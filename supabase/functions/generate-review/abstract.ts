import { generateWithOpenRouter } from './openrouter.ts';

export async function generateAbstract(
  titleAndObjectives: string,
  literatureReview: string,
  openrouterKey: string
): Promise<string> {
  const systemPrompt = `You are a medical research proposal expert. Create a comprehensive abstract based on the provided title, objectives, and literature review.

Guidelines:
- Length: 250-300 words
- Structure: Include background, objectives, methodology, expected outcomes, and significance
- Style: Clear, concise, and professional academic writing
- Focus on synthesizing the key points from the provided context

The abstract should effectively summarize the entire research proposal while maintaining academic rigor and clarity.`;

  return await generateWithOpenRouter(
    `Generate an abstract based on these components:\n\nTitle and Objectives:\n${titleAndObjectives}\n\nLiterature Review:\n${literatureReview}`,
    systemPrompt,
    openrouterKey
  );
}