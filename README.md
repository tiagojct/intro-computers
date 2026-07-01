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
| `s` | notas do orador, sobrepostas na própria deck (cuidado: visíveis se espelhares o ecrã) |
| `d` | modo claro / escuro |
| `l` | idioma PT / EN |
| `p` | abrir a **vista de apresentador** numa janela separada |

`#5` no URL abre diretamente no slide 5.

### Vista de apresentador (`p`)

Para os alunos **não** verem as notas, usa dois ecrãs em modo **estendido** (não espelhado):

1. Liga o projetor como ecrã estendido (não duplicado).
2. No portátil, abre a deck e carrega `f` (ecrã inteiro) na janela do **projetor**.
3. Carrega `p` para abrir a janela do apresentador; arrasta-a para o **ecrã do portátil**.

A janela do apresentador mostra o slide atual, as suas notas, o **próximo** slide e um
cronómetro (clica no cronómetro para reiniciar). Sincroniza com a deck por `BroadcastChannel`
(mesmo origin, offline) — navega na janela da deck e a do apresentador acompanha. Precisa de
ser servida por `http://` (não `file://`). Com `s` (notas na própria deck) os alunos veem-nas
se espelhares; com `p` em ecrã estendido, não.

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

## Os 40 slides

1. Título *(hero centrado)*
2. O caminho de hoje (três perguntas; "no fim, o mapa completo")
3. O que é um computador (entrada → processamento → saída)
4. Hardware (processador / memória / armazenamento; desligar)
5. Software (máquina + instruções = trabalho feito)
6. Sistema operativo (camadas; Windows / macOS / Linux)
7. O que é um ficheiro (anatomia `nome` . `extensão`)
8. **Tudo é texto** (a mesma nota em `.txt` → `.md` → `.csv` → `.json`, animado passo a passo)
9. A extensão diz o tipo/programa (.csv/.docx/.jpg/.pdf/.html → folha/texto/imagem/PDF/browser; browser → chatbot)
10. Organização dos ficheiros (árvore = arquivo clínico)
11. O mesmo caminho (Windows `\` + `C:` vs macOS/Linux `/`)
12. Zona do sistema vs a tua zona
13. Ficheiros ocultos (definições) *(opcional)*
14. Duas formas de pedir o mesmo (clicar vs escrever)
15. O terminal (comando real `ls`, com legenda)
16. **Pasta de trabalho** (onde o agente atua — working directory)
17. Repetir sem esforço (varrimento + contador) *(opcional)*
18. Instalar programas (lista verificada; Homebrew / apt / npm)
19. A internet (pedido / resposta)
20. A web (URL → servidor → página; browser → chatbot)
21. O que é uma API (impresso de requisição)
22. Chave de API (+ guarda segura + custos)
23. O modelo — o cérebro emprestado
24. Tokens (o modelo lê/escreve em pedaços de texto)
25. Custo na cloud (paga-se por token: entrada + saída)
26. O agente OpenCode (lê / escreve / executa; transição p/ terminal real)
27. **Prompt + contexto** (janela de contexto: o que o modelo vê)
28. **Permissões do agente** (propõe e pede autorização)
29. A IA pode enganar-se — confirma sempre
30. A fronteira — os ficheiros saem da máquina
31. Dados de doentes (RGPD: contrato / localização / base legal + DPO)
32. **Pseudonimização** (tirar identificadores antes de usar)
33. Modelo local (opção segura; requisitos de hardware)
34. Primeiros passos *(opcional)*
35. Glossário PT (termo + definição + exemplo)
36. Quiz 1/2 — escolha múltipla, revela por passos *(opcional)*
37. Quiz 2/2 — risco / RGPD / agente *(opcional)*
38. **Termos não falados** (lista para discussão aberta)
39. Em resumo
40. **O mapa** — esquema final só com símbolos e setas

Slides marcados *(opcional)* aparecem com etiqueta "opcional" na grelha (`o`).

## Design — Try-Works

Design system **Try-Works** (Moby-Dick, ch.96: *campo frio, fogo raro*). Fontes locais
(offline, `assets/fonts/`): **Fraunces** (títulos serif display), **Archivo** (UI),
**JetBrains Mono** (eyebrows/terminal), **Literata** (corpo). Um campo frio (osso/mar) com o
**âmbar (fogo) só nas marcas críticas** (chave, fronteira/RGPD, custo, "a IA pode errar").
Dois modos: **True Lamp (claro)** por omissão, **Try-Fire (escuro)** — alternar com `d`.

Slides técnicos novos: **A web** (URL → servidor → página; browser → chatbot), **Tokens**
(o modelo lê/escreve em pedaços de texto; contexto mede-se em tokens), **Custo na cloud**
(paga-se por token: entrada+saída; modelo local não cobra por uso).

**Bilingue (PT/EN)** — tecla `l` alterna. Tudo o que está nos slides está traduzido
(~300 `data-en` em `index.html`, motor em `js/deck.js`): títulos, eyebrows, leads, apartes,
rótulos de diagrama, quiz, glossário e os terminais falsos (`outEn`/`cmdEn` em `js/animations.js`).
Só ficam em PT as **notas do orador (`s`)** e as **definições do modal de termos** (são auxiliares
do apresentador). O toggle re-corre o terminal visível no novo idioma.

**Quiz** — perguntas centradas, **uma de cada vez**: cada slide entra na 1.ª pergunta e cada
avanço revela a resposta e depois a pergunta seguinte.

**Terminais falsos** — prompt realista `rosa@mac ~/estudo $ cmd` (o `$` a âmbar). O demo do
agente mostra o fluxo completo: lê ficheiros nomeados → envia para a cloud (âmbar) → pede
autorização `[s/N]` → escreve → aviso de que os ficheiros saíram da máquina.

Atalhos: `→ ←` navegar · `o` grelha · `f` ecrã · `t` repetir · `s` notas · **`d` modo** · **`l` idioma**.
Captura/revisão: `?all` (revela passos), `?mode=lit` (escuro), `?lang=en`.

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
