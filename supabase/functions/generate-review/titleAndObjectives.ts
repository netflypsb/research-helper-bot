import { generateWithOpenRouter } from './openrouter.ts';

export async function generateTitleAndObjectives(
  description: string,
  literatureReview: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating title and objectives for description:', description.substring(0, 100) + '...');

  const systemPrompt = `You are a medical research proposal expert. Create a comprehensive title and objectives section following this structure:

1. Title (15-20 words):
- Clear and concise representation of the research
- Include key variables or relationships
- Use standard medical/scientific terminology

2. Research Objectives (300-400 words total):

General Objective (100 words):
- State the primary aim of the research
- Use action verbs (e.g., determine, evaluate, assess)
- Align with the research gap identified

Specific Objectives (200-300 words):
- List 3-4 measurable objectives
- Each should contribute to the general objective
- Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
- Begin each with an action verb`;

  try {
    const content = await generateWithOpenRouter(
      `Generate a title and objectives based on:\n\nResearch Description:\n${description}\n\nLiterature Review Context:\n${literatureReview}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated title and objectives');
    return content;
  } catch (error) {
    console.error('Error generating title and objectives:', error);
    throw new Error(`Failed to generate title and objectives: ${error.message}`);
  }
}