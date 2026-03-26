import type { QuizData } from "./schema";

export function buildPrompt(data: QuizData) {
  return `
Você é um orientador especialista em carreira internacional, planejamento de estudos e posicionamento profissional.

Analise o perfil abaixo e gere uma resposta objetiva, útil, realista e personalizada.

DADOS DO USUÁRIO
Nome: ${data.nome}
WhatsApp: ${data.whatsapp}

PERFIL
- Se considera mais: ${data.perfil.seConsideraMais}
- Prefere trabalhar: ${data.perfil.prefereTrabalhar}
- Toma decisões com: ${data.perfil.decisoes}

OBJETIVOS
- Maior objetivo hoje: ${data.objetivos.maiorObjetivo}
- Onde quer estar em 1 ano: ${data.objetivos.ondeQuerEstarEm1Ano}
- O que deseja conquistar: ${data.objetivos.oQueDesejaConquistar}

REALIDADE ATUAL
- Horas por dia: ${data.realidadeAtual.horasPorDia}
- Situação atual: ${data.realidadeAtual.trabalhaOuEstuda}
- Disciplina: ${data.realidadeAtual.disciplina}/10
- Já tentou mudar de vida antes: ${data.realidadeAtual.jaTentouMudar}

DIFICULDADES
- Principal dificuldade: ${data.dificuldades.principalDificuldade}
- Maior medo: ${data.dificuldades.maiorMedo}
- Começa e não termina: ${data.dificuldades.comecaENaoTermina}

INTERESSES
- Tempo livre: ${data.interesses.tempoLivre}
- Áreas: ${data.interesses.areas.join(", ")}
- Se dinheiro não fosse problema: ${data.interesses.semDinheiroComoProblema}

PERSONALIZAÇÃO
- Estilo do plano: ${data.personalizacao.estiloPlano}

REGRAS
- Sugira de 3 a 4 carreiras.
- Sugira 3 países coerentes com o perfil e objetivo.
- O plano deve ser de 30 dias, dividido em 4 semanas.
- O plano deve ser viável para a quantidade de horas diárias informada.
- A resposta deve ser prática, sem frases genéricas.
- Leve em conta barreiras como procrastinação, foco, direção, dinheiro e disciplina.

FORMATO OBRIGATÓRIO
Retorne APENAS JSON com este formato:
{
  "diagnostico": "texto",
  "carreiras": ["item 1", "item 2", "item 3"],
  "paises": ["item 1", "item 2", "item 3"],
  "plano30Dias": [
    {
      "semana": "Semana 1",
      "foco": "texto curto",
      "acoes": ["ação 1", "ação 2", "ação 3"]
    }
  ],
  "rotinaDiaria": ["item 1", "item 2", "item 3"],
  "alertas": ["item 1", "item 2", "item 3"]
}
`;
}