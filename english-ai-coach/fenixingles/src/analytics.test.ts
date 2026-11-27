import { beforeEach, describe, expect, it, vi } from "vitest";

const load = async () => { vi.resetModules(); return import("@/lib/analytics"); };

describe("medição anônima", () => {
  beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); delete (globalThis as unknown as { __FX_ENV__?: object }).__FX_ENV__; });

  it("sem chave nada é enviado e o cartão não aparece", async () => {
    const f = vi.fn(); vi.stubGlobal("fetch", f);
    const a = await load(); a.setAnalytics(true); a.track("licao_concluida", { unidade: 1 });
    expect(a.analyticsAvailable()).toBe(false); expect(f).not.toHaveBeenCalled();
  });

  it("com chave mas sem consentimento nada sai; com consentimento sai só o evento anônimo", async () => {
    (globalThis as unknown as { __FX_ENV__: object }).__FX_ENV__ = { VITE_POSTHOG_KEY: "phc_teste" };
    const f = vi.fn().mockResolvedValue({}); vi.stubGlobal("fetch", f);
    const a = await load();
    a.track("erro_na_questao", { unidade: 2, tipo: "fill" }); expect(f).not.toHaveBeenCalled();
    a.setAnalytics(true);
    a.track("erro_na_questao", { unidade: 2, licao: 1, tipo: "fill", ...({ nome: "Davi", email: "x@y.com" } as object) });
    expect(f).toHaveBeenCalledTimes(1);
    const body = JSON.parse(f.mock.calls[0]![1].body);
    expect(body.event).toBe("erro_na_questao");
    expect(Object.keys(body.properties).sort()).toEqual(["$process_person_profile", "licao", "tipo", "unidade"].sort());
    expect(JSON.stringify(body)).not.toMatch(/Davi|x@y\.com/);
    a.setAnalytics(false); a.track("licao_concluida"); expect(f).toHaveBeenCalledTimes(1);
  });
});
