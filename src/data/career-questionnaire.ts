import type {
  ArrayQuestionField,
  CareerFormValues,
  CareerQuestion,
  CareerStep,
} from "@/types/career";

export const CAREER_STEPS: CareerStep[] = [
  {
    id: "identification",
    title: "Etapa 1",
    subtitle: "Identificação",
  },
  {
    id: "goals",
    title: "Etapa 2",
    subtitle: "Teste de personalidade",
  },
  {
    id: "availability",
    title: "Etapa 3",
    subtitle: "Disponibilidade de tempo",
  },
  {
    id: "profile",
    title: "Etapa 4",
    subtitle: "Áreas de interesse",
  },
];

export const INITIAL_FORM_VALUES: CareerFormValues = {
  age: null,
  education: "",
  currentlyWorking: "",
  workInGraduationArea: "",
  currentProfession: "",
  englishLevel: "",
  internationalExperience: "",
  mainGoal: "",
  personalityStyle: "",
  personalityPreference: "",
  learningFormat: "",
  personalityInterest: "",
  studyHoursPerDay: "",
  studyAvailability: "",
  mainChallenge: "",
  routineDuration: "",
  intendsCareerChange: "",
  targetProfession: "",
  coursePreference: "",
  financialCondition: "",
  preferredCountries: [],
};

