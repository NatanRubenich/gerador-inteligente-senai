/**
 * Schemas para MongoDB - Gerador de Provas SENAI
 * 
 * Estrutura otimizada para RAG (Retrieval-Augmented Generation):
 * - Unidades Curriculares são documentos independentes para busca eficiente
 * - Capacidades e Conhecimentos são embeddings-friendly
 * - Metadados do curso mantidos para contexto
 */

// Schema para Cursos (documento principal)
export const cursoSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'nome', 'tipoEnsino'],
      properties: {
        id: { bsonType: 'string', description: 'Identificador único do curso' },
        nome: { bsonType: 'string', description: 'Nome completo do curso' },
        tipoEnsino: { 
          bsonType: 'string', 
          enum: ['tecnico', 'integrado'],
          description: 'Tipo de ensino: tecnico ou integrado' 
        },
        cbo: { bsonType: 'string', description: 'Código Brasileiro de Ocupações' },
        cargaHorariaTotal: { bsonType: 'int', description: 'Carga horária total em horas' },
        competenciaGeral: { bsonType: 'string', description: 'Competência geral do profissional' },
        perfilProfissional: { bsonType: 'string', description: 'Descrição do perfil profissional' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
};

// Schema para Unidades Curriculares (documento separado para RAG)
export const unidadeCurricularSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['cursoId', 'nome', 'cargaHoraria'],
      properties: {
        cursoId: { bsonType: 'string', description: 'ID do curso relacionado' },
        cursoNome: { bsonType: 'string', description: 'Nome do curso (denormalizado para busca)' },
        id: { bsonType: 'string', description: 'ID único da UC' },
        nome: { bsonType: 'string', description: 'Nome da unidade curricular' },
        modulo: { bsonType: 'string', description: 'Módulo (Básico, Introdutório, Específico I, II)' },
        periodo: { bsonType: 'string', description: 'Período (1º, 2º, 3º, 4º Período)' },
        cargaHoraria: { bsonType: 'int', description: 'Carga horária em horas' },
        objetivo: { bsonType: 'string', description: 'Objetivo da unidade curricular' },
        
        // Capacidades (CB = Básicas, CT = Técnicas)
        capacidades: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['codigo', 'descricao'],
            properties: {
              codigo: { bsonType: 'string', description: 'Código (CB1, CT1, etc)' },
              tipo: { bsonType: 'string', enum: ['basica', 'tecnica'] },
              descricao: { bsonType: 'string', description: 'Descrição da capacidade' }
            }
          }
        },
        
        // Conhecimentos (estrutura hierárquica)
        conhecimentos: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              codigo: { bsonType: 'string' },
              titulo: { bsonType: 'string' },
              topico: { bsonType: 'string' },
              subtopicos: { bsonType: 'array' },
              subitens: { bsonType: 'array' }
            }
          }
        },
        
        // Campo para busca textual (concatenação para RAG)
        textoCompleto: { bsonType: 'string', description: 'Texto concatenado para busca semântica' },
        
        // Metadados
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
};

// Schema para Capacidades (documento separado para busca granular)
export const capacidadeSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['codigo', 'descricao', 'unidadeCurricularId'],
      properties: {
        codigo: { bsonType: 'string', description: 'Código único (CB1, CT1, etc)' },
        tipo: { 
          bsonType: 'string', 
          enum: ['basica', 'tecnica'],
          description: 'CB = básica, CT = técnica' 
        },
        descricao: { bsonType: 'string', description: 'Descrição completa da capacidade' },
        
        // Referências
        unidadeCurricularId: { bsonType: 'string' },
        unidadeCurricularNome: { bsonType: 'string' },
        cursoId: { bsonType: 'string' },
        cursoNome: { bsonType: 'string' },
        modulo: { bsonType: 'string' },
        periodo: { bsonType: 'string' },
        
        // Metadados
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
};

// Schema para Conhecimentos (documento separado para busca granular)
export const conhecimentoSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['titulo', 'unidadeCurricularId'],
      properties: {
        codigo: { bsonType: 'string' },
        titulo: { bsonType: 'string', description: 'Título/tópico do conhecimento' },
        topico: { bsonType: 'string', description: 'Tópico principal' },
        subtopicos: { 
          bsonType: 'array', 
          items: { bsonType: 'string' },
          description: 'Lista de subtópicos' 
        },
        
        // Texto completo para RAG
        textoCompleto: { bsonType: 'string' },
        
        // Referências
        unidadeCurricularId: { bsonType: 'string' },
        unidadeCurricularNome: { bsonType: 'string' },
        cursoId: { bsonType: 'string' },
        cursoNome: { bsonType: 'string' },
        
        // Metadados
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
};

// Índices recomendados para performance e busca
export const indices = {
  cursos: [
    { key: { id: 1 }, unique: true },
    { key: { nome: 'text' } }
  ],
  unidadesCurriculares: [
    { key: { cursoId: 1 } },
    { key: { nome: 1 } },
    { key: { modulo: 1 } },
    { key: { periodo: 1 } },
    { key: { textoCompleto: 'text', nome: 'text' }, name: 'busca_textual' }
  ],
  capacidades: [
    { key: { unidadeCurricularId: 1 } },
    { key: { cursoId: 1 } },
    { key: { tipo: 1 } },
    { key: { codigo: 1 } },
    { key: { descricao: 'text' }, name: 'busca_capacidade' }
  ],
  conhecimentos: [
    { key: { unidadeCurricularId: 1 } },
    { key: { cursoId: 1 } },
    { key: { textoCompleto: 'text', titulo: 'text' }, name: 'busca_conhecimento' }
  ]
};

export const COLLECTIONS = {
  CURSOS: 'cursos',
  UNIDADES_CURRICULARES: 'unidades_curriculares',
  CAPACIDADES: 'capacidades',
  CONHECIMENTOS: 'conhecimentos'
};
