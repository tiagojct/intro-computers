# Guião de locução — Do hardware ao agente

Apresentação para profissionais de saúde / investigadores clínicos.
Controla com `→` (avançar passo/slide), `←` (recuar), `t` (repetir animação), `f` (ecrã inteiro), `o` (grelha).

> **Notas no próprio deck:** carrega `s` para abrir um painel discreto com a nota condensada
> de cada slide (inclui os pontos de **verificação de compreensão**). Este ficheiro é o guião
> completo; o painel é o lembrete rápido durante a aula. Mostra-o só num ecrã de apresentador.

**Tempo:** ~45 min com tudo; **~30 min** saltando os slides marcados *(opcional)*.
**Cortes para 30 min:** saltar **Ficheiros ocultos**, **Automatizar**, **Primeiros passos** e o **Quiz**.
Na grelha (`o`) os opcionais aparecem marcados "opcional". O contador no ecrã é a referência de posição.

Regra de ouro: o ecrã diz pouco de propósito. A explicação és **tu**.

---

### Título — *0:30*
- Enquadra: "hoje vamos da máquina física até usar uma IA, sem dar nada por adquirido."
- Pergunta: "quem aqui já abriu um terminal?" (calibra o nível).

### O caminho — *1:00*
- As três perguntas do dia. A 3ª (ficheiros + IA) é o que importa mesmo.
- **Diz:** "no fim, vemos o mapa completo disto tudo." (cria reconhecimento no slide final).

### O que é um computador — *1:00*
- Entrada → processamento → saída. O ponto animado percorre o ciclo.
- Metáfora: pedir uma análise — amostra, laboratório, resultado.

### Hardware — *2:00*
- Três peças. Deixa o processador a pulsar.
- No passo "Desligar" (a memória esvazia-se): **martela** — o que está na memória desaparece; no arquivo, fica.
- Fecho: "tudo isto está só *nesta* máquina — até algo o enviar para fora." (semente da fronteira).

### Software — *1:00*
- Hardware + instruções = trabalho feito.
- Metáfora: o conhecimento clínico é o que torna útil um profissional treinado.

### Sistema operativo — *1:00*
- O intermediário entre ti e as peças. Windows / macOS / Linux.

### O que é um ficheiro — *0:45*
- Informação guardada com um nome. **Antes do ponto = nome; depois = extensão** (o tipo).

### A extensão diz o tipo — *1:15*
- A extensão (à direita do ponto) define **como os dados estão guardados** e **que programa o sistema usa** para abrir.
- Exemplos: `.csv` tabela de dados (abre na folha de cálculo — **mas é texto, não é uma folha de cálculo**); `.docx` texto (processador); `.jpg` imagem (editor); `.pdf` documento (leitor); `.html` web (**browser**).
- **Ponte:** o browser abre a web — e é num browser que falas com um **chatbot** (liga ao agente, mais à frente).

### Organização dos ficheiros — *1:30*
- Pastas dentro de pastas = arquivo clínico (serviço → processo → documentos).
- Mostra que a máquina escreve o caminho numa linha só.

