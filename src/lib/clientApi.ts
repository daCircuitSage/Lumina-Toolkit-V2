/**
 * Client-side API calls (for static deployment)
 * WARNING: This exposes API keys - use only for development/demo
 */

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  console.warn('VITE_MISTRAL_API_KEY not found. AI features will not work.');
}

export async function callMistralAPI(messages: any[], model = 'mistral-small', temperature = 0.7, maxTokens = 2000) {
  if (!MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY is not configured');
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Mistral API');
  }

  return data.choices[0].message.content;
}

export async function chatWithAI(message: string, history = []) {
  const messages = [
    { role: 'system', content: 'You are a helpful, intelligent AI assistant inside a productivity SaaS platform called Lumina Toolkit. You help users with writing, coding, learning, and general questions. Keep responses clear, practical, and human-like.' },
    ...history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  return await callMistralAPI(messages);
}
