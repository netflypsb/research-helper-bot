import { generateWithOpenRouter } from './openrouter.ts';

export async function synthesizeLiteratureReview(
  searchResults: any[],
  description: string,
  openrouterKey: string
): Promise<string> {
  console.log('Synthesizing literature review from', searchResults.length, 'search results');
  
  const context = searchResults
    .map(result => result.snippet)
    .join('\n\n');

  const systemPrompt = `You are a medical research synthesizer. Create a comprehensive literature review (1000-1200 words) following this structure:

1. Current State of Knowledge (400-450 words):
- Synthesize key findings from recent research
- Present major theoretical frameworks
- Highlight significant methodologies

2. Critical Analysis (300-350 words):
- Evaluate research quality
- Compare conflicting findings
- Identify methodological strengths/weaknesses

3. Research Gaps (200-250 words):
- Identify unexplored areas
- Point out methodological limitations
- Highlight theoretical gaps

4. Research Justification (100-150 words):
- Connect proposed study to gaps
- Explain potential contributions
- Establish theoretical framework`;

  try {
    const content = await generateWithOpenRouter(
      `Create a structured literature review for: ${description}\n\nBased on these findings:\n${context}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated literature review');
    return content;
  } catch (error) {
    console.error('Error generating literature review:', error);
    throw new Error(`Failed to generate literature review: ${error.message}`);
  }
}