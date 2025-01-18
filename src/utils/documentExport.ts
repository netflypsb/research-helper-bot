import { Document, Paragraph, HeadingLevel, Packer, AlignmentType, convertInchesToTwip } from 'docx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Document formatting configuration
const documentConfig = {
  pageSetup: {
    size: {
      width: convertInchesToTwip(8.5),  // Letter width
      height: convertInchesToTwip(11),  // Letter height
    },
    margins: {
      top: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
    },
  },
  defaultStyle: {
    font: "Times New Roman",
    size: 24, // 12pt
    spacing: {
      line: 480, // Double spacing
      before: 240,
      after: 240,
    },
  }
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

const getResearchTitle = (components: any[]): string => {
  const titleComponent = components.find(c => c.component_type === 'title_and_objectives');
  if (titleComponent?.content) {
    const firstLine = titleComponent.content.split('\n')[0];
    const cleanTitle = firstLine.replace(/[#*`]/g, '').trim();
    return cleanTitle || 'Research-Proposal';
  }
  return 'Research-Proposal';
};

const createDocxParagraphs = (content: string) => {
  return content.split('\n\n').map(paragraph => {
    const cleanText = paragraph
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .trim();

    return new Paragraph({
      text: cleanText,
      style: {
        ...documentConfig.defaultStyle,
        alignment: AlignmentType.LEFT,
      },
    });
  });
};

export const exportToDoc = async (components: any[]) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {
          page: documentConfig.pageSetup,
        },
        children: components.map(component => {
          if (!component.content) return [];

          return [
            new Paragraph({
              text: getTitle(component.component_type),
              heading: HeadingLevel.HEADING_1,
              style: {
                ...documentConfig.defaultStyle,
                size: 32, // 16pt for headings
                bold: true,
                alignment: AlignmentType.CENTER,
              },
            }),
            ...createDocxParagraphs(component.content)
          ];
        }).flat()
      }]
    });

    const fileName = `${getResearchTitle(components)}.docx`;
    
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

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(getTitle(component.component_type), margin, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
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