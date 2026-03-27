import { jsPDF } from "jspdf";
import type { CareerFormValues, CareerResult } from "@/types/career";

function addTitle(doc: jsPDF, text: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(text, 20, y);
  return y + 6;
}

function addParagraph(doc: jsPDF, text: string, y: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, y);
  return y + lines.length * 5 + 2;
}

function addList(doc: jsPDF, values: string[], y: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let cursor = y;
  values.forEach((value) => {
    const lines = doc.splitTextToSize(`- ${value}`, 170);
    doc.text(lines, 20, cursor);
    cursor += lines.length * 5 + 1;
  });

  return cursor + 2;
}

function ensurePage(doc: jsPDF, currentY: number, threshold = 272): number {
  if (currentY <= threshold) {
    return currentY;
  }

  doc.addPage();
  return 20;
}

function formatOptional(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Não informado";
}

export function exportCareerResultPdf(
  values: CareerFormValues,
  result: CareerResult
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AI CAREER SYSTEM - Relatório Completo", 20, 20);

  let y = 30;
  y = addParagraph(doc, result.summary, y);

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Perfil de personalidade", y);
  y = addParagraph(
    doc,
    `${result.personalityProfile.title} (${result.personalityProfile.code})`,
    y
  );
  y = addParagraph(doc, result.personalityProfile.description, y);
  y = addList(doc, result.personalityProfile.strengths.map((item) => `Ponto forte: ${item}`), y);

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Nível de prontidão", y);
  y = addParagraph(doc, `Prontidão estimada: ${result.readinessLevel}%`, y);

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Países com melhor compatibilidade", y);
  y = addList(
    doc,
    result.countryMatches.map(
      (match) => `${match.country} (${match.compatibility}%): ${match.reason}`
    ),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Respostas do formulário", y);
  addList(
    doc,
    [
      `Idade: ${values.age ?? "Não informado"}`,
      `Escolaridade: ${formatOptional(values.education)}`,
      `Trabalhando atualmente: ${formatOptional(values.currentlyWorking)}`,
      `Atua na área de formação: ${formatOptional(values.workInGraduationArea)}`,
      `Profissão atual: ${formatOptional(values.currentProfession)}`,
      `Inglês: ${formatOptional(values.englishLevel)}`,
      `Experiência internacional: ${formatOptional(values.internationalExperience)}`,
      `Objetivo principal: ${formatOptional(values.mainGoal)}`,
      `Estilo de personalidade: ${formatOptional(values.personalityStyle)}`,
      `Preferência de trabalho: ${formatOptional(values.personalityPreference)}`,
      `Forma de aprendizado: ${formatOptional(values.learningFormat)}`,
      `Área de interesse: ${formatOptional(values.personalityInterest)}`,
      `Horas de estudo por dia: ${formatOptional(values.studyHoursPerDay)}`,
      `Disponibilidade de estudo: ${formatOptional(values.studyAvailability)}`,
      `Principal desafio: ${formatOptional(values.mainChallenge)}`,
      `Rotina estimada: ${formatOptional(values.routineDuration)}`,
      `Pretende mudar de profissão: ${formatOptional(values.intendsCareerChange)}`,
      `Profissão alvo: ${formatOptional(values.targetProfession)}`,
      `Preferência de curso: ${formatOptional(values.coursePreference)}`,
      `Condição financeira: ${formatOptional(values.financialCondition)}`,
      `Países escolhidos: ${values.preferredCountries.length > 0 ? values.preferredCountries.join(", ") : "Não informado"}`,
    ],
    y
  );

  doc.save("relatorio-completo-ai-career-system.pdf");
}
