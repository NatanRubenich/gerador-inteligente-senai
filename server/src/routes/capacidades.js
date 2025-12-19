/**
 * Rotas para Capacidades
 */

import { Router } from 'express';
import { getDb } from '../config/database.js';
import { COLLECTIONS } from '../models/schemas.js';

const router = Router();

// GET /api/capacidades - Listar todas as capacidades (com filtros)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { cursoId, unidadeCurricularId, tipo, limit = 100, skip = 0 } = req.query;
    
    const filter = {};
    if (cursoId) filter.cursoId = cursoId;
    if (unidadeCurricularId) filter.unidadeCurricularId = unidadeCurricularId;
    if (tipo) filter.tipo = tipo;
    
    const capacidades = await db.collection(COLLECTIONS.CAPACIDADES)
      .find(filter)
      .project({ _id: 0 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection(COLLECTIONS.CAPACIDADES).countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: capacidades, 
      count: capacidades.length,
      total 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/capacidades/busca - Busca textual em capacidades
router.post('/busca', async (req, res) => {
  try {
    const db = getDb();
    const { query, cursoId, tipo, limit = 20 } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query é obrigatória' });
    }
    
    const filter = { $text: { $search: query } };
    if (cursoId) filter.cursoId = cursoId;
    if (tipo) filter.tipo = tipo;
    
    const capacidades = await db.collection(COLLECTIONS.CAPACIDADES)
      .find(filter, { score: { $meta: 'textScore' } })
      .project({ _id: 0, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .toArray();
    
    res.json({ success: true, data: capacidades, count: capacidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/capacidades/stats - Estatísticas de capacidades
router.get('/stats', async (req, res) => {
  try {
    const db = getDb();
    
    const stats = await db.collection(COLLECTIONS.CAPACIDADES).aggregate([
      {
        $group: {
          _id: { cursoId: '$cursoId', tipo: '$tipo' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.cursoId',
          cursoId: { $first: '$_id.cursoId' },
          tipos: {
            $push: {
              tipo: '$_id.tipo',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      }
    ]).toArray();
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
