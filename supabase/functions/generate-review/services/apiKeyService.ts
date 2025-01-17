export async function handleApiKeys(
  supabaseClient: any,
  userId: string,
  useMedResearchKeys: boolean
) {
  let apiKeys;

  if (useMedResearchKeys) {
    console.log('Using MedResearch API keys');
    const openrouterKey = Deno.env.get('MEDRESEARCH_OPENROUTER_KEY');
    const serperKey = Deno.env.get('MEDRESEARCH_SERPER_KEY');
    
    if (!openrouterKey || !serperKey) {
      throw new Error('MedResearch API keys not configured');
    }

    apiKeys = {
      openrouter_key: openrouterKey,
      serper_key: serperKey,
    };

    await supabaseClient.rpc('increment_api_key_usage', { user_id_param: userId });
  } else {
    console.log('Fetching user API keys');
    const { data: userApiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (apiKeysError || !userApiKeys) {
      throw new Error('API keys not found. Please ensure you have set up your OpenRouter API key in the settings.');
    }

    apiKeys = userApiKeys;
  }

  if (!apiKeys.openrouter_key) {
    throw new Error('OpenRouter API key is not set. Please add your OpenRouter API key in the settings.');
  }

  return apiKeys;
}