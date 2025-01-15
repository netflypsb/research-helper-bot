import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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

export const exportToPdf = (components: any[]) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Sort components in the desired order
  const orderedTypes = ['title_and_objectives', 'abstract', 'literature_review', 'methodology'];
  const orderedComponents = orderedTypes
    .map(type => components.find(c => c.component_type === type))
    .filter(c => c);
  
  orderedComponents.forEach((component) => {
    // Add section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(getTitle(component.component_type), margin, yPos);
    yPos += 10;
    
    // Add content
    if (component.content) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(component.content, pageWidth - 2 * margin);
      
      splitText.forEach((line: string) => {
        if (yPos > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 7;
      });
      
      yPos += 15;
    }
  });
  
  doc.save('research-proposal.pdf');
};

export const exportToDoc = (components: any[]) => {
  // Sort components in the desired order
  const orderedTypes = ['title_and_objectives', 'abstract', 'literature_review', 'methodology'];
  const orderedComponents = orderedTypes
    .map(type => components.find(c => c.component_type === type))
    .filter(c => c);
  
  let content = '';
  
  orderedComponents.forEach((component) => {
    content += `# ${getTitle(component.component_type)}\n\n`;
    content += `${component.content || ''}\n\n`;
  });
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'research-proposal.doc');
};