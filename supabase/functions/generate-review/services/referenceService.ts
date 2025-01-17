import { generateWithOpenRouter } from '../openrouter.ts';
import { ApiKeys } from '../types.ts';

export async function generateAndStoreReferences(
  description: string,
  literatureReview: string,
  requestId: string,
  apiKeys: ApiKeys,
  supabaseClient: any
) {
  console.log('Starting reference generation for request:', requestId);

  const systemPrompt = `You are a medical research reference expert. Create a structured list of references based on the provided literature review and research description. For each reference, provide:

1. Citation in APA format
2. DOI (if available)
3. Publication year
4. Authors
5. Journal/Source
6. Relevance score (1-5)
7. Key findings relevant to the research

Format the output as a JSON array where each reference contains these fields.`;

  try {
    const content = await generateWithOpenRouter(
      `Generate structured references based on:\n\nResearch Description:\n${description}\n\nLiterature Review:\n${literatureReview}`,
      systemPrompt,
      apiKeys.openrouterKey
    );
    
    console.log('Successfully generated references');
    
    // Parse the generated content as JSON
    const references = JSON.parse(content);

    // Store references in the database
    await supabaseClient
      .from('research_proposal_references')
      .insert({
        research_request_id: requestId,
        reference_data: references
      });

    return references;
  } catch (error) {
    console.error('Error generating references:', error);
    throw new Error(`Failed to generate references: ${error.message}`);
  }
}