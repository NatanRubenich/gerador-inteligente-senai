// Configuração da API - Chave integrada ao sistema
// IMPORTANTE: Em produção, use variáveis de ambiente

// API Gemini - Google AI
// Para obter sua chave gratuita: https://aistudio.google.com/app/apikey
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Modelo a ser utilizado (Gemini 2.5 Flash - com thinking)
export const LLM_MODEL = 'gemini-2.5-flash';

// URL da API Gemini
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Aliases para compatibilidade (deprecated - usar GEMINI_*)
export const GROQ_API_KEY = GEMINI_API_KEY;
export const GROQ_API_URL = GEMINI_API_URL;
