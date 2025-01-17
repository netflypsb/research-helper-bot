import { generateAndStoreSearchResults } from './services/researchService.ts';
import { generateProposalComponents } from './services/proposalService.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function coordinateResearchGeneration(
  description: string,
  userId: string,
  requestId: string,
  apiKeys: { openrouterKey: string; serperKey: string }
) {
  console.log('Starting research generation process for request:', requestId);
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Step 1: Generate and store search results
    console.log('Performing literature search...');
    const { searchResults } = await generateAndStoreSearchResults(
      description,
      requestId,
      apiKeys,
      supabaseClient
    );

    // Step 2: Generate all proposal components
    console.log('Generating research proposal components...');
    await generateProposalComponents(
      description,
      searchResults,
      requestId,
      apiKeys,
      supabaseClient
    );

    // Update research request status
    await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    console.log('Research generation process completed successfully');
    return true;
  } catch (error) {
    console.error('Error in research generation process:', error);
    
    // Update research request status to failed
    await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    throw error;
  }
}