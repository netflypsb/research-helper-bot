import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export const exportToPdf = (components: any[]) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  components.forEach((component) => {
    // Add title
    doc.setFontSize(14);
    doc.text(getTitle(component.component_type), margin, yPos);
    yPos += 10;
    
    // Add content
    if (component.content) {
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(component.content, pageWidth - 2 * margin);
      
      splitText.forEach((line: string) => {
        if (yPos > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 7;
      });
      
      yPos += 10;
    }
  });
  
  doc.save('research-proposal.pdf');
};

export const exportToDoc = (components: any[]) => {
  let content = '';
  
  components.forEach((component) => {
    content += `# ${getTitle(component.component_type)}\n\n`;
    content += `${component.content || ''}\n\n`;
  });
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'research-proposal.doc');
};

const getTitle = (type: string) => {
  switch (type) {
    case 'literature_review':
      return 'Literature Review';
    case 'title_and_objectives':
      return 'Title & Objectives';
    case 'methodology':
      return 'Methodology';
    case 'abstract':
      return 'Abstract';
    default:
      return type;
  }
};