import { Document, Paragraph, HeadingLevel, Packer } from 'docx';
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

const getResearchTitle = (components: any[]): string => {
  const titleComponent = components.find(c => c.component_type === 'title_and_objectives');
  if (titleComponent?.content) {
    // Extract the first line which is typically the title
    const firstLine = titleComponent.content.split('\n')[0];
    // Remove markdown formatting if present
    const cleanTitle = firstLine.replace(/[#*`]/g, '').trim();
    return cleanTitle || 'Research-Proposal';
  }
  return 'Research-Proposal';
};

const createDocxParagraphs = (content: string) => {
  // Split content into paragraphs
  return content.split('\n\n').map(paragraph => {
    // Remove markdown formatting
    const cleanText = paragraph
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
      .trim();

    return new Paragraph({
      text: cleanText,
    });
  });
};

export const exportToDoc = async (components: any[]) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: components.map(component => {
          if (!component.content) return [];

          return [
            new Paragraph({
              text: getTitle(component.component_type),
              heading: HeadingLevel.HEADING_1,
            }),
            ...createDocxParagraphs(component.content)
          ];
        }).flat()
      }]
    });

    const fileName = `${getResearchTitle(components)}.docx`;
    
    // Generate the .docx file
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating DOCX:', error);
  }
};

export const exportToPdf = (components: any[]) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const fileName = `${getResearchTitle(components)}.pdf`;
  
  components.forEach((component) => {
    if (!component.content) return;

    // Add section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(getTitle(component.component_type), margin, yPos);
    yPos += 10;
    
    // Add content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Remove markdown formatting
    const cleanContent = component.content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1');

    const splitText = doc.splitTextToSize(cleanContent, pageWidth - 2 * margin);
    
    splitText.forEach((line: string) => {
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 7;
    });
    
    yPos += 15;
  });
  
  doc.save(fileName);
};