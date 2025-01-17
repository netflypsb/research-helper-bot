import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function createResearchRequest(
  supabaseClient: any,
  userId: string,
  description: string
) {
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
    console.error('Error creating research request:', requestError);
    throw new Error('Failed to create research request');
  }

  return requestData;
}

export async function validateRequest(description: string, userId: string) {
  if (!description || !userId) {
    throw new Error('Missing required fields');
  }
}