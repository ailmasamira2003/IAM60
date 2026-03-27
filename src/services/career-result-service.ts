import type { CareerFormValues, CareerResult } from "@/types/career";

export async function requestCareerResult(
  payload: CareerFormValues
): Promise<CareerResult> {
  const response = await fetch("/api/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível gerar seu resultado.");
  }

  return data.result as CareerResult;
}

export function buildMockChatReply(
  message: string,
  result: CareerResult
): string {
  const lowered = message.toLowerCase();

  if (lowered.includes("bolsa")) {
    const scholarship = result.scholarships[0];
    return scholarship
      ? `A melhor bolsa para começar é ${scholarship.name}, em ${scholarship.country}. Priorize este fit: ${scholarship.fitReason}.`
      : "Seu perfil ainda não possui uma bolsa prioritária. Ajuste o inglês e a rotina para abrir mais oportunidades.";
  }

  if (
    lowered.includes("país") ||
    lowered.includes("pais") ||
    lowered.includes("canadá") ||
    lowered.includes("canada") ||
    lowered.includes("alemanha")
  ) {
    return `Para você, os países com melhor equilíbrio entre objetivo e perfil são: ${result.recommendedCountries.join(
      ", "
    )}.`;
  }

  if (lowered.includes("carreira") || lowered.includes("trabalho")) {
    return `As carreiras com maior aderência neste momento são ${result.suggestedCareers.join(
      ", "
    )}. Foque na primeira opção nas próximas 6 semanas para ganhar tração.`;
  }

  if (lowered.includes("plano") || lowered.includes("roteiro")) {
    return `Seu próximo passo imediato é: ${result.roadmap[0]}. Isso destrava os próximos itens do seu plano.`;
  }

  return "Boa pergunta. Com base no seu resultado, recomendo priorizar inglês aplicado, portfólio e candidaturas para programas de alta aderência nas próximas semanas.";
}

