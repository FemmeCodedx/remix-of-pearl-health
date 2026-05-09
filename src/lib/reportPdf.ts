import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface SymptomRow {
  date: string;
  symptom: string;
  intensity: number;
  note?: string | null;
}

export interface CycleRow {
  started_on: string;
  ended_on?: string | null;
  flow?: string | null;
}

export interface ReportPdfInput {
  userName: string;
  rangeLabel: string;
  generatedLabel: string;
  symptoms: SymptomRow[];
  cycles: CycleRow[];
  topSymptoms: { label: string; count: number }[];
  copy: {
    title: string;
    generated: string;
    range: string;
    summary: string;
    symptomsLogged: string;
    daysTracked: string;
    topSymptoms: string;
    recent: string;
    cyclesLogged: string;
    avgCycle: string;
    days: string;
    intensity: string;
    noSymptoms: string;
  };
}

const PINK: [number, number, number] = [209, 84, 138]; // hsl(330,55%,57%) approx

export function buildReportPdf(input: ReportPdfInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const page = doc.internal.pageSize;
  const W = page.getWidth();

  // Header band
  doc.setFillColor(...PINK);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(input.copy.title, 40, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${input.copy.generated}: ${input.generatedLabel}`, 40, 50);
  doc.text(`${input.copy.range}: ${input.rangeLabel}`, 40, 62);

  // Body
  doc.setTextColor(40, 40, 40);
  let y = 100;

  // Greeting
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(input.userName, 40, y);
  y += 22;

  // Summary box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(input.copy.summary, 40, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const daysSet = new Set(input.symptoms.map((s) => s.date));
  doc.text(`• ${input.copy.symptomsLogged}: ${input.symptoms.length}`, 50, y); y += 14;
  doc.text(`• ${input.copy.daysTracked}: ${daysSet.size}`, 50, y); y += 14;
  doc.text(`• ${input.copy.cyclesLogged}: ${input.cycles.length}`, 50, y); y += 14;

  // Avg cycle
  if (input.cycles.length >= 2) {
    const sorted = [...input.cycles].sort((a, b) => a.started_on.localeCompare(b.started_on));
    const diffs: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const a = new Date(sorted[i - 1].started_on).getTime();
      const b = new Date(sorted[i].started_on).getTime();
      diffs.push(Math.round((b - a) / (1000 * 60 * 60 * 24)));
    }
    const avg = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    doc.text(`• ${input.copy.avgCycle}: ${avg} ${input.copy.days}`, 50, y); y += 14;
  }

  y += 8;

  // Top symptoms
  if (input.topSymptoms.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(input.copy.topSymptoms, 40, y);
    y += 8;
    autoTable(doc, {
      startY: y,
      head: [["Symptom", "Count"]],
      body: input.topSymptoms.map((s) => [s.label, String(s.count)]),
      headStyles: { fillColor: PINK, textColor: 255 },
      styles: { fontSize: 10, cellPadding: 6 },
      margin: { left: 40, right: 40 },
    });
    y = (doc as any).lastAutoTable.finalY + 16;
  }

  // Recent entries
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(input.copy.recent, 40, y);
  y += 8;

  if (!input.symptoms.length) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(input.copy.noSymptoms, 40, y + 14);
  } else {
    autoTable(doc, {
      startY: y,
      head: [["Date", "Symptom", input.copy.intensity, "Note"]],
      body: input.symptoms
        .slice(0, 80)
        .map((s) => [s.date, s.symptom, "★".repeat(s.intensity), s.note || ""]),
      headStyles: { fillColor: PINK, textColor: 255 },
      styles: { fontSize: 9, cellPadding: 5 },
      margin: { left: 40, right: 40 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 130 },
        2: { cellWidth: 60 },
        3: { cellWidth: "auto" },
      },
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Pearl Femme · ${i} / ${pageCount}`,
      W - 40,
      doc.internal.pageSize.getHeight() - 20,
      { align: "right" }
    );
  }

  return doc;
}
