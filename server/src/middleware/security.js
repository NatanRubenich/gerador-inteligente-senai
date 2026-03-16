/**
 * Middlewares de Segurança - Gerador de Provas SENAI
 * Rate Limiting, Helmet e validações globais
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/**
 * Configuração do Helmet (headers de segurança HTTP)
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Desabilitado para não quebrar o frontend SPA
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

/**
 * Rate limiter global - aplica a todas as rotas da API
 * 100 requisições por minuto por IP
 */
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns instantes.'
  }
});

/**
 * Rate limiter para rotas do Gemini (AI) - mais restritivo
 * 10 requisições por minuto por IP (chamadas à API custam dinheiro)
 */
export const geminiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Limite de requisições à IA atingido. Aguarde 1 minuto antes de tentar novamente.'
  }
});

/**
 * Rate limiter para rotas de escrita (POST/PUT/DELETE) em dados
 * 30 requisições por minuto por IP
 */
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Muitas operações de escrita. Tente novamente em alguns instantes.'
  }
});