### O mesmo caminho (Windows vs macOS) — *1:00*
- O mesmo ficheiro escrito de duas formas. Mesma estrutura, escrita diferente.
- Windows: `\` e letra de unidade (`C:`). macOS/Linux: `/`. O resto é igual.

### Zonas — *1:15*
- Zona do sistema (restrita) vs a tua zona. Impede estragar o sistema sem querer.
- Metáfora: armazém da farmácia vs o teu gabinete.

### Ficheiros ocultos — *1:00*  *(opcional — saltar se apertado)*
- Definições fora de vista. Como a calibração de um aparelho.
- Liga ao passo seguinte da formação: "vais vê-los ao configurar as ferramentas."

### Falar por texto — *1:15*
- Clicar (5 passos) vs escrever (1 linha). O esforço é que muda.

### O terminal — *2:00*
- Deixa o terminal escrever sozinho. Depois usa a legenda colorida: utilizador / pasta / ordem / resposta.
- Tranquiliza: "parece árido, mas é só texto que entra e texto que sai."

### Pasta de trabalho — *1:00*
- A pasta do projeto onde o agente atua (working directory). Abres o terminal dentro dela.
- Só nessa pasta ele lê e escreve; o que está fora fica de fora. Liga terminal → agente.

### Automatizar — *1:00*  *(opcional — o Terminal já vendeu o valor)*
- Uma ordem, mil ficheiros. Trabalho repetitivo sem esforço.

### Instalar programas — *1:30*
- Gestor de pacotes = só de fontes verificadas. Metáfora: formulário de medicamentos aprovados.
- Nunca um programa qualquer apanhado na net. Homebrew / apt / npm.

### A internet — *1:15*
- Pedido → servidor → resposta. Metáfora: amostra ao laboratório externo, relatório de volta.

### O que é uma API — *1:00*
- Só um impresso de requisição: campos fixos, sem ambiguidade.

### Chave de API — *1:15*
- Credencial pessoal. Não partilhar; **guardar em variável de ambiente** (nunca num ficheiro partilhado); se vazar, **revogar e gerar outra**; atenção aos **custos por uso**.
- Metáfora: as tuas credenciais de acesso ao sistema clínico.

### O modelo — *1:30*
- O "cérebro emprestado": programa enorme num datacenter, não no teu portátil.
- A chave dá-te acesso; há muitos modelos, com capacidades e preços diferentes.
- Liga: "este é o cérebro; a seguir, quem o usa por ti."

### O agente (OpenCode) — *2:00*
- Lê, escreve, executa. Instala-se com o gestor de pacotes que já viram.
- **TRANSIÇÃO PARA O TERMINAL REAL:** aqui, `f`/`Esc` para sair da apresentação e **abrir o terminal a sério**. Mostra o OpenCode a correr com um comando real. (Volta depois ao slide seguinte.)

### Prompt + contexto — *1:15*
- O **prompt** é o que escreves. A **janela de contexto** é o que o modelo vê de cada vez (ficheiros + pergunta).
- O que fica fora da janela, ele não conhece — tu escolhes o que entra.

### Permissões do agente — *1:00*
- Antes de escrever/correr, o agente **propõe** e pede **autorização**. Tu lês e aprovas ou recusas.
- Reforça: o controlo é teu; nada acontece sem o teu sim.

### A IA pode enganar-se — *1:30*
- Pode inventar com confiança; não conhece o caso à frente.
- **Confirma sempre.** Assistente, não substituto — a responsabilidade clínica é tua.

### A fronteira — *2:00*  ← **o coração da apresentação**
- Para pensar, o agente envia os teus ficheiros para fora.
- Deixa o fluxo de documentos atravessar a linha. Frase para assentar: "o conteúdo dos teus ficheiros sai da máquina."
- Faz uma pausa aqui.

### Dados de doentes — *2:00*
- Deixa de ser conveniência: é tratamento de dados (RGPD).
- As três perguntas: contrato? onde ficam? base legal/consentimento?
- "Sem resposta clara, não envies para a cloud. Na dúvida, fala com o DPO."

### Pseudonimização — *1:15*
- Tirar o que identifica (nome, nº utente) **antes** de usar o ficheiro.
- Reduz o risco — mas confirma a base legal; não é passe livre.

### Modelo local — *1:30*
- A opção segura para dados identificáveis: corre na própria máquina (Ollama), instalado do mesmo gestor de pacotes.
- **Precisa de máquina capaz** (muita RAM; modelos grandes pedem GPU) e é mais lento — mas privado por construção. A cloud só sem dados de doentes (ou com contratos e consentimento). Requisitos/nomes mudam — confirma a documentação atual.

### Primeiros passos — *1:00*  *(opcional — redundante com o workshop a seguir)*
- Checklist de arranque. Lembra que nomes/versões mudam.

### Glossário — *0:45*
- "Levem isto." Página de consulta PT.

### Quiz — *3:00*  *(opcional)*
- As 10 perguntas vivem no mesmo slide. Lê a pergunta, deixa responder, **só depois** avança o
  passo para revelar — a opção certa acende a verde, e fica acumulada no ecrã com as anteriores.
- 1 memória · 2 barra `\` no Windows · 3 lista verificada · 4 (aberta) o que é uma API · 5 chave em variável de ambiente.
- 6 ficheiros saem para a cloud · 7 dados de doentes → modelo local · 8 pseudonimizar = tirar identificadores.
- 9 (aberta) o agente pede autorização · 10 (aberta) a IA pode errar → confirmar sempre.

### Termos não falados — *1:00*
- Grelha de termos que ficaram de fora. Pergunta à turma se há algum que queiram discutir.
- Abre 1-2 à vontade conforme o tempo (estacionamento de dúvidas).

### Em resumo — *0:45*
- A cadeia toda numa linha. Reforça: dados de doentes → modelo local.

### O mapa — *1:00*
- A peça visual. Deixa os fios desenharem-se e os dados fluírem.
- "Reconhecem isto? É tudo o que vimos, ligado." Termina aqui.

---

## Percurso de 30 minutos (cortado)
Saltar os 4 opcionais: **Ficheiros ocultos**, **Automatizar**, **Primeiros passos**, **Quiz**.
Mantém pasta de trabalho, prompt/contexto, permissões e pseudonimização (são curtos e ligam o arco).
≈ 30 slides, ~30 min com margem para perguntas e para o estacionamento de termos.
