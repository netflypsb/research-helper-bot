import { generateWithOpenRouter } from './openrouter.ts';
import { LiteratureSchema } from './types.ts';

export async function generateSearchTerms(description: string, openrouterKey: string): Promise<LiteratureSchema> {
  console.log('Generating search terms for description:', description);
  
  if (!openrouterKey) {
    throw new Error('OpenRouter API key is required for search terms generation');
  }

  const systemPrompt = `You are a research strategist specialized in medical literature. Generate a structured search strategy following these guidelines:

1. Analyze the research topic
2. Identify key concepts and terms
3. Include relevant MeSH terms where applicable
4. Consider synonyms and alternative terms
5. Structure queries from most specific to broader context`;

  const prompt = `For the following research topic, generate:
1. A list of 3-5 specific search queries
2. Key subtopics to explore
3. Essential medical terms and concepts

Research topic: ${description}

Format the response as a structured list with clear sections.`;
  
  try {
    const response = await generateWithOpenRouter(prompt, systemPrompt, openrouterKey);
    console.log('Generated search strategy:', response);

    // Parse the response to extract queries
    const lines = response.split('\n').filter(line => line.trim());
    const queries = lines
      .filter(line => line.match(/^[\d\.-]\s+/)) // Lines starting with numbers
      .map(line => ({
        queryText: line.replace(/^[\d\.-]\s+/, '').trim(),
        priority: 'high' as const
      }));

    // Extract key terms and subtopics
    const keyTerms = lines
      .filter(line => line.toLowerCase().includes('term') || line.toLowerCase().includes('concept'))
      .map(line => line.replace(/^[^:]+:\s*/, '').trim());

    const subtopics = lines
      .filter(line => line.toLowerCase().includes('subtopic'))
      .map(line => line.replace(/^[^:]+:\s*/, '').trim());

    const schema: LiteratureSchema = {
      metadata: {
        topic: description,
        subtopics: subtopics.length > 0 ? subtopics : [],
        keyTerms: keyTerms.length > 0 ? keyTerms : []
      },
      queries: queries.length > 0 ? queries : [
        {
          queryText: description,
          priority: 'high' as const
        }
      ]
    };

    console.log('Structured search schema:', schema);
    return schema;
  } catch (error) {
    console.error('Error generating search terms:', error);
    // Fallback to a basic schema if generation fails
    return {
      metadata: {
        topic: description,
        subtopics: [],
        keyTerms: []
      },
      queries: [{
        queryText: description,
        priority: 'high' as const
      }]
    };
  }
}