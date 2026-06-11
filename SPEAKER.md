# Guião de locução — Do hardware ao agente

Apresentação para profissionais de saúde / investigadores clínicos.
Controla com `→` (avançar passo/slide), `←` (recuar), `t` (repetir animação), `f` (ecrã inteiro), `o` (grelha).

**Tempo:** ~38 min com tudo; **~30 min** saltando os slides marcados *(opcional)*.
**Cortes para 30 min:** saltar **10** (dotfiles), **13** (automatizar), **24** (primeiros passos).
Na grelha (`o`) estes aparecem marcados "opcional".

Regra de ouro: o ecrã diz pouco de propósito. A explicação és **tu**.

---

### 1 · Título — *0:30*
- Enquadra: "hoje vamos da máquina física até usar uma IA, sem dar nada por adquirido."
- Pergunta: "quem aqui já abriu um terminal?" (calibra o nível).

### 2 · O caminho — *1:00*
- As três perguntas do dia. A 3ª (ficheiros + IA) é o que importa mesmo.
- **Diz:** "no fim, vemos o mapa completo disto tudo." (cria reconhecimento no slide 27).

### 3 · O que é um computador — *1:00*
- Entrada → processamento → saída. O ponto animado percorre o ciclo.
- Metáfora: pedir uma análise — amostra, laboratório, resultado.

### 4 · Hardware — *2:00*
- Três peças. Deixa o processador a pulsar.
- No passo "Desligar" (a memória esvazia-se): **martela** — o que está na memória desaparece; no arquivo, fica.
- Fecho: "tudo isto está só *nesta* máquina — até algo o enviar para fora." (semente da fronteira).

### 5 · Software — *1:00*
- Hardware + instruções = trabalho feito.
- Metáfora: o conhecimento clínico é o que torna útil um profissional treinado.

### 6 · Sistema operativo — *1:00*
- O intermediário entre ti e as peças. Windows / macOS / Linux.

### 7 · O que é um ficheiro — *0:45*
- Informação com um nome. O fim do nome diz o tipo (`.csv`).

### 8 · Organização dos ficheiros — *1:30*
- Pastas dentro de pastas = arquivo clínico (serviço → processo → documentos).
- Mostra que a máquina escreve o caminho numa linha só.

### 9 · Zonas — *1:15*
- Zona do sistema (restrita) vs a tua zona. Impede estragar o sistema sem querer.
- Metáfora: armazém da farmácia vs o teu gabinete.

### 10 · Ficheiros ocultos — *1:00*  *(opcional — saltar se apertado)*
- Definições fora de vista. Como a calibração de um aparelho.
- Liga ao passo seguinte da formação: "vais vê-los ao configurar as ferramentas."

### 11 · Falar por texto — *1:15*
- Clicar (5 passos) vs escrever (1 linha). O esforço é que muda.

### 12 · O terminal — *2:00*
- Deixa o terminal escrever sozinho. Depois usa a legenda colorida: utilizador / pasta / ordem / resposta.
- Tranquiliza: "parece árido, mas é só texto que entra e texto que sai."

### 13 · Automatizar — *1:00*  *(opcional — o slide 11 já vendeu o terminal)*
- Uma ordem, mil ficheiros. Trabalho repetitivo sem esforço.

### 14 · Instalar programas — *1:30*
- Gestor de pacotes = só de fontes verificadas. Metáfora: formulário de medicamentos aprovados.
- Nunca um programa qualquer apanhado na net. Homebrew / apt / npm.

### 15 · A internet — *1:15*
- Pedido → servidor → resposta. Metáfora: amostra ao laboratório externo, relatório de volta.

### 16 · O que é uma API — *1:00*
- Só um impresso de requisição: campos fixos, sem ambiguidade.

### 17 · Chave de API — *1:15*
- A tua credencial pessoal. Não partilhar, não expor. **Pode ter custos.**
- Metáfora: o teu login de prescritor.

### 18 · O modelo — *1:30*
- O "cérebro emprestado": programa enorme num datacenter, não no teu portátil.
- A chave dá-te acesso; há muitos modelos, com capacidades e preços diferentes.
- Liga: "este é o cérebro; a seguir, quem o usa por ti."

### 19 · O agente (OpenCode) — *2:00*
- Lê, escreve, executa. Instala-se com o gestor de pacotes que já viram.
- **TRANSIÇÃO PARA O TERMINAL REAL:** aqui, `f`/`Esc` para sair da apresentação e **abrir o terminal a sério**. Mostra o OpenCode a correr com um comando real. (Volta depois para o slide 20.)

### 20 · A IA pode enganar-se — *1:30*
- Pode inventar com confiança; não conhece o teu doente.
- **Confirma sempre.** Assistente, não substituto — a responsabilidade clínica é tua.

### 21 · A fronteira — *2:00*  ← **o coração da apresentação**
- Para pensar, o agente envia os teus ficheiros para fora.
- Deixa o fluxo de documentos atravessar a linha. Frase para assentar: "o conteúdo dos teus ficheiros sai da máquina."
- Faz uma pausa aqui.

### 22 · Dados de doentes — *2:00*
- Deixa de ser conveniência: é tratamento de dados (RGPD).
- As três perguntas: contrato? onde ficam? base legal/consentimento?
- "Sem resposta clara, não envies para a cloud. Na dúvida, fala com o DPO."

### 23 · Modelo local — *1:30*
- A opção segura para dados identificáveis: corre na própria máquina (Ollama), instalado do mesmo gestor de pacotes.
- Mais lento, menos capaz — mas privado por construção. A cloud só sem dados de doentes (ou com contratos e consentimento).

### 24 · Primeiros passos — *1:00*  *(opcional — redundante com o workshop a seguir)*
- Checklist de arranque. Lembra que nomes/versões mudam.

### 25 · Glossário — *0:45*
- "Levem isto." Página de consulta PT.

### 26 · Em resumo — *0:45*
- A cadeia toda numa linha. Reforça: dados de doentes → modelo local.

### 27 · O mapa — *1:00*
- A peça visual. Deixa os fios desenharem-se e os dados fluírem.
- "Reconhecem isto? É tudo o que vimos, ligado." Termina aqui.

---

## Percurso de 30 minutos (cortado)
1 → 9, salta **10**, 11 → 12, salta **13**, 14 → 23, salta **24**, 25 → 27.
≈ 24 slides, ~30 min com margem para perguntas.
