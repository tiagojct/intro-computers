// animations.js — camada de animacao (anime.js) por slide
//
// Mantem o contrato de hooks que js/deck.js chama:
//   SlideHooks.onEnter(idx, slideEl, {retrigger})
//   SlideHooks.onStep(idx, step, slideEl)
//   SlideHooks.onLeave(idx, slideEl)
//
// Os passos [data-step] continuam geridos pelo deck.js (mostra/esconde elementos via .shown).
// Aqui: (1) classes de estado de que o CSS precisa, (2) coreografia de entrada,
// (3) loops continuos e sequencias ricas com anime.js, (4) terminais falsos.

(function () {

  const A = window.anime;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // ---- loops anime ativos (parar ao sair do slide) ----
  let loops = [];
  function stopLoops() { loops.forEach(a => { try { a.pause(); } catch (e) {} }); loops = []; }
  function L(params) { const a = A(params); loops.push(a); return a; }

  // ---- timers ----
  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  // ---- terminais falsos ----
  const TERMS = {
    'term-cli': [
      { out: 'escrevo uma ordem curta e carrego Enter.', outEn: 'I type a short command and press Enter.', cls: 'dim' },
      { out: '"ls" quer dizer listar o que esta na pasta:', outEn: '"ls" means list what is in the folder:', cls: 'dim' },
      { prompt: 'rosa@mac', path: '~/estudo', pathEn: '~/study', cmd: 'ls' },
      { out: 'coorte.csv   notas.txt   analise.R', outEn: 'cohort.csv   notes.txt   analysis.R', delay: 280 },
      { blank: true },
      { out: 'texto entra, texto sai.', outEn: 'text in, text out.', cls: 'ok', delay: 220 },
    ],
    'term-pkg': [
      { out: 'peco para instalar a partir da lista verificada:', outEn: 'I ask to install from the verified list:', cls: 'dim' },
      { prompt: 'rosa@mac', path: '~', cmd: 'instalar editor', cmdEn: 'install editor' },
      { out: 'a procurar na lista verificada...', outEn: 'searching the verified list...', cls: 'dim', delay: 320 },
      { out: 'a confirmar a origem... OK', outEn: 'verifying the source... OK', cls: 'dim', delay: 360 },
      { out: 'instalado com seguranca.', outEn: 'installed safely.', cls: 'ok', delay: 360 },
    ],
  };
  let termsDone = new Set();
  let boundaryCrossed = false;
  function runTerm(id) {
    const el = document.getElementById(id);
    const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
    if (el && window.typeInto) window.typeInto(el, TERMS[id], {
      lang,
      onDone() { if (window.Deck && window.Deck.refit) window.Deck.refit(); },
    });
  }

  // ---- reinicio de estado (classes de que o CSS depende) ----
  const RESET = {
    '.machine': 'off', '.hw.ram': 'cleared',
    '.inert-box': 'powered', '.sw-instr': 'run', '.sw-stage': 'go',
    '.dot-list': 'reveal', '.toggle-pill': 'on',
    '.dest-machine .slot': 'filled',
    '.rr-stage': 'send recv', '.boundary-stage': 'leak sealed',
    '.recap-chain': 'go', '.roadmap': 'go', '.filecard': 'draw',
    '.auto-file': 'done', '.auto-files': 'scanning', '.costmeter': 'fill',
  };
  function resetState(slideEl) {
    for (const [sel, cls] of Object.entries(RESET)) {
      slideEl.querySelectorAll(sel).forEach(n => cls.split(' ').forEach(c => n.classList.remove(c)));
    }
    const n = slideEl.querySelector('.auto-counter .n');
    if (n) n.textContent = '0';
  }

  // ---- coreografia de entrada (todos os slides) ----
  function enterChoreo(slideEl) {
    if (REDUCED) return;
    // texto: sobe e aparece, encadeado
    const text = $('.kicker, h1, h2, .lead, .aside', slideEl).filter(n => !n.closest('[data-step]'));
    if (text.length) {
      A.set(text, { opacity: 0, translateY: 18 });
      A({ targets: text, opacity: [0, 1], translateY: [18, 0], duration: 620, delay: A.stagger(80), easing: 'easeOutCubic' });
    }
    // contentores de diagrama: aparecem com leve subida (filhos [data-step] mantem-se escondidos)
    const blocks = $('.ioflow, .machine, .sw-stage, .layers, .filecard-stage, .tree, .pathset, .zones, .dot-list, .shell-vs, .term, .registry-flow, .rr-stage, .api-stage, .model-flow, .agent-caps, .boundary-stage, .gov-list, .glossary, .quiz, .key-rules, .keycard, .schema, .frame, .permcard, .redact, .parklist, .ctx-items, .filename, .ftypes, .textcards', slideEl)
      .filter(n => !n.closest('[data-step]'));
    if (blocks.length) {
      A.set(blocks, { opacity: 0, translateY: 22 });
      A({ targets: blocks, opacity: [0, 1], translateY: [22, 0], duration: 720, delay: 180, easing: 'easeOutCubic' });
    }
    // foco gigante: entra com escala + desfoque
    const giants = $('.giant, .bigword', slideEl).filter(n => !n.closest('[data-step]'));
    if (giants.length) {
      A.set(giants, { opacity: 0, scale: 0.8, filter: 'blur(8px)' });
      A({ targets: giants, opacity: [0, 1], scale: [0.8, 1], filter: ['blur(8px)', 'blur(0px)'],
          duration: 900, delay: A.stagger(120, { start: 120 }), easing: 'easeOutCubic' });
    }
    // sublinhado desenhado a mao
    const ul = $('.uline path', slideEl);
    if (ul.length) {
      A.set(ul, { strokeDashoffset: 640 });
      A({ targets: ul, strokeDashoffset: [640, 0], duration: 900, delay: 560, easing: 'easeInOutSine' });
    }
  }

  // ---- contador suave ----
  function countUp(el, to, dur) {
    if (REDUCED) { el.textContent = to; return; }
    L({ targets: { v: 0 }, v: to, duration: dur, easing: 'easeOutExpo',
        update(a) { el.textContent = Math.round(a.animations[0].currentValue); } });
  }

  // ---- pontos de fluxo de dados no slide-mapa ----
  function flowDots() {
    const svg = document.querySelector('#s-schema .wires');
    const g = svg && svg.querySelector('.flow-dots');
    if (!g) return;
    g.innerHTML = '';
    if (REDUCED) return;
    const wires = [
      { sel: '#wire-spine', color: '#4d7680', n: 3, dur: 2600 },
      { sel: '#wire-cloud', color: '#c9651d', n: 2, dur: 2100 },
      { sel: '#wire-local', color: '#86a87f', n: 1, dur: 1700 },
      { sel: '#wire-pkg',   color: '#4d7680', n: 1, dur: 1500 },
    ];
    wires.forEach(w => {
      const p = A.path(w.sel);
      for (let i = 0; i < w.n; i++) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', '6'); c.setAttribute('cx', '0'); c.setAttribute('cy', '0'); c.setAttribute('fill', w.color);
        g.appendChild(c);
        L({ targets: c, translateX: p('x'), translateY: p('y'), easing: 'linear',
            duration: w.dur, loop: true, delay: i * (w.dur / w.n) + 2000,
            opacity: [{ value: 1, duration: 1 }, { value: 1, duration: w.dur * 0.82 }, { value: 0, duration: w.dur * 0.18 }] });
      }
    });
  }

  // ---- desligar/ligar a memoria (hardware) ----
  function hardwarePower(slideEl, off) {
    const bits = $('.hw.ram .vol-content i', slideEl);
    if (REDUCED || !bits.length) return;
    if (off) {
      bits.forEach((b, i) => A({ targets: b, translateY: -12 - i * 5, translateX: (i - 1.5) * 7,
        rotate: (i % 2 ? 1 : -1) * 35, opacity: 0, duration: 620, easing: 'easeOutQuad' }));
    } else {
      A({ targets: bits, translateX: 0, translateY: 0, rotate: 0, opacity: 1, duration: 360, easing: 'easeOutQuad' });
    }
  }

  // ============================================================
  //  HOOKS
  // ============================================================

  window.SlideHooks = {
    onEnter(idx, slideEl, opts = {}) {
      stopLoops();
      clearTimers();
      resetState(slideEl);
      termsDone = new Set();
      boundaryCrossed = false;
      const id = slideEl.id;
      const base = opts.retrigger ? 80 : 460;

      enterChoreo(slideEl);

      // terminal nao escondido por passo -> arranca ao entrar
      const term = slideEl.querySelector('.term-body[id]');
      if (term && !term.closest('[data-step]')) {
        later(() => { runTerm(term.id); termsDone.add(term.id); }, base + 60);
      }

      // classes de estado auto (revelacoes que o CSS faz)
      if (slideEl.querySelector('.roadmap')) later(() => slideEl.querySelector('.roadmap')?.classList.add('go'), 320);
      if (id === 's-recap') later(() => slideEl.querySelector('.recap-chain')?.classList.add('go'), 320);
      if (id === 's-file')  later(() => slideEl.querySelector('.filecard')?.classList.add('draw'), 460);
      if (id === 's-software' && !REDUCED) later(() => {
        A({ targets: slideEl.querySelector('.sw-box.machine'), boxShadow: ['0 0 0 rgba(10,102,214,0)', '0 0 36px -10px rgba(10,102,214,.6)'], duration: 700, direction: 'alternate', loop: 4, easing: 'easeInOutSine' });
        const r = slideEl.querySelector('.sw-box.result');
        if (r) A({ targets: r, scale: [0.9, 1], opacity: [0, 1], duration: 600, easing: 'easeOutBack' });
      }, base);
      if (id === 's-automate') {
        later(() => slideEl.querySelector('.auto-files')?.classList.add('scanning'), 350);
        $('.auto-file', slideEl).forEach((f, i) => later(() => f.classList.add('done'), 650 + i * 230));
        const c = slideEl.querySelector('.auto-counter .n');
        if (c) later(() => countUp(c, 1000, 1700), 500);
      }
      if (id === 's-packages') {
        $('.dest-machine .slot', slideEl).forEach((s, i) => later(() => s.classList.add('filled'), 850 + i * 520));
      }
      if (id === 's-boundary') slideEl.querySelector('.boundary-stage')?.classList.add('leak');

      // ---- loops continuos (vida) ----
      if (!REDUCED) {
        if (id === 's-what') {
          const tok = slideEl.querySelector('.io-token');
          if (tok) { A.set(tok, { opacity: 0, left: '6%' });
            L({ targets: tok, left: ['6%', '94%'], duration: 2200, loop: true, easing: 'easeInOutSine', delay: 700,
                opacity: [{ value: 1, duration: 220 }, { value: 1, duration: 1760 }, { value: 0, duration: 220 }] }); }
          const proc = slideEl.querySelector('.iobox.proc');
          if (proc) L({ targets: proc, scale: [1, 1.05], duration: 1100, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-apikey') {
          const key = slideEl.querySelector('.keycard .ic');
          if (key) L({ targets: key, scale: [1, 1.12], rotate: [-4, 4], duration: 1300,
              direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-boundary') {
          // ficheiros visiveis na maquina, em repouso (a travessia e' no passo)
          A.set($('.side.local .docfile', slideEl), { translateX: 0, opacity: 1 });
        }
        if (id === 's-local') {
          const sh = slideEl.querySelector('.side.local .ic');
          if (sh) L({ targets: sh, scale: [1, 1.08], duration: 1200, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-file') {
          const ext = slideEl.querySelector('.fn-ext');
          if (ext) L({ targets: ext, scale: [1, 1.08], duration: 1100, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-tokens') {
          const tks = $('.tokenize .tk', slideEl);
          if (tks.length) { A.set(tks, { opacity: 0, scale: 0.7 });
            A({ targets: tks, opacity: [0, 1], scale: [0.7, 1], duration: 480, delay: A.stagger(110, { start: 300 }), easing: 'easeOutBack' }); }
        }
        if (id === 's-cost') {
          later(() => slideEl.querySelector('.costmeter')?.classList.add('fill'), 500);
        }
        if (id === 's-workdir') {
          const f = slideEl.querySelector('.giant .ic');
          if (f) L({ targets: f, scale: [1, 1.06], duration: 1300, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-perms') {
          const yes = slideEl.querySelector('.perm-yes');
          if (yes) L({ targets: yes, scale: [1, 1.07], duration: 900, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-model') {
          const dc = slideEl.querySelector('.mf-node.big .ic-lg');
          if (dc) L({ targets: dc, scale: [1, 1.1], duration: 1200, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
          const badge = slideEl.querySelector('.mf-badge');
          if (badge) L({ targets: badge, translateY: [-2, 2], duration: 1000, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        }
        if (id === 's-schema') {
          flowDots();
          // nos pulsam suavemente depois de aparecerem
          later(() => L({ targets: '#s-schema .node', scale: [1, 1.04], duration: 1400, direction: 'alternate',
              loop: true, delay: A.stagger(120), easing: 'easeInOutSine' }), 1400);
        }
      }
    },

    onStep(idx, step, slideEl) {
      const id = slideEl.id;

      if (id === 's-quiz') {
        $('.quiz-q', slideEl).forEach(q => {
          const qa = q.querySelector('.qa[data-step]');
          const correctOpt = q.querySelector('[data-correct]');
          if (qa && correctOpt) correctOpt.classList.toggle('correct', Number(qa.dataset.step) <= step);
        });
      }
      if (id === 's-hardware') {
        const off = step >= 4;
        slideEl.querySelector('.hw.ram')?.classList.toggle('cleared', off);
        slideEl.querySelector('.machine')?.classList.toggle('off', off);
        hardwarePower(slideEl, off);
      }
      if (id === 's-dotfiles') {
        const on = step >= 1;
        slideEl.querySelector('.dot-list')?.classList.toggle('reveal', on);
        slideEl.querySelector('.toggle-pill')?.classList.toggle('on', on);
      }
      if (id === 's-internet') {
        const stage = slideEl.querySelector('.rr-stage');
        stage?.classList.toggle('send', step >= 1);
        stage?.classList.toggle('recv', step >= 2);
        if (step >= 2 && !REDUCED) {
          const srv = slideEl.querySelector('.rr-node.server .box');
          if (srv) A({ targets: srv, scale: [1, 1.12, 1], duration: 600, easing: 'easeOutQuad' });
        }
      }
      if (id === 's-local') {
        slideEl.querySelector('.boundary-stage')?.classList.toggle('sealed', step >= 1);
      }
      if (id === 's-boundary') {
        const docs = $('.side.local .docfile', slideEl);
        const stage = slideEl.querySelector('.boundary-stage');
        if (docs.length && stage) {
          if (step >= 1 && !boundaryCrossed && !REDUCED) {
            boundaryCrossed = true;
            const dist = Math.max(360, stage.offsetWidth * 0.52);
            A({ targets: docs, translateX: [0, dist], opacity: [1, 0.25], easing: 'easeInOutSine',
                duration: 1500, delay: A.stagger(220) });
          } else if (step < 1) {
            boundaryCrossed = false;
            A.set(docs, { translateX: 0, opacity: 1 });
          }
        }
      }

      // terminal escondido atras de um passo -> arranca ao aparecer
      const term = slideEl.querySelector('.term-body[id]');
      if (term && !termsDone.has(term.id)) {
        const gate = term.closest('[data-step]');
        if (gate && gate.classList.contains('shown')) {
          termsDone.add(term.id);
          later(() => runTerm(term.id), 140);
        }
      }
    },

    onLeave(idx, slideEl) {
      stopLoops();
      clearTimers();
    },

    // re-corre terminais ja visiveis no idioma atual (chamado pelo toggle `l`)
    relang(slideEl) {
      if (!slideEl) return;
      slideEl.querySelectorAll('.term-body[id]').forEach(t => {
        if (t.childNodes.length && (!t.closest('[data-step]') || t.closest('[data-step]').classList.contains('shown'))) {
          runTerm(t.id);
        }
      });
    },
  };

})();
