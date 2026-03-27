import { NextResponse } from "next/server";
import { z } from "zod";
import type { CareerResult, CountryMatch, PersonalityProfile } from "@/types/career";

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

type MbtiCode =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";

type LifestyleAxis =
  | "innovation"
  | "stability"
  | "collaboration"
  | "balance"
  | "openness"
  | "pace";

type LifestyleVector = Record<LifestyleAxis, number>;

interface PersonalityBlueprint {
  title: string;
  description: string;
  strengths: string[];
  priorities: LifestyleVector;
}

interface CountryLifestyleProfile extends LifestyleVector {
  note: string;
}

const mbtiBlueprints: Record<MbtiCode, PersonalityBlueprint> = {
  ISTJ: {
    title: "Planejador(a) Confiável",
    description:
      "Você tende a executar com consistência, clareza de processo e foco em resultado de longo prazo.",
    strengths: ["Disciplina", "Organização", "Compromisso com prazos"],
    priorities: {
      innovation: 3,
      stability: 5,
      collaboration: 3,
      balance: 3,
      openness: 2,
      pace: 2,
    },
  },
  ISFJ: {
    title: "Cuidador(a) Estruturado(a)",
    description:
      "Seu perfil combina confiabilidade com cuidado humano, sendo forte em ambientes previsíveis e colaborativos.",
    strengths: ["Empatia prática", "Consistência", "Responsabilidade"],
    priorities: {
      innovation: 2,
      stability: 5,
      collaboration: 5,
      balance: 4,
      openness: 3,
      pace: 2,
    },
  },
  INFJ: {
    title: "Estrategista Humanista",
    description:
      "Você pensa no longo prazo com propósito, buscando impacto real e coerência com valores pessoais.",
    strengths: ["Visão de futuro", "Leitura de contexto", "Propósito"],
    priorities: {
      innovation: 4,
      stability: 3,
      collaboration: 5,
      balance: 4,
      openness: 5,
      pace: 2,
    },
  },
  INTJ: {
    title: "Arquiteto(a) Estratégico(a)",
    description:
      "Você tende a planejar com autonomia, lógica e foco em ambientes de alta complexidade.",
    strengths: ["Pensamento sistêmico", "Autonomia", "Foco estratégico"],
    priorities: {
      innovation: 5,
      stability: 4,
      collaboration: 2,
      balance: 2,
      openness: 3,
      pace: 4,
    },
  },
  ISTP: {
    title: "Especialista Técnico(a)",
    description:
      "Você aprende fazendo, resolve problemas práticos com rapidez e prefere autonomia operacional.",
    strengths: ["Resolução de problemas", "Objetividade", "Ação prática"],
    priorities: {
      innovation: 4,
      stability: 3,
      collaboration: 2,
      balance: 3,
      openness: 3,
      pace: 5,
    },
  },
  ISFP: {
    title: "Criador(a) Sensível",
    description:
      "Seu estilo une criatividade aplicada e sensibilidade humana, com forte busca por sentido no trabalho.",
    strengths: ["Criatividade", "Empatia", "Flexibilidade"],
    priorities: {
      innovation: 3,
      stability: 3,
      collaboration: 4,
      balance: 5,
      openness: 5,
      pace: 2,
    },
  },
  INFP: {
    title: "Idealista Criativo(a)",
    description:
      "Você tende a buscar projetos com significado pessoal, liberdade de criação e impacto positivo.",
    strengths: ["Imaginação", "Valores claros", "Adaptação criativa"],
    priorities: {
      innovation: 4,
      stability: 2,
      collaboration: 4,
      balance: 5,
      openness: 5,
      pace: 2,
    },
  },
  INTP: {
    title: "Analista Inventivo(a)",
    description:
      "Você gosta de investigar ideias complexas e construir soluções inteligentes com profundidade técnica.",
    strengths: ["Raciocínio abstrato", "Curiosidade", "Inovação intelectual"],
    priorities: {
      innovation: 5,
      stability: 3,
      collaboration: 2,
      balance: 3,
      openness: 4,
      pace: 3,
    },
  },
  ESTP: {
    title: "Executor(a) de Alta Energia",
    description:
      "Você se destaca em contextos rápidos, com decisão sob pressão e foco em resultados concretos.",
    strengths: ["Agilidade", "Negociação", "Tomada de decisão"],
    priorities: {
      innovation: 4,
      stability: 2,
      collaboration: 3,
      balance: 2,
      openness: 4,
      pace: 5,
    },
  },
  ESFP: {
    title: "Conector(a) Dinâmico(a)",
    description:
      "Seu perfil combina energia social, praticidade e capacidade de criar experiências positivas com pessoas.",
    strengths: ["Comunicação", "Flexibilidade", "Engajamento social"],
    priorities: {
      innovation: 3,
      stability: 2,
      collaboration: 5,
      balance: 4,
      openness: 5,
      pace: 4,
    },
  },
  ENFP: {
    title: "Catalisador(a) Criativo(a)",
    description:
      "Você é orientado(a) a ideias novas, conexões humanas e caminhos de carreira com autonomia e propósito.",
    strengths: ["Inovação", "Persuasão", "Visão de possibilidades"],
    priorities: {
      innovation: 5,
      stability: 2,
      collaboration: 4,
      balance: 4,
      openness: 5,
      pace: 4,
    },
  },
  ENTP: {
    title: "Inovador(a) Estratégico(a)",
    description:
      "Você tende a prosperar em ambientes de mudança, com espaço para testar ideias e construir soluções novas.",
    strengths: ["Experimentação", "Estratégia", "Adaptabilidade"],
    priorities: {
      innovation: 5,
      stability: 2,
      collaboration: 3,
      balance: 3,
      openness: 5,
      pace: 5,
    },
  },
  ESTJ: {
    title: "Gestor(a) de Execução",
    description:
      "Você opera bem em ambientes organizados, com metas claras, estrutura e avanço consistente de carreira.",
    strengths: ["Liderança prática", "Gestão", "Eficiência"],
    priorities: {
      innovation: 3,
      stability: 5,
      collaboration: 3,
      balance: 3,
      openness: 2,
      pace: 4,
    },
  },
  ESFJ: {
    title: "Coordenador(a) de Pessoas",
    description:
      "Seu perfil combina organização com cuidado relacional, favorecendo ambientes colaborativos e seguros.",
    strengths: ["Trabalho em equipe", "Organização", "Apoio interpessoal"],
    priorities: {
      innovation: 2,
      stability: 4,
      collaboration: 5,
      balance: 4,
      openness: 4,
      pace: 3,
    },
  },
  ENFJ: {
    title: "Líder Inspirador(a)",
    description:
      "Você tende a mobilizar pessoas em torno de objetivos, com empatia, visão e alta comunicação.",
    strengths: ["Influência positiva", "Liderança humana", "Comunicação"],
    priorities: {
      innovation: 4,
      stability: 3,
      collaboration: 5,
      balance: 4,
      openness: 5,
      pace: 3,
    },
  },
  ENTJ: {
    title: "Comandante Estratégico(a)",
    description:
      "Seu perfil favorece ambientes competitivos, orientados a desempenho, escala e crescimento acelerado.",
    strengths: ["Visão de negócio", "Decisão", "Foco em performance"],
    priorities: {
      innovation: 5,
      stability: 4,
      collaboration: 3,
      balance: 2,
      openness: 3,
      pace: 5,
    },
  },
};

