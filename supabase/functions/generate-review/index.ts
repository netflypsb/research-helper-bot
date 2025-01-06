import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProposalComponent {
  type: string;
  prompt: string;
  wordCount: string;
}

const PROPOSAL_COMPONENTS: ProposalComponent[] = [
  {
    type: "title",
    prompt: "Generate a concise and descriptive title for this medical research proposal.",
    wordCount: "10-20 words",
  },
  {
    type: "abstract",
    prompt: "Generate an abstract summarizing the entire proposal, including background, objectives, methodology, expected outcomes, and significance.",
    wordCount: "250-300 words",
  },
  {
    type: "introduction",
    prompt: "Generate an introduction including background information, problem statement, and significance of the study.",
    wordCount: "500-800 words",
  },
  {
    type: "objectives",
    prompt: "Generate research objectives including one general objective and specific measurable goals.",
    wordCount: "100-200 words",
  },
  {
    type: "methodology",
    prompt: "Generate a detailed methodology section including study design, population, sampling methods, data collection, intervention details, statistical analysis, and ethical considerations.",
    wordCount: "1000-1500 words",
  },
  {
    type: "expected_outcomes",
    prompt: "Generate expected outcomes including predicted findings and potential implications.",
    wordCount: "200-300 words",
  },
  {
    type: "work_plan",
    prompt: "Generate a work plan including key milestones and timeline.",
    wordCount: "150-300 words",
  },
  {
    type: "budget",
    prompt: "Generate a budget narrative with breakdown of estimated costs and justification.",
    wordCount: "200-300 words",
  },
];

async function generateComponent(
  openrouterKey: string,
  description: string,
  component: ProposalComponent,
  previousComponents: { type: string; content: string }[]
): Promise<string> {
  const context = previousComponents
    .map(c => `${c.type.toUpperCase()}:\n${c.content}`)
    .join('\n\n');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [
        {
          role: 'system',
          content: `You are a medical research proposal expert. Generate content for the ${component.type} section (${component.wordCount}).`
        },
        {
          role: 'user',
          content: `Research Description: ${description}\n\nPrevious sections:\n${context}\n\n${component.prompt}`
        }
      ]
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

    const { description, userId, requestId } = await req.json();
    console.log('Received request:', { description, userId, requestId });

    // Get API keys
    const { data: apiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (apiKeysError || !apiKeys?.openrouter_key) {
      throw new Error('API keys not found');
    }

    // Initialize components in the database
    for (const component of PROPOSAL_COMPONENTS) {
      await supabaseClient
        .from('research_proposal_components')
        .insert({
          research_request_id: requestId,
          component_type: component.type,
          status: 'pending'
        });
    }

    // Generate components sequentially
    const generatedComponents: { type: string; content: string }[] = [];
    
    for (const component of PROPOSAL_COMPONENTS) {
      console.log(`Generating ${component.type}...`);
      
      try {
        const content = await generateComponent(
          apiKeys.openrouter_key,
          description,
          component,
          generatedComponents
        );

        // Update the component in the database
        await supabaseClient
          .from('research_proposal_components')
          .update({
            content,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('research_request_id', requestId)
          .eq('component_type', component.type);

        generatedComponents.push({ type: component.type, content });
      } catch (error) {
        console.error(`Error generating ${component.type}:`, error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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