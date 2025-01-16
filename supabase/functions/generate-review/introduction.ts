import { generateWithOpenRouter } from './openrouter.ts';

export async function generateIntroduction(
  description: string,
  literatureReview: string,
  titleAndObjectives: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating introduction for description:', description.substring(0, 100) + '...');

  const systemPrompt = `You are a medical research proposal expert. Create a comprehensive introduction section following this structure:

1. Background (200-250 words):
- Historical context and developments
- Recent advancements in the field
- Current state of knowledge

2. Research Context (200-250 words):
- Broader implications of the research
- Relevance to the field
- Connection to existing literature

3. Research Significance (150-200 words):
- Importance of addressing the research problem
- Potential impact on the field
- Benefits to stakeholders

4. Research Gap (150-200 words):
- Clear identification of knowledge gaps
- How this research addresses these gaps
- Justification for the study`;

  try {
    const content = await generateWithOpenRouter(
      `Generate an introduction based on:\n\nResearch Description:\n${description}\n\nLiterature Review Context:\n${literatureReview}\n\nTitle and Objectives Context:\n${titleAndObjectives}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated introduction');
    return content;
  } catch (error) {
    console.error('Error generating introduction:', error);
    throw new Error(`Failed to generate introduction: ${error.message}`);
  }
}