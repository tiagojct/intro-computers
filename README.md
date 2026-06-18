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

## Os 27 slides

1. Título
2. O caminho de hoje (três perguntas; "no fim, o mapa completo")
3. O que é um computador (entrada → processamento → saída)
4. Hardware (processador / memória / armazenamento; desligar para o processador e esvazia a memória)
5. Software (máquina + instruções = trabalho feito)
6. Sistema operativo (camadas; Windows / macOS / Linux ligados à camada do SO)
7. O que é um ficheiro
8. Organização dos ficheiros (árvore = arquivo clínico)
9. Zona do sistema vs a tua zona
10. Ficheiros ocultos (definições) *(opcional)*
11. Duas formas de pedir o mesmo (clicar = 5 passos vs escrever = 1 linha)
12. O terminal (comando real `ls`, com legenda das partes)
13. Repetir sem esforço (varrimento + contador 0→1000) *(opcional)*
14. Instalar programas (lista verificada; Homebrew / apt / npm)
15. A internet (pedido / resposta)
16. O que é uma API (impresso de requisição)
17. Chave de API (+ custos)
18. **O modelo — o cérebro emprestado** (portátil → chave → datacenter)
19. O agente OpenCode (lê / escreve / executa; transição p/ terminal real — ver SPEAKER.md)
20. A IA pode enganar-se — confirma sempre
21. A fronteira — os ficheiros saem da máquina
22. Dados de doentes (RGPD: contrato / localização / base legal + DPO)
23. Modelo local (a opção segura para dados de doentes)
24. Primeiros passos *(opcional)*
25. Glossário PT
26. Em resumo
27. **O mapa** — esquema final só com símbolos e setas; fios desenham-se, dados fluem

Slides marcados *(opcional)* aparecem com etiqueta "opcional" na grelha (`o`); cortá-los dá ~30 min.

## Notas

- Animações com **anime.js** (vendido em `vendor/`, offline): coreografia de entrada, loops contínuos, fluxo de dados no mapa, ficheiros a atravessar a fronteira. Re-disparar com `t`.
- **Design alinhado com tiagojct.eu** (estilo rsms.me): fundo tom-da-home, acento azul, hairlines, cantos vivos (3px), eyebrows mono. Tipografia **Inter** + **IBM Plex Mono**, vendida em `assets/fonts/` (offline, sem Google Fonts).
- Texto reduzido ao mínimo: títulos curtos + apartes; o detalhe fica para a fala.
- Os **terminais** mantêm-se escuros de propósito (parecem janelas reais sobre o branco).
- Personagem dos exemplos: **Rosa**. Comandos reais, traduzidos em linguagem simples.
- Ícones em **SVG** (sprite no topo do `index.html`), sem emojis.
- Respeita `prefers-reduced-motion` (animações e terminais ficam instantâneos).
- Sem dependências, sem `npm install`. Única chamada de rede: as fontes Google (opcional).