const countryLifestyleProfiles: Record<string, CountryLifestyleProfile> = {
  EUA: {
    innovation: 5,
    stability: 3,
    collaboration: 3,
    balance: 2,
    openness: 4,
    pace: 5,
    note: "Mercado amplo e competitivo, com muitas oportunidades para crescimento rápido.",
  },
  "Canadá": {
    innovation: 4,
    stability: 4,
    collaboration: 5,
    balance: 4,
    openness: 5,
    pace: 3,
    note: "Combina boa qualidade de vida com ambiente multicultural e boa previsibilidade.",
  },
  Portugal: {
    innovation: 3,
    stability: 3,
    collaboration: 4,
    balance: 5,
    openness: 4,
    pace: 2,
    note: "Boa adaptação cultural e ritmo de vida mais equilibrado para transição internacional.",
  },
  Alemanha: {
    innovation: 5,
    stability: 5,
    collaboration: 3,
    balance: 4,
    openness: 3,
    pace: 4,
    note: "Forte em engenharia e processos, com alto padrão de organização e estabilidade.",
  },
  "Austrália": {
    innovation: 4,
    stability: 4,
    collaboration: 4,
    balance: 5,
    openness: 4,
    pace: 3,
    note: "Mistura mercado sólido com estilo de vida equilibrado e acolhedor para estrangeiros.",
  },
  "Reino Unido": {
    innovation: 4,
    stability: 4,
    collaboration: 3,
    balance: 3,
    openness: 4,
    pace: 4,
    note: "Ecossistema internacional maduro, com forte rede acadêmica e profissional.",
  },
  Irlanda: {
    innovation: 4,
    stability: 4,
    collaboration: 4,
    balance: 4,
    openness: 4,
    pace: 3,
    note: "Ambiente em crescimento para tecnologia e negócios, com boa integração internacional.",
  },
  Holanda: {
    innovation: 4,
    stability: 4,
    collaboration: 5,
    balance: 5,
    openness: 5,
    pace: 3,
    note: "Perfil moderno e internacional, com forte equilíbrio entre carreira e vida pessoal.",
  },
  "França": {
    innovation: 4,
    stability: 3,
    collaboration: 4,
    balance: 4,
    openness: 4,
    pace: 3,
    note: "Combina tradição acadêmica e criativa com bons polos de inovação.",
  },
  Espanha: {
    innovation: 3,
    stability: 3,
    collaboration: 4,
    balance: 5,
    openness: 4,
    pace: 2,
    note: "Ritmo de vida mais humano, com boa qualidade relacional e adaptação social.",
  },
  "Nova Zelândia": {
    innovation: 3,
    stability: 4,
    collaboration: 5,
    balance: 5,
    openness: 5,
    pace: 2,
    note: "Estilo de vida estável e equilibrado, ideal para quem prioriza bem-estar no longo prazo.",
  },
  "Suíça": {
    innovation: 5,
    stability: 5,
    collaboration: 3,
    balance: 4,
    openness: 3,
    pace: 3,
    note: "Altíssima estabilidade e excelência acadêmica/profissional, com forte foco em precisão.",
  },
  China: {
    innovation: 5,
    stability: 3,
    collaboration: 3,
    balance: 2,
    openness: 2,
    pace: 5,
    note: "Ambiente de alta escala e velocidade, com forte avanço em tecnologia e pesquisa aplicada.",
  },
  Japão: {
    innovation: 5,
    stability: 5,
    collaboration: 3,
    balance: 3,
    openness: 2,
    pace: 4,
    note: "Mercado avançado e disciplinado, valorizando consistência técnica e qualidade.",
  },
  "Coreia do Sul": {
    innovation: 5,
    stability: 4,
    collaboration: 3,
    balance: 2,
    openness: 3,
    pace: 5,
    note: "Economia dinâmica e tecnológica, com alto ritmo e foco em inovação aplicada.",
  },
};

