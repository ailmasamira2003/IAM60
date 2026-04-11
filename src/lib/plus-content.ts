import type { CareerFormValues, CareerResult } from "@/types/career";

export interface PlusSubscriber {
  fullName: string;
  email: string;
  cpf?: string;
  birthDate?: string;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  focus: string;
  tasks: string[];
  outcome: string;
}

export interface ReportMetric {
  label: string;
  value: number;
  description: string;
}

export interface DevelopmentSkill {
  skill: string;
  reason: string;
  action: string;
}

export interface ScholarshipOpportunity {
  id: string;
  country: string;
  name: string;
  coverage: string;
  summary: string;
  idealFor: string;
  requirements: string[];
}

type ScholarshipTemplate = Omit<ScholarshipOpportunity, "id" | "requirements"> & {
  baseRequirements: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function uniqueList<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function getEnglishMetric(level: string): number {
  const map: Record<string, number> = {
    Basico: 38,
    Intermediario: 58,
    Avancado: 79,
    Fluente: 92,
    "Básico": 38,
    "Intermediário": 58,
    "Avançado": 79,
  };

  return map[level] ?? 45;
}

function getHoursMetric(hoursPerDay: string): number {
  const map: Record<string, number> = {
    "1h": 40,
    "2h": 58,
    "3h": 74,
    "4h+": 86,
  };

  return map[hoursPerDay] ?? 44;
}

function getAvailabilityMetric(availability: string): number {
  const map: Record<string, number> = {
    "Todos os dias": 85,
    "Apenas dias úteis": 68,
    "Apenas finais de semana": 50,
  };

  return map[availability] ?? 52;
}

function getFinancialMetric(financialCondition: string): number {
  const map: Record<string, number> = {
    "Pagar tudo": 78,
    "Buscar bolsa parcial": 64,
    "Preciso de bolsa 100%": 49,
  };

  return map[financialCondition] ?? 55;
}

function getChallengePenalty(mainChallenge: string): number {
  const map: Record<string, number> = {
    "Falta de tempo": 10,
    "Falta de foco": 14,
    "Não sei por onde começar": 18,
    "Falta de dinheiro": 12,
  };

  return map[mainChallenge] ?? 10;
}

function getCourseLabel(coursePreference: string): string {
  if (coursePreference.includes("Curtos")) {
    return "cursos curtos com entrega rapida";
  }

  if (coursePreference.includes("Medios") || coursePreference.includes("Médios")) {
    return "programas de media duracao";
  }

  if (coursePreference.includes("Longos")) {
    return "programas academicos completos";
  }

  return "programas alinhados ao seu momento";
}

function getCountryList(values: CareerFormValues, result: CareerResult): string[] {
  const rankedCountries = result.countryMatches.map((match) => match.country);
  return uniqueList([...rankedCountries, ...values.preferredCountries]).slice(0, 6);
}

export function getLeadCountry(
  values: CareerFormValues,
  result: CareerResult
): string {
  return getCountryList(values, result)[0] ?? "Canadá";
}

export function getFocusAreaLabel(values: CareerFormValues): string {
  if (values.intendsCareerChange === "Sim" && values.targetProfession.trim()) {
    return values.targetProfession.trim();
  }

  if (values.currentProfession.trim()) {
    return values.currentProfession.trim();
  }

  return values.personalityInterest || "carreira internacional";
}

export function getFirstName(fullName: string): string {
  const [firstName] = fullName.trim().split(/\s+/);
  return firstName || "voce";
}

export function buildStudyPlan(
  values: CareerFormValues,
  result: CareerResult
): StudyPlanDay[] {
  const leadCountry = getLeadCountry(values, result);
  const focusArea = getFocusAreaLabel(values);
  const englishLevel = values.englishLevel || "seu nivel atual";
  const studyRoutine = `${values.studyHoursPerDay || "1h"} por dia, ${
    values.studyAvailability || "em um ritmo realista"
  }`;
  const courseLabel = getCourseLabel(values.coursePreference);
  const financialStrategy =
    values.financialCondition === "Preciso de bolsa 100%"
      ? "mapa agressivo de bolsas integrais e custos essenciais"
      : values.financialCondition === "Buscar bolsa parcial"
        ? "mix entre bolsa parcial e reserva propria"
        : "reserva financeira e aplicacoes com maior retorno";

  return [
    {
      day: 1,
      title: "Definir alvo internacional",
      focus: `Escolher um foco claro entre ${focusArea} e o mercado de ${leadCountry}.`,
      tasks: [
        `Resumir em uma frase seu objetivo principal: ${values.mainGoal || "aplicar para estudar ou trabalhar fora."}`,
        `Selecionar ${leadCountry} como pais ancora e dois paises de apoio.`,
        "Transformar o objetivo em uma meta com prazo e criterio de sucesso.",
      ],
      outcome: "Meta internacional clara e lista curta de destinos prioritarios.",
    },
    {
      day: 2,
      title: "Mapear base atual",
      focus: `Entender sua linha de partida em idioma, experiencia e prontidao (${result.readinessLevel}%).`,
      tasks: [
        `Registrar seu nivel de ingles atual: ${englishLevel}.`,
        "Listar experiencias, cursos e resultados que ja fortalecem sua candidatura.",
        "Anotar as tres lacunas mais urgentes para reduzir nas proximas semanas.",
      ],
      outcome: "Diagnostico objetivo do que ja sustenta sua aplicacao.",
    },
    {
      day: 3,
      title: "Montar trilha de competencias",
      focus: `Priorizar habilidades para crescer em ${focusArea}.`,
      tasks: [
        `Escolher um projeto pratico ou portfolio ligado a ${focusArea}.`,
        "Separar uma habilidade tecnica, uma de comunicacao e uma de posicionamento.",
        "Definir evidencia concreta para cada habilidade escolhida.",
      ],
      outcome: "Trilha de desenvolvimento ligada ao perfil e ao destino.",
    },
    {
      day: 4,
      title: "Fixar rotina de estudos",
      focus: `Criar uma rotina sustentavel com ${studyRoutine}.`,
      tasks: [
        "Reservar blocos fixos de estudo na agenda.",
        `Adaptar a rotina para reduzir o principal bloqueio: ${values.mainChallenge || "falta de clareza"}.`,
        "Determinar revisao semanal e checkpoint de progresso.",
      ],
      outcome: "Calendario semanal de execucao pronto para ser repetido.",
    },
    {
      day: 5,
      title: "Fortalecer CV e narrativa",
      focus: "Construir uma candidatura que traduza valor de forma simples.",
      tasks: [
        "Atualizar curriculo em uma pagina com resultados mensuraveis.",
        "Ajustar LinkedIn, portfolio ou carta de motivacao para o objetivo internacional.",
        "Reunir provas de desempenho academico ou profissional.",
      ],
      outcome: "Kit inicial de candidatura com posicionamento coerente.",
    },
    {
      day: 6,
      title: "Selecionar programas certos",
      focus: `Filtrar ${courseLabel} com boa aderencia ao seu objetivo.`,
      tasks: [
        `Separar 3 programas ou vagas em ${leadCountry} com requisitos viaveis.`,
        "Comparar idioma, duracao, custo e potencial de empregabilidade.",
        "Marcar o que pede portfolio, experiencia, exames ou recomendacoes.",
      ],
      outcome: "Shortlist enxuta de oportunidades para aplicar com qualidade.",
    },
    {
      day: 7,
      title: "Planejar bolsa e custo",
      focus: `Organizar um plano financeiro baseado em ${financialStrategy}.`,
      tasks: [
        "Montar tabela com tuition, custo de vida, taxas e documentos.",
        "Priorizar bolsas, descontos e editais com maior chance de encaixe.",
        "Definir valor de reserva minima e estrategia de aplicacao em ondas.",
      ],
      outcome: "Mapa financeiro com cenarios realista, moderado e agressivo.",
    },
    {
      day: 8,
      title: "Abrir calendario de aplicacoes",
      focus: "Transformar estrategia em execucao com prazo e ordem.",
      tasks: [
        "Quebrar a candidatura em documentos, testes, essays e envios.",
        "Definir uma primeira aplicacao piloto para validar o processo.",
        "Agendar revisao quinzenal para acompanhar avanco e ajustes.",
      ],
      outcome: "Roadmap de aplicacao pronto para as proximas semanas.",
    },
  ];
}

export function buildReportMetrics(
  values: CareerFormValues,
  result: CareerResult
): ReportMetric[] {
  const english = getEnglishMetric(values.englishLevel);
  const routine = clamp(
    Math.round(
      getHoursMetric(values.studyHoursPerDay) * 0.45 +
        getAvailabilityMetric(values.studyAvailability) * 0.35 +
        (values.routineDuration === "3+ meses"
          ? 82
          : values.routineDuration === "1 mês"
            ? 64
            : 46) *
          0.2 -
        getChallengePenalty(values.mainChallenge)
    ),
    28,
    94
  );
  const clarity = clamp(
    Math.round(
      (values.mainGoal.trim().length > 120 ? 84 : 68) +
        (values.intendsCareerChange === "Sim" && values.targetProfession.trim()
          ? 8
          : 0) +
        (values.preferredCountries.length > 1 ? 4 : 0)
    ),
    40,
    95
  );
  const funding = clamp(
    Math.round(
      getFinancialMetric(values.financialCondition) -
        (values.coursePreference.includes("Longos") ? 6 : 0) +
        (values.preferredCountries.length >= 3 ? 3 : 0)
    ),
    32,
    89
  );
  const fit = clamp(
    Math.round((result.readinessLevel + (result.countryMatches[0]?.compatibility ?? 70)) / 2),
    35,
    96
  );

  return [
    {
      label: "Idioma",
      value: english,
      description: "Mostra o quanto o nivel atual de ingles sustenta processos seletivos e vida academica.",
    },
    {
      label: "Rotina de execucao",
      value: routine,
      description: "Avalia consistencia de estudo, disponibilidade e impacto do principal bloqueio informado.",
    },
    {
      label: "Clareza de objetivo",
      value: clarity,
      description: "Mede nitidez de meta, direcao profissional e foco geografico da estrategia.",
    },
    {
      label: "Viabilidade financeira",
      value: funding,
      description: "Indica a robustez do seu plano para lidar com custos, bolsas e margem de seguranca.",
    },
    {
      label: "Fit internacional",
      value: fit,
      description: "Combina sua prontidao atual com a compatibilidade dos paises escolhidos.",
    },
  ];
}

const interestSkillMap: Record<
  string,
  Array<{ skill: string; reason: string; action: string }>
> = {
  tecnologia: [
    {
      skill: "Portfolio tecnico internacional",
      reason: "Projetos demonstraveis aceleram confianca em recrutadores e programas.",
      action: "Publique dois estudos de caso com contexto, stack usada e impacto final.",
    },
    {
      skill: "Comunicacao tecnica em ingles",
      reason: "Explicar solucoes com clareza aumenta desempenho em entrevistas e colaboracoes.",
      action: "Treine apresentacoes curtas sobre projetos, desafios e resultados em ingles.",
    },
  ],
  "negocios e empreendedorismo": [
    {
      skill: "Narrativa de negocio",
      reason: "Mercados internacionais valorizam clareza sobre problema, proposta e resultado.",
      action: "Monte um pitch de 90 segundos com foco em dor, solucao e diferencial.",
    },
    {
      skill: "Leitura de mercado e dados",
      reason: "Tomar decisoes com dados fortalece aplicacoes e networking estrategico.",
      action: "Transforme uma pesquisa de mercado em um resumo com insights e recomendacoes.",
    },
  ],
  "saude e bem-estar": [
    {
      skill: "Documentacao academica e regulatoria",
      reason: "Areas de saude pedem organizacao rigorosa de comprovacoes e exigencias.",
      action: "Crie um checklist com diploma, historico, traducoes e validacoes necessarias.",
    },
    {
      skill: "Comunicacao empatica em contexto multicultural",
      reason: "Adaptacao cultural e comunicacao segura fazem diferenca na pratica profissional.",
      action: "Treine respostas para situacoes de atendimento e colaboracao em equipe.",
    },
  ],
  "artes, design e criatividade": [
    {
      skill: "Curadoria de portfolio",
      reason: "Nao basta produzir; e preciso selecionar projetos com narrativa e criterio.",
      action: "Organize um portfolio curto com problema, processo criativo e resultado final.",
    },
    {
      skill: "Apresentacao de conceito",
      reason: "Editais e escolas criativas avaliam repertorio, intencao e argumentacao.",
      action: "Escreva uma apresentacao autoral de uma pagina sobre sua linha criativa.",
    },
  ],
  "educacao e desenvolvimento humano": [
    {
      skill: "Facilitacao e desenho de aprendizagem",
      reason: "Programas internacionais observam capacidade de estruturar experiencias formativas.",
      action: "Crie uma microaula ou workshop com objetivo, roteiro e avaliacao.",
    },
    {
      skill: "Escrita reflexiva em ingles",
      reason: "Boa parte das aplicacoes pede essays ou cartas com visao pedagogica consistente.",
      action: "Produza um texto curto conectando experiencia, impacto e metas futuras.",
    },
  ],
  "ciencias exatas": [
    {
      skill: "Rigor analitico aplicado",
      reason: "Resultados e evidencias fortalecem candidaturas em exatas.",
      action: "Monte um mini projeto com metodologia, calculos e conclusoes objetivas.",
    },
    {
      skill: "Ingles tecnico",
      reason: "Leitura de papers, provas e entrevistas exige vocabulario especifico.",
      action: "Separar um glossario pratico da sua area e revisar em ciclos semanais.",
    },
  ],
  "ciencias humanas e sociais": [
    {
      skill: "Escrita argumentativa",
      reason: "Aplicacoes nessa area valorizam clareza de raciocinio e repertorio critico.",
      action: "Produza um essay curto sobre um tema da sua area com tese e evidencias.",
    },
    {
      skill: "Analise intercultural",
      reason: "Experiencia internacional pede leitura de contexto e adaptacao discursiva.",
      action: "Relacione um tema do Brasil com a perspectiva do pais-alvo em um resumo comparativo.",
    },
  ],
  "comunicacao, marketing e midia": [
    {
      skill: "Storytelling com dados",
      reason: "Comunicacao internacional combina criacao com leitura de performance.",
      action: "Transforme uma campanha em case com objetivo, estrategia e indicadores.",
    },
    {
      skill: "Posicionamento profissional",
      reason: "Sua narrativa pessoal precisa ser clara em CV, portfolio e entrevistas.",
      action: "Reescreva bio e headline do LinkedIn com foco na vaga ou programa alvo.",
    },
  ],
  "direito, relacoes internacionais e politicas publicas": [
    {
      skill: "Pesquisa e escrita formal",
      reason: "Editais e instituicoes dessa area avaliam profundidade e consistencia argumentativa.",
      action: "Produza uma nota tecnica curta conectando problema, contexto e recomendacao.",
    },
    {
      skill: "Comunicacao institucional em ingles",
      reason: "Negociacao, articulacao e leitura de documentos formais dependem dessa base.",
      action: "Treine vocabulario juridico ou diplomatico em simulacoes de entrevista.",
    },
  ],
  "sustentabilidade, meio ambiente e energia": [
    {
      skill: "Gestao de projetos com impacto",
      reason: "Programas da area valorizam solucao aplicada e mensuracao de efeito.",
      action: "Estruture um case com problema socioambiental, acao proposta e indicadores.",
    },
    {
      skill: "Analise de evidencias e comunicacao publica",
      reason: "Traduzir dados tecnicos em mensagem clara amplia competitividade internacional.",
      action: "Crie um resumo executivo de uma pagina com recomendacoes praticas.",
    },
  ],
  "analise de dados e pesquisa aplicada": [
    {
      skill: "Portfolio analitico",
      reason: "Demonstrar metodo e interpretacao vale mais do que listar ferramentas.",
      action: "Publique um projeto com base de dados, limpeza, analise e conclusoes.",
    },
    {
      skill: "Visualizacao e traducao de insights",
      reason: "Mercado internacional busca quem explica o dado com clareza para decisao.",
      action: "Monte um dashboard simples e acompanhe o racional por escrito.",
    },
  ],
};

const challengeSkillMap: Record<string, DevelopmentSkill> = {
  "Falta de tempo": {
    skill: "Gestao de tempo de alta friccao",
    reason: "Sem agenda protegida, o plano perde continuidade antes de gerar evidencia real.",
    action: "Separar blocos curtos, repetiveis e negociados com antecedencia na semana.",
  },
  "Falta de foco": {
    skill: "Execucao com foco e revisao",
    reason: "Alternar prioridades demais reduz consistencia e atrasa a candidatura.",
    action: "Usar um unico objetivo por ciclo semanal e revisar entregas no fim da semana.",
  },
  "Não sei por onde começar": {
    skill: "Priorizacao de proximo passo",
    reason: "Ganhar clareza operacional e o primeiro desbloqueio mais importante agora.",
    action: "Transformar o objetivo em tres entregas pequenas e agendar a primeira ainda hoje.",
  },
  "Falta de dinheiro": {
    skill: "Planejamento financeiro para candidatura",
    reason: "A estrategia precisa combinar custo total, bolsas, prazos e reserva minima.",
    action: "Montar planilha com custos, editais, documentos e estrategia de aplicacao em ondas.",
  },
};

export function buildDevelopmentSkills(
  values: CareerFormValues,
  result: CareerResult
): DevelopmentSkill[] {
  const areaKey = toKey(values.personalityInterest || "carreira internacional");
  const matchedArea =
    Object.keys(interestSkillMap).find((key) => areaKey.includes(toKey(key))) ??
    "tecnologia";

  const baseSkills = interestSkillMap[matchedArea] ?? interestSkillMap.tecnologia;
  const readinessSkill: DevelopmentSkill =
    result.readinessLevel >= 75
      ? {
          skill: "Execucao de candidatura com padrao internacional",
          reason: "Seu perfil ja tem base; agora o ganho vem de refinamento e consistencia.",
          action: "Simular entrevistas, revisar essays e testar uma primeira aplicacao piloto.",
        }
      : {
          skill: "Construcao de base competitiva",
          reason: "Antes de acelerar, vale consolidar idioma, evidencias e rotina de estudo.",
          action: "Escolher um projeto-ancora e medir evolucao semanal por entrega concreta.",
        };

  const combined = [
    challengeSkillMap[values.mainChallenge],
    ...baseSkills,
    readinessSkill,
  ].filter(Boolean) as DevelopmentSkill[];

  const seen = new Set<string>();

  return combined.filter((item) => {
    if (seen.has(item.skill)) {
      return false;
    }

    seen.add(item.skill);
    return true;
  });
}

const scholarshipTemplates: Record<string, ScholarshipTemplate[]> = {
  EUA: [
    {
      country: "EUA",
      name: "Global Reach Merit Award",
      coverage: "40% a 80% de tuition",
      summary: "Bolsa demonstrativa para estudantes com narrativa forte e potencial de lideranca.",
      idealFor: "Perfis que combinam desempenho academico com portfolio ou experiencia pratica.",
      baseRequirements: [
        "Historico escolar ou academico com bom desempenho.",
        "Essay explicando objetivo internacional e impacto futuro.",
        "Curriculo em ingles com experiencias relevantes.",
      ],
    },
  ],
  "Canadá": [
    {
      country: "Canadá",
      name: "Maple Path Scholarship",
      coverage: "Ate 70% da tuition + apoio inicial",
      summary: "Exemplo de bolsa voltada para transicao academica e integracao multicultural.",
      idealFor: "Quem busca combinacao entre qualidade de vida, estudo e adaptacao gradual.",
      baseRequirements: [
        "Carta de motivacao conectando pais-alvo e plano de carreira.",
        "Comprovacao de nivel de idioma para ingresso.",
        "Plano academico com justificativa de area e programa.",
      ],
    },
  ],
  "Portugal": [
    {
      country: "Portugal",
      name: "Lusophone Mobility Grant",
      coverage: "25% a 60% do custo academico",
      summary: "Exemplo demonstrativo para rotas de adaptacao cultural e academica mais acessiveis.",
      idealFor: "Perfis que valorizam proximidade cultural e estrategia de entrada sustentavel.",
      baseRequirements: [
        "Historico academico atualizado.",
        "Carta curta com objetivos de estudo e empregabilidade.",
        "Comprovacao basica de sustentabilidade financeira.",
      ],
    },
  ],
  "Alemanha": [
    {
      country: "Alemanha",
      name: "Future Skills Deutschland",
      coverage: "Isencao parcial + apoio para materiais",
      summary: "Bolsa demo para programas com perfil tecnico, organizacao e excelencia academica.",
      idealFor: "Quem busca engenharia, tecnologia, exatas ou campos de alta estrutura.",
      baseRequirements: [
        "Historico com notas consistentes.",
        "Plano de estudos detalhado.",
        "Prova de aderencia tecnica ao curso ou programa.",
      ],
    },
  ],
  "Austrália": [
    {
      country: "Austrália",
      name: "Southern Horizon Award",
      coverage: "50% da tuition",
      summary: "Exemplo de bolsa para candidatos que buscam equilibrio entre carreira e experiencia internacional.",
      idealFor: "Quem quer uma trilha de estudo aplicada com boa adaptacao de estilo de vida.",
      baseRequirements: [
        "Carta de motivacao com foco em objetivos praticos.",
        "Comprovacao de idioma.",
        "Evidencias de participacao academica ou profissional.",
      ],
    },
  ],
  "Reino Unido": [
    {
      country: "Reino Unido",
      name: "Bridge to Impact Scholarship",
      coverage: "35% a 75% do programa",
      summary: "Bolsa demonstrativa para candidaturas com forte narrativa academica e impacto futuro.",
      idealFor: "Perfis com boa escrita, clareza de objetivos e consistencia de carreira.",
      baseRequirements: [
        "Essay autoral com foco em impacto.",
        "Historico academico e recomendacao.",
        "Curriculo com experiencias extracurriculares ou profissionais.",
      ],
    },
  ],
  "Irlanda": [
    {
      country: "Irlanda",
      name: "Emerald Career Scholarship",
      coverage: "Ate 60% de tuition",
      summary: "Exemplo de bolsa voltada para perfis internacionais com desejo de insercao em ecossistemas inovadores.",
      idealFor: "Quem quer tecnologia, negocios ou comunicacao em ambiente internacional.",
      baseRequirements: [
        "Curriculo em ingles.",
        "Carta conectando programa, carreira e pais.",
        "Comprovacao minima de idioma ou plano de evolucao.",
      ],
    },
  ],
  "Holanda": [
    {
      country: "Holanda",
      name: "Open World Study Fund",
      coverage: "40% a 70% dos custos academicos",
      summary: "Bolsa demo para candidatos que valorizam colaboracao, inovacao e repertorio internacional.",
      idealFor: "Perfis com projeto bem definido e abertura multicultural.",
      baseRequirements: [
        "Plano academico objetivo.",
        "Historico e atividades com autonomia.",
        "Comprovacao de ingles e motivacao internacional.",
      ],
    },
  ],
  "França": [
    {
      country: "França",
      name: "Creative Excellence Bourse",
      coverage: "30% a 65% do programa",
      summary: "Exemplo demonstrativo de bolsa para areas criativas, humanas e polos de inovacao.",
      idealFor: "Quem busca combinacao de repertorio cultural e desenvolvimento academico.",
      baseRequirements: [
        "Carta de motivacao com repertorio e objetivos.",
        "Portfolio ou texto de interesse, quando aplicavel.",
        "Historico e documentos basicos da candidatura.",
      ],
    },
  ],
  "Espanha": [
    {
      country: "Espanha",
      name: "Iberia Talent Grant",
      coverage: "25% a 55% da tuition",
      summary: "Bolsa demonstrativa para candidaturas com foco em adaptacao cultural e progressao de carreira.",
      idealFor: "Quem quer entrada progressiva em ambiente academico europeu.",
      baseRequirements: [
        "Objetivo profissional bem descrito.",
        "Comprovacao academica minima.",
        "Organizacao financeira ou de bolsa complementar.",
      ],
    },
  ],
  "Nova Zelândia": [
    {
      country: "Nova Zelândia",
      name: "Pacific Balance Scholarship",
      coverage: "50% do programa",
      summary: "Exemplo de bolsa para estudantes que valorizam qualidade de vida e planejamento sustentavel.",
      idealFor: "Perfis que buscam experiencia internacional com rotina equilibrada.",
      baseRequirements: [
        "Carta de motivacao com plano de longo prazo.",
        "Historico e referencias basicas.",
        "Comprovacao de idioma e adaptabilidade.",
      ],
    },
  ],
  "Suíça": [
    {
      country: "Suíça",
      name: "Precision Excellence Fellowship",
      coverage: "Bolsa parcial + apoio academico",
      summary: "Modelo demonstrativo para candidatos com alto nivel tecnico e organizacao forte.",
      idealFor: "Quem mira excelencia academica, pesquisa ou trilhas altamente especializadas.",
      baseRequirements: [
        "Historico forte e evidencias de excelencia.",
        "Projeto academico ou de pesquisa conciso.",
        "Documentacao completa entregue com alto nivel de organizacao.",
      ],
    },
  ],
  "China": [
    {
      country: "China",
      name: "Innovation Gateway Award",
      coverage: "60% a 100% do custo academico",
      summary: "Exemplo de bolsa para candidatos interessados em mercados dinamicos e alta intensidade de inovacao.",
      idealFor: "Perfis adaptaveis com interesse em tecnologia, negocios e ecossistemas de escala.",
      baseRequirements: [
        "Plano de carreira ligado ao contexto asiatico.",
        "Comprovacao academica.",
        "Carta demonstrando abertura cultural e disciplina.",
      ],
    },
  ],
  "Japão": [
    {
      country: "Japão",
      name: "Future Discipline Scholarship",
      coverage: "Bolsa parcial com apoio de instalacao",
      summary: "Exemplo demonstrativo para candidatos com foco tecnico, consistencia e qualidade de execucao.",
      idealFor: "Quem valoriza ambiente disciplinado e alto padrao de desempenho.",
      baseRequirements: [
        "Historico academico consistente.",
        "Plano de estudo detalhado.",
        "Discurso claro sobre motivacao para o pais e para o programa.",
      ],
    },
  ],
  "Coreia do Sul": [
    {
      country: "Coreia do Sul",
      name: "Seoul Next Talent Grant",
      coverage: "40% a 80% dos custos",
      summary: "Bolsa demo para candidatos alinhados a inovacao, ritmo acelerado e experiencia global.",
      idealFor: "Perfis que querem crescer em tecnologia, negocios ou industrias criativas.",
      baseRequirements: [
        "Carta de motivacao com foco em crescimento rapido.",
        "Curriculo com projetos ou experiencias praticas.",
        "Comprovacao de idioma ou plano de evolucao definido.",
      ],
    },
  ],
};

function buildDynamicRequirements(
  values: CareerFormValues,
  focusArea: string
): string[] {
  const englishRequirement =
    values.englishLevel === "Avançado" || values.englishLevel === "Fluente"
      ? "Comprovacao formal de proficiencia ou entrevista em ingles bem treinada."
      : `Plano para sair de ${values.englishLevel || "um nivel inicial"} para um nivel competitivo antes da aplicacao.`;

  const focusKey = toKey(focusArea);
  const portfolioRequirement =
    focusKey.includes("design") || focusKey.includes("criativ")
      ? "Portfolio enxuto com 3 a 5 projetos explicando processo e resultado."
      : focusKey.includes("dados") || focusKey.includes("tecnolog")
        ? "Projeto demonstravel ou case tecnico com problema, metodo e impacto."
        : "Evidencia concreta de experiencia, projeto autoral ou iniciativa relevante.";

  const financialRequirement =
    values.financialCondition === "Preciso de bolsa 100%"
      ? "Justificativa financeira clara e estrategia complementar para custos nao cobertos."
      : "Plano de sustentabilidade financeira para taxas, documentacao e chegada.";

  return [englishRequirement, portfolioRequirement, financialRequirement];
}

export function buildScholarshipSuggestions(
  values: CareerFormValues,
  result: CareerResult
): ScholarshipOpportunity[] {
  const focusArea = getFocusAreaLabel(values);
  const countries = getCountryList(values, result);

  return countries
    .flatMap((country) => {
      const templates = scholarshipTemplates[country] ?? [];

      return templates.map((template, index) => ({
        id: `${country}-${index}`,
        country: template.country,
        name: template.name,
        coverage: template.coverage,
        summary: template.summary,
        idealFor: template.idealFor,
        requirements: [
          ...template.baseRequirements,
          ...buildDynamicRequirements(values, focusArea),
        ].slice(0, 5),
      }));
    })
    .slice(0, 6);
}
