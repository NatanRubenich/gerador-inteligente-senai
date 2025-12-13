// Configuração da API - Chave integrada ao sistema
// IMPORTANTE: Em produção, use variáveis de ambiente

// API Groq - Gratuita
// Para obter sua chave: https://console.groq.com/keys
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || '';

// Modelo a ser utilizado
export const LLM_MODEL = 'llama-3.3-70b-versatile';

// URL da API
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
