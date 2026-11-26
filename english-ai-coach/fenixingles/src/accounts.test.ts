import { beforeEach, describe, expect, it } from "vitest";
import { checkPin, createAccount, createTestUsers, deleteAccount, loadAccounts, logout, switchTo, userData } from "@/lib/accounts";

describe("alunos no aparelho", () => {
  beforeEach(() => localStorage.clear()); // jsdom ignora o reload
  const P = "fenixingles-progress-v1";

  it("cada aluno tem o seu próprio progresso", async () => {
    const a = await createAccount("Ana", null, false);
    localStorage.setItem(P, JSON.stringify({ completed: ["1-0"] }));
    const b = await createAccount("Bia", null, false);
    expect(localStorage.getItem(P)).toBeNull(); // Bia começa do zero
    localStorage.setItem(P, JSON.stringify({ completed: ["1-0", "1-1", "1-2"] }));
    switchTo(a.id, false);
    expect(JSON.parse(localStorage.getItem(P)!).completed).toEqual(["1-0"]);
    expect(userData<{ completed: string[] }>(b.id, P)!.completed).toHaveLength(3);
    expect(loadAccounts().current).toBe(a.id);
  });

  it("senha: só o resumo é salvo e confere", async () => {
    const a = await createAccount("Davi", "1234", false);
    const saved = loadAccounts().users[0]!;
    expect(saved.pin).not.toContain("1234");
    expect(await checkPin(saved, "1234")).toBe(true);
    expect(await checkPin(saved, "0000")).toBe(false);
    expect(a.name).toBe("Davi");
  });

  it("sair guarda os dados e apagar remove tudo", async () => {
    const a = await createAccount("Ana", null, false);
    localStorage.setItem(P, JSON.stringify({ completed: ["1-0"] }));
    logout();
    expect(loadAccounts().current).toBeNull();
    expect(localStorage.getItem(P)).toBeNull();
    expect(userData<{ completed: string[] }>(a.id, P)!.completed).toEqual(["1-0"]);
    deleteAccount(a.id);
    expect(loadAccounts().users).toHaveLength(0);
    expect(Object.keys(localStorage).filter((k) => k.includes(a.id))).toEqual([]);
  });

  it("cria 3 usuários de teste sem trocar o aluno atual", async () => {
    const a = await createAccount("Ana", null, false);
    await createTestUsers();
    const s = loadAccounts();
    expect(s.users).toHaveLength(4);
    expect(s.current).toBe(a.id);
    expect(s.users.filter((u) => u.test).map((u) => u.name)).toEqual(["Ana (teste)", "Davi (teste)", "Bia (teste)"]);
  });
});
