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

  const stepsOf = (i) => Array.from(slides[i].querySelectorAll('[data-step]'))
    .sort((a, b) => (+a.dataset.step || 0) - (+b.dataset.step || 0));

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

    // hooks
    if (window.SlideHooks) {
      if (prevIndex != null && prevIndex !== cur && window.SlideHooks.onLeave) {
        window.SlideHooks.onLeave(prevIndex, slides[prevIndex]);
      }
      if (window.SlideHooks.onEnter) window.SlideHooks.onEnter(cur, slides[cur]);
    }
  }

  function applySteps() {
    const steps = stepsOf(cur);
    steps.forEach((node, i) => node.classList.toggle('shown', i < step));
    // notifica animacoes ligadas ao passo atual (cobre avancar, recuar e saltos)
    if (window.SlideHooks && window.SlideHooks.onStep) {
      window.SlideHooks.onStep(cur, step, slides[cur]);
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

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
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

  window.addEventListener('resize', () => { if (overview) layoutOverview(); });

  // hash inicial: #5 abre no slide 5
  const fromHash = parseInt((location.hash || '').slice(1), 10);
  if (!isNaN(fromHash) && fromHash >= 1 && fromHash <= slides.length) cur = fromHash - 1;

  // arranque
  render(null);
  applySteps();

  // expoe para debug / hooks
  window.Deck = {
    next, prev, gotoSlide,
    toggleNotes() { notesOn = !notesOn; document.body.classList.toggle('show-notes', notesOn); renderNotes(); },
    get index() { return cur; }, get step() { return step; },
  };
})();
