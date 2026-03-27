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