export const CAREER_QUESTIONS: CareerQuestion[] = [
  {
    id: "age",
    stepId: "identification",
    type: "number",
    title: "Qual é a sua idade?",
    helper: "Usamos essa informação para calibrar recomendações e prazos.",
    placeholder: "Exemplo: 24",
    min: 1,
  },
  {
    id: "education",
    stepId: "identification",
    type: "single-choice",
    title: "Qual é sua escolaridade atual?",
    helper: "Esse ponto ajuda a sugerir caminhos acadêmicos e profissionais viáveis.",
    options: [
      "Ensino médio incompleto",
      "Ensino médio completo",
      "Superior incompleto",
      "Superior completo",
      "Pós-graduação incompleta",
      "Pós-graduação completa",
      "Ensino técnico completo",
    ],
  },
  {
    id: "currentlyWorking",
    stepId: "identification",
    type: "single-choice",
    title: "Está trabalhando atualmente?",
    helper: "Essa informação ajuda a adaptar o ritmo do plano à sua rotina.",
    options: ["Sim", "Não"],
  },
  {
    id: "workInGraduationArea",
    stepId: "identification",
    type: "single-choice",
    title: "Está atuando na área que se formou?",
    helper: "Com isso, ajustamos a estratégia para transição ou progressão de carreira.",
    options: [
      "Sim, estou",
      "Não, me formei em outra área",
      "Trabalho, mas não tenho graduação ou tecnólogo",
    ],
  },
  {
    id: "currentProfession",
    stepId: "identification",
    type: "text",
    title: "Qual é a sua profissão atualmente?",
    helper:
      "Informe apenas o nome da profissão atual. Se estiver em transição, descreva a ocupação principal de hoje.",
    placeholder: "Exemplo: Especialista em Segurança Digital",
    maxLength: 80,
  },
  {
    id: "englishLevel",
    stepId: "identification",
    type: "single-choice",
    title: "Qual seu nível de inglês?",
    helper: "O idioma impacta diretamente seus países e programas recomendados.",
    options: ["Básico", "Intermediário", "Avançado", "Fluente"],
  },
  {
    id: "internationalExperience",
    stepId: "identification",
    type: "single-choice",
    title: "Você já teve alguma experiência internacional?",
    helper: "Vale intercâmbio, viagem de estudos, trabalho ou residência.",
    options: ["Sim", "Não"],
  },
  {
    id: "mainGoal",
    stepId: "identification",
    type: "textarea",
    title: "Qual é o seu objetivo principal hoje?",
    helper:
      "Seja livre para descrever o seu sonho internacional, metas e o que você deseja conquistar.",
    placeholder:
      "Exemplo: Quero trabalhar com tecnologia no Canadá em até 2 anos, com um plano realista para estudar inglês e conseguir minha primeira vaga.",
  },
  {
    id: "personalityStyle",
    stepId: "goals",
    type: "single-choice",
    title: "Você se considera mais:",
    helper: "Escolha o estilo que mais representa como você atua no dia a dia.",
    options: ["Criativo", "Analítico", "Prático", "Comunicativo"],
  },
  {
    id: "personalityPreference",
    stepId: "goals",
    type: "single-choice",
    title: "Com o que você prefere trabalhar?",
    helper: "Escolha o tipo de atividade que mais combina com você.",
    options: [
      "Estratégia, lógica e sistemas complexos",
      "Pessoas, empatia e desenvolvimento humano",
      "Organização, processos e execução com estabilidade",
      "Ação prática, operações dinâmicas e resposta rápida",
      "Pesquisa, dados e investigação técnica",
      "Comunicação, influência e mediação",
      "Criação e inovação de produtos/soluções",
      "Suporte, serviço e atendimento com impacto real",
    ],
  },
  {
    id: "learningFormat",
    stepId: "goals",
    type: "single-choice",
    title: "Você aprende melhor:",
    helper:
      "Escolha a estratégia de estudo que mais funciona para você no dia a dia.",
    options: [
      "Respondendo perguntas de revisão sobre o conteúdo",
      "Revisando o conteúdo em pequenos blocos durante a semana",
      "Alternando entre assuntos diferentes no mesmo estudo",
      "Explicando a matéria com suas próprias palavras",
      "Aprendendo com exercícios práticos e projetos",
    ],
  },
  {
    id: "personalityInterest",
    stepId: "goals",
    type: "single-choice",
    title: "Você gosta mais de:",
    helper: "Isso ajuda a destacar frentes com maior motivação no longo prazo.",
    options: [
      "Tecnologia",
      "Negócios e Empreendedorismo",
      "Saúde e Bem-estar",
      "Artes, Design e Criatividade",
      "Educação e Desenvolvimento Humano",
      "Ciências Exatas",
      "Ciências Humanas e Sociais",
      "Comunicação, Marketing e Mídia",
      "Direito, Relações Internacionais e Políticas Públicas",
      "Sustentabilidade, Meio Ambiente e Energia",
      "Análise de dados e pesquisa aplicada",
    ],
  },
  {
    id: "studyHoursPerDay",
    stepId: "availability",
    type: "single-choice",
    title: "Quantas horas por dia você pode estudar?",
    helper: "Defina uma carga que você realmente consegue manter.",
    options: ["1h", "2h", "3h", "4h+"],
  },
  {
    id: "studyAvailability",
    stepId: "availability",
    type: "single-choice",
    title: "Você pode estudar:",
    helper: "Esse ritmo orienta a intensidade do plano semanal.",
    options: ["Todos os dias", "Apenas dias úteis", "Apenas finais de semana"],
  },
  {
    id: "mainChallenge",
    stepId: "availability",
    type: "single-choice",
    title: "Qual seu maior problema hoje:",
    helper: "Vamos considerar esse bloqueio para montar um plano mais executável.",
    options: [
      "Falta de tempo",
      "Falta de foco",
      "Não sei por onde começar",
      "Falta de dinheiro",
    ],
  },
  {
    id: "routineDuration",
    stepId: "availability",
    type: "single-choice",
    title: "Você consegue manter rotina por quanto tempo:",
    helper: "A consistência esperada define a estratégia de evolução.",
    options: ["1 semana", "1 mês", "3+ meses"],
  },
  {
    id: "intendsCareerChange",
    stepId: "profile",
    type: "single-choice",
    title: "Você pretende mudar de profissão?",
    helper:
      "Isso ajuda a decidir se vamos focar em transição de carreira ou em evolução na área atual.",
    options: ["Sim", "Não"],
  },
  {
    id: "targetProfession",
    stepId: "profile",
    type: "text",
    title: "Você já tem alguma profissão em mente?",
    helper: "Se já tiver uma direção, escreva aqui para personalizar melhor o resultado.",
    placeholder: "Exemplo: Analista de dados",
  },
  {
    id: "coursePreference",
    stepId: "profile",
    type: "single-choice",
    title: "Você prefere cursos:",
    helper: "Isso define o formato de formação sugerido no roadmap.",
    options: [
      "Curtos (até 6 meses)",
      "Médios (1–2 anos)",
      "Longos (graduação/pós)",
    ],
  },
  {
    id: "financialCondition",
    stepId: "profile",
    type: "single-choice",
    title: "Você pretende:",
    helper: "Com isso, conseguimos priorizar bolsas e rotas financeiras compatíveis.",
    options: ["Pagar tudo", "Buscar bolsa parcial", "Preciso de bolsa 100%"],
  },
  {
    id: "preferredCountries",
    stepId: "profile",
    type: "multi-choice",
    title: "Quais países você tem interesse:",
    helper: "Selecione um ou mais países para orientar as recomendações.",
    options: [
      "EUA",
      "Canadá",
      "Portugal",
      "Alemanha",
      "Austrália",
      "Reino Unido",
      "Irlanda",
      "Holanda",
      "França",
      "Espanha",
      "Nova Zelândia",
      "Suíça",
      "China",
      "Japão",
      "Coreia do Sul",
    ],
  },
];

export function shouldDisplayQuestion(
  question: CareerQuestion,
  values: CareerFormValues
): boolean {
  if (
    question.id === "workInGraduationArea" ||
    question.id === "currentProfession"
  ) {
    return values.currentlyWorking === "Sim";
  }

  if (question.id === "targetProfession") {
    return values.intendsCareerChange === "Sim";
  }

  return true;
}

export function getVisibleCareerQuestions(
  values: CareerFormValues
): CareerQuestion[] {
  return CAREER_QUESTIONS.filter((question) => shouldDisplayQuestion(question, values));
}

const arrayFields = new Set<keyof CareerFormValues>(["preferredCountries"]);

export function isArrayField(
  key: keyof CareerFormValues
): key is ArrayQuestionField {
  return arrayFields.has(key);
}

export function isQuestionAnswered(
  question: CareerQuestion,
  values: CareerFormValues
): boolean {
  const value = values[question.id];

  if (value === null) {
    return false;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return false;
    }

    if (question.type === "number") {
      if (typeof question.min === "number" && value < question.min) {
        return false;
      }

      if (typeof question.max === "number" && value > question.max) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value.trim().length > 0;
}
