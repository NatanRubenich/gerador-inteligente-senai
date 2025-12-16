// Configuração da API - Chave integrada ao sistema
// IMPORTANTE: Em produção, use variáveis de ambiente

// API Groq - Inferência ultra-rápida
// Para obter sua chave gratuita: https://console.groq.com/keys
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || '';

// Modelo a ser utilizado (Llama 3.3 70B - excelente para JSON estruturado)
export const LLM_MODEL = 'llama-3.3-70b-versatile';

// URL da API Groq (compatível com OpenAI)
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Aliases para compatibilidade legada
export const GEMINI_API_KEY = GROQ_API_KEY;
export const GEMINI_API_URL = GROQ_API_URL;
