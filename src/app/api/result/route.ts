import { NextResponse } from "next/server";
import { z } from "zod";
import type {
  CareerResult,
  ProfileSlice,
  ScholarshipOption,
  UniversityProgram,
} from "@/types/career";

const payloadSchema = z
  .object({
    age: z.number().int().min(1),
    education: z.string().min(1),
    currentlyWorking: z.enum(["Sim", "Não"]),
    workInGraduationArea: z.string().default(""),
    currentProfession: z.string().max(80).default(""),
    englishLevel: z.string().min(1),
    internationalExperience: z.string().min(1),
    mainGoal: z.string().min(1),
    personalityStyle: z.string().min(1),
    personalityPreference: z.string().min(1),
    learningFormat: z.string().min(1),
    personalityInterest: z.string().min(1),
    studyHoursPerDay: z.string().min(1),
    studyAvailability: z.string().min(1),
    mainChallenge: z.string().min(1),
    routineDuration: z.string().min(1),
    intendsCareerChange: z.enum(["Sim", "Não"]),
    targetProfession: z.string().default(""),
    coursePreference: z.string().min(1),
    financialCondition: z.string().min(1),
    preferredCountries: z.array(z.string()).min(1),
  })
  .superRefine((payload, context) => {
    if (
      payload.currentlyWorking === "Sim" &&
      payload.workInGraduationArea.trim().length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["workInGraduationArea"],
        message: "Informe se está atuando na área de formação.",
      });
    }

    if (
      payload.currentlyWorking === "Sim" &&
      payload.currentProfession.trim().length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentProfession"],
        message: "Informe sua profissão atual.",
      });
    }

    if (
      payload.intendsCareerChange === "Sim" &&
      payload.targetProfession.trim().length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetProfession"],
        message: "Informe a profissão desejada para a transição.",
      });
    }
  });

const areaCareerMap: Record<string, string[]> = {
  Tecnologia: [
    "Engenheiro(a) de Software",
    "Analista de Dados",
    "Especialista em Nuvem",
    "Analista de Cibersegurança",
  ],
  Saúde: [
    "Analista de Saúde Digital",
    "Assistente de Pesquisa Clínica",
    "Coordenador(a) de Projetos em Saúde",
    "Especialista em Dados em Saúde",
  ],
  Negócios: [
    "Analista de Negócios",
    "Especialista em Marketing de Crescimento",
    "Estrategista de Operações",
    "Gerente de Sucesso do Cliente",
  ],
  Engenharia: [
    "Engenheiro(a) de Processos",
    "Engenheiro(a) de Qualidade",
    "Especialista em Automação",
    "Engenheiro(a) de Projetos",
  ],
  Artes: [
    "Designer UX/UI",
    "Diretor(a) de Arte",
    "Motion Designer",
    "Designer de Produto",
  ],
  Educação: [
    "Designer Instrucional",
    "Especialista em Educação Digital",
    "Coordenador(a) de Programas Educacionais",
    "Consultor(a) de Aprendizagem Corporativa",
  ],
};

type AreaKey = keyof typeof areaCareerMap;

function inferAreaFromInterest(personalityInterest: string): AreaKey {
  const map: Record<string, AreaKey> = {
    Tecnologia: "Tecnologia",
    "Análise de dados e pesquisa aplicada": "Tecnologia",
    "Dados, Pesquisa e Investigação": "Tecnologia",
    "Negócios e Empreendedorismo": "Negócios",
    Negócios: "Negócios",
    "Comunicação, Marketing e Mídia": "Negócios",
    "Direito, Relações Internacionais e Políticas Públicas": "Negócios",
    "Saúde e Bem-estar": "Saúde",
    Saúde: "Saúde",
    "Artes, Design e Criatividade": "Artes",
    Artes: "Artes",
    "Educação e Desenvolvimento Humano": "Educação",
    Educação: "Educação",
    "Ciências Humanas e Sociais": "Educação",
    "Ciências Exatas": "Engenharia",
    "Sustentabilidade, Meio Ambiente e Energia": "Engenharia",
  };

  return map[personalityInterest] ?? "Tecnologia";
}

const countryGoalMap: Record<string, string[]> = {
  "Estudar fora": ["Canadá", "Portugal", "Alemanha", "Irlanda", "Reino Unido"],
  "Trabalhar fora": ["Alemanha", "Canadá", "Austrália", "Holanda", "Irlanda"],
  Imigrar: ["Canadá", "Portugal", "Austrália", "Nova Zelândia", "Alemanha"],
};

