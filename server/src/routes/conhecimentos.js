/**
 * Rotas para Conhecimentos
 */

import { Router } from 'express';
import { getDb } from '../config/database.js';
import { COLLECTIONS } from '../models/schemas.js';

const router = Router();

// GET /api/conhecimentos - Listar todos os conhecimentos (com filtros)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { cursoId, unidadeCurricularId, limit = 100, skip = 0 } = req.query;
    
    const filter = {};
    if (cursoId) filter.cursoId = cursoId;
    if (unidadeCurricularId) filter.unidadeCurricularId = unidadeCurricularId;
    
    const conhecimentos = await db.collection(COLLECTIONS.CONHECIMENTOS)
      .find(filter)
      .project({ _id: 0 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection(COLLECTIONS.CONHECIMENTOS).countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: conhecimentos, 
      count: conhecimentos.length,
      total 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/conhecimentos/busca - Busca textual em conhecimentos
router.post('/busca', async (req, res) => {
  try {
    const db = getDb();
    const { query, cursoId, limit = 20 } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query é obrigatória' });
    }
    
    const filter = { $text: { $search: query } };
    if (cursoId) filter.cursoId = cursoId;
    
    const conhecimentos = await db.collection(COLLECTIONS.CONHECIMENTOS)
      .find(filter, { score: { $meta: 'textScore' } })
      .project({ _id: 0, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .toArray();
    
    res.json({ success: true, data: conhecimentos, count: conhecimentos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
