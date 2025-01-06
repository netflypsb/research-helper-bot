import { corsHeaders } from './utils.ts';

export async function generateWithOpenRouter(
  prompt: string,
  systemPrompt: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating with OpenRouter:', { prompt, systemPrompt });
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
      'HTTP-Referer': 'https://lovable.dev',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    console.error('OpenRouter API error:', await response.text());
    throw new Error(`OpenRouter API returned status ${response.status}`);
  }

  const data = await response.json();
  console.log('OpenRouter response:', data);

  if (!data.choices?.[0]?.message?.content) {
    console.error('Invalid OpenRouter response format:', data);
    throw new Error('Invalid response format from OpenRouter API');
  }

  return data.choices[0].message.content;
}