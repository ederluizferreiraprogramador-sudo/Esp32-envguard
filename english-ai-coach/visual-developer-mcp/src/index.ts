import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import {
  access, copyFile, lstat, mkdir, readFile, readdir, realpath, rename, stat, writeFile
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const ROOT_INPUT = process.env.VISUAL_PROJECT_ROOT;
if (!ROOT_INPUT) {
  console.error("VISUAL_PROJECT_ROOT is required. Set it to the project folder the MCP may edit.");
  process.exit(1);
}
const ROOT = await realpath(path.resolve(ROOT_INPUT));
const MAX_TEXT_BYTES = 1_000_000;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const EDITABLE = new Set([".html", ".htm", ".css", ".js"]);
const TEXT_READABLE = new Set([
  ".html", ".htm", ".css", ".js", ".mjs", ".json", ".md", ".txt", ".svg", ".xml"
]);
const IMAGE_TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif"
};

function result(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

async function safePath(relativePath: string): Promise<string> {
  if (!relativePath || path.isAbsolute(relativePath)) throw new Error("Use a non-empty relative path inside the project.");
  const normalized = path.normalize(relativePath);
  if (normalized === ".." || normalized.startsWith(`..${path.sep}`) || normalized.includes(`${path.sep}..${path.sep}`)) {
    throw new Error("Path traversal is not allowed.");
  }
  const full = path.resolve(ROOT, normalized);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) throw new Error("Path is outside the project root.");

  // Reject symlinks in every existing path component to prevent escaping the workspace.
  let cursor = ROOT;
  for (const part of normalized.split(path.sep)) {
    if (!part || part === ".") continue;
    cursor = path.join(cursor, part);
    try {
      const s = await lstat(cursor);
      if (s.isSymbolicLink()) throw new Error("Symbolic links are not allowed in MCP paths.");
    } catch (e: any) {
      if (e?.code === "ENOENT") break;
      throw e;
    }
  }
  return full;
}

async function ensureInsideRoot(full: string) {
  const parent = await realpath(path.dirname(full)).catch(() => ROOT);
  if (parent !== ROOT && !parent.startsWith(ROOT + path.sep)) throw new Error("Resolved path escaped project root.");
}

async function makeBackup(full: string): Promise<string> {
  await ensureInsideRoot(full);
  const relative = path.relative(ROOT, full);
  const backupRoot = path.join(ROOT, ".visual-developer", "backups");
  const destination = path.join(backupRoot, `${Date.now()}-${relative.replace(/[\\/]/g, "__")}.bak`);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(full, destination);
  return path.relative(ROOT, destination);
}

async function walk(dir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const output: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") continue;
    const rel = path.join(prefix, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) output.push(...await walk(path.join(dir, entry.name), rel));
    else output.push(rel);
  }
  return output;
}

const server = new McpServer({ name: "visual-developer-mcp", version: "1.0.0" });

// Small adapter keeps tool declarations readable while using the current MCP SDK v2 API.
function registerTool(name: string, description: string, inputSchema: any, handler: any) {
  server.registerTool(name, { description, inputSchema }, handler);
}

registerTool(
  "project_overview",
  "Show the configured project root and a safe inventory of project files. Hidden folders, node_modules and dist are excluded.",
  {},
  async () => {
    const files = await walk(ROOT);
    return result(`Project root: ${ROOT}\nFiles (${files.length}):\n${files.slice(0, 300).join("\n")}${files.length > 300 ? "\n... truncated at 300 files" : ""}`);
  }
);

registerTool(
  "read_project_file",
  "Read a text file inside the configured project. Use relative paths only.",
  { path: z.string().min(1).max(300) },
  async ({ path: rel }: { path: string }) => {
    const full = await safePath(rel);
    if (!TEXT_READABLE.has(path.extname(full).toLowerCase())) throw new Error("File type is not permitted for text reading.");
    const s = await stat(full);
    if (!s.isFile() || s.size > MAX_TEXT_BYTES) throw new Error("File is not a regular file or exceeds the 1 MB limit.");
    return result(`--- ${rel} ---\n${await readFile(full, "utf8")}`);
  }
);

registerTool(
  "analyze_reference_image",
  "Load a reference screenshot or design image from inside the project. The image is returned to the model for visual inspection.",
  { path: z.string().min(1).max(300) },
  async ({ path: rel }: { path: string }) => {
    const full = await safePath(rel);
    const ext = path.extname(full).toLowerCase();
    const mimeType = IMAGE_TYPES[ext];
    if (!mimeType) throw new Error("Supported image types: PNG, JPG, JPEG, WEBP, GIF.");
    const s = await stat(full);
    if (!s.isFile() || s.size > MAX_IMAGE_BYTES) throw new Error("Image is not a regular file or exceeds the 12 MB limit.");
    const data = (await readFile(full)).toString("base64");
    return {
      content: [
        { type: "text" as const, text: `Reference image: ${rel} (${Math.round(s.size / 1024)} KB). Inspect layout, spacing, colors, typography and visible components. Do not assume access to hidden source code.` },
        { type: "image" as const, data, mimeType }
      ]
    };
  }
);

registerTool(
  "backup_project_file",
  "Create a timestamped backup of one project file before editing. Returns the backup path.",
  { path: z.string().min(1).max(300) },
  async ({ path: rel }: { path: string }) => {
    const full = await safePath(rel);
    const s = await stat(full);
    if (!s.isFile()) throw new Error("Only regular files can be backed up.");
    return result(`Backup created: ${await makeBackup(full)}`);
  }
);

registerTool(
  "write_project_file",
  "Create or update an HTML, CSS or JavaScript file. Existing files are backed up automatically. Always inspect the file first and explain the intended change; use this tool only after the user has requested the edit.",
  {
    path: z.string().min(1).max(300),
    content: z.string().max(MAX_TEXT_BYTES),
    createBackup: z.boolean().default(true)
  },
  async ({ path: rel, content, createBackup }: { path: string; content: string; createBackup: boolean }) => {
    const full = await safePath(rel);
    const ext = path.extname(full).toLowerCase();
    if (!EDITABLE.has(ext)) throw new Error("Only .html, .htm, .css and .js files can be written.");
    await mkdir(path.dirname(full), { recursive: true });
    const exists = await access(full).then(() => true).catch(() => false);
    let backup = "none (new file)";
    if (exists) {
      const s = await stat(full);
      if (!s.isFile()) throw new Error("Target is not a regular file.");
      if (createBackup) backup = await makeBackup(full);
    }
    const temp = `${full}.visual-developer-tmp`;
    await writeFile(temp, content, { encoding: "utf8", flag: "w" });
    await rename(temp, full);
    return result(`Updated: ${rel}\nBackup: ${backup}\nBytes: ${Buffer.byteLength(content, "utf8")}\nReminder: run validate_project and inspect the page in a browser.`);
  }
);

registerTool(
  "validate_project",
  "Run lightweight checks on HTML, CSS and JavaScript files. Checks local script/style references, basic tag balance and JS syntax using the installed Node runtime.",
  {},
  async () => {
    const files = await walk(ROOT);
    const htmlFiles = files.filter(f => [".html", ".htm"].includes(path.extname(f).toLowerCase()));
    const issues: string[] = [];
    for (const rel of htmlFiles) {
      const html = await readFile(path.join(ROOT, rel), "utf8");
      const refs = [...html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]);
      for (const ref of refs) {
        if (/^(https?:|data:|#|mailto:|tel:|javascript:|\/\/)/i.test(ref)) continue;
        const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
        if (!clean) continue;
        const target = path.resolve(path.dirname(path.join(ROOT, rel)), clean);
        if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
          issues.push(`${rel}: reference escapes project: ${ref}`); continue;
        }
        const ok = await access(target).then(() => true).catch(() => false);
        if (!ok) issues.push(`${rel}: missing local reference: ${ref}`);
      }
      const opens = (html.match(/<([a-z][a-z0-9]*)\b(?![^>]*\/>)[^>]*>/gi) || []);
      const closes = (html.match(/<\/([a-z][a-z0-9]*)\s*>/gi) || []);
      if (opens.length === 0) issues.push(`${rel}: no HTML elements detected`);
      if (!/<html[\s>]/i.test(html)) issues.push(`${rel}: missing <html> root element`);
      if (!/<head[\s>]/i.test(html)) issues.push(`${rel}: missing <head> element`);
      if (!/<body[\s>]/i.test(html)) issues.push(`${rel}: missing <body> element`);
    }
    const jsFiles = files.filter(f => path.extname(f).toLowerCase() === ".js");
    for (const rel of jsFiles) {
      const check = await new Promise<string | null>(resolve => {
        const child = spawn(process.execPath, ["--check", path.join(ROOT, rel)], { stdio: ["ignore", "pipe", "pipe"] });
        let err = "";
        child.stderr.on("data", d => err += d.toString());
        child.on("error", e => resolve(e.message));
        child.on("close", code => resolve(code === 0 ? null : err.trim() || `node --check exited ${code}`));
      });
      if (check) issues.push(`${rel}: JavaScript syntax: ${check}`);
    }
    return result(`Validation finished.\nHTML files: ${htmlFiles.length}\nJavaScript files: ${jsFiles.length}\nIssues: ${issues.length}\n${issues.length ? issues.join("\n") : "No issues found by these lightweight checks."}\n\nNote: this is not a full HTML/CSS accessibility, security or browser compatibility audit.`);
  }
);

registerTool(
  "capture_html_screenshot",
  "Render a local HTML file in headless Chromium using Playwright and return a screenshot image. Install Chromium once with: npx playwright install chromium.",
  {
    path: z.string().min(1).max(300),
    width: z.number().int().min(320).max(2560).default(390),
    height: z.number().int().min(500).max(3000).default(844)
  },
  async ({ path: rel, width, height }: { path: string; width: number; height: number }) => {
    const full = await safePath(rel);
    if (![".html", ".htm"].includes(path.extname(full).toLowerCase())) throw new Error("Screenshot target must be an HTML file.");
    const { chromium } = await import("playwright");
    // VISUAL_CHROMIUM_PATH (opcional) aponta para um Chromium já instalado.
    const browser = await chromium.launch({ headless: true, executablePath: process.env.VISUAL_CHROMIUM_PATH || undefined });
    try {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(full).href, { waitUntil: "networkidle", timeout: 30000 });
      const screenshot = await page.screenshot({ fullPage: true, type: "png" });
      return {
        content: [
          { type: "text" as const, text: `Screenshot captured for ${rel} at ${width}x${height}. Review the image and compare it with the reference.` },
          { type: "image" as const, data: screenshot.toString("base64"), mimeType: "image/png" }
        ]
      };
    } finally {
      await browser.close();
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
