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
    
    // Buscar capacidades SEMPRE da UC (fonte única de verdade)
    const unidade = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });
    
    let capacidades = [];
    
    if (unidade) {
      // Buscar capacidades embutidas na UC
      const caps = unidade.capacidades || unidade.capacidadesTecnicas || [];
      capacidades = caps.map((cap, index) => ({
        ...cap,
        id: cap.id || `${req.params.id}-cap${index + 1}`,
        unidadeCurricularId: req.params.id,
        unidadeCurricularNome: unidade.nome,
        cursoId: unidade.cursoId,
        cursoNome: unidade.cursoNome,
        modulo: unidade.modulo
      }));
    }
    
    res.json({ success: true, data: capacidades, count: capacidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/unidades/:id/conhecimentos - Listar conhecimentos de uma UC
router.get('/:id/conhecimentos', async (req, res) => {
  try {
    const db = getDb();
    
    // Primeiro, tentar buscar na coleção CONHECIMENTOS separada
    let conhecimentos = await db.collection(COLLECTIONS.CONHECIMENTOS)
      .find({ unidadeCurricularId: req.params.id })
      .project({ _id: 0 })
      .toArray();
    
    // Se não encontrou, buscar conhecimentos embutidos na UC
    if (conhecimentos.length === 0) {
      const unidade = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
        .findOne({ id: req.params.id }, { projection: { _id: 0 } });
      
      if (unidade && unidade.conhecimentos) {
        conhecimentos = unidade.conhecimentos.map((con, index) => ({
          ...con,
          id: con.id || `${req.params.id}-con${index + 1}`,
          unidadeCurricularId: req.params.id,
          unidadeCurricularNome: unidade.nome
        }));
      }
    }
    
    res.json({ success: true, data: conhecimentos, count: conhecimentos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/unidades/:id - Atualizar UC
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const ucId = req.params.id;
    const updateData = req.body;

    // Verificar se UC existe
    const existing = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .findOne({ id: ucId });
    
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Unidade Curricular não encontrada' });
    }

    // Atualizar UC
    const result = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).updateOne(
      { id: ucId },
      { 
        $set: { 
          ...updateData, 
          id: ucId, // Manter o ID original
          updatedAt: new Date() 
        } 
      }
    );

    res.json({ 
      success: true, 
      message: 'Unidade Curricular atualizada com sucesso',
      data: { id: ucId, modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Erro ao atualizar UC:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/unidades - Criar nova UC
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const ucData = req.body;

    // Validar dados mínimos
    if (!ucData.nome || !ucData.cursoId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome e cursoId são obrigatórios' 
      });
    }

    // Gerar ID se não existir
    if (!ucData.id) {
      const count = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
        .countDocuments({ cursoId: ucData.cursoId });
      ucData.id = `${ucData.cursoId}-uc${count + 1}`;
    }

    // Verificar se já existe
    const existing = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .findOne({ id: ucData.id });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Já existe uma UC com este ID' 
      });
    }

    // Inserir UC
    const ucDoc = {
      ...ucData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).insertOne(ucDoc);

    res.status(201).json({ 
      success: true, 
      message: 'Unidade Curricular criada com sucesso',
      data: { id: ucData.id }
    });
  } catch (error) {
    console.error('Erro ao criar UC:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/unidades/:id - Deletar UC
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const ucId = req.params.id;

    // Verificar se UC existe
    const existing = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
      .findOne({ id: ucId });
    
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Unidade Curricular não encontrada' });
    }

    // Deletar UC
    await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).deleteOne({ id: ucId });

    // Deletar capacidades e conhecimentos associados (se existirem em coleções separadas)
    await db.collection(COLLECTIONS.CAPACIDADES).deleteMany({ unidadeCurricularId: ucId });
    await db.collection(COLLECTIONS.CONHECIMENTOS).deleteMany({ unidadeCurricularId: ucId });

    res.json({ 
      success: true, 
      message: 'Unidade Curricular deletada com sucesso',
      data: { id: ucId }
    });
  } catch (error) {
    console.error('Erro ao deletar UC:', error);
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
