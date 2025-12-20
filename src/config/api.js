// Configuração da API - Chave integrada ao sistema
// IMPORTANTE: Em produção, use variáveis de ambiente

// ============================================
// GOOGLE GEMINI API (Principal)
// ============================================
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_MODEL = 'gemini-2.5-flash';

// ============================================
// GROQ API (Fallback/Alternativa)
// ============================================
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Modelo padrão a ser utilizado
export const LLM_MODEL = GEMINI_MODEL;
export const LLM_PROVIDER = 'gemini'; // 'gemini' ou 'groq'
