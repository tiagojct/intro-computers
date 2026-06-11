// terminal.js — efeito typewriter para terminais falsos (sem execucao real)
//
// Uso:
//   typeInto(el, lines, { onDone })
// onde `lines` e um array de objetos:
//   { prompt: "user@mac", path: "~/projeto", cmd: "ls -la", speed: 38 }  // linha de comando
//   { out: "texto de saida", cls: "ok"|"warn"|"dim", delay: 300 }        // linha ja escrita
//   { blank: true }                                                       // linha vazia
//
// Respeita prefers-reduced-motion: escreve tudo de imediato.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// guarda o controlador atual por elemento para podermos cancelar / re-disparar
const controllers = new WeakMap();

async function typeInto(container, lines, opts = {}) {
  // cancela qualquer corrida anterior neste container
  const prev = controllers.get(container);
  if (prev) prev.cancelled = true;
  const ctrl = { cancelled: false };
  controllers.set(container, ctrl);

  container.innerHTML = '';
  const cursor = el('span', 'term-cursor');
  container.appendChild(cursor);

  const place = (node) => container.insertBefore(node, cursor);

  for (const line of lines) {
    if (ctrl.cancelled) return;

    if (line.blank) {
      place(el('span', 'term-line', ' '));
      place(document.createTextNode('\n'));
      await sleep(REDUCED ? 0 : (line.delay ?? 120));
      continue;
    }

    if (line.out != null) {
      // saida pre-escrita, aparece de uma vez (com pequeno atraso)
      await sleep(REDUCED ? 0 : (line.delay ?? 220));
      if (ctrl.cancelled) return;
      const ln = el('span', 'term-line');
      ln.appendChild(el('span', 'out ' + (line.cls || ''), line.out));
      place(ln);
      place(document.createTextNode('\n'));
      container.scrollTop = container.scrollHeight;
      continue;
    }

    // linha de comando: escreve char a char
    const ln = el('span', 'term-line');
    if (line.prompt) {
      ln.appendChild(el('span', 'prompt', line.prompt));
    }
    if (line.path) {
      ln.appendChild(el('span', 'path', line.path));
      ln.appendChild(document.createTextNode(' '));
    }
    const cmdSpan = el('span', 'cmd', '');
    ln.appendChild(cmdSpan);
    place(ln);

    const text = line.cmd || '';
    if (REDUCED) {
      cmdSpan.textContent = text;
    } else {
      const speed = line.speed ?? 40;
      for (let i = 0; i < text.length; i++) {
        if (ctrl.cancelled) return;
        cmdSpan.textContent += text[i];
        // pausa ligeiramente variavel para parecer humano
        const jitter = (i % 7 === 0) ? speed * 1.8 : speed;
        await sleep(jitter);
      }
    }
    place(document.createTextNode('\n'));
    container.scrollTop = container.scrollHeight;
    await sleep(REDUCED ? 0 : (line.after ?? 260));
  }

  if (!ctrl.cancelled && opts.onDone) opts.onDone();
}

window.typeInto = typeInto;
