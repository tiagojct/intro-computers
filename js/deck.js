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

  let cur = 0;       // indice do slide atual
  let step = 0;      // passos revelados no slide atual
  let overview = false;
  let fitTimer = null;

  const stepsOf = (i) => Array.from(slides[i].querySelectorAll('[data-step]'))
    .sort((a, b) => (+a.dataset.step || 0) - (+b.dataset.step || 0));

  // ---- cor por seccao: muda --bg/--accent (com transicao) conforme o slide ----
  const root = document.documentElement;
  const GROUPS = {
    intro:       { bg: '#eef0ea', accent: '#0a66d6' },
    foundations: { bg: '#dde9fa', accent: '#0a57bd' },
    tools:       { bg: '#dcefe2', accent: '#0a7048' },
    network:     { bg: '#fbe7cc', accent: '#a85510' },
    model:       { bg: '#e8e6f4', accent: '#5b4bc4' },
    risk:        { bg: '#fbe0d4', accent: '#bf3318' },
    local:       { bg: '#cdebd3', accent: '#0a624a' },
    close:       { bg: '#eef0ea', accent: '#0a66d6' },
  };
  const SECTION = {
    's-title': 'intro', 's-map': 'intro',
    's-what': 'foundations', 's-hardware': 'foundations', 's-software': 'foundations',
    's-os': 'foundations', 's-file': 'foundations', 's-filetypes': 'foundations', 's-filesystem': 'foundations',
    's-paths': 'foundations', 's-zones': 'foundations', 's-dotfiles': 'foundations',
    's-shell': 'tools', 's-terminal': 'tools', 's-workdir': 'tools',
    's-automate': 'tools', 's-packages': 'tools',
    's-internet': 'network', 's-api': 'network', 's-apikey': 'network',
    's-model': 'model', 's-agent': 'model', 's-prompt': 'model', 's-perms': 'model',
    's-aierra': 'risk', 's-boundary': 'risk', 's-patient': 'risk', 's-pseudon': 'risk',
    's-local': 'local',
    's-start': 'close', 's-glossary': 'close', 's-quiz': 'close', 's-quiz-1': 'close',
    's-quiz-2': 'close', 's-parking': 'close', 's-recap': 'close', 's-schema': 'close',
  };
  function applySectionColor(s) {
    const g = GROUPS[(s && SECTION[s.id]) || 'intro'] || GROUPS.intro;
    const bg = (s && s.dataset.bg) || g.bg;
    const accent = (s && s.dataset.accent) || g.accent;
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg-2', 'color-mix(in srgb, ' + bg + ' 90%, #000)');
  }

  function render(prevIndex) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === cur);
      s.classList.toggle('past', i < cur);
    });

    applySectionColor(slides[cur]);

    // progresso
    const pct = slides.length > 1 ? (cur / (slides.length - 1)) * 100 : 100;
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.innerHTML = '<b>' + (cur + 1) + '</b> / ' + slides.length;
    if (titleTag) titleTag.textContent = slides[cur].dataset.title || '';
    renderNotes();

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
    }
  });

  window.addEventListener('resize', () => { if (overview) layoutOverview(); else fitSlide(slides[cur]); });

  // hash inicial: #5 abre no slide 5
  const fromHash = parseInt((location.hash || '').slice(1), 10);
  if (!isNaN(fromHash) && fromHash >= 1 && fromHash <= slides.length) cur = fromHash - 1;

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
