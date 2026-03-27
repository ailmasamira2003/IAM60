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
  englishLevel: "",
  internationalExperience: "",
  mainGoal: "",
  personalityStyle: "",
  personalityPreference: "",
  learningFormat: "",
  personalityInterest: "",
  workEnvironment: "",
  studyHoursPerDay: "",
  studyAvailability: "",
  mainChallenge: "",
  routineDuration: "",
  interestArea: "",
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
    min: 14,
    max: 70,
  },
  {
    id: "education",
    stepId: "identification",
    type: "single-choice",
    title: "Qual é sua escolaridade atual?",
    helper: "Esse ponto ajuda a sugerir caminhos acadêmicos e profissionais viáveis.",
    options: ["Ensino médio", "Faculdade", "Formado(a)", "Trabalhando"],
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
    type: "single-choice",
    title: "Qual é o seu objetivo principal hoje?",
    helper: "Vamos priorizar o plano conforme seu objetivo mais importante.",
    options: ["Estudar fora", "Trabalhar fora", "Imigrar"],
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
    title: "Você prefere:",
    helper: "Essa escolha melhora a aderência das carreiras sugeridas.",
    options: [
      "Trabalhar com pessoas",
      "Analisar dados",
      "Criar coisas novas",
      "Resolver problemas",
    ],
  },
  {
    id: "learningFormat",
    stepId: "goals",
    type: "single-choice",
    title: "Você aprende melhor:",
    helper: "Com esse dado, o plano propõe uma rotina de estudo mais realista.",
    options: [
      "Praticando",
      "Assistindo",
      "Lendo",
      "Testando sozinho",
    ],
  },
  {
    id: "personalityInterest",
    stepId: "goals",
    type: "single-choice",
    title: "Você gosta mais de:",
    helper: "Isso ajuda a destacar frentes com maior motivação no longo prazo.",
    options: ["Tecnologia", "Negócios", "Saúde", "Artes", "Educação"],
  },
  {
    id: "workEnvironment",
    stepId: "goals",
    type: "single-choice",
    title: "Em qual ambiente você se imagina trabalhando:",
    helper: "O ambiente ideal influencia o país e o tipo de oportunidade recomendado.",
    options: ["Remotamente", "Em escritório", "Viajando", "Em campo"],
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
    id: "interestArea",
    stepId: "profile",
    type: "single-choice",
    title: "Qual área você mais se interessa:",
    helper: "A área escolhida será a base das recomendações de carreira.",
    options: ["Tecnologia", "Saúde", "Negócios", "Engenharia", "Artes"],
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
    options: ["EUA", "Canadá", "Portugal", "Alemanha", "Austrália"],
  },
];

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
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value.trim().length > 0;
}

