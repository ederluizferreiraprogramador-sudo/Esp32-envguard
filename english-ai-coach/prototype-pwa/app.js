(() => {
  const VOCAB = window.VOCAB;
  const KEY = "englishup.v1";
  const $ = (s) => document.querySelector(s);

  // --- Estado: caixa de Leitner (1..5) por palavra ---
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  let state = load(); // { [en]: { box, seen, hits } }
  const entry = (w) => (state[w.en] ||= { box: 1, seen: 0, hits: 0 });

  // --- Navegação ---
  document.querySelectorAll("nav button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.toggle("active", x === b));
    document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== b.dataset.view));
    if (b.dataset.view === "stats") renderStats();
    if (b.dataset.view === "quiz") nextQuestion();
  }));

  // --- Fala ---
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text); u.lang = "en-US";
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  };

  // --- Flashcards: palavras de caixas menores aparecem com mais frequência ---
  let current, flipped = false;
  const pick = () => {
    const weights = VOCAB.map((w) => 6 - entry(w).box);
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < VOCAB.length; i++) { r -= weights[i]; if (r <= 0) return VOCAB[i]; }
    return VOCAB[0];
  };
  const showCard = () => { current = pick(); flipped = false; $("#card-text").textContent = current.en; };
  const flip = () => { flipped = !flipped; $("#card-text").textContent = flipped ? current.pt : current.en; if (!flipped) return; };
  $("#card").addEventListener("click", flip);
  $("#card").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
  $("#speak").addEventListener("click", () => speak(current.en));
  const grade = (ok) => {
    const e = entry(current); e.seen++;
    if (ok) { e.hits++; e.box = Math.min(5, e.box + 1); } else e.box = 1;
    save(); showCard();
  };
  $("#right").addEventListener("click", () => grade(true));
  $("#wrong").addEventListener("click", () => grade(false));

  // --- Quiz ---
  let answered = false;
  function nextQuestion() {
    answered = false;
    const w = pick();
    const opts = [w];
    while (opts.length < Math.min(4, VOCAB.length)) {
      const c = VOCAB[Math.floor(Math.random() * VOCAB.length)];
      if (!opts.includes(c)) opts.push(c);
    }
    opts.sort(() => Math.random() - 0.5);
    $("#q-text").textContent = `O que significa "${w.en}"?`;
    $("#q-feedback").textContent = ""; $("#q-next").hidden = true;
    const box = $("#q-options"); box.replaceChildren();
    opts.forEach((o) => {
      const b = document.createElement("button");
      b.textContent = o.pt;
      b.addEventListener("click", () => {
        if (answered) return; answered = true;
        const ok = o === w, e = entry(w); e.seen++;
        if (ok) { e.hits++; e.box = Math.min(5, e.box + 1); } else e.box = 1;
        save();
        b.classList.add(ok ? "ok" : "no");
        if (!ok) [...box.children].find((x) => x.textContent === w.pt).classList.add("ok");
        $("#q-feedback").textContent = ok ? "Correto! 🎉" : `Resposta: ${w.pt}`;
        $("#q-next").hidden = false; speak(w.en);
      });
      box.appendChild(b);
    });
  }
  $("#q-next").addEventListener("click", nextQuestion);

  // --- Progresso ---
  function renderStats() {
    const mastered = VOCAB.filter((w) => entry(w).box >= 5).length;
    const seen = Object.values(state).reduce((a, e) => a + e.seen, 0);
    const hits = Object.values(state).reduce((a, e) => a + e.hits, 0);
    const pct = seen ? Math.round((hits / seen) * 100) : 0;
    $("#stats-body").textContent = `Palavras dominadas: ${mastered}/${VOCAB.length} · Respostas: ${seen} · Acertos: ${pct}%`;
  }
  $("#reset").addEventListener("click", () => {
    if (confirm("Zerar todo o progresso?")) { state = {}; save(); renderStats(); }
  });

  showCard();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
