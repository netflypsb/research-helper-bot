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

  const systemPrompt = `You are a medical research reference expert. Your task is to return ONLY a raw JSON array of references. Do not include any explanatory text, markdown formatting, or code blocks.

Each object in the array must strictly follow this format:
{
  "citation": "string containing APA format citation",
  "doi": "string or null",
  "year": number,
  "authors": ["array", "of", "author", "names"],
  "journal": "string",
  "relevanceScore": number between 1 and 5,
  "keyFindings": "string"
}

Remember:
1. Return ONLY the JSON array
2. No markdown, no \`\`\`json\`\`\` wrapper
3. No explanations or additional text`;

  try {
    const content = await generateWithOpenRouter(
      `Generate structured references based on:\n\nResearch Description:\n${description}\n\nLiterature Review:\n${literatureReview}`,
      systemPrompt,
      apiKeys.openrouterKey
    );
    
    console.log('Raw OpenRouter response:', content);
    
    // More aggressive cleaning of the response
    let cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\s*\[\s*\n/, '[')  // Clean leading whitespace and newlines
      .replace(/\s*\]\s*$/, ']')    // Clean trailing whitespace
      .replace(/^\s*/, '')          // Remove any remaining leading whitespace
      .replace(/\s*$/, '')          // Remove any remaining trailing whitespace
      .trim();

    // If the content doesn't start with [ and end with ], attempt to extract the JSON array
    if (!cleanedContent.startsWith('[') || !cleanedContent.endsWith(']')) {
      const match = cleanedContent.match(/\[[\s\S]*\]/);
      if (match) {
        cleanedContent = match[0];
      }
    }

    console.log('Cleaned content:', cleanedContent);
    
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

    // Validate each reference object
    references.forEach((ref, index) => {
      if (!ref.citation || !ref.year || !Array.isArray(ref.authors) || !ref.journal) {
        throw new Error(`Invalid reference object at index ${index}`);
      }
    });

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