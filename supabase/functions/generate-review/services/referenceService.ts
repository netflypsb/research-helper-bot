import { generateWithOpenRouter } from '../openrouter.ts';
import { ApiKeys } from '../types.ts';

interface Reference {
  citation: string;
  doi?: string;
  year: number;
  authors: string[];
  journal: string;
  relevanceScore: number;
  keyFindings: string;
}

export async function generateAndStoreReferences(
  description: string,
  literatureReview: string,
  requestId: string,
  apiKeys: ApiKeys,
  supabaseClient: any
) {
  console.log('Starting reference generation for request:', requestId);

  const systemPrompt = `You are a medical research reference expert. Generate a JSON array of references based on the provided research description and literature review. Each reference must strictly follow this format:
{
  "citation": "Full APA format citation",
  "doi": "DOI string or null if not available",
  "year": number (e.g. 2024),
  "authors": ["array", "of", "author", "names"],
  "journal": "journal name",
  "relevanceScore": number between 1 and 5,
  "keyFindings": "brief description of key findings"
}

Important rules:
1. Return ONLY a valid JSON array
2. Every object MUST have all required fields
3. Year must be a valid number
4. Authors must be a non-empty array of strings
5. RelevanceScore must be between 1 and 5
6. All text fields must be non-empty strings`;

  try {
    const content = await generateWithOpenRouter(
      `Generate structured references based on:\n\nResearch Description:\n${description}\n\nLiterature Review:\n${literatureReview}`,
      systemPrompt,
      apiKeys.openrouterKey
    );
    
    console.log('Raw OpenRouter response:', content);
    
    // Clean the response
    let cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\s*\[\s*\n/, '[')
      .replace(/\s*\]\s*$/, ']')
      .replace(/^\s*/, '')
      .replace(/\s*$/, '')
      .trim();

    // Extract JSON array if needed
    if (!cleanedContent.startsWith('[') || !cleanedContent.endsWith(']')) {
      const match = cleanedContent.match(/\[[\s\S]*\]/);
      if (match) {
        cleanedContent = match[0];
      } else {
        throw new Error('Could not find valid JSON array in response');
      }
    }

    console.log('Cleaned content:', cleanedContent);
    
    let references: Reference[];
    try {
      references = JSON.parse(cleanedContent);
      console.log('Successfully parsed references:', references);
    } catch (parseError) {
      console.error('Error parsing references JSON:', parseError);
      throw new Error(`Failed to parse references JSON: ${parseError.message}`);
    }

    // Validate array structure
    if (!Array.isArray(references)) {
      throw new Error('References must be an array');
    }

    // Validate each reference object
    references.forEach((ref, index) => {
      console.log(`Validating reference ${index}:`, ref);
      
      if (!ref || typeof ref !== 'object') {
        throw new Error(`Invalid reference at index ${index}: not an object`);
      }

      // Validate required string fields
      ['citation', 'journal', 'keyFindings'].forEach(field => {
        if (!ref[field] || typeof ref[field] !== 'string' || ref[field].trim() === '') {
          throw new Error(`Invalid reference at index ${index}: missing or invalid ${field}`);
        }
      });

      // Validate year
      if (!ref.year || typeof ref.year !== 'number' || ref.year < 1900 || ref.year > new Date().getFullYear()) {
        throw new Error(`Invalid reference at index ${index}: invalid year`);
      }

      // Validate authors array
      if (!Array.isArray(ref.authors) || ref.authors.length === 0 || 
          !ref.authors.every(author => typeof author === 'string' && author.trim() !== '')) {
        throw new Error(`Invalid reference at index ${index}: invalid authors array`);
      }

      // Validate relevanceScore
      if (typeof ref.relevanceScore !== 'number' || ref.relevanceScore < 1 || ref.relevanceScore > 5) {
        throw new Error(`Invalid reference at index ${index}: invalid relevanceScore`);
      }

      // Validate DOI if present
      if (ref.doi !== undefined && ref.doi !== null && (typeof ref.doi !== 'string' || ref.doi.trim() === '')) {
        throw new Error(`Invalid reference at index ${index}: invalid DOI format`);
      }
    });

    console.log('All references validated successfully');

    // Store references in the database
    const { error: insertError } = await supabaseClient
      .from('research_proposal_references')
      .insert({
        research_request_id: requestId,
        reference_data: references
      });

    if (insertError) {
      console.error('Error inserting references:', insertError);
      throw new Error(`Failed to store references: ${insertError.message}`);
    }

    console.log('References stored successfully');
    return references;
  } catch (error) {
    console.error('Error in generateAndStoreReferences:', error);
    throw new Error(`Failed to generate references: ${error.message}`);
  }
}