type CanonicalGoal = keyof typeof countryGoalMap;

function inferCanonicalGoal(mainGoal: string): CanonicalGoal {
  const normalized = mainGoal
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    normalized.includes("imigr") ||
    normalized.includes("resid") ||
    normalized.includes("morar")
  ) {
    return "Imigrar";
  }

  if (
    normalized.includes("estud") ||
    normalized.includes("univers") ||
    normalized.includes("faculd") ||
    normalized.includes("curso") ||
    normalized.includes("mestrad") ||
    normalized.includes("doutor")
  ) {
    return "Estudar fora";
  }

  if (
    normalized.includes("trabalh") ||
    normalized.includes("emprego") ||
    normalized.includes("vaga") ||
    normalized.includes("carreira")
  ) {
    return "Trabalhar fora";
  }

  return "Estudar fora";
}

const universityPool: UniversityProgram[] = [
  {
    university: "University of Toronto",
    program: "Certificado em Análise de Dados",
    country: "Canadá",
    duration: "12 meses",
  },
  {
    university: "Seneca College",
    program: "Gestão Global de Negócios",
    country: "Canadá",
    duration: "8 meses",
  },
  {
    university: "TU Munich",
    program: "Software Systems M.Sc",
    country: "Alemanha",
    duration: "24 meses",
  },
  {
    university: "RWTH Aachen",
    program: "Industrial Engineering",
    country: "Alemanha",
    duration: "24 meses",
  },
  {
    university: "University of Melbourne",
    program: "Professional Engineering",
    country: "Austrália",
    duration: "24 meses",
  },
  {
    university: "Universidade de Lisboa",
    program: "Gestão Internacional",
    country: "Portugal",
    duration: "18 meses",
  },
  {
    university: "University of Porto",
    program: "Ciência de Dados Aplicada",
    country: "Portugal",
    duration: "12 meses",
  },
  {
    university: "Arizona State University",
    program: "Information Technology",
    country: "EUA",
    duration: "18 meses",
  },
  {
    university: "Northeastern University",
    program: "Digital Media",
    country: "EUA",
    duration: "24 meses",
  },
  {
    university: "University of Sydney",
    program: "International Business",
    country: "Austrália",
    duration: "18 meses",
  },
  {
    university: "University College Dublin",
    program: "Data Analytics M.Sc",
    country: "Irlanda",
    duration: "12 meses",
  },
  {
    university: "Trinity College Dublin",
    program: "Digital Marketing Strategy",
    country: "Irlanda",
    duration: "12 meses",
  },
  {
    university: "University of Amsterdam",
    program: "Sustainable Business",
    country: "Holanda",
    duration: "12 meses",
  },
  {
    university: "TU Delft",
    program: "Engineering and Technology M.Sc",
    country: "Holanda",
    duration: "24 meses",
  },
  {
    university: "King's College London",
    program: "International Relations",
    country: "Reino Unido",
    duration: "12 meses",
  },
  {
    university: "University of Manchester",
    program: "Advanced Engineering",
    country: "Reino Unido",
    duration: "24 meses",
  },
  {
    university: "Sorbonne Université",
    program: "Applied Data Science",
    country: "França",
    duration: "18 meses",
  },
  {
    university: "Universitat de Barcelona",
    program: "Global Business Management",
    country: "Espanha",
    duration: "18 meses",
  },
  {
    university: "University of Auckland",
    program: "Information Systems",
    country: "Nova Zelândia",
    duration: "18 meses",
  },
  {
    university: "University of Otago",
    program: "Health Sciences",
    country: "Nova Zelândia",
    duration: "24 meses",
  },
  {
    university: "ETH Zurich",
    program: "Data Science M.Sc",
    country: "Suíça",
    duration: "24 meses",
  },
  {
    university: "EPFL",
    program: "Energy Science and Technology",
    country: "Suíça",
    duration: "24 meses",
  },
  {
    university: "Tsinghua University",
    program: "Global Business Journalism",
    country: "China",
    duration: "24 meses",
  },
  {
    university: "Peking University",
    program: "International Relations",
    country: "China",
    duration: "24 meses",
  },
  {
    university: "The University of Tokyo",
    program: "International Program in Economics",
    country: "Japão",
    duration: "24 meses",
  },
  {
    university: "Kyoto University",
    program: "Civil and Environmental Engineering",
    country: "Japão",
    duration: "24 meses",
  },
  {
    university: "Seoul National University",
    program: "Global MBA",
    country: "Coreia do Sul",
    duration: "16 meses",
  },
  {
    university: "KAIST",
    program: "Electrical Engineering",
    country: "Coreia do Sul",
    duration: "24 meses",
  },
];

const scholarshipPool: ScholarshipOption[] = [
  {
    name: "Vanier Canada Graduate Scholarship",
    country: "Canadá",
    coverage: "Até CAD 50.000/ano",
    fitReason: "Excelente para perfis acadêmicos e de pesquisa",
  },
  {
    name: "DAAD Scholarship",
    country: "Alemanha",
    coverage: "Mensalidade + custo de vida",
    fitReason: "Alta aderência para tecnologia e engenharia",
  },
  {
    name: "Australia Awards",
    country: "Austrália",
    coverage: "Tuition + passagem + manutenção",
    fitReason: "Boa opção para trilhas com foco em impacto global",
  },
  {
    name: "Santander Universidades",
    country: "Portugal",
    coverage: "Auxílio parcial",
    fitReason: "Porta de entrada acessível para estudos na Europa",
  },
  {
    name: "Fulbright Foreign Student",
    country: "EUA",
    coverage: "Apoio acadêmico e financeiro",
    fitReason: "Programa competitivo para perfis de alto desempenho",
  },
  {
    name: "Chevening Scholarship",
    country: "Reino Unido",
    coverage: "Tuition + custo de vida + passagens",
    fitReason: "Excelente para pós-graduação e desenvolvimento de liderança global",
  },
  {
    name: "Government of Ireland International Education Scholarship",
    country: "Irlanda",
    coverage: "Bolsa + auxílio financeiro",
    fitReason: "Boa porta de entrada para cursos estratégicos em universidades irlandesas",
  },
  {
    name: "Holland Scholarship",
    country: "Holanda",
    coverage: "Auxílio parcial para tuition",
    fitReason: "Aderente para estudantes internacionais em programas de graduação e pós",
  },
  {
    name: "Eiffel Excellence Scholarship",
    country: "França",
    coverage: "Auxílio mensal + benefícios acadêmicos",
    fitReason: "Forte opção para mestrado e doutorado em áreas de alta demanda",
  },
  {
    name: "Becas MAEC-AECID",
    country: "Espanha",
    coverage: "Apoio acadêmico e financeiro parcial",
    fitReason: "Oportunidade relevante para formação internacional em instituições espanholas",
  },
  {
    name: "Manaaki New Zealand Scholarships",
    country: "Nova Zelândia",
    coverage: "Tuition + manutenção + passagens",
    fitReason: "Ótima alternativa para trilhas acadêmicas com foco em impacto e inovação",
  },
  {
    name: "Swiss Government Excellence Scholarships",
    country: "Suíça",
    coverage: "Bolsa mensal + apoio acadêmico",
    fitReason: "Muito relevante para pós-graduação e pesquisa em universidades suíças",
  },
  {
    name: "Chinese Government Scholarship (CSC)",
    country: "China",
    coverage: "Tuition + acomodação + auxílio mensal",
    fitReason: "Excelente opção para cursos em inglês e mandarim com apoio governamental",
  },
  {
    name: "MEXT Scholarship",
    country: "Japão",
    coverage: "Tuition + auxílio mensal + passagens",
    fitReason: "Programa sólido para graduação e pós em instituições japonesas",
  },
  {
    name: "Global Korea Scholarship (GKS)",
    country: "Coreia do Sul",
    coverage: "Tuition + manutenção + curso de idioma",
    fitReason: "Alta aderência para quem busca formação internacional na Coreia do Sul",
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getStudyHoursAsNumber(studyHoursPerDay: string): number {
  const map: Record<string, number> = {
    "1h": 1,
    "2h": 2,
    "3h": 3,
    "4h+": 4,
  };

  return map[studyHoursPerDay] ?? 1;
}

function scoreReadiness(payload: z.infer<typeof payloadSchema>): number {
  const englishScore: Record<string, number> = {
    Básico: 10,
    Intermediário: 18,
    Avançado: 26,
    Fluente: 34,
  };

  const studyAvailabilityScore: Record<string, number> = {
    "Todos os dias": 12,
    "Apenas dias úteis": 9,
    "Apenas finais de semana": 6,
  };

  const routineScore: Record<string, number> = {
    "1 semana": 4,
    "1 mês": 9,
    "3+ meses": 14,
  };

  const challengePenalty: Record<string, number> = {
    "Falta de tempo": 7,
    "Falta de foco": 8,
    "Não sei por onde começar": 6,
    "Falta de dinheiro": 8,
  };

  const financialScore: Record<string, number> = {
    "Pagar tudo": 6,
    "Buscar bolsa parcial": 4,
    "Preciso de bolsa 100%": 2,
  };

  const hours = getStudyHoursAsNumber(payload.studyHoursPerDay);

  let total = 24;
  total += englishScore[payload.englishLevel] ?? 12;
  total += clamp(hours * 4, 4, 16);
  total += studyAvailabilityScore[payload.studyAvailability] ?? 6;
  total += routineScore[payload.routineDuration] ?? 8;
  total += financialScore[payload.financialCondition] ?? 2;
  total -= challengePenalty[payload.mainChallenge] ?? 5;
  total += payload.internationalExperience === "Sim" ? 6 : 0;

  return clamp(total, 35, 95);
}

function buildProfileChart(payload: z.infer<typeof payloadSchema>): ProfileSlice[] {
  let creative = 24;
  let analytical = 24;
  let practical = 24;
  let communicative = 24;

  if (payload.personalityStyle === "Criativo") {
    creative += 16;
  }
  if (payload.personalityStyle === "Analítico") {
    analytical += 16;
  }
  if (payload.personalityStyle === "Prático") {
    practical += 16;
  }
  if (payload.personalityStyle === "Comunicativo") {
    communicative += 16;
  }

  const personalityPreferenceBoosts: Record<
    string,
    Partial<{
      creative: number;
      analytical: number;
      practical: number;
      communicative: number;
    }>
  > = {
    // Legacy options
    "Trabalhar com pessoas": { communicative: 12 },
    "Analisar dados": { analytical: 12 },
    "Criar coisas novas": { creative: 12 },
    "Resolver problemas": { practical: 12 },
    // New work-style options
    "Estratégia, lógica e sistemas complexos": { analytical: 11, creative: 3 },
    "Pessoas, empatia e desenvolvimento humano": {
      communicative: 10,
      creative: 4,
    },
    "Organização, processos e execução com estabilidade": {
      practical: 9,
      analytical: 4,
    },
    "Ação prática, operações dinâmicas e resposta rápida": {
      practical: 11,
      creative: 3,
    },
    "Pesquisa, dados e investigação técnica": { analytical: 12 },
    "Comunicação, influência e mediação": { communicative: 12 },
    "Criação e inovação de produtos/soluções": { creative: 12 },
    "Suporte, serviço e atendimento com impacto real": {
      communicative: 8,
      practical: 4,
    },
  };

  const normalizedPreference = payload.personalityPreference
    .replace(/\s+\([A-Z]{2}\)$/u, "")
    .trim();
  const preferenceBoost = personalityPreferenceBoosts[normalizedPreference];
  if (preferenceBoost) {
    creative += preferenceBoost.creative ?? 0;
    analytical += preferenceBoost.analytical ?? 0;
    practical += preferenceBoost.practical ?? 0;
    communicative += preferenceBoost.communicative ?? 0;
  }

  const learningFormatBoosts: Record<
    string,
    Partial<{
      creative: number;
      analytical: number;
      practical: number;
      communicative: number;
    }>
  > = {
    // Legacy options
    Praticando: { practical: 10 },
    Assistindo: { communicative: 7 },
    Lendo: { analytical: 10 },
    "Testando sozinho": { creative: 6, practical: 8 },
    // New evidence-based options
    "Fazendo testes rápidos e flashcards": { analytical: 8, practical: 5 },
    "Respondendo perguntas de revisão sobre o conteúdo": {
      analytical: 8,
      practical: 5,
    },
    "Revisando em sessões curtas ao longo da semana": {
      analytical: 7,
      practical: 4,
    },
    "Revisando o conteúdo em pequenos blocos durante a semana": {
      analytical: 7,
      practical: 4,
    },
    "Intercalando temas e tipos de exercício": { analytical: 8, creative: 4 },
    "Alternando entre assuntos diferentes no mesmo estudo": {
      analytical: 8,
      creative: 4,
    },
    "Explicando com minhas palavras e exemplos": {
      communicative: 7,
      analytical: 5,
    },
    "Explicando a matéria com minhas próprias palavras": {
      communicative: 7,
      analytical: 5,
    },
    "Praticando em exercícios e projetos reais": { practical: 10, creative: 4 },
    "Aprendendo com exercícios práticos e projetos": {
      practical: 10,
      creative: 4,
    },
  };

  const learningBoost = learningFormatBoosts[payload.learningFormat];
  if (learningBoost) {
    creative += learningBoost.creative ?? 0;
    analytical += learningBoost.analytical ?? 0;
    practical += learningBoost.practical ?? 0;
    communicative += learningBoost.communicative ?? 0;
  }

  const personalityInterestBoosts: Record<
    string,
    Partial<{
      creative: number;
      analytical: number;
      practical: number;
      communicative: number;
    }>
  > = {
    // Legacy options
    Tecnologia: { analytical: 7, practical: 5 },
    Negócios: { communicative: 7, analytical: 4 },
    Saúde: { practical: 8, communicative: 4 },
    Artes: { creative: 10 },
    Educação: { communicative: 8 },
    // New expanded options
    "Negócios e Empreendedorismo": { communicative: 7, analytical: 5 },
    "Saúde e Bem-estar": { practical: 8, communicative: 5 },
    "Artes, Design e Criatividade": { creative: 10, communicative: 2 },
    "Educação e Desenvolvimento Humano": { communicative: 8, analytical: 2 },
    "Ciências Exatas": { analytical: 10, practical: 3 },
    "Ciências Humanas e Sociais": { analytical: 5, communicative: 6 },
    "Comunicação, Marketing e Mídia": { communicative: 10, creative: 4 },
    "Direito, Relações Internacionais e Políticas Públicas": {
      analytical: 6,
      communicative: 7,
    },
    "Sustentabilidade, Meio Ambiente e Energia": {
      analytical: 6,
      practical: 6,
      creative: 3,
    },
    "Dados, Pesquisa e Investigação": { analytical: 11, practical: 4 },
  };

  const interestBoost = personalityInterestBoosts[payload.personalityInterest];
  if (interestBoost) {
    creative += interestBoost.creative ?? 0;
    analytical += interestBoost.analytical ?? 0;
    practical += interestBoost.practical ?? 0;
    communicative += interestBoost.communicative ?? 0;
  }

  return [
    { name: "Criativo", value: clamp(creative, 10, 60), color: "#d946ef" },
    { name: "Analítico", value: clamp(analytical, 10, 60), color: "#38bdf8" },
    { name: "Prático", value: clamp(practical, 10, 60), color: "#22c55e" },
    { name: "Comunicativo", value: clamp(communicative, 10, 60), color: "#f59e0b" },
  ];
}

function normalizeToHundred(slices: ProfileSlice[]): ProfileSlice[] {
  const total = slices.reduce((sum, item) => sum + item.value, 0);

  return slices.map((slice, index) => {
    if (index < slices.length - 1) {
      return {
        ...slice,
        value: Math.round((slice.value / total) * 100),
      };
    }

    const partial = slices
      .slice(0, -1)
      .reduce((sum, item) => sum + Math.round((item.value / total) * 100), 0);

    return {
      ...slice,
      value: 100 - partial,
    };
  });
}

function pickCountries(payload: z.infer<typeof payloadSchema>): string[] {
  const canonicalGoal = inferCanonicalGoal(payload.mainGoal);
  const fallback = countryGoalMap[canonicalGoal] ?? countryGoalMap["Estudar fora"];
  const merged = [...payload.preferredCountries, ...fallback];

  return Array.from(new Set(merged)).slice(0, 3);
}

function pickCareers(payload: z.infer<typeof payloadSchema>): string[] {
  const inferredArea = inferAreaFromInterest(payload.personalityInterest);
  const fromArea = areaCareerMap[inferredArea] ?? areaCareerMap.Tecnologia;
  const canonicalGoal = inferCanonicalGoal(payload.mainGoal);

  if (canonicalGoal === "Imigrar") {
    return [
      fromArea[0],
      "Especialista em Adaptação Internacional",
      fromArea[1],
      fromArea[2],
    ];
  }

  if (canonicalGoal === "Estudar fora") {
    return [
      "Assistente de Pesquisa",
      fromArea[0],
      fromArea[1],
      "Analista de Projetos Acadêmicos",
    ];
  }

  return fromArea.slice(0, 4);
}

function buildRoadmap(payload: z.infer<typeof payloadSchema>): string[] {
  const pace =
    payload.studyHoursPerDay === "3h" || payload.studyHoursPerDay === "4h+"
      ? "acelerado"
      : "gradual";
  const inferredArea = inferAreaFromInterest(payload.personalityInterest);

  const professionFocus = payload.targetProfession.trim()
    ? ` com foco em ${payload.targetProfession.trim()}`
    : "";

  return [
    `Semana 1: organizar rotina ${pace}, meta de inglês e trilha inicial em ${inferredArea}${professionFocus}.`,
    "Semana 2: desenvolver base prática com exercícios e projetos de portfólio.",
    "Semana 3: preparar currículo internacional, LinkedIn e carta de apresentação.",
    "Semana 4: mapear universidades/programas e bolsas compatíveis com o perfil.",
    "Semana 5 em diante: candidaturas, networking estratégico e simulação de entrevistas.",
  ];
}

function buildGaps(payload: z.infer<typeof payloadSchema>): string[] {
  const gaps: string[] = [];

  if (payload.englishLevel === "Básico") {
    gaps.push("Nível de inglês ainda limitado para candidaturas internacionais imediatas.");
  }

  if (payload.studyHoursPerDay === "1h") {
    gaps.push("Carga de estudo diária baixa para objetivos de curto prazo.");
  }

  if (payload.routineDuration === "1 semana") {
    gaps.push("Baixa previsibilidade de rotina para sustentar evolução contínua.");
  }

  if (payload.mainChallenge === "Falta de foco") {
    gaps.push("Falta de foco recorrente pode interromper a execução do plano.");
  }

  if (payload.mainChallenge === "Não sei por onde começar") {
    gaps.push("Necessidade de clareza inicial de trilha e priorização das próximas ações.");
  }

  if (payload.mainChallenge === "Falta de tempo") {
    gaps.push("Agenda apertada exige microblocos de estudo e maior disciplina semanal.");
  }

  if (payload.mainChallenge === "Falta de dinheiro") {
    gaps.push("Pressão financeira exige foco em bolsas e programas de menor custo.");
  }

  if (payload.financialCondition === "Preciso de bolsa 100%") {
    gaps.push("Dependência de bolsa integral requer calendário de candidatura rigoroso.");
  }

  if (gaps.length === 0) {
    gaps.push("Continuar evoluindo inglês profissional e fortalecer portfólio internacional.");
  }

  return gaps.slice(0, 3);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos para gerar resultado.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const readinessLevel = scoreReadiness(payload);
    const recommendedCountries = pickCountries(payload);
    const suggestedCareers = pickCareers(payload);
    const profileChart = normalizeToHundred(buildProfileChart(payload));

    const universities = universityPool
      .filter((item) => recommendedCountries.includes(item.country))
      .slice(0, 4);

    const scholarships = scholarshipPool
      .filter((item) => recommendedCountries.includes(item.country))
      .slice(0, 4);

    const professionFocus = payload.targetProfession.trim()
      ? `, com interesse direto em ${payload.targetProfession.trim()}`
      : "";
    const inferredArea = inferAreaFromInterest(payload.personalityInterest);
    const mainGoalText = payload.mainGoal.trim();
    const mainGoalPreview =
      mainGoalText.length > 140
        ? `${mainGoalText.slice(0, 137)}...`
        : mainGoalText;

    const result: CareerResult = {
      summary: `Seu perfil indica bom potencial para carreira internacional em ${inferredArea}${professionFocus}. Com foco em "${mainGoalPreview}", o plano foi estruturado para sua disponibilidade (${payload.studyAvailability.toLowerCase()}) e rotina estimada de ${payload.routineDuration.toLowerCase()}.`,
      profileChart,
      suggestedCareers,
      recommendedCountries,
      universities,
      scholarships,
      roadmap: buildRoadmap(payload),
      readinessLevel,
      topGaps: buildGaps(payload),
    };

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao montar resultado simulado.",
      },
      { status: 500 }
    );
  }
}
