/**
 * Middlewares de Validação de Input - Gerador de Provas SENAI
 * Usa express-validator para sanitizar e validar dados de entrada
 */

import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware que verifica os resultados da validação
 * Deve ser usado após as regras de validação
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors.array().map(e => ({
        campo: e.path,
        mensagem: e.msg
      }))
    });
  }
  next();
}

// ============================================
// Validações para CURSOS
// ============================================

export const validateCreateCurso = [
  body('id')
    .trim()
    .notEmpty().withMessage('ID do curso é obrigatório')
    .isLength({ max: 100 }).withMessage('ID do curso deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('ID do curso deve conter apenas letras, números, hífens e underscores'),
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome do curso é obrigatório')
    .isLength({ max: 500 }).withMessage('Nome do curso deve ter no máximo 500 caracteres'),
  body('tipoEnsino')
    .optional()
    .isIn(['tecnico', 'integrado']).withMessage('Tipo de ensino deve ser "tecnico" ou "integrado"'),
  body('cargaHorariaTotal')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Carga horária deve ser entre 1 e 10000'),
  body('unidadesCurriculares')
    .optional()
    .isArray().withMessage('Unidades curriculares devem ser um array'),
  body('unidadesCurriculares.*.nome')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Nome da UC deve ter no máximo 500 caracteres'),
  body('unidadesCurriculares.*.cargaHoraria')
    .optional()
    .isInt({ min: 1, max: 5000 }).withMessage('Carga horária da UC deve ser entre 1 e 5000'),
  handleValidationErrors
];

export const validateUpdateCurso = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID do curso é obrigatório'),
  body('nome')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Nome do curso deve ter no máximo 500 caracteres'),
  body('tipoEnsino')
    .optional()
    .isIn(['tecnico', 'integrado']).withMessage('Tipo de ensino deve ser "tecnico" ou "integrado"'),
  handleValidationErrors
];

// ============================================
// Validações para UNIDADES CURRICULARES
// ============================================

export const validateCreateUC = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome da UC é obrigatório')
    .isLength({ max: 500 }).withMessage('Nome da UC deve ter no máximo 500 caracteres'),
  body('cursoId')
    .trim()
    .notEmpty().withMessage('cursoId é obrigatório')
    .isLength({ max: 100 }).withMessage('cursoId deve ter no máximo 100 caracteres'),
  body('cargaHoraria')
    .optional()
    .isInt({ min: 1, max: 5000 }).withMessage('Carga horária deve ser entre 1 e 5000'),
  body('modulo')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Módulo deve ter no máximo 200 caracteres'),
  body('capacidades')
    .optional()
    .isArray().withMessage('Capacidades devem ser um array'),
  body('conhecimentos')
    .optional()
    .isArray().withMessage('Conhecimentos devem ser um array'),
  handleValidationErrors
];

export const validateUpdateUC = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID da UC é obrigatório'),
  body('nome')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Nome da UC deve ter no máximo 500 caracteres'),
  body('cargaHoraria')
    .optional()
    .isInt({ min: 1, max: 5000 }).withMessage('Carga horária deve ser entre 1 e 5000'),
  handleValidationErrors
];

// ============================================
// Validações para BUSCA
// ============================================

export const validateSearch = [
  body('query')
    .trim()
    .notEmpty().withMessage('Query de busca é obrigatória')
    .isLength({ max: 500 }).withMessage('Query deve ter no máximo 500 caracteres'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit deve ser entre 1 e 100'),
  body('cursoId')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('cursoId deve ter no máximo 100 caracteres'),
  handleValidationErrors
];

// ============================================
// Validações para GEMINI
// ============================================

export const validateGeminiExtract = [
  body('pdfBase64')
    .notEmpty().withMessage('PDF (base64) é obrigatório')
    .isString().withMessage('PDF deve ser uma string base64'),
  handleValidationErrors
];

export const validateGeminiExtractWithUCs = [
  body('pdfBase64')
    .notEmpty().withMessage('PDF (base64) é obrigatório')
    .isString().withMessage('PDF deve ser uma string base64'),
  body('ucs')
    .isArray({ min: 1 }).withMessage('Lista de UCs é obrigatória e deve ter ao menos 1 item'),
  body('ucs.*.nome')
    .trim()
    .notEmpty().withMessage('Nome da UC é obrigatório'),
  handleValidationErrors
];

export const validateGeminiGenerate = [
  body('systemPrompt')
    .notEmpty().withMessage('systemPrompt é obrigatório')
    .isString().withMessage('systemPrompt deve ser uma string')
    .isLength({ max: 50000 }).withMessage('systemPrompt deve ter no máximo 50000 caracteres'),
  body('userPrompt')
    .notEmpty().withMessage('userPrompt é obrigatório')
    .isString().withMessage('userPrompt deve ser uma string')
    .isLength({ max: 50000 }).withMessage('userPrompt deve ter no máximo 50000 caracteres'),
  body('maxTokens')
    .optional()
    .isInt({ min: 256, max: 65536 }).withMessage('maxTokens deve ser entre 256 e 65536'),
  handleValidationErrors
];

// ============================================
// Validações para query params de listagem
// ============================================

export const validateListQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 500 }).withMessage('Limit deve ser entre 1 e 500'),
  query('skip')
    .optional()
    .isInt({ min: 0 }).withMessage('Skip deve ser >= 0'),
  query('cursoId')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('cursoId deve ter no máximo 100 caracteres'),
  handleValidationErrors
];
