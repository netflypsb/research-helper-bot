import { generateWithOpenRouter } from './openrouter.ts';

export async function generateSearchTerms(description: string, openrouterKey: string): Promise<string> {
  console.log('Generating search terms for description:', description);
  
  if (!openrouterKey) {
    throw new Error('OpenRouter API key is required for search terms generation');
  }

  const systemPrompt = 'You are a research strategist. Generate relevant search terms for academic research.';
  const prompt = `Generate 3-5 specific search terms for the following research topic: ${description}`;
  
  try {
    const terms = await generateWithOpenRouter(prompt, systemPrompt, openrouterKey);
    console.log('Generated search terms:', terms);
    return terms;
  } catch (error) {
    console.error('Error generating search terms:', error);
    throw new Error(`Failed to generate search terms: ${error.message}`);
  }
}