import { generateWithOpenRouter } from './openrouter.ts';

export async function generateAbstract(
  titleAndObjectives: string,
  literatureReview: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating abstract based on provided components');

  const systemPrompt = `You are a medical research abstract expert. Create a structured abstract (300-350 words) following this format:

Background (100 words):
- Provide context from literature review
- Identify the research gap
- Establish the significance

Objectives (50 words):
- State the primary research aim
- List key specific objectives

Methods (100 words):
- Summarize study design
- Describe population/sample
- Outline key procedures
- Mention analysis approach

Expected Outcomes (50 words):
- Describe anticipated findings
- Highlight potential impact

Keywords (5-7 terms):
- Include relevant MeSH terms
- List in order of relevance`;

  try {
    const content = await generateWithOpenRouter(
      `Generate a structured abstract based on:\n\nTitle and Objectives:\n${titleAndObjectives}\n\nLiterature Review:\n${literatureReview}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated abstract');
    return content;
  } catch (error) {
    console.error('Error generating abstract:', error);
    throw new Error(`Failed to generate abstract: ${error.message}`);
  }
}