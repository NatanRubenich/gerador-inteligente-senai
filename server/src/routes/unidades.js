/**
 * Rotas para Unidades Curriculares
 */

import { Router } from 'express';
import { getDb } from '../config/database.js';
import { COLLECTIONS } from '../models/schemas.js';

const router = Router();

// GET /api/unidades - Listar todas as UCs (com filtros opcionais)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { cursoId, modulo, periodo, limit = 50, skip = 0 } = req.query;
    
    const filter = {};
    if (cursoId) filter.cursoId = cursoId;
    if (modulo) filter.modulo = modulo;
    if (periodo) filter.periodo = periodo;
    
    const unidades = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .find(filter)
      .project({ _id: 0, textoCompleto: 0 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: unidades, 
      count: unidades.length,
      total,
      pagination: { skip: parseInt(skip), limit: parseInt(limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/unidades/:id - Buscar UC por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const unidade = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });
    
    if (!unidade) {
      return res.status(404).json({ success: false, error: 'Unidade Curricular não encontrada' });
    }
    
    res.json({ success: true, data: unidade });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/unidades/:id/capacidades - Listar capacidades de uma UC
router.get('/:id/capacidades', async (req, res) => {
  try {
    const db = getDb();
    const capacidades = await db.collection(COLLECTIONS.CAPACIDADES)
      .find({ unidadeCurricularId: req.params.id })
      .project({ _id: 0 })
      .toArray();
    
    res.json({ success: true, data: capacidades, count: capacidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/unidades/:id/conhecimentos - Listar conhecimentos de uma UC
router.get('/:id/conhecimentos', async (req, res) => {
  try {
    const db = getDb();
    const conhecimentos = await db.collection(COLLECTIONS.CONHECIMENTOS)
      .find({ unidadeCurricularId: req.params.id })
      .project({ _id: 0 })
      .toArray();
    
    res.json({ success: true, data: conhecimentos, count: conhecimentos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/unidades/busca - Busca textual (para RAG)
router.post('/busca', async (req, res) => {
  try {
    const db = getDb();
    const { query, cursoId, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query é obrigatória' });
    }
    
    const filter = { $text: { $search: query } };
    if (cursoId) filter.cursoId = cursoId;
    
    const unidades = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .find(filter, { score: { $meta: 'textScore' } })
      .project({ _id: 0, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .toArray();
    
    res.json({ success: true, data: unidades, count: unidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
