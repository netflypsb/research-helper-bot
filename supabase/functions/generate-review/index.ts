import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders, handleError } from './utils.ts';
import { generateWithOpenRouter } from './openrouter.ts';
import { performSearch } from './serper.ts';
import type { ResearchRequest, ApiKeys } from './types.ts';

async function generateSearchTerms(description: string, openrouterKey: string): Promise<string> {
  const systemPrompt = 'You are a research strategist. Generate relevant search terms for academic research.';
  const prompt = `Generate 3-5 specific search terms for the following research topic: ${description}`;
  
  return await generateWithOpenRouter(prompt, systemPrompt, openrouterKey);
}

async function synthesizeLiteratureReview(
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
- Connect with existing theoretical frameworks

Total word count should be between 1,000-1,500 words.
Use academic language and proper citations where relevant.`;

  return await generateWithOpenRouter(
    `Create a structured literature review for the topic: ${description}\n\nBased on these findings:\n${context}`,
    systemPrompt,
    openrouterKey
  );
}

async function generateTitleAndObjectives(
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
- Logically support the general objective

Format the response with clear headings for Title and Objectives sections.`;

  return await generateWithOpenRouter(
    `Generate a title and objectives based on this research description:\n${description}\n\nAnd this literature review:\n${literatureReview}`,
    systemPrompt,
    openrouterKey
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { description, userId } = await req.json();
    console.log('Received request:', { description, userId });

    // Fetch API keys
    const { data: apiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (apiKeysError || !apiKeys) {
      console.error('API keys error:', apiKeysError);
      return new Response(
        JSON.stringify({ error: 'API keys not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create research request
    const { data: requestData, error: requestError } = await supabaseClient
      .from('research_requests')
      .insert({
        user_id: userId,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (requestError) {
      throw requestError;
    }

    console.log('Starting research process...');

    // Generate search terms and perform search
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouter_key);
    console.log('Generated search terms:', searchTerms);

    const searchResults = await performSearch(searchTerms, apiKeys.serper_key);
    console.log('Search results retrieved:', searchResults.length);

    // Generate literature review
    const literatureReview = await synthesizeLiteratureReview(
      searchResults,
      description,
      apiKeys.openrouter_key
    );
    console.log('Literature review generated');

    // Store literature review
    const { error: litReviewError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'literature_review',
        content: literatureReview,
        status: 'completed'
      });

    if (litReviewError) throw litReviewError;

    // Generate title and objectives
    const titleAndObjectives = await generateTitleAndObjectives(
      description,
      literatureReview,
      apiKeys.openrouter_key
    );
    console.log('Title and objectives generated');

    // Store title and objectives
    const { error: objectivesError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'title_and_objectives',
        content: titleAndObjectives,
        status: 'completed'
      });

    if (objectivesError) throw objectivesError;

    // Update research request status
    const { error: updateError } = await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        message: 'Research proposal components generated successfully',
        requestId: requestData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleError(error);
  }
});