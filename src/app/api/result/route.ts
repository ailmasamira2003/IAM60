import { NextResponse } from "next/server";
import { z } from "zod";
import type {
  CareerResult,
  ProfileSlice,
  ScholarshipOption,
  UniversityProgram,
} from "@/types/career";

const payloadSchema = z.object({
  age: z.number().int().min(14).max(70),
  education: z.string().min(1),
  englishLevel: z.string().min(1),
  internationalExperience: z.string().min(1),
  mainGoal: z.string().min(1),
  personalityStyle: z.string().min(1),
  personalityPreference: z.string().min(1),
  learningFormat: z.string().min(1),
  personalityInterest: z.string().min(1),
  workEnvironment: z.string().min(1),
  studyHoursPerDay: z.string().min(1),
  studyAvailability: z.string().min(1),
  mainChallenge: z.string().min(1),
  routineDuration: z.string().min(1),
  interestArea: z.string().min(1),
  targetProfession: z.string().min(1),
  coursePreference: z.string().min(1),
  financialCondition: z.string().min(1),
  preferredCountries: z.array(z.string()).min(1),
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
};

const countryGoalMap: Record<string, string[]> = {
  "Estudar fora": ["Canadá", "Portugal", "Alemanha", "Austrália", "EUA"],
  "Trabalhar fora": ["Alemanha", "Canadá", "Austrália", "EUA", "Portugal"],
  Imigrar: ["Canadá", "Portugal", "Austrália", "Alemanha", "EUA"],
};

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

  if (payload.personalityPreference === "Trabalhar com pessoas") {
    communicative += 12;
  }
  if (payload.personalityPreference === "Analisar dados") {
    analytical += 12;
  }
  if (payload.personalityPreference === "Criar coisas novas") {
    creative += 12;
  }
  if (payload.personalityPreference === "Resolver problemas") {
    practical += 12;
  }

  if (payload.learningFormat === "Praticando") {
    practical += 10;
  }
  if (payload.learningFormat === "Assistindo") {
    communicative += 7;
  }
  if (payload.learningFormat === "Lendo") {
    analytical += 10;
  }
  if (payload.learningFormat === "Testando sozinho") {
    creative += 6;
    practical += 8;
  }

  if (payload.personalityInterest === "Tecnologia") {
    analytical += 7;
    practical += 5;
  }
  if (payload.personalityInterest === "Negócios") {
    communicative += 7;
    analytical += 4;
  }
  if (payload.personalityInterest === "Saúde") {
    practical += 8;
    communicative += 4;
  }
  if (payload.personalityInterest === "Artes") {
    creative += 10;
  }
  if (payload.personalityInterest === "Educação") {
    communicative += 8;
  }

  if (payload.workEnvironment === "Remotamente") {
    analytical += 4;
    practical += 4;
  }
  if (payload.workEnvironment === "Em escritório") {
    communicative += 5;
  }
  if (payload.workEnvironment === "Viajando") {
    communicative += 8;
    creative += 4;
  }
  if (payload.workEnvironment === "Em campo") {
    practical += 8;
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
  const fallback = countryGoalMap[payload.mainGoal] ?? countryGoalMap["Estudar fora"];
  const merged = [...payload.preferredCountries, ...fallback];

  return Array.from(new Set(merged)).slice(0, 3);
}

function pickCareers(payload: z.infer<typeof payloadSchema>): string[] {
  const fromArea = areaCareerMap[payload.interestArea] ?? areaCareerMap.Tecnologia;

  if (payload.mainGoal === "Imigrar") {
    return [
      fromArea[0],
      "Especialista em Adaptação Internacional",
      fromArea[1],
      fromArea[2],
    ];
  }

  if (payload.mainGoal === "Estudar fora") {
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

  const professionFocus = payload.targetProfession.trim()
    ? ` com foco em ${payload.targetProfession.trim()}`
    : "";

  return [
    `Semana 1: organizar rotina ${pace}, meta de inglês e trilha inicial em ${payload.interestArea}${professionFocus}.`,
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

    const result: CareerResult = {
      summary: `Seu perfil indica bom potencial para carreira internacional em ${payload.interestArea}${professionFocus}. Com foco em ${payload.mainGoal.toLowerCase()}, o plano foi estruturado para sua disponibilidade (${payload.studyAvailability.toLowerCase()}) e rotina estimada de ${payload.routineDuration.toLowerCase()}.`,
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

