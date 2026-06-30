// deck.js — motor de slides: navegacao por teclado, passos, progresso, overview
//
// Estrutura esperada no HTML:
//   .deck > section.slide[data-slide]
//   elementos com [data-step] dentro de um slide revelam um a um.
//
// Hooks de animacao: window.SlideHooks = { onEnter(idx, slideEl), onLeave(idx, slideEl) }
// definidos em animations.js. deck.js chama-os ao entrar/sair de cada slide.

(function () {
  const deck = document.querySelector('.deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const bar = document.querySelector('.progress > i');
  const counter = document.querySelector('.hud .count');
  const titleTag = document.querySelector('.slide-title-tag');

  // ---- notas do orador (tecla `s`) ----
  const notesPanel = document.querySelector('.notes-panel');
  let notes = {};
  try { notes = JSON.parse(document.getElementById('notes-data')?.textContent || '{}'); }
  catch (e) { notes = {}; }
  let notesOn = false;

  function renderNotes() {
    if (!notesPanel) return;
    notesPanel.hidden = !notesOn;
    if (!notesOn) return;
    const id = slides[cur] && slides[cur].id;
    const html = (id && notes[id]) || '<span class="np-empty">sem notas para este slide</span>';
    notesPanel.innerHTML =
      '<span class="np-tag">nota · ' + (cur + 1) + '/' + slides.length + '</span>' +
      '<span class="np-body">' + html + '</span>';
  }

  // ---- vista de apresentador (tecla `p`): janela separada, sincronizada ----
  // Projetor mostra a deck; o portatil mostra esta janela com notas + proximo slide.
  // Sincroniza por BroadcastChannel (mesmo origin, offline). Os alunos nunca veem as notas.
  const pchan = ('BroadcastChannel' in window) ? new BroadcastChannel('intro-deck') : null;
  function postPresenter() {
    if (!pchan) return;
    const id = slides[cur] && slides[cur].id;
    const nid = slides[cur + 1] && slides[cur + 1].id;
    pchan.postMessage({
      type: 'state',
      n: cur + 1, total: slides.length,
      title: (slides[cur] && slides[cur].dataset.title) || '',
      notes: (id && notes[id]) || '',
      nextTitle: (slides[cur + 1] && slides[cur + 1].dataset.title) || '',
      nextNotes: (nid && notes[nid]) || '',
    });
  }
  if (pchan) pchan.onmessage = (e) => { if (e.data && e.data.type === 'hello') postPresenter(); };

  const PRESENTER_HTML =
    '<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><title>Apresentador</title>' +
    '<style>' +
    ':root{color-scheme:dark}*{box-sizing:border-box}' +
    'body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#12161b;color:#f1efe9;' +
    'display:flex;flex-direction:column;height:100vh;padding:24px 28px;gap:18px}' +
    '.top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #2c3640;padding-bottom:12px}' +
    '.pos{font:600 15px ui-monospace,monospace;letter-spacing:.1em;color:#5f97a0}' +
    '#clock{font:600 15px ui-monospace,monospace;color:#97a0a4;cursor:pointer}' +
    '#clock:hover{color:#e0832a}' +
    '.now{font-size:13px;text-transform:uppercase;letter-spacing:.18em;color:#7d8c8c;margin:0 0 4px}' +
    '#title{font-size:30px;font-weight:600;margin:0 0 14px;line-height:1.15}' +
    '#notes{font-size:21px;line-height:1.5;color:#f1efe9;flex:1;overflow:auto}' +
    '#notes b{color:#e0832a}' +
    '.next{border-top:1px solid #2c3640;padding-top:14px;color:#97a0a4}' +
    '.next .nlab{font-size:12px;text-transform:uppercase;letter-spacing:.18em;color:#5f7d54;margin:0 0 4px}' +
    '#ntitle{font-size:18px;font-weight:600;color:#cdd5d2;margin:0 0 6px}' +
    '#nnotes{font-size:15px;line-height:1.45;color:#7d8c8c;max-height:22vh;overflow:auto}' +
    '.hint{font-size:11px;color:#52646a;text-align:center}' +
    '</style></head><body>' +
    '<div class="top"><span class="pos" id="pos">— / —</span><span id="clock" title="clicar para reiniciar">00:00</span></div>' +
    '<div><p class="now">slide atual</p><h1 id="title"></h1><div id="notes"><i>a ligar a deck...</i></div></div>' +
    '<div class="next"><p class="nlab">a seguir</p><div id="ntitle"></div><div id="nnotes"></div></div>' +
    '<p class="hint">navega na janela da deck (setas). esta janela so mostra as notas.</p>' +
    '<script>' +
    'var ch=new BroadcastChannel("intro-deck"),start=Date.now();' +
    'function p(n){return (n<10?"0":"")+n}' +
    'setInterval(function(){var s=Math.floor((Date.now()-start)/1000);document.getElementById("clock").textContent=p(Math.floor(s/60))+":"+p(s%60)},500);' +
    'document.getElementById("clock").onclick=function(){start=Date.now()};' +
    'ch.onmessage=function(e){var d=e.data;if(!d||d.type!=="state")return;' +
    'document.getElementById("pos").textContent=d.n+" / "+d.total;' +
    'document.getElementById("title").textContent=d.title||"";' +
    'document.getElementById("notes").innerHTML=d.notes||"<i>sem notas para este slide</i>";' +
    'document.getElementById("ntitle").textContent=d.nextTitle||"\\u2014 fim \\u2014";' +
    'document.getElementById("nnotes").innerHTML=d.nextNotes||""};' +
    'ch.postMessage({type:"hello"});' +
    'window.addEventListener("beforeunload",function(){ch.close()});' +
    '<\/script></body></html>';

  function openPresenter() {
    if (!pchan) { alert('A vista de apresentador precisa de um servidor (http), nao file://.'); return; }
    const w = window.open('', 'intro-presenter', 'width=760,height=920');
    if (!w) return;
    w.document.open(); w.document.write(PRESENTER_HTML); w.document.close();
    setTimeout(postPresenter, 250);
  }

  let cur = 0;       // indice do slide atual
  let step = 0;      // passos revelados no slide atual
  let overview = false;
  let fitTimer = null;

  const stepsOf = (i) => Array.from(slides[i].querySelectorAll('[data-step]'))
    .sort((a, b) => (+a.dataset.step || 0) - (+b.dataset.step || 0));

  // ---- modo Try-Works: cold (claro) <-> lit (escuro) ----
  const root = document.documentElement;
  function toggleMode() {
    root.dataset.mode = root.dataset.mode === 'lit' ? 'cold' : 'lit';
  }

  // ---- idioma: PT <-> EN (troca innerHTML dos [data-en]) ----
  let lang = 'pt';
  const i18nEls = Array.from(document.querySelectorAll('[data-en]'));
  function setLang(l) {
    lang = l;
    root.lang = (l === 'en') ? 'en' : 'pt-PT';
    i18nEls.forEach(el => {
      if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
      el.innerHTML = (l === 'en') ? el.dataset.en : el.dataset.pt;
    });
    if (typeof cur === 'number' && slides[cur]) {
      if (window.SlideHooks && window.SlideHooks.relang) window.SlideHooks.relang(slides[cur]);
      fitSlide(slides[cur]);
    }
  }
  function toggleLang() { setLang(lang === 'pt' ? 'en' : 'pt'); }

  function render(prevIndex) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === cur);
      s.classList.toggle('past', i < cur);
    });

    // progresso
    const pct = slides.length > 1 ? (cur / (slides.length - 1)) * 100 : 100;
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.innerHTML = '<b>' + (cur + 1) + '</b> / ' + slides.length;
    if (titleTag) titleTag.textContent = slides[cur].dataset.title || '';
    renderNotes();
    postPresenter();

    // hooks
    if (window.SlideHooks) {
      if (prevIndex != null && prevIndex !== cur && window.SlideHooks.onLeave) {
        window.SlideHooks.onLeave(prevIndex, slides[prevIndex]);
      }
      if (window.SlideHooks.onEnter) window.SlideHooks.onEnter(cur, slides[cur]);
    }

    fitSlide(slides[cur]);
    // re-fit de seguranca: conteudo assincrono (terminais a escrever) cresce depois
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => fitSlide(slides[cur]), 1600);
  }

  function applySteps() {
    const steps = stepsOf(cur);
    steps.forEach((node, i) => node.classList.toggle('shown', i < step));
    // notifica animacoes ligadas ao passo atual (cobre avancar, recuar e saltos)
    if (window.SlideHooks && window.SlideHooks.onStep) {
      window.SlideHooks.onStep(cur, step, slides[cur]);
    }
    fitSlide(slides[cur]);
  }

  // ---- auto-fit: encolhe o conteudo se for mais alto que o ecra (sem cortar) ----
  function fitSlide(s) {
    if (!s) return;
    const inner = s.querySelector('.slide-inner');
    if (!inner) return;
    inner.style.transform = '';               // medir sem escala
    if (overview) return;
    const cs = getComputedStyle(s);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const avail = s.clientHeight - padY;
    const needed = inner.scrollHeight;
    if (needed > avail && needed > 0) {
      const k = Math.max(0.5, avail / needed);
      inner.style.transformOrigin = 'center center';
      inner.style.transform = 'scale(' + k + ')';
    }
  }

  function gotoSlide(i, opts = {}) {
    if (i < 0 || i >= slides.length) return;
    const prev = cur;
    cur = i;
    // ao avancar: comeca sem passos; ao recuar: mostra todos
    step = opts.showAllSteps ? stepsOf(cur).length : 0;
    render(prev);
    applySteps();
  }

  function next() {
    const steps = stepsOf(cur);
    if (step < steps.length) {
      step++;
      applySteps();
      return;
    }
    if (cur < slides.length - 1) gotoSlide(cur + 1);
  }

  function prev() {
    if (step > 0) {
      step--;
      applySteps();
      return;
    }
    if (cur > 0) gotoSlide(cur - 1, { showAllSteps: true });
  }

  // ---------- overview ----------

  function layoutOverview() {
    const cols = Math.ceil(Math.sqrt(slides.length));
    const rows = Math.ceil(slides.length / cols);
    const gap = 18;
    const W = window.innerWidth, H = window.innerHeight;
    const cw = (W - gap * (cols + 1)) / cols;
    const ch = (H - gap * (rows + 1)) / rows;
    const scale = Math.min(cw / W, ch / H);
    slides.forEach((s, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const x = gap + c * (cw + gap);
      const y = gap + r * (ch + gap);
      s.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      s.style.width = W + 'px';
      s.style.height = H + 'px';
    });
  }

  function toggleOverview() {
    overview = !overview;
    deck.classList.toggle('overview', overview);
    if (overview) {
      // limpa escalas de auto-fit para as miniaturas ficarem corretas
      slides.forEach(s => { const i = s.querySelector('.slide-inner'); if (i) i.style.transform = ''; });
      layoutOverview();
    } else {
      slides.forEach(s => { s.style.transform = ''; s.style.width = ''; s.style.height = ''; });
      render(null);
      applySteps();
    }
  }

  // clique num slide na overview -> entra nesse slide
  deck.addEventListener('click', (e) => {
    if (!overview) return;
    const s = e.target.closest('.slide');
    if (!s) return;
    const i = slides.indexOf(s);
    toggleOverview();
    gotoSlide(i, { showAllSteps: false });
  });

  // ---------- teclado ----------

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  function retrigger() {
    if (window.SlideHooks && window.SlideHooks.onEnter) {
      window.SlideHooks.onEnter(cur, slides[cur], { retrigger: true });
    }
  }

  // ---- modal de termos (clique num [data-term]) ----
  const modal = document.querySelector('.term-modal');
  if (modal) {
    const termData = (() => { try { return JSON.parse(document.getElementById('term-data')?.textContent || '{}'); } catch (e) { return {}; } })();
    const mTitle = modal.querySelector('.tm-title');
    const mDef = modal.querySelector('.tm-def');
    const mWiki = modal.querySelector('.tm-wiki');
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-term]');
      if (t && !overview) {
        const d = termData[t.dataset.term];
        if (!d) return;
        mTitle.textContent = t.dataset.term;
        mDef.textContent = d.def;
        mWiki.href = 'https://pt.wikipedia.org/wiki/' + d.wiki;
        modal.showModal();
        return;
      }
      if (e.target === modal) modal.close(); // clique no backdrop
    });
    modal.querySelector('.tm-close').addEventListener('click', () => modal.close());
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (modal && modal.open) return; // navegacao desativada com o modal aberto
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault(); if (overview) toggleOverview(); else next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); if (!overview) prev(); break;
      case 'ArrowDown':
        e.preventDefault(); if (!overview) gotoSlide(cur + 1); break;
      case 'ArrowUp':
        e.preventDefault(); if (!overview) gotoSlide(cur - 1, { showAllSteps: true }); break;
      case 'Home':
        e.preventDefault(); gotoSlide(0); break;
      case 'End':
        e.preventDefault(); gotoSlide(slides.length - 1, { showAllSteps: true }); break;
      case 'o': case 'O':
        e.preventDefault(); toggleOverview(); break;
      case 'f': case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      case 't': case 'T':
        e.preventDefault(); if (!overview) retrigger(); break;
      case 's': case 'S':
        e.preventDefault(); notesOn = !notesOn; document.body.classList.toggle('show-notes', notesOn); renderNotes(); break;
      case 'd': case 'D':
        e.preventDefault(); toggleMode(); break;
      case 'l': case 'L':
        e.preventDefault(); toggleLang(); break;
      case 'p': case 'P':
        e.preventDefault(); openPresenter(); break;
    }
  });

  window.addEventListener('resize', () => { if (overview) layoutOverview(); else fitSlide(slides[cur]); });

  // hash inicial: #5 abre no slide 5
  const fromHash = parseInt((location.hash || '').slice(1), 10);
  if (!isNaN(fromHash) && fromHash >= 1 && fromHash <= slides.length) cur = fromHash - 1;

  // ?mode=lit|cold e ?lang=en -> estado inicial (revisao / captura)
  const qp = new URLSearchParams(location.search);
  if (qp.get('mode') === 'lit' || qp.get('mode') === 'cold') root.dataset.mode = qp.get('mode');
  if (qp.get('lang') === 'en') setLang('en');

  // arranque
  render(null);
  // ?all -> revela todos os passos do slide inicial (revisao / captura)
  if (/[?&]all\b/.test(location.search)) step = stepsOf(cur).length;
  applySteps();

  // expoe para debug / hooks
  window.Deck = {
    next, prev, gotoSlide,
    refit() { fitSlide(slides[cur]); },
    toggleNotes() { notesOn = !notesOn; document.body.classList.toggle('show-notes', notesOn); renderNotes(); },
    get index() { return cur; }, get step() { return step; },
  };
})();
