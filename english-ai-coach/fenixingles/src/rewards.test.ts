import { beforeEach, describe, expect, it } from "vitest";
import { awardForLesson, loadNest, loadPremium, PHOENIXES, setPremium } from "@/lib/rewards";

describe("recompensas", () => {
  beforeEach(() => localStorage.clear());

  it("a primeira lição sempre dá a Fênix de Fogo", () => {
    expect(awardForLesson("1-0", () => 0.99)).toBe("fogo");
    expect(loadNest().counts.fogo).toBe(1);
  });

  it("refazer a mesma lição não dá outro presente", () => {
    awardForLesson("1-0");
    expect(awardForLesson("1-0")).toBeNull();
    expect(loadNest().gifted).toEqual(["1-0"]);
  });

  it("sorteia só fênix da coleção (nunca a Imortal) e conta repetidas", () => {
    awardForLesson("1-0");
    const ids = new Set(PHOENIXES.filter((p) => p.weight > 0).map((p) => p.id));
    for (let i = 1; i < 40; i++) expect(ids.has(awardForLesson(`x-${i}`, () => (i * 0.137) % 1)!)).toBe(true);
    const total = Object.values(loadNest().counts).reduce((a, b) => a + (b ?? 0), 0);
    expect(total).toBe(40);
  });

  it("Fênix Imortal ativa vidas infinitas e entra no ninho", () => {
    expect(loadPremium().active).toBe(false);
    setPremium(true);
    expect(loadPremium().active).toBe(true);
    expect(loadNest().counts.imortal).toBe(1);
    setPremium(false);
    expect(loadPremium().active).toBe(false);
  });
});
