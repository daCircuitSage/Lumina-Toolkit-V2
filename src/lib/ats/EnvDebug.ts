/**
 * Environment Variable Debug Tool
 * Helps diagnose API key loading issues
 */

export interface EnvDebugInfo {
  availableVars: string[];
  mistralKey: string | null;
  viteMistralKey: string | null;
  geminiKey: string | null;
  viteGeminiKey: string | null;
  gaId: string | null;
  recommendations: string[];
}

export function debugEnvironmentVariables(): EnvDebugInfo {
  // Get all available environment variables
  const availableVars = Object.keys(import.meta.env);
  
  // Check specific API keys
  const mistralKey = import.meta.env.MISTRAL_API_KEY || null;
  const viteMistralKey = import.meta.env.VITE_MISTRAL_API_KEY || null;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  const viteGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  const gaId = import.meta.env.VITE_GA_ID || null;
  
  const recommendations: string[] = [];
  
  // Analyze and provide recommendations
  if (!mistralKey && !viteMistralKey) {
    recommendations.push('❌ No Mistral API key found. Add MISTRAL_API_KEY (production) or VITE_MISTRAL_API_KEY (development) to your .env file.');
  } else if (viteMistralKey) {
    recommendations.push('✅ VITE_MISTRAL_API_KEY found (development mode)');
  } else if (mistralKey) {
    recommendations.push('✅ MISTRAL_API_KEY found (production mode)');
  }
  
  if (!geminiKey && !viteGeminiKey) {
    recommendations.push('ℹ️ No Gemini API key found (optional)');
  }
  
  if (!gaId) {
    recommendations.push('ℹ️ No VITE_GA_ID found (optional)');
  }
  
  return {
    availableVars,
    mistralKey,
    viteMistralKey,
    geminiKey,
    viteGeminiKey,
    gaId,
    recommendations
  };
}

// Log debug info to console (remove in production)
export function logEnvironmentDebug() {
  const debug = debugEnvironmentVariables();
  console.group('🔍 Environment Variable Debug');
  console.log('Available variables:', debug.availableVars);
  console.log('MISTRAL_API_KEY:', debug.mistralKey ? '✅ Found' : '❌ Not found');
  console.log('VITE_MISTRAL_API_KEY:', debug.viteMistralKey ? '✅ Found' : '❌ Not found');
  console.log('VITE_GEMINI_API_KEY:', debug.viteGeminiKey ? '✅ Found' : '❌ Not found');
  console.log('VITE_GA_ID:', debug.gaId ? '✅ Found' : '❌ Not found');
  console.log('Recommendations:', debug.recommendations);
  console.groupEnd();
  
  return debug;
}
