# Análise SWOT — *Do hardware ao agente*

**Avaliação pedagógica** · 2026-06-18 · perspetiva de educador
Objeto: apresentação interativa (HTML/CSS/JS, 27 slides, PT-PT) para profissionais de
saúde e investigadores clínicos, que parte do *hardware* físico até ao uso de um agente de
IA no terminal, tendo como clímax a proteção de dados de doentes (RGPD) e a ideia de que
*o conteúdo dos ficheiros sai da máquina e atravessa uma fronteira institucional*.

---

## Resumo

Este é um material de formação **maduro, coeso e tecnicamente sólido**. A arquitetura
sem dependências (offline, sem *build*, fontes e anime.js incluídos) torna-o fiável em
sala; o design é profissional e a curadoria das metáforas clínicas é exemplar. A sua maior
força pedagógica — *slides propositadamente vazios, com a explicação a cargo do orador* — é
também a sua principal fragilidade: a aula é **unidirecional**, sem momentos de verificação
de compreensão, e depende fortemente da pessoa que apresenta. As melhorias de maior impacto
(implementadas nesta revisão) atacam exatamente esse ponto, sem mexer no polimento visual
nem no ritmo de 30/38 min.

---

## Forças

- **Arco pedagógico coerente e progressivo.** Da máquina física → SO → ficheiros →
  terminal → internet/API → modelo → agente → **fronteira/RGPD**. Cada slide prepara o
  seguinte (scaffolding); a 3.ª pergunta do roteiro é assumidamente o coração da aula.
- **Metáforas clínicas consistentes e bem escolhidas.** Arquivo clínico (sistema de
  ficheiros), requisição/laboratório externo (API/internet), formulário de medicamentos
  aprovados (gestor de pacotes), login de prescritor (chave de API). Reduzem a carga
  cognitiva de uma audiência não técnica.
- **A mensagem que mais importa é o clímax, não um rodapé.** A fronteira institucional e
  o RGPD ocupam o terço final (slides 21–23) e culminam no mapa-síntese (27).
- **Arquitetura robusta e *fail-safe*.** Pura HTML/CSS/JS, sem `npm`, sem CDN; fontes e
  anime.js locais. Os "terminais" são encenados — nada depende de rede ou chaves durante a
  aula. Corre em qualquer máquina.
- **Design profissional e identidade visual forte.** Sistema de *tokens* consistente,
  tipografia Inter + IBM Plex Mono, ícones SVG (sem emojis), cantos vivos, *hairlines*.
- **Acessibilidade cuidada.** Respeita `prefers-reduced-motion` (animações e terminais
  ficam instantâneos).
- **Guião de locução completo** (`SPEAKER.md`) com tempos por slide, pontos-chave,
  metáforas, perguntas e cortes para o slot de 30 min.
- **Dois formatos.** Deck principal (controlo fino) + versão Twine (auto-ritmo,
  ramificada) — flexibilidade de entrega.

## Fraquezas

- **Comunicação unidirecional; sem verificação de compreensão.** Não havia *checkpoints*,
  perguntas à turma nem avaliação formativa — não se mede se a mensagem passou. *(Atenuado
  nesta revisão.)*
- **Notas do orador num ficheiro separado.** Exigiam segundo ecrã ou impressão de
  `SPEAKER.md`. *(Atenuado nesta revisão: tecla `s`.)*
- **Transição para o terminal real é manual e frágil** (slide 19). Se a instalação/rede
  falhar ao vivo, quebra a credibilidade — não há plano B no deck.
- **O slide-clímax do RGPD levantava 3 perguntas mas não dava um caminho de decisão claro**
  ("e se a resposta for não?"). *(Reforçado nesta revisão: tira de decisão.)*
- **Modelo local (Ollama) sem expectativas concretas** de requisitos de hardware ou
  desempenho — fica abstrato para quem terá de o adotar.
- **Chave de API sem armazenamento seguro.** Diz "não partilhar / pode ter custos", mas não
  mostra *onde/como* guardar (variáveis de ambiente, gestor de segredos) nem rotação/revogação.
- **Glossário mínimo** (12 termos, definições de uma linha) e sem exemplos clínicos.
- **Sem material de apoio para o aluno levar** (folha-resumo) nem quiz final.

## Oportunidades

- **Tornar a aula bidirecional** com *checkpoints* de compreensão e momentos "pergunta à
  turma" ao fim de cada bloco — sem violar a filosofia de "ecrã minimalista".
