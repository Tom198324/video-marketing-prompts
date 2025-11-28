import { jsPDF } from 'jspdf';

export interface ValidationResult {
  title: string;
  analysis: {
    overall_score: number;
    overall_assessment: string;
    section_scores?: Record<string, number>;
    section_analysis?: Record<string, { strengths: string[]; weaknesses: string[] }>;
    priority_improvements?: string[];
    penalties_applied?: string[];
  };
  isValid: boolean;
  recommendation: string;
}

export function exportToMarkdown(result: ValidationResult): string {
  const { title, analysis, recommendation } = result;
  
  let markdown = `# Validation Report: ${title}\n\n`;
  markdown += `**Overall Score:** ${analysis.overall_score}/10\n\n`;
  markdown += `**Quality Badge:** ${getQualityBadgeText(analysis.overall_score)}\n\n`;
  markdown += `**Recommendation:** ${recommendation}\n\n`;
  markdown += `---\n\n`;
  
  markdown += `## Overall Assessment\n\n`;
  markdown += `${analysis.overall_assessment}\n\n`;
  markdown += `---\n\n`;
  
  if (analysis.section_scores) {
    markdown += `## Section Scores\n\n`;
    Object.entries(analysis.section_scores).forEach(([section, score]) => {
      markdown += `- **${formatSectionName(section)}:** ${score}/10\n`;
    });
    markdown += `\n---\n\n`;
  }
  
  if (analysis.section_analysis) {
    markdown += `## Detailed Section Analysis\n\n`;
    Object.entries(analysis.section_analysis).forEach(([section, details]) => {
      markdown += `### ${formatSectionName(section)}\n\n`;
      
      if (details.strengths && details.strengths.length > 0) {
        markdown += `**Strengths:**\n`;
        details.strengths.forEach(strength => {
          markdown += `- ✅ ${strength}\n`;
        });
        markdown += `\n`;
      }
      
      if (details.weaknesses && details.weaknesses.length > 0) {
        markdown += `**Weaknesses:**\n`;
        details.weaknesses.forEach(weakness => {
          markdown += `- ❌ ${weakness}\n`;
        });
        markdown += `\n`;
      }
    });
    markdown += `---\n\n`;
  }
  
  if (analysis.penalties_applied && analysis.penalties_applied.length > 0) {
    markdown += `## Penalties Applied\n\n`;
    analysis.penalties_applied.forEach(penalty => {
      markdown += `- ⚠️ ${penalty}\n`;
    });
    markdown += `\n---\n\n`;
  }
  
  if (analysis.priority_improvements && analysis.priority_improvements.length > 0) {
    markdown += `## Priority Improvements\n\n`;
    analysis.priority_improvements.forEach((improvement, idx) => {
      markdown += `${idx + 1}. ${improvement}\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `---\n\n`;
  markdown += `*Report generated on ${new Date().toLocaleString()}*\n`;
  
  return markdown;
}

export function exportToPDF(result: ValidationResult): void {
  const { title, analysis, recommendation } = result;
  
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Validation Report', margin, yPos);
  yPos += lineHeight * 2;
  
  // Prompt Title
  doc.setFontSize(14);
  doc.text(title, margin, yPos);
  yPos += lineHeight * 1.5;
  
  // Overall Score
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Score: ${analysis.overall_score}/10`, margin, yPos);
  yPos += lineHeight;
  
  // Quality Badge
  const badgeText = getQualityBadgeText(analysis.overall_score);
  doc.text(`Quality: ${badgeText}`, margin, yPos);
  yPos += lineHeight;
  
  // Recommendation
  doc.text(`Recommendation: ${recommendation}`, margin, yPos);
  yPos += lineHeight * 2;
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += lineHeight;
  
  // Overall Assessment
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Assessment', margin, yPos);
  yPos += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const assessmentLines = doc.splitTextToSize(analysis.overall_assessment, maxWidth);
  assessmentLines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, margin, yPos);
    yPos += lineHeight;
  });
  yPos += lineHeight;
  
  // Section Scores
  if (analysis.section_scores) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Section Scores', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    Object.entries(analysis.section_scores).forEach(([section, score]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${formatSectionName(section)}: ${score}/10`, margin + 5, yPos);
      yPos += lineHeight;
    });
    yPos += lineHeight;
  }
  
  // Priority Improvements
  if (analysis.priority_improvements && analysis.priority_improvements.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Priority Improvements', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysis.priority_improvements.forEach((improvement, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const improvementLines = doc.splitTextToSize(`${idx + 1}. ${improvement}`, maxWidth - 5);
      improvementLines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin + 5, yPos);
        yPos += lineHeight;
      });
    });
    yPos += lineHeight;
  }
  
  // Penalties
  if (analysis.penalties_applied && analysis.penalties_applied.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Penalties Applied', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysis.penalties_applied.forEach((penalty) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const penaltyLines = doc.splitTextToSize(`• ${penalty}`, maxWidth - 5);
      penaltyLines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin + 5, yPos);
        yPos += lineHeight;
      });
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Save
  const filename = `validation-report-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getQualityBadgeText(score: number): string {
  if (score >= 9) return 'Gold (9-10)';
  if (score >= 7) return 'Silver (7-8.9)';
  if (score >= 5) return 'Bronze (5-6.9)';
  return 'Poor (<5)';
}

function formatSectionName(section: string): string {
  return section
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
