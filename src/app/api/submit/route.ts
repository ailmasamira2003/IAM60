export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { quizSchema } from "@/lib/schema";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = quizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const prompt = buildPrompt(data);
    console.log("Prompt gerado:", prompt);

    const areaPrincipal = data.interesses.areas[0];

    const paisesSugeridos = ["Canadá", "Alemanha", "Portugal"];

    const { data: countries, error: countriesError } = await supabase
      .from("countries")
      .select("id, name, slug")
      .in("name", paisesSugeridos);

    if (countriesError) {
      console.error("Erro ao buscar países:", countriesError);
      return NextResponse.json(
        { error: "Erro ao buscar países no banco." },
        { status: 500 }
      );
    }

    const countryIds = countries.map((country) => country.id);

    const { data: universities, error: universitiesError } = await supabase
      .from("universities")
      .select("id, name, area, level, ranking_note, description, website, country_id")
      .in("country_id", countryIds)
      .eq("area", areaPrincipal);

    if (universitiesError) {
      console.error("Erro ao buscar universidades:", universitiesError);
      return NextResponse.json(
        { error: "Erro ao buscar universidades no banco." },
        { status: 500 }
      );
    }

    const { data: scholarships, error: scholarshipsError } = await supabase
      .from("scholarships")
      .select("id, name, area, level, coverage, description, requirements, website, country_id")
      .in("country_id", countryIds)
      .eq("area", areaPrincipal);

    if (scholarshipsError) {
      console.error("Erro ao buscar bolsas:", scholarshipsError);
      return NextResponse.json(
        { error: "Erro ao buscar bolsas no banco." },
        { status: 500 }
      );
    }

    const result = {
      diagnostico: `Com base no seu perfil, ${data.nome} demonstra potencial para construir uma carreira internacional com foco em ${data.interesses.areas.join(", ")}. Seu nível de disciplina atual e sua disponibilidade diária mostram que um plano bem estruturado pode gerar evolução consistente nos próximos meses.`,
      carreiras: [
        "Desenvolvedor de Software",
        "Analista de Dados",
        "Product Designer",
        "Especialista em Marketing Digital",
      ],
      paises: paisesSugeridos,
      plano30Dias: [
        {
          semana: "Semana 1",
          foco: "Clareza e organização",
          acoes: [
            "Definir uma meta profissional internacional clara",
            "Escolher uma área principal de atuação",
            "Organizar uma rotina diária de estudos",
          ],
        },
        {
          semana: "Semana 2",
          foco: "Base técnica",
          acoes: [
            "Estudar fundamentos da área escolhida",
            "Consumir conteúdo prático em português e inglês",
            "Registrar aprendizados importantes",
          ],
        },
        {
          semana: "Semana 3",
          foco: "Portfólio e presença",
          acoes: [
            "Criar ou atualizar LinkedIn",
            "Montar um projeto simples para portfólio",
            "Pesquisar vagas internacionais da área",
          ],
        },
        {
          semana: "Semana 4",
          foco: "Posicionamento",
          acoes: [
            "Revisar currículo",
            "Mapear países com maior aderência ao perfil",
            "Definir próximos 60 dias de evolução",
          ],
        },
      ],
      rotinaDiaria: [
        `Dedicar ${data.realidadeAtual.horasPorDia} hora(s) por dia ao plano`,
        "Separar 20 minutos para inglês",
        "Executar uma tarefa prática por dia",
      ],
      alertas: [
        "Evite começar vários caminhos ao mesmo tempo",
        "Disciplina baixa exige rotina simples e sustentável",
        "Falta de direção se resolve com metas pequenas e claras",
      ],
      universities: universities.map((university) => {
        const country = countries.find((c) => c.id === university.country_id);

        return {
          name: university.name,
          country: country?.name ?? "País não encontrado",
          area: university.area,
          level: university.level,
          ranking_note: university.ranking_note,
          description: university.description,
          website: university.website,
        };
      }),
      scholarships: scholarships.map((scholarship) => {
        const country = countries.find((c) => c.id === scholarship.country_id);

        return {
          name: scholarship.name,
          country: country?.name ?? "País não encontrado",
          area: scholarship.area,
          level: scholarship.level,
          coverage: scholarship.coverage,
          description: scholarship.description,
          requirements: scholarship.requirements,
          website: scholarship.website,
        };
      }),
    };

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("ERRO COMPLETO DA API:", error);

    return NextResponse.json(
      {
        error: error?.message || "Erro interno no servidor.",
      },
      { status: 500 }
    );
  }
}