- **Notas embutidas no próprio deck**, eliminando a dependência de segundo ecrã.
- **Reforçar o clímax** transformando as 3 perguntas do RGPD num auxílio de decisão visível.
- **Folha-resumo A4** (glossário + cadeia + as 3 perguntas RGPD) para o aluno levar.
- **Integração explícita com o workshop Promptfather** (ligações cruzadas nos materiais).
- **Export auto-ritmo (Twine)** para auto-estudo antes/depois da sessão.
- **Aprofundar Ollama e a guarda da chave** com 1–2 linhas concretas cada.

## Ameaças

- **Dependência total do apresentador.** Reutilizado por outro docente sem o contexto, o
  deck "vazio por desenho" perde grande parte do valor. *(Mitigado pelas notas embutidas.)*
- **Conteúdo técnico-AI volátil.** Nomes, preços e capacidades de modelos, e ferramentas
  (OpenCode, Ollama), mudam depressa — risco de desatualização.
- **Demo ao vivo dependente de rede/instalação** — falha possível no pior momento.
- **A mensagem RGPD ser ouvida mas não accionada** — risco de ficar no plano da
  consciencialização sem mudar comportamento.
- **Manutenção ao longo do tempo** (um único autor, repositório isolado).

---

## Matriz cruzada (TOWS) — da análise à ação

- **Forças × Oportunidades** — A coerência do arco + a oportunidade de bidirecionalidade →
  **verificações de compreensão nos limites dos blocos** (feito) que consolidam cada etapa.
- **Forças × Ameaças** — O guião forte + a ameaça de dependência do orador →
  **embutir as notas no deck** (feito), tornando-o reutilizável por outros docentes.
- **Fraquezas × Oportunidades** — RGPD sem caminho de decisão + clímax forte →
  **tira de decisão "sem resposta clara aos três → …"** (feito) que converte a mensagem em ação.
- **Fraquezas × Ameaças** — Demo frágil + falha de rede ao vivo →
  **slide de recurso (screenshot/gravação) do OpenCode** (backlog) como rede de segurança.

---

## Roteiro priorizado

| # | Ação | Impacto | Esforço | Estado |
|---|------|---------|---------|--------|
| 1 | Notas do orador embutidas no deck (tecla `s`) | Alto | Médio | **Feito** |
| 2 | Verificações de compreensão / "pergunta à turma" (fim dos blocos 1, 2 e recap) | Alto | Baixo | **Feito** |
| 3 | Auxílio de decisão RGPD no slide 22 (tira "não cloud · local · DPO") | Alto | Baixo | **Feito** |
| 4 | Slide de recurso para a demo ao vivo (screenshot/gravação do OpenCode) | Alto | Baixo | Próximo |
| 5 | Guarda segura da chave de API (variável de ambiente; nunca em ficheiro partilhado) | Médio | Baixo | Próximo |
| 6 | Ollama: requisitos de hardware + expectativa de desempenho | Médio | Baixo | Próximo |
| 7 | Folha-resumo A4 para o aluno (glossário + cadeia + 3 perguntas RGPD) | Médio | Médio | Backlog |
| 8 | Ligações cruzadas com o workshop Promptfather | Médio | Baixo | Backlog |
| 9 | Glossário com exemplos clínicos | Baixo | Baixo | Backlog |
| 10 | Quiz final curto / export Twine para auto-estudo | Médio | Médio | Backlog |

---

## O que mudou nesta revisão (itens 1–3)

- **Notas do orador no deck (`s`).** Painel discreto, escondido por omissão, com a nota
  condensada de cada slide (origem: `SPEAKER.md`). Removem a dependência de segundo ecrã e
  tornam o deck reutilizável por outro docente. Implementado em `index.html`
  (`<script type="application/json" id="notes-data">`), `js/deck.js` e `css/base.css`.
- **Verificação de compreensão.** Marcadores **&#10003; VERIFICA** nas notas ao fim do
  bloco 1 (slide *Zonas*), do bloco 2 (slide *O modelo*) e na recapitulação; além de um
  passo no slide *Em resumo* que pergunta à turma antes de revelar a conclusão.
- **Decisão RGPD (slide 22).** Nova tira de passo que resolve as 3 perguntas num caminho
  claro: **não enviar para a cloud · usar modelo local · falar com o DPO**.

> Todas as alterações são **aditivas**: não tocam nas animações (`SlideHooks`), no `pipeline`
> de passos nem nos tempos de 30/38 min.
