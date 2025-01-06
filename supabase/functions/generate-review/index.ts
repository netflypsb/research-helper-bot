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
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
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
  return data.choices[0].message.content;
}

async function performSearch(searchTerms: string, serpKey: string, serperKey: string) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': serperKey,
    },
    body: JSON.stringify({
      q: searchTerms,
      num: 8 // Increased number of results for better coverage
    })
  });

  const data = await response.json();
  return data.organic;
}

async function synthesizeResults(searchResults: any[], description: string, openrouterKey: string) {
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
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
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

    console.log('Starting research process...');

    // Step 1: Generate search terms
    const searchTerms = await generateSearchTerms(description, apiKeys.openrouter_key);
    console.log('Generated search terms:', searchTerms);

    // Step 2: Perform search
    const searchResults = await performSearch(searchTerms, apiKeys.serp_key, apiKeys.serper_key);
    console.log('Search results retrieved:', searchResults.length);

    // Step 3: Synthesize results
    const review = await synthesizeResults(searchResults, description, apiKeys.openrouter_key);
    console.log('Review generated successfully');

    // Update research request with result
    const { error: updateError } = await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        result: review,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('description', description);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ result: review }),
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