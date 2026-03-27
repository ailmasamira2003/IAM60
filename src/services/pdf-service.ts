import { jsPDF } from "jspdf";
import type { CareerFormValues, CareerResult } from "@/types/career";

function drawPieChartAsImage(
  slices: CareerResult["profileChart"],
  size = 220
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  const total = slices.reduce((acc, item) => acc + item.value, 0);
  let startAngle = -Math.PI / 2;

  slices.forEach((slice) => {
    const angle = (slice.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;

    ctx.beginPath();
    ctx.moveTo(size / 2, size / 2);
    ctx.arc(size / 2, size / 2, size / 2 - 10, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();

    startAngle = endAngle;
  });

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  return canvas.toDataURL("image/png");
}

function addList(
  doc: jsPDF,
  title: string,
  values: string[],
  y: number,
  left = 20
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(title, left, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let cursor = y + 6;
  values.forEach((value) => {
    const lines = doc.splitTextToSize(`- ${value}`, 165);
    doc.text(lines, left, cursor);
    cursor += lines.length * 5 + 1;
  });

  return cursor + 3;
}

function ensurePage(doc: jsPDF, currentY: number, threshold = 270): number {
  if (currentY < threshold) {
    return currentY;
  }

  doc.addPage();
  return 20;
}

export function exportCareerResultPdf(
  values: CareerFormValues,
  result: CareerResult
): void {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AI CAREER SYSTEM - Relatório Internacional", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const intro = doc.splitTextToSize(result.summary, 170);
  doc.text(intro, 20, 30);

  doc.setFont("helvetica", "bold");
  doc.text(
    `Objetivo: ${values.mainGoal} | Prontidão: ${result.readinessLevel}%`,
    20,
    44
  );

  const chartImage = drawPieChartAsImage(result.profileChart);
  if (chartImage) {
    doc.addImage(chartImage, "PNG", 20, 50, 55, 55);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let legendY = 60;
  result.profileChart.forEach((slice) => {
    doc.setFillColor(slice.color);
    doc.rect(82, legendY - 3.5, 4, 4, "F");
    doc.text(`${slice.name}: ${slice.value}%`, 89, legendY);
    legendY += 7;
  });

  let currentY = 114;
  currentY = addList(doc, "Carreiras sugeridas", result.suggestedCareers, currentY);
  currentY = ensurePage(doc, currentY);
  currentY = addList(
    doc,
    "Países recomendados",
    result.recommendedCountries,
    currentY
  );
  currentY = ensurePage(doc, currentY);
  currentY = addList(doc, "Plano de ação", result.roadmap, currentY);
  currentY = ensurePage(doc, currentY);
  currentY = addList(doc, "Principais lacunas", result.topGaps, currentY);
  currentY = ensurePage(doc, currentY);
  currentY = addList(
    doc,
    "Bolsas compatíveis",
    result.scholarships.map(
      (scholarship) =>
        `${scholarship.name} (${scholarship.country}) - ${scholarship.coverage}`
    ),
    currentY
  );
  currentY = ensurePage(doc, currentY);
  addList(
    doc,
    "Universidades e programas",
    result.universities.map(
      (item) =>
        `${item.university} - ${item.program} (${item.country}, ${item.duration})`
    ),
    currentY
  );

  doc.save("ai-career-system-relatorio.pdf");
}

