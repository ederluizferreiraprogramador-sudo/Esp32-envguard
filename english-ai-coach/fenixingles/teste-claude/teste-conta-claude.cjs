// Simula a plataforma do Claude: claude.use("user") e claude.use("db") com área privada por pessoa.
const { chromium } = require('playwright');
const store = {}; // compartilhado entre "aparelhos"
(async () => {
  const b = await chromium.launch();
  const open = async (uid, name) => {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await c.exposeFunction('__dbGet', (path) => store[path] ?? null);
    await c.exposeFunction('__dbSet', (path, d) => { store[path] = d; });
    await c.addInitScript(([uid, name]) => {
      window.claude = { use: async (n) => {
        if (n === 'user') return uid ? { id: async () => uid, me: async () => ({ id: uid, name }) } : null;
        if (n === 'db') return uid ? { doc: (path) => {
          if (!path.startsWith('data/users/' + uid + '/')) throw new Error('outro usuário');
          return { get: async () => { const d = await window.__dbGet(path); return { exists: !!d, data: () => d ?? undefined }; }, set: async (d) => { await window.__dbSet(path, d); } };
        } } : null;
        return null;
      } };
    }, [uid, name]);
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + process.cwd() + '/test.html'); await p.waitForTimeout(1500);
    return { p, c, errs };
  };
  // Ana no celular: começa do zero (onboarding)
  let A = await open('u_ana', 'Ana');
  console.log('Ana nova -> onboarding:', await A.p.evaluate(() => document.body.innerText.includes('Bem-vindo')));
  await A.p.evaluate(() => { localStorage.setItem('fenixingles-student-v1', JSON.stringify({ name: 'Ana', age: '7 a 9 anos', goal: 10, level: 'basico', avatar: {} })); localStorage.setItem('fenixingles-progress-v1', JSON.stringify({ completed: ['1-0','1-1','1-2'], xp: 30 })); sessionStorage.setItem('fx-chat-greeted','1'); });
  await A.p.reload(); await A.p.waitForTimeout(6500);
  console.log('salvo na nuvem da Ana:', JSON.parse(store['data/users/u_ana/progresso'].dados)['fenixingles-progress-v1'].completed);
  await A.p.getByRole('link', { name: /Perfil/ }).last().click(); await A.p.waitForTimeout(400);
  console.log('botão sair escondido:', !(await A.p.getByRole('button', { name: /Sair da conta/ }).count()));
  // Davi no mesmo aparelho (mesmo navegador) depois: não vê o progresso da Ana
  await A.c.addInitScript(() => { window.claude = { use: async (n) => n === 'user' ? { id: async () => 'u_davi', me: async () => ({ id: 'u_davi', name: 'Davi' }) } : n === 'db' ? { doc: (path) => ({ get: async () => { const d = await window.__dbGet(path); return { exists: !!d, data: () => d ?? undefined }; }, set: async (d) => { await window.__dbSet(path, d); } }) } : null }; });
  const pD = await A.c.newPage(); await pD.goto('file://' + process.cwd() + '/test.html'); await pD.waitForTimeout(2000);
  console.log('Davi no mesmo navegador vê progresso local:', await pD.evaluate(() => localStorage.getItem('fenixingles-progress-v1')));
  await A.c.close();
  // Ana em outro aparelho: progresso volta
  const A2 = await open('u_ana', 'Ana'); await A2.p.waitForTimeout(1500);
  console.log('Ana no outro aparelho:', await A2.p.evaluate(() => localStorage.getItem('fenixingles-progress-v1')));
  await A2.p.screenshot({ path: 'c1.png' });
  // sem conta Claude
  const G = await open(null, ''); await G.p.screenshot({ path: 'c2.png' });
  console.log('sem conta -> tela entrar:', await G.p.evaluate(() => document.body.innerText.includes('conta Claude')));
  await G.p.getByRole('button', { name: /Continuar sem conta/ }).click(); await G.p.waitForTimeout(1500);
  console.log('convidado -> onboarding:', await G.p.evaluate(() => document.body.innerText.includes('Bem-vindo')));
  console.log('errors', [...A2.errs, ...G.errs]); await b.close();
})();
