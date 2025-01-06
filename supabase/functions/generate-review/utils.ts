export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handleError(error: any) {
  console.error('Error details:', error);
  const message = error.message || 'An unexpected error occurred';
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}