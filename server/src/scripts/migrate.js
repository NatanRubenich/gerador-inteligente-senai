/**
 * Script de Migração - Dados para MongoDB Atlas
 * 
 * Migra os dados de cursos.js e matrizes-curriculares.json para MongoDB
 * Estrutura otimizada para RAG com documentos separados por entidade
 * 
 * Uso: npm run migrate
 */

import 'dotenv/config';
import { connectToDatabase, closeConnection } from '../config/database.js';
import { COLLECTIONS, indices } from '../models/schemas.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para os arquivos de dados
const DATA_PATH = join(__dirname, '../../../src/data');

// Função para determinar tipo de capacidade
function getTipoCapacidade(codigo) {
  if (codigo.startsWith('CB')) return 'basica';
  if (codigo.startsWith('CT')) return 'tecnica';
  return 'outro';
}

// Função para gerar texto completo para busca (RAG)
function gerarTextoCompleto(uc, curso) {
  const partes = [
    `Curso: ${curso.nome}`,
    `Unidade Curricular: ${uc.nome}`,
    `Módulo: ${uc.modulo || ''}`,
    `Período: ${uc.periodo || ''}`,
    `Objetivo: ${uc.objetivo || ''}`,
  ];

  // Adicionar capacidades
  if (uc.capacidades?.length) {
    partes.push('Capacidades:');
    uc.capacidades.forEach(cap => {
      partes.push(`- ${cap.codigo}: ${cap.descricao}`);
    });
  }

  // Adicionar conhecimentos
  if (uc.conhecimentos?.length) {
    partes.push('Conhecimentos:');
    uc.conhecimentos.forEach(con => {
      const titulo = con.titulo || con.topico || '';
      partes.push(`- ${titulo}`);
      const subs = con.subtopicos || con.subitens || [];
      subs.forEach(sub => {
        if (typeof sub === 'string') {
          partes.push(`  - ${sub}`);
        } else if (sub.titulo) {
          partes.push(`  - ${sub.titulo}`);
        }
      });
    });
  }

  return partes.filter(p => p).join('\n');
}

// Função para gerar texto completo de conhecimento
function gerarTextoConhecimento(conhecimento, ucNome) {
  const titulo = conhecimento.titulo || conhecimento.topico || '';
  const subs = conhecimento.subtopicos || conhecimento.subitens || [];
  
  let texto = `${titulo}`;
  subs.forEach(sub => {
    if (typeof sub === 'string') {
      texto += ` | ${sub}`;
    } else if (sub.titulo) {
      texto += ` | ${sub.titulo}`;
    }
  });
  
  return `${ucNome}: ${texto}`;
}

// Mapeamento de IDs antigos para novos (para compatibilidade)
const ID_MAP = {
  'desi': 'desenvolvimento-sistemas',
  'info-internet': 'informatica-internet'
};

// Carregar dados do cursos.js (ES Module) - DESABILITADO para evitar duplicatas
async function carregarCursosJS() {
  // Retornando array vazio para usar apenas o JSON como fonte principal
  // O JSON (matrizes-curriculares.json) é mais completo e atualizado
  console.log('ℹ️ Usando apenas matrizes-curriculares.json como fonte de dados');
  return [];
}

// Carregar dados do matrizes-curriculares.json
function carregarMatrizesJSON() {
  try {
    const jsonPath = join(DATA_PATH, 'knowledge-base/matrizes-curriculares.json');
    const content = readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(content);
    return data.cursos || [];
  } catch (error) {
    console.warn('⚠️ Não foi possível carregar matrizes-curriculares.json:', error.message);
    return [];
  }
}

// Criar índices nas coleções
async function criarIndices(db) {
  console.log('\n📊 Criando índices...');
  
  for (const [colecao, indexList] of Object.entries(indices)) {
    const collection = db.collection(colecao);
    for (const index of indexList) {
      try {
        await collection.createIndex(index.key, { 
          name: index.name,
          unique: index.unique || false 
        });
        console.log(`  ✓ Índice criado em ${colecao}: ${JSON.stringify(index.key)}`);
      } catch (error) {
        if (error.code === 85) { // Index already exists
          console.log(`  ⏭️ Índice já existe em ${colecao}`);
        } else {
          console.warn(`  ⚠️ Erro ao criar índice em ${colecao}:`, error.message);
        }
      }
    }
  }
}

// Migrar dados
async function migrar() {
  console.log('🚀 Iniciando migração para MongoDB Atlas...\n');
  
  const { db } = await connectToDatabase();
  const now = new Date();
  
  // Estatísticas
  const stats = {
    cursos: 0,
    unidadesCurriculares: 0,
    capacidades: 0,
    conhecimentos: 0
  };

  // Carregar dados de ambas as fontes
  const cursosJS = await carregarCursosJS();
  const cursosJSON = carregarMatrizesJSON();
  
  console.log(`📁 Dados carregados:`);
  console.log(`   - cursos.js: ${cursosJS.length} cursos`);
  console.log(`   - matrizes-curriculares.json: ${cursosJSON.length} cursos`);

  // Mesclar dados (prioridade para cursos.js que tem mais detalhes)
  const cursosMap = new Map();
  
  // Primeiro, adicionar dados do JSON
  cursosJSON.forEach(curso => {
    cursosMap.set(curso.id, {
      ...curso,
      fonte: 'matrizes-curriculares.json'
    });
  });
  
  // Depois, sobrescrever/adicionar com dados do JS (mais completos)
  cursosJS.forEach(curso => {
    const existing = cursosMap.get(curso.id);
    cursosMap.set(curso.id, {
      ...existing,
      ...curso,
      fonte: 'cursos.js'
    });
  });

  const cursosMerged = Array.from(cursosMap.values());
  console.log(`\n🔄 Total de cursos após merge: ${cursosMerged.length}`);

  // Limpar coleções existentes
  console.log('\n🗑️ Limpando coleções existentes...');
  await db.collection(COLLECTIONS.CURSOS).deleteMany({});
  await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).deleteMany({});
  await db.collection(COLLECTIONS.CAPACIDADES).deleteMany({});
  await db.collection(COLLECTIONS.CONHECIMENTOS).deleteMany({});

  // Processar cada curso
  for (const curso of cursosMerged) {
    console.log(`\n📚 Processando curso: ${curso.nome}`);
    
    // Inserir curso
    const cursoDoc = {
      id: curso.id,
      nome: curso.nome,
      tipoEnsino: curso.tipoEnsino || 'tecnico',
      cbo: curso.cbo || null,
      cargaHorariaTotal: curso.cargaHorariaTotal || curso.cargaHoraria || 0,
      competenciaGeral: curso.competenciaGeral || null,
      perfilProfissional: curso.perfilProfissional || null,
      createdAt: now,
      updatedAt: now
    };
    
    await db.collection(COLLECTIONS.CURSOS).insertOne(cursoDoc);
    stats.cursos++;

    // Processar unidades curriculares
    const ucs = curso.unidadesCurriculares || [];
    console.log(`   📖 ${ucs.length} unidades curriculares`);

    for (let i = 0; i < ucs.length; i++) {
      const uc = ucs[i];
      const ucId = uc.id || `${curso.id}-uc${i + 1}`;
      
      // Normalizar capacidades
      const capacidades = (uc.capacidades || uc.capacidadesTecnicas || []).map(cap => ({
        codigo: cap.codigo,
        tipo: getTipoCapacidade(cap.codigo),
        descricao: cap.descricao
      }));

      // Normalizar conhecimentos
      const conhecimentos = (uc.conhecimentos || []).map(con => ({
        codigo: con.codigo || null,
        titulo: con.titulo || con.topico || '',
        topico: con.topico || con.titulo || '',
        subtopicos: con.subtopicos || [],
        subitens: con.subitens || []
      }));

      // Documento da UC
      const ucDoc = {
        id: ucId,
        cursoId: curso.id,
        cursoNome: curso.nome,
        nome: uc.nome,
        modulo: uc.modulo || null,
        periodo: uc.periodo || null,
        cargaHoraria: uc.cargaHoraria || 0,
        objetivo: uc.objetivo || null,
        capacidades,
        conhecimentos,
        textoCompleto: gerarTextoCompleto(uc, curso),
        createdAt: now,
        updatedAt: now
      };

      await db.collection(COLLECTIONS.UNIDADES_CURRICULARES).insertOne(ucDoc);
      stats.unidadesCurriculares++;

      // Inserir capacidades como documentos separados
      for (const cap of capacidades) {
        const capDoc = {
          codigo: cap.codigo,
          tipo: cap.tipo,
          descricao: cap.descricao,
          unidadeCurricularId: ucId,
          unidadeCurricularNome: uc.nome,
          cursoId: curso.id,
          cursoNome: curso.nome,
          modulo: uc.modulo || null,
          periodo: uc.periodo || null,
          createdAt: now,
          updatedAt: now
        };
        
        await db.collection(COLLECTIONS.CAPACIDADES).insertOne(capDoc);
        stats.capacidades++;
      }

      // Inserir conhecimentos como documentos separados
      for (const con of conhecimentos) {
        const conDoc = {
          codigo: con.codigo,
          titulo: con.titulo,
          topico: con.topico,
          subtopicos: con.subtopicos,
          subitens: con.subitens,
          textoCompleto: gerarTextoConhecimento(con, uc.nome),
          unidadeCurricularId: ucId,
          unidadeCurricularNome: uc.nome,
          cursoId: curso.id,
          cursoNome: curso.nome,
          createdAt: now,
          updatedAt: now
        };
        
        await db.collection(COLLECTIONS.CONHECIMENTOS).insertOne(conDoc);
        stats.conhecimentos++;
      }
    }
  }

  // Criar índices
  await criarIndices(db);

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('='.repeat(50));
  console.log(`\n📊 Estatísticas:`);
  console.log(`   - Cursos: ${stats.cursos}`);
  console.log(`   - Unidades Curriculares: ${stats.unidadesCurriculares}`);
  console.log(`   - Capacidades: ${stats.capacidades}`);
  console.log(`   - Conhecimentos: ${stats.conhecimentos}`);
  console.log(`\n📦 Total de documentos: ${Object.values(stats).reduce((a, b) => a + b, 0)}`);
}

// Executar migração
migrar()
  .catch(error => {
    console.error('\n❌ Erro na migração:', error);
    process.exit(1);
  })
  .finally(async () => {
    await closeConnection();
    process.exit(0);
  });
