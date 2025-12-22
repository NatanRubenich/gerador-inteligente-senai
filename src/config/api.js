// Configuração da API
// v2.0.0 - API Keys agora ficam APENAS no backend (segurança)

// URL do backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Modelo utilizado (apenas para referência, a chamada é feita no backend)
export const LLM_MODEL = 'gemini-2.5-flash';
export const LLM_PROVIDER = 'gemini';
