# Do hardware ao agente

Apresentação interativa (HTML/CSS/JS puro, sem build) para uma aula a profissionais de
saúde e investigadores clínicos. Leva a audiência do conceito de *hardware* até ao uso de
um agente de IA no terminal (OpenCode), com o ponto crítico: ao usar um modelo na cloud, o
conteúdo dos ficheiros sai da máquina e atravessa uma fronteira institucional.

Controlada pelo apresentador. As animações e os "terminais" são encenados e fiáveis — nada
depende de rede, instalações ou chaves de API durante a aula.

## Abrir

Servir localmente (recomendado, evita restrições `file://`):

```bash
cd intro-computers
python3 -m http.server 8000
# abrir http://localhost:8000
```

Ou abrir `index.html` diretamente no browser.

Depois carregar `f` para ecrã inteiro.

## Atalhos de teclado

| Tecla | Acção |
|-------|-------|
| `→` / `Espaço` | avançar (próximo passo ou próximo slide) |
| `←` | recuar |
| `↓` / `↑` | saltar slide inteiro |
| `Home` / `End` | primeiro / último slide |
| `o` | grelha de visão geral (clicar num slide salta para ele) |
| `f` | ecrã inteiro |
| `t` | repetir a animação / o terminal do slide atual |
| `s` | notas do orador do slide atual (painel discreto, só para o apresentador) |

`#5` no URL abre diretamente no slide 5.

## Estrutura

```
index.html            todos os slides (<section class="slide">)
css/base.css          design system, layout do deck, navegação
css/slides.css        estilos e animações por slide
css/terminal.css      janela de terminal falso
js/deck.js            motor: slides, passos, progresso, overview, teclado
js/terminal.js        efeito typewriter (typeInto) reutilizável
js/animations.js      camada de animação por slide (anime.js + SlideHooks)
vendor/anime.min.js   anime.js v3 (local, offline)
SPEAKER.md            guião de locução (tempos, pontos-chave, transições, cortes)
```

## Os 36 slides

1. Título *(hero centrado)*
2. O caminho de hoje (três perguntas; "no fim, o mapa completo")
3. O que é um computador (entrada → processamento → saída)
4. Hardware (processador / memória / armazenamento; desligar)
5. Software (máquina + instruções = trabalho feito)
6. Sistema operativo (camadas; Windows / macOS / Linux)
7. O que é um ficheiro (anatomia `nome` . `extensão`)
8. **A extensão diz o tipo/programa** (.csv/.docx/.jpg/.pdf/.html → folha/texto/imagem/PDF/browser; browser → chatbot)
9. Organização dos ficheiros (árvore = arquivo clínico)
10. O mesmo caminho (Windows `\` + `C:` vs macOS/Linux `/`)
11. Zona do sistema vs a tua zona
12. Ficheiros ocultos (definições) *(opcional)*
13. Duas formas de pedir o mesmo (clicar vs escrever)
14. O terminal (comando real `ls`, com legenda)
15. **Pasta de trabalho** (onde o agente atua — working directory)
16. Repetir sem esforço (varrimento + contador) *(opcional)*
17. Instalar programas (lista verificada; Homebrew / apt / npm)
18. A internet (pedido / resposta)
19. O que é uma API (impresso de requisição)
20. Chave de API (+ guarda segura + custos)
21. O modelo — o cérebro emprestado
22. O agente OpenCode (lê / escreve / executa; transição p/ terminal real)
23. **Prompt + contexto** (janela de contexto: o que o modelo vê)
24. **Permissões do agente** (propõe e pede autorização)
25. A IA pode enganar-se — confirma sempre
26. A fronteira — os ficheiros saem da máquina
27. Dados de doentes (RGPD: contrato / localização / base legal + DPO)
28. **Pseudonimização** (tirar identificadores antes de usar)
29. Modelo local (opção segura; requisitos de hardware)
30. Primeiros passos *(opcional)*
31. Glossário PT (termo + definição + exemplo)
32. Quiz 1/2 — escolha múltipla, revela por passos *(opcional)*
33. Quiz 2/2 — risco / RGPD / agente *(opcional)*
34. **Termos não falados** (lista para discussão aberta)
35. Em resumo
36. **O mapa** — esquema final só com símbolos e setas

Slides marcados *(opcional)* aparecem com etiqueta "opcional" na grelha (`o`).

## Design

Linguagem **experimental**: composições centradas (sem o esquema fixo título-ao-canto), focos
de tipografia/ícones gigantes, e a **cor de fundo muda por secção** (azul→fundamentos,
verde→ferramentas, âmbar→rede, indigo→modelo/agente, terracota→risco/RGPD, verde→local) com
transição suave — motor em `js/deck.js` (mapa `SECTION`/`GROUPS`).

Conteúdo dimensionado por **auto-fit**: se um slide for mais alto que o ecrã, encolhe sozinho.

**Uma ideia por slide:** o ecrã é o cartaz (título curto + foco animado); o detalhe vive nas
notas do orador (`s`). **Termos clicáveis** no slide "Não falámos destes" e no glossário abrem
uma janela com definição PT + link Wikipédia (`<dialog class="term-modal">` + `#term-data`).

## Notas

- Animações com **anime.js** (vendido em `vendor/`, offline): coreografia de entrada, loops contínuos, fluxo de dados no mapa, ficheiros a atravessar a fronteira. Re-disparar com `t`.
- **Design alinhado com tiagojct.eu** (estilo rsms.me): fundo tom-da-home, acento azul, hairlines, cantos vivos (3px), eyebrows mono. Tipografia **Inter** + **IBM Plex Mono**, vendida em `assets/fonts/` (offline, sem Google Fonts).
- Texto reduzido ao mínimo: títulos curtos + apartes; o detalhe fica para a fala.
- Os **terminais** mantêm-se escuros de propósito (parecem janelas reais sobre o branco).
- Personagem dos exemplos: **Rosa**. Comandos reais, traduzidos em linguagem simples.
- Ícones em **SVG** (sprite no topo do `index.html`), sem emojis.
- Respeita `prefers-reduced-motion` (animações e terminais ficam instantâneos).
- Sem dependências, sem `npm install`. Única chamada de rede: as fontes Google (opcional).
