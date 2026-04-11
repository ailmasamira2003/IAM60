import { jsPDF } from "jspdf";
import {
  buildDevelopmentSkills,
  buildReportMetrics,
  buildStudyPlan,
  getLeadCountry,
  type PlusSubscriber,
} from "@/lib/plus-content";
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
  return trimmed.length > 0 ? trimmed : "Nao informado";
}

export function exportCareerResultPdf(
  values: CareerFormValues,
  result: CareerResult,
  subscriber?: PlusSubscriber
): void {
  const metrics = buildReportMetrics(values, result);
  const skills = buildDevelopmentSkills(values, result);
  const studyPlan = buildStudyPlan(values, result);
  const leadCountry = getLeadCountry(values, result);
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AILA - Relatorio Completo", 20, 20);

  let y = 30;

  if (subscriber) {
    y = addParagraph(doc, `Nome: ${subscriber.fullName}`, y);
    y = addParagraph(doc, `E-mail: ${subscriber.email}`, y);
    y += 2;
  }

  y = addParagraph(doc, result.summary, y);
  y = addParagraph(
    doc,
    `Pais ancora sugerido: ${leadCountry}. Este PDF consolida o formulario, os percentuais avaliados e as prioridades do plano premium demonstrativo.`,
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Perfil de personalidade", y);
  y = addParagraph(
    doc,
    `${result.personalityProfile.title} (${result.personalityProfile.code})`,
    y
  );
  y = addParagraph(doc, result.personalityProfile.description, y);
  y = addList(
    doc,
    result.personalityProfile.strengths.map((item) => `Ponto forte: ${item}`),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Nivel de prontidao", y);
  y = addParagraph(doc, `Prontidao estimada: ${result.readinessLevel}%`, y);

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Aspectos avaliados", y);
  y = addList(
    doc,
    metrics.map(
      (metric) => `${metric.label}: ${metric.value}% - ${metric.description}`
    ),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Habilidades para desenvolver", y);
  y = addList(
    doc,
    skills.map(
      (skill) => `${skill.skill}: ${skill.reason} Proxima acao: ${skill.action}`
    ),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Plano inicial em dias", y);
  y = addList(
    doc,
    studyPlan.map(
      (day) => `Dia ${day.day} - ${day.title}: ${day.focus} Entrega: ${day.outcome}`
    ),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Paises com melhor compatibilidade", y);
  y = addList(
    doc,
    result.countryMatches.map(
      (match) => `${match.country} (${match.compatibility}%): ${match.reason}`
    ),
    y
  );

  y = ensurePage(doc, y + 3);
  y = addTitle(doc, "Respostas do formulario", y);
  addList(
    doc,
    [
      `Idade: ${values.age ?? "Nao informado"}`,
      `Escolaridade: ${formatOptional(values.education)}`,
      `Trabalhando atualmente: ${formatOptional(values.currentlyWorking)}`,
      `Atua na area de formacao: ${formatOptional(values.workInGraduationArea)}`,
      `Profissao atual: ${formatOptional(values.currentProfession)}`,
      `Ingles: ${formatOptional(values.englishLevel)}`,
      `Experiencia internacional: ${formatOptional(values.internationalExperience)}`,
      `Objetivo principal: ${formatOptional(values.mainGoal)}`,
      `Estilo de personalidade: ${formatOptional(values.personalityStyle)}`,
      `Preferencia de trabalho: ${formatOptional(values.personalityPreference)}`,
      `Forma de aprendizado: ${formatOptional(values.learningFormat)}`,
      `Area de interesse: ${formatOptional(values.personalityInterest)}`,
      `Horas de estudo por dia: ${formatOptional(values.studyHoursPerDay)}`,
      `Disponibilidade de estudo: ${formatOptional(values.studyAvailability)}`,
      `Principal desafio: ${formatOptional(values.mainChallenge)}`,
      `Rotina estimada: ${formatOptional(values.routineDuration)}`,
      `Pretende mudar de profissao: ${formatOptional(values.intendsCareerChange)}`,
      `Profissao alvo: ${formatOptional(values.targetProfession)}`,
      `Preferencia de curso: ${formatOptional(values.coursePreference)}`,
      `Condicao financeira: ${formatOptional(values.financialCondition)}`,
      `Paises escolhidos: ${
        values.preferredCountries.length > 0
          ? values.preferredCountries.join(", ")
          : "Nao informado"
      }`,
    ],
    y
  );

  doc.save("relatorio-completo-aila.pdf");
}
