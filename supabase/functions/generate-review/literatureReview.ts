import { generateWithOpenRouter } from './openrouter.ts';

export async function synthesizeLiteratureReview(
  searchResults: any[],
  description: string,
  openrouterKey: string
): Promise<string> {
  const context = searchResults.map(result => result.snippet).join('\n');
  const systemPrompt = `You are a research synthesizer tasked with creating comprehensive literature reviews. 
Follow this structure strictly:

1. Title: "Literature Review: [Research Topic]"

2. Overview of Relevant Studies (400-500 words):
- Synthesize and present key findings from recent research
- Highlight methodologies used
- Present major theoretical frameworks

3. Identification of Research Gaps (300-400 words):
- Analyze limitations in current research
- Identify unexplored areas
- Point out methodological gaps

4. Building on Existing Work (300-400 words):
- Explain how the proposed study addresses identified gaps
- Discuss potential contributions to the field
- Connect with existing theoretical frameworks`;

  return await generateWithOpenRouter(
    `Create a structured literature review for the topic: ${description}\n\nBased on these findings:\n${context}`,
    systemPrompt,
    openrouterKey
  );
}