import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function handleQueuePosition(
  supabaseClient: any,
  requestData: any,
  queueData: any
) {
  const { count } = await supabaseClient
    .from('request_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .lt('created_at', queueData.created_at);

  return count;
}

export async function createQueueEntry(
  supabaseClient: any,
  userId: string,
  requestId: string
) {
  const { data: queueData, error: queueError } = await supabaseClient
    .from('request_queue')
    .insert({
      user_id: userId,
      research_request_id: requestId,
      status: 'pending'
    })
    .select()
    .single();

  if (queueError) {
    console.error('Error adding to queue:', queueError);
    throw new Error('Failed to queue request');
  }

  return queueData;
}