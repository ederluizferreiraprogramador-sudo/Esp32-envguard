"""Servidor MCP do English AI Coach.

Expõe o currículo (16 unidades, na ordem do livro-base) e o progresso do
aluno como *tools* que qualquer cliente MCP (Claude Code, Claude Desktop,
agentes do Paperclip) pode chamar.

Execução (stdio):  python server.py
"""
import json
import os
import random
from datetime import datetime, timezone
from pathlib import Path

from mcp.server.fastmcp import FastMCP

ROOT = Path(__file__).resolve().parent
CURRICULUM = ROOT.parent / "content" / "curriculum.json"
PROGRESS = Path(os.environ.get("COACH_PROGRESS_FILE", ROOT / "progress.json"))

mcp = FastMCP("english-ai-coach")


def _units() -> list[dict]:
    return json.loads(CURRICULUM.read_text(encoding="utf-8"))["units"]


def _unit(unit_id: str) -> dict:
    uid = unit_id.upper().strip()
    if uid.isdigit():
        uid = f"U{int(uid):02d}"
    for u in _units():
        if u["id"] == uid:
            return u
    raise ValueError(f"Unidade não encontrada: {unit_id} (use U01..U16)")


def _load_progress() -> dict:
    if PROGRESS.exists():
        return json.loads(PROGRESS.read_text(encoding="utf-8"))
    return {"attempts": []}


@mcp.tool()
def list_units() -> list[dict]:
    """Lista as unidades do curso na ordem do livro (id, título, gramática)."""
    return [{"id": u["id"], "title": u["title"], "grammar": u["grammar"]} for u in _units()]


@mcp.tool()
def get_unit(unit_id: str) -> dict:
    """Retorna uma unidade completa: tópicos, gramática, vocabulário, diálogo e quiz."""
    return _unit(unit_id)


@mcp.tool()
def get_vocabulary(unit_id: str) -> list[dict]:
    """Retorna o vocabulário (inglês, português, exemplo) de uma unidade."""
    return _unit(unit_id)["vocabulary"]


@mcp.tool()
def make_quiz(unit_id: str, n: int = 4) -> list[dict]:
    """Sorteia até n perguntas do quiz da unidade (sem a resposta correta)."""
    qs = list(_unit(unit_id)["quiz"])
    random.shuffle(qs)
    return [{"index": _unit(unit_id)["quiz"].index(q), "question": q["question"], "options": q["options"]}
            for q in qs[: max(1, n)]]


@mcp.tool()
def check_answer(unit_id: str, question_index: int, answer_index: int) -> dict:
    """Corrige uma resposta e devolve a explicação em português."""
    quiz = _unit(unit_id)["quiz"]
    if not 0 <= question_index < len(quiz):
        raise ValueError("question_index fora do intervalo")
    q = quiz[question_index]
    return {"correct": answer_index == q["answer_index"],
            "right_option": q["options"][q["answer_index"]],
            "explanation_pt": q["explanation_pt"]}


@mcp.tool()
def record_attempt(unit_id: str, score: int, total: int) -> dict:
    """Salva o resultado de um quiz (progresso local em JSON)."""
    uid = _unit(unit_id)["id"]
    data = _load_progress()
    data["attempts"].append({"unit": uid, "score": score, "total": total,
                             "at": datetime.now(timezone.utc).isoformat()})
    PROGRESS.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    return {"saved": True, "attempts": len(data["attempts"])}


@mcp.tool()
def get_progress() -> dict:
    """Resumo do progresso: melhor nota por unidade e próxima unidade sugerida."""
    best: dict[str, float] = {}
    for a in _load_progress()["attempts"]:
        best[a["unit"]] = max(best.get(a["unit"], 0), a["score"] / a["total"])
    nxt = next((u["id"] for u in _units() if best.get(u["id"], 0) < 0.7), None)
    return {"best_by_unit": best, "next_unit": nxt, "pass_mark": 0.7}


if __name__ == "__main__":
    mcp.run()
