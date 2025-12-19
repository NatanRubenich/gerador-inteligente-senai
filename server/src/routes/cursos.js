/**
 * Rotas para Cursos e Unidades Curriculares
 */

import { Router } from 'express';
import { getDb } from '../config/database.js';
import { COLLECTIONS } from '../models/schemas.js';

const router = Router();

// GET /api/cursos - Listar todos os cursos
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const cursos = await db.collection(COLLECTIONS.CURSOS)
      .find({})
      .project({ _id: 0 })
      .toArray();
    
    res.json({ success: true, data: cursos, count: cursos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/cursos/:id - Buscar curso por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const curso = await db.collection(COLLECTIONS.CURSOS)
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });
    
    if (!curso) {
      return res.status(404).json({ success: false, error: 'Curso não encontrado' });
    }
    
    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/cursos/:id/unidades - Listar UCs de um curso
router.get('/:id/unidades', async (req, res) => {
  try {
    const db = getDb();
    const unidades = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .find({ cursoId: req.params.id })
      .project({ _id: 0, textoCompleto: 0 })
      .toArray();
    
    res.json({ success: true, data: unidades, count: unidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
