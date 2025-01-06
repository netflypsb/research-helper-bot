import { generateWithOpenRouter } from './openrouter.ts';

export async function generateTitleAndObjectives(
  description: string,
  literatureReview: string,
  openrouterKey: string
): Promise<string> {
  const systemPrompt = `You are a medical research proposal expert. Based on the provided research description and literature review, generate:

1. Title (10-20 words):
- Concise and descriptive
- Clearly summarizes the research topic and focus
- Reflects the identified research gaps

2. Objectives (100-200 words total):
a) General Objective:
- State the broad goal of the research
- Align with identified research gaps
- Clear and achievable

b) Specific Objectives:
- List 3-4 measurable and precise goals
- Directly related to research questions
- Logically support the general objective`;

  return await generateWithOpenRouter(
    `Generate a title and objectives based on this research description:\n${description}\n\nAnd this literature review:\n${literatureReview}`,
    systemPrompt,
    openrouterKey
  );
}