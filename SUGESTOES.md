# Sugestões de melhoria — intro-computers

Avaliação de Basílio (Hermes Agent), 2026-06-06.

A apresentação está pronta para ser usada. As sugestões abaixo são incrementais.

---

## 1. Adicionar slide "O modelo" entre o 17 e o 18

**Problema:** A progressão actual é API → Chave de API → Agente OpenCode. Falta o conceito de "o que é um modelo de IA" — o elo que liga a chave ao agente.

**Slide proposto (17.5):**
- Título: "O modelo — o cérebro emprestado"
- Corpo: "Um programa enorme (centenas de GB) treinado para prever texto. Corre em GPUs, em datacenters, não no teu portátil. A chave de API dá-te acesso a ele. O OpenRouter lista dezenas — com preços e capacidades diferentes."
- Diagrama: "o teu portátil" → "chave" → "OpenRouter" → "modelo a correr num datacenter"
- 4 ícones, 3 linhas de texto. Simples.

**Esforço:** ~30 min.

---

## 2. Criar `SPEAKER.md` com guião de locução

**Problema:** O README descreve os slides mas não há *speaker notes*. Para uma audiência sem background técnico, saber exactamente o que dizer em cada slide é tão importante como o design.

**Formato sugerido:** Uma entrada por slide, com:
- Duração estimada
- Pontos-chave a cobrir
- Metáfora clínica a usar (se aplicável)
- Pergunta a fazer à audiência (se aplicável)
- Momento de transição (ex: "aqui, fecha a apresentação e abre o terminal real")

**Esforço:** ~45 min.

---

## 3. Usar o mapa (slide 27) como roadmap no início

**Problema:** O slide 27 é a peça visual mais valiosa da apresentação e só aparece no fim. Mostrá-lo no início como "aqui está o mapa completo — vamos percorrê-lo" cria um efeito pedagógico de reconhecimento quando os alunos o revêem no fim.

**Sugestão:** No slide 2 ("O caminho de hoje"), adicionar uma versão simplificada do mapa com os nós a cinzento. Alternativa mais simples: adicionar uma nota de locução no slide 2 que diga "no fim, vamos ver o mapa completo disto tudo."

**Esforço:** ~15 min.

---

## 4. Marcar a transição "apresentação → terminal real" no slide 18

**Problema:** Os terminais falsos (`typeInto`) são excelentes como dispositivo de apresentação, mas o workshop é *sobre* o terminal. Em algum momento, a apresentação tem de dar lugar ao terminal real.

**Sugestão:** No slide 18 (OpenCode), adicionar uma nota (HTML comment ou atributo `data-note`) que indique ao apresentador: "Aqui, fecha a apresentação (Esc) e abre o terminal real. Mostra o OpenCode a correr com um comando real." Isto também deve ir para o `SPEAKER.md`.

**Esforço:** ~5 min.

---

## 5. Decidir cortes para caber em 30 minutos

**Problema:** 27 slides a ~1.5 min cada = ~40 minutos. Para o workshop Promptfather (slot de 30 min), é preciso cortar ou marcar slides como opcionais.

**Sugestão de cortes:**
- Slide 10 (dotfiles) — interessante mas não essencial para o arco principal. Marcar como opcional.
- Slide 13 (automação) — o slide 11 já vende o valor do terminal. Marcar como opcional.
- Slide 24 (primeiros passos) — redundante com o que vai acontecer no workshop a seguir. Cortar.

Com estes cortes: 24 slides ≈ 30 minutos.

**Implementação:** Adicionar classe `optional` aos slides 10 e 13. No `SPEAKER.md`, indicar que se salta do 9 para o 11 e do 12 para o 14 se o tempo for apertado.

**Esforço:** ~10 min.

---

## 6. Integrar com o workshop Promptfather

**Problema:** A apresentação vive num repositório separado (`intro-computers`) e não está referenciada no material do workshop (`ev2026-promptfather`).

**Sugestões:**
- Adicionar link para o `intro-computers` no `course.qmd` do Promptfather (secção inicial ou como material de apoio).
- No `instructor/script.md` do Promptfather, adicionar uma nota na secção de abertura: "Antes do workshop, mostra a apresentação `intro-computers` (30 min)."
- No `workshop-logistics.md`, adicionar `intro-computers` à checklist de véspera: "Testar apresentação no portátil: `cd intro-computers && python3 -m http.server 8000`."

**Esforço:** ~20 min.

---

## Resumo

| # | Acção | Esforço | Prioridade |
|---|-------|---------|------------|
| 1 | Slide "O modelo" | 30 min | Alta — fecha o arco conceptual |
| 2 | `SPEAKER.md` | 45 min | Alta — essencial para dar a aula |
| 3 | Mapa como roadmap | 15 min | Média — melhoria pedagógica |
| 4 | Transição para terminal real | 5 min | Média — evita quebra no workshop |
| 5 | Cortes para 30 min | 10 min | Alta — necessário para o slot |
| 6 | Integração com Promptfather | 20 min | Média — conecta os materiais |

**Total:** ~2h de trabalho para ter a apresentação completamente afinada para a Escola de Verão.