const lifestyleAxisLabels: Record<LifestyleAxis, string> = {
  innovation: "inovação e oportunidades de crescimento",
  stability: "estabilidade e previsibilidade de carreira",
  collaboration: "colaboração e suporte social",
  balance: "equilíbrio entre trabalho e vida pessoal",
  openness: "abertura cultural para integração internacional",
  pace: "dinamismo do mercado de trabalho",
};

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

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function inferMbtiCode(payload: z.infer<typeof payloadSchema>): MbtiCode {
  let extroversion = 0;
  let introversion = 0;
  let sensing = 0;
  let intuition = 0;
  let thinking = 0;
  let feeling = 0;
  let judging = 0;
  let perceiving = 0;

  const style = normalizeText(payload.personalityStyle);
  const preference = normalizeText(payload.personalityPreference);
  const learning = normalizeText(payload.learningFormat);
  const interest = normalizeText(payload.personalityInterest);

  if (style.includes("comunic")) {
    extroversion += 2;
    feeling += 1;
  }
  if (style.includes("analit")) {
    introversion += 1;
    thinking += 2;
  }
  if (style.includes("pratic")) {
    sensing += 2;
    judging += 1;
  }
  if (style.includes("criativ")) {
    intuition += 2;
    perceiving += 1;
  }

  if (
    preference.includes("pessoas") ||
    preference.includes("empatia") ||
    preference.includes("comunicacao") ||
    preference.includes("suporte")
  ) {
    extroversion += 2;
    feeling += 2;
  }

  if (
    preference.includes("estrategia") ||
    preference.includes("logica") ||
    preference.includes("sistemas") ||
    preference.includes("dados")
  ) {
    introversion += 1;
    intuition += 1;
    thinking += 2;
  }

  if (preference.includes("organizacao") || preference.includes("processos")) {
    sensing += 1;
    thinking += 1;
    judging += 2;
  }

  if (preference.includes("acao pratica") || preference.includes("operacoes")) {
    sensing += 2;
    perceiving += 2;
  }

  if (preference.includes("criacao") || preference.includes("inovacao")) {
    intuition += 2;
    perceiving += 1;
  }

  if (
    learning.includes("revisao") ||
    learning.includes("perguntas") ||
    learning.includes("blocos")
  ) {
    sensing += 1;
    thinking += 1;
    judging += 1;
  }

  if (learning.includes("alternando")) {
    intuition += 2;
    perceiving += 1;
  }

  if (learning.includes("explicando") || learning.includes("proprias palavras")) {
    extroversion += 1;
    feeling += 1;
    intuition += 1;
  }

  if (
    learning.includes("projetos") ||
    learning.includes("exercicios praticos") ||
    learning.includes("praticando")
  ) {
    sensing += 2;
    perceiving += 1;
  }

  if (
    interest.includes("tecnologia") ||
    interest.includes("dados") ||
    interest.includes("exatas") ||
    interest.includes("engenharia")
  ) {
    intuition += 1;
    thinking += 2;
  }

  if (
    interest.includes("saude") ||
    interest.includes("educacao") ||
    interest.includes("humanas")
  ) {
    sensing += 1;
    feeling += 2;
  }

  if (
    interest.includes("negocios") ||
    interest.includes("empreendedorismo") ||
    interest.includes("direito") ||
    interest.includes("politicas publicas")
  ) {
    extroversion += 1;
    thinking += 1;
    judging += 1;
  }

  if (interest.includes("artes") || interest.includes("comunicacao")) {
    extroversion += 1;
    intuition += 2;
    feeling += 1;
  }

  if (interest.includes("sustentabilidade") || interest.includes("meio ambiente")) {
    intuition += 1;
    sensing += 1;
    feeling += 1;
  }

  if (payload.studyAvailability === "Todos os dias") {
    judging += 2;
  }
  if (payload.studyAvailability === "Apenas finais de semana") {
    perceiving += 1;
  }
  if (payload.routineDuration === "3+ meses") {
    judging += 2;
  }
  if (payload.routineDuration === "1 semana") {
    perceiving += 1;
  }
  if (payload.mainChallenge === "Falta de foco") {
    perceiving += 1;
  }

  const energy =
    extroversion === introversion
      ? style.includes("comunic")
        ? "E"
        : "I"
      : extroversion > introversion
        ? "E"
        : "I";

  const information =
    sensing === intuition
      ? style.includes("criativ")
        ? "N"
        : "S"
      : sensing > intuition
        ? "S"
        : "N";

  const decision =
    thinking === feeling
      ? style.includes("analit")
        ? "T"
        : "F"
      : thinking > feeling
        ? "T"
        : "F";

  const structure =
    judging === perceiving
      ? style.includes("pratic")
        ? "J"
        : "P"
      : judging > perceiving
        ? "J"
        : "P";

  return `${energy}${information}${decision}${structure}` as MbtiCode;
}

