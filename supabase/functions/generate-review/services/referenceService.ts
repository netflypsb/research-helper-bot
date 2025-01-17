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

  const systemPrompt = `You are a medical research reference expert. Create a structured list of references based on the provided literature review and research description. Return ONLY a valid JSON array where each reference contains these fields:

{
  "citation": "string (APA format)",
  "doi": "string (optional)",
  "year": number,
  "authors": string[],
  "journal": "string",
  "relevanceScore": number (1-5),
  "keyFindings": "string"
}

Do not include any markdown formatting, code blocks, or explanatory text. Return only the JSON array.`;

  try {
    const content = await generateWithOpenRouter(
      `Generate structured references based on:\n\nResearch Description:\n${description}\n\nLiterature Review:\n${literatureReview}`,
      systemPrompt,
      apiKeys.openrouterKey
    );
    
    console.log('Raw OpenRouter response:', content);
    
    // Clean up the response - remove any markdown formatting if present
    const cleanedContent = content.replace(/\`\`\`json|\`\`\`|\n/g, '').trim();
    console.log('Cleaned content:', cleanedContent);
    
    // Parse the cleaned JSON
    let references;
    try {
      references = JSON.parse(cleanedContent);
      console.log('Successfully parsed references:', references);
    } catch (parseError) {
      console.error('Error parsing references JSON:', parseError);
      throw new Error(`Failed to parse references JSON: ${parseError.message}`);
    }

    // Validate the references structure
    if (!Array.isArray(references)) {
      throw new Error('References must be an array');
    }

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