/**
 * Rotas para Cursos e Unidades Curriculares
 */

import { Router } from 'express';
import { getDb } from '../config/database.js';
import { COLLECTIONS } from '../models/schemas.js';

const router = Router();

// POST /api/cursos - Criar novo curso
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const courseData = req.body;

    // Validar dados mínimos
    if (!courseData.id || !courseData.nome) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID e nome do curso são obrigatórios' 
      });
    }

    // Verificar se curso já existe
    const existing = await db.collection(COLLECTIONS.CURSOS).findOne({ id: courseData.id });
    if (existing) {
      // Atualizar curso existente
      await db.collection(COLLECTIONS.CURSOS).updateOne(
        { id: courseData.id },
        { $set: { ...courseData, updatedAt: new Date() } }
      );
      
      // Atualizar UCs
      if (courseData.unidadesCurriculares) {
        // Remover UCs antigas
        await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).deleteMany({ cursoId: courseData.id });
        
        // Inserir novas UCs com IDs gerados
        const ucs = courseData.unidadesCurriculares.map((uc, index) => {
          // Gerar ID se não existir
          const ucId = uc.id || `${courseData.id}-uc${index + 1}`;
          return {
            ...uc,
            id: ucId,
            cursoId: courseData.id,
            cursoNome: courseData.nome,
            ordem: index,
            createdAt: new Date()
          };
        });
        
        if (ucs.length > 0) {
          await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).insertMany(ucs);
        }
      }

      return res.json({ 
        success: true, 
        message: 'Curso atualizado com sucesso',
        data: { id: courseData.id }
      });
    }

    // Criar novo curso
    const cursoDoc = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remover UCs do documento principal (serão salvas separadamente)
    delete cursoDoc.unidadesCurriculares;
    
    await db.collection(COLLECTIONS.CURSOS).insertOne(cursoDoc);

    // Salvar UCs separadamente com IDs gerados
    if (courseData.unidadesCurriculares && courseData.unidadesCurriculares.length > 0) {
      const ucs = courseData.unidadesCurriculares.map((uc, index) => {
        const ucId = uc.id || `${courseData.id}-uc${index + 1}`;
        return {
          ...uc,
          id: ucId,
          cursoId: courseData.id,
          cursoNome: courseData.nome,
          ordem: index,
          createdAt: new Date()
        };
      });
      
      await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).insertMany(ucs);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Curso criado com sucesso',
      data: { id: courseData.id }
    });

  } catch (error) {
    console.error('Erro ao salvar curso:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/cursos/:id - Deletar curso
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    // Deletar curso
    const result = await db.collection(COLLECTIONS.CURSOS).deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Curso não encontrado' });
    }

    // Deletar UCs associadas
    await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).deleteMany({ cursoId: id });

    res.json({ success: true, message: 'Curso deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/cursos - Listar todos os cursos (com UCs se solicitado)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const includeUCs = req.query.includeUCs === 'true';
    
    const cursos = await db.collection(COLLECTIONS.CURSOS)
      .find({})
      .project({ _id: 0 })
      .toArray();
    
    // Se solicitado, incluir UCs em cada curso
    if (includeUCs) {
      for (const curso of cursos) {
        const ucs = await db.collection(COLLECTIONS.UNIDADES_CURRICULARES)
          .find({ cursoId: curso.id })
          .project({ _id: 0 })
          .sort({ ordem: 1 })
          .toArray();
        curso.unidadesCurriculares = ucs;
      }
    }
    
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