function buildPersonalityProfile(code: MbtiCode): PersonalityProfile {
  const blueprint = mbtiBlueprints[code];

  return {
    code,
    title: blueprint.title,
    description: blueprint.description,
    strengths: blueprint.strengths,
  };
}

function buildCountryMatches(
  selectedCountries: string[],
  profileCode: MbtiCode
): CountryMatch[] {
  const blueprint = mbtiBlueprints[profileCode];
  const axes = Object.keys(lifestyleAxisLabels) as LifestyleAxis[];

  const matches = selectedCountries
    .filter((country) => countryLifestyleProfiles[country])
    .map((country) => {
      const countryProfile = countryLifestyleProfiles[country];
      const weighted = axes.map((axis) => ({
        axis,
        score: countryProfile[axis] * blueprint.priorities[axis],
      }));
      const rawScore = weighted.reduce((sum, item) => sum + item.score, 0);
      const compatibility = Math.round((rawScore / 150) * 100);
      const topSignals = weighted
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((item) => lifestyleAxisLabels[item.axis]);

      return {
        country,
        compatibility,
        reason: `${countryProfile.note} Destaque para ${topSignals[0]} e ${topSignals[1]}.`,
      };
    })
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 4);

  if (matches.length > 0) {
    return matches;
  }

  return [
    {
      country: "Canadá",
      compatibility: 70,
      reason:
        "País com boa combinação entre qualidade de vida, oportunidades e integração internacional.",
    },
  ];
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
    const personalityCode = inferMbtiCode(payload);
    const personalityProfile = buildPersonalityProfile(personalityCode);
    const countryMatches = buildCountryMatches(payload.preferredCountries, personalityCode);

    const result: CareerResult = {
      summary: `Seu perfil de personalidade aponta para ${personalityProfile.title} (${personalityProfile.code}).`,
      personalityProfile,
      countryMatches,
      readinessLevel,
    };

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao montar resultado.",
      },
      { status: 500 }
    );
  }
}
