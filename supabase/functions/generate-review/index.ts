import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Agent, Crew, Task } from 'https://esm.sh/crewai-sdk@0.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Fetch API keys for the user
    const { data: apiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (apiKeysError || !apiKeys) {
      return new Response(
        JSON.stringify({ error: 'API keys not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize CrewAI agents
    const strategist = new Agent({
      role: 'Research Strategist',
      goal: 'Develop search strategies based on user input',
      backstory: 'Expert in formulating effective research queries',
      llmConfig: {
        apiKey: apiKeys.openrouter_key,
        baseURL: 'https://openrouter.ai/api/v1',
      },
    });

    const searcher = new Agent({
      role: 'Literature Searcher',
      goal: 'Retrieve relevant research papers',
      backstory: 'Skilled in navigating academic databases',
      tools: {
        serpApi: { apiKey: apiKeys.serp_key },
        serperDev: { apiKey: apiKeys.serper_key },
      },
    });

    const synthesizer = new Agent({
      role: 'Review Synthesizer',
      goal: 'Summarize and synthesize research findings',
      backstory: 'Adept at creating coherent literature reviews',
      llmConfig: {
        apiKey: apiKeys.openrouter_key,
        baseURL: 'https://openrouter.ai/api/v1',
      },
    });

    // Create tasks
    const tasks = [
      new Task({
        description: 'Generate optimized search terms based on the research description',
        agent: strategist,
      }),
      new Task({
        description: 'Perform literature search using the generated terms',
        agent: searcher,
      }),
      new Task({
        description: 'Synthesize findings into a comprehensive review',
        agent: synthesizer,
      }),
    ];

    // Create and execute crew
    const crew = new Crew({
      agents: [strategist, searcher, synthesizer],
      tasks: tasks,
    });

    const result = await crew.execute();

    // Update research request with result
    const { error: updateError } = await supabaseClient
      .from('research_requests')
      .update({ 
        status: 'completed',
        result: result,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('description', description);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});