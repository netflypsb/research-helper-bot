import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateSearchTerms(description: string, openrouterKey: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
      'HTTP-Referer': 'https://lovable.dev',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [{
        role: 'system',
        content: 'You are a research strategist. Generate relevant search terms for academic research.'
      }, {
        role: 'user',
        content: `Generate 3-5 specific search terms for the following research topic: ${description}`
      }]
    })
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenRouter API for search terms generation');
  }
  return data.choices[0].message.content;
}

async function performSearch(searchTerms: string, serperKey: string) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': serperKey,
    },
    body: JSON.stringify({
      q: searchTerms,
      num: 8
    })
  });

  const data = await response.json();
  return data.organic || [];
}

async function synthesizeLiteratureReview(searchResults: any[], description: string, openrouterKey: string) {
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
      'HTTP-Referer': 'https://lovable.dev',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: `Create a structured literature review for the topic: ${description}\n\nBased on these findings:\n${context}`
      }]
    })
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenRouter API for literature review generation');
  }
  return data.choices[0].message.content;
}

async function generateTitleAndObjectives(description: string, literatureReview: string, openrouterKey: string) {
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
      'HTTP-Referer': 'https://lovable.dev',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: `Generate a title and objectives based on this research description:\n${description}\n\nAnd this literature review:\n${literatureReview}`
      }]
    })
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenRouter API for title and objectives generation');
  }
  return data.choices[0].message.content;
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

    // Fetch API keys for the user
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

    // Create initial research request
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

    // Step 1: Generate search terms and perform literature review
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouter_key);
    console.log('Generated search terms:', searchTerms);

    const searchResults = await performSearch(searchTerms, apiKeys.serper_key);
    console.log('Search results retrieved:', searchResults.length);

    const literatureReview = await synthesizeLiteratureReview(searchResults, description, apiKeys.openrouter_key);
    console.log('Literature review generated successfully');

    // Create literature review component
    const { error: litReviewError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'literature_review',
        content: literatureReview,
        status: 'completed'
      });

    if (litReviewError) {
      throw litReviewError;
    }

    // Step 2: Generate title and objectives based on literature review
    const titleAndObjectives = await generateTitleAndObjectives(description, literatureReview, apiKeys.openrouter_key);
    console.log('Title and objectives generated successfully');

    // Create title and objectives component
    const { error: objectivesError } = await supabaseClient
      .from('research_proposal_components')
      .insert({
        research_request_id: requestData.id,
        component_type: 'title_and_objectives',
        content: titleAndObjectives,
        status: 'completed'
      });

    if (objectivesError) {
      throw objectivesError;
    }

    // Update research request status
    const { error: updateError } = await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        message: 'Research proposal components generated successfully',
        requestId: requestData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});