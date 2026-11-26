// Simula o servidor do Base44 (contas, código por e-mail, tabela ProgressoCompleto com RLS por dono).
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const users = {}, recs = {}; let nextId = 1; const tokens = {};
  await c.route('https://base44.app/api/apps/**', async (route) => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api\/apps\/[^/]+/, ''), body = req.postDataJSON?.() ?? null;
    const auth = (req.headers()['authorization'] || '').replace('Bearer ', ''), uid = tokens[auth];
    const json = (s, d) => route.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(d) });
    if (req.headers()['x-app-id'] !== '6b03f9395666f1f1c5968695') return json(400, { detail: 'missing app id' });
    if (path === '/auth/register') { if (users[body.email]) return json(400, { detail: 'User already exists' }); users[body.email] = { id: 'u' + nextId++, email: body.email, pw: body.password, ok: false }; return json(200, { ok: true }); }
    if (path === '/auth/verify-otp') { const u = users[body.email]; if (!u || body.otp_code !== '123456') return json(400, { detail: 'Invalid OTP code' }); u.ok = true; return json(200, { ok: true }); }
    if (path === '/auth/login') { const u = users[body.email]; if (!u || u.pw !== body.password) return json(401, { detail: 'Invalid email or password' }); if (!u.ok) return json(403, { detail: 'Please verify your email' }); const t = 'tok-' + u.id + '-' + Math.random(); tokens[t] = u.id; return json(200, { access_token: t, user: { id: u.id } }); }
    if (path === '/auth/reset-password-request') return json(200, {});
    if (!uid) return json(401, { detail: 'unauthorized' });
    if (path === '/entities/User/me') { const u = Object.values(users).find(x => x.id === uid); return json(200, { id: u.id, email: u.email }); }
    if (path === '/entities/ProgressoCompleto' && req.method() === 'GET') { const q = JSON.parse(url.searchParams.get('q') || '{}'); return json(200, Object.values(recs).filter(r => r.created_by_id === uid && (!q.created_by_id || q.created_by_id === uid))); }
    if (path === '/entities/ProgressoCompleto' && req.method() === 'POST') { const id = 'r' + nextId++; recs[id] = { id, created_by_id: uid, ...body }; return json(200, recs[id]); }
    const m = path.match(/^\/entities\/ProgressoCompleto\/(\w+)$/); if (m && req.method() === 'PUT') { const r = recs[m[1]]; if (!r || r.created_by_id !== uid) return json(403, { detail: 'forbidden' }); Object.assign(r, body); return json(200, r); }
    return json(404, { detail: 'not found ' + path });
  });
  const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/test.html'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
  await p.screenshot({ path: 'a1.png' });
  const signup = async (email) => {
    await p.getByRole('link', { name: 'Criar conta grátis' }).click(); await p.waitForTimeout(300);
    await p.fill('#email', email); await p.fill('#senha', 'fenix2026'); await p.fill('#senha2', 'fenix2026'); await p.check('input[type=checkbox]');
    await p.getByRole('button', { name: 'Criar conta' }).click(); await p.waitForTimeout(500); await p.screenshot({ path: 'a2.png' });
    await p.fill('#codigo', '000000'); await p.getByRole('button', { name: /Confirmar e entrar/ }).click(); await p.waitForTimeout(400);
    console.log('bad code msg:', await p.locator('[role=alert]').innerText());
    await p.fill('#codigo', '123456'); await p.getByRole('button', { name: /Confirmar e entrar/ }).click(); await p.waitForTimeout(1500);
  };
  await signup('mae.ana@exemplo.com');
  console.log('after signup on onboarding:', await p.evaluate(() => document.body.innerText.includes('Bem-vindo')));
  // simula progresso de Ana
  await p.evaluate(() => { localStorage.setItem('fenixingles-student-v1', JSON.stringify({ name: 'Ana', age: '7 a 9 anos', goal: 10, level: 'basico', avatar: {} })); localStorage.setItem('fenixingles-progress-v1', JSON.stringify({ completed: ['1-0','1-1'], xp: 20 })); sessionStorage.setItem('fx-chat-greeted','1'); });
  await p.reload(); await p.waitForTimeout(6500);
  console.log('cloud rec Ana:', JSON.stringify(Object.values(recs).map(r => ({ by: r.created_by_id, done: JSON.parse(r.dados)['fenixingles-progress-v1']?.completed }))));
  await p.getByRole('link', { name: /Perfil/ }).last().click(); await p.waitForTimeout(500);
  await p.getByRole('button', { name: /Sair da conta/ }).click(); await p.waitForTimeout(1500);
  console.log('after logout local progress:', await p.evaluate(() => localStorage.getItem('fenixingles-progress-v1')));
  await signup('pai.davi@exemplo.com');
  console.log('Davi local progress (deve ser vazio):', await p.evaluate(() => localStorage.getItem('fenixingles-progress-v1')));
  // logout e login de novo como Ana
  await p.evaluate(() => { localStorage.setItem('fenixingles-student-v1', JSON.stringify({ name: 'Davi', age: '7 a 9 anos', goal: 10, level: 'basico', avatar: {} })); sessionStorage.setItem('fx-chat-greeted','1'); }); await p.reload(); await p.waitForTimeout(900);
  await p.getByRole('link', { name: /Perfil/ }).last().click(); await p.waitForTimeout(500); await p.getByRole('button', { name: /Sair da conta/ }).click(); await p.waitForTimeout(1500);
  await p.fill('#email', 'mae.ana@exemplo.com'); await p.fill('#senha', 'errada1'); await p.getByRole('button', { name: 'Entrar' }).click(); await p.waitForTimeout(500);
  console.log('wrong pw msg:', await p.locator('[role=alert]').innerText());
  await p.fill('#senha', 'fenix2026'); await p.getByRole('button', { name: 'Entrar' }).click(); await p.waitForTimeout(1800);
  console.log('Ana restored:', await p.evaluate(() => localStorage.getItem('fenixingles-progress-v1')));
  await p.screenshot({ path: 'a3.png' });
  // sem conexão
  const p2 = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p2.route('https://base44.app/**', r => r.abort()); await p2.goto('file://' + process.cwd() + '/test.html'); await p2.waitForTimeout(800);
  await p2.fill('#email', 'x@y.com'); await p2.fill('#senha', 'abc12345'); await p2.getByRole('button', { name: 'Entrar' }).click(); await p2.waitForTimeout(600);
  await p2.screenshot({ path: 'a4.png' }); console.log('offline msg:', await p2.locator('[role=alert]').innerText());
  console.log('errors', errs); await b.close();
})();
