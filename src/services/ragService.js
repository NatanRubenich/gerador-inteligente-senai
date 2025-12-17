// Serviço RAG (Retrieval-Augmented Generation) - Especialista SENAI
// Base de conhecimento da metodologia SENAI para elaboração de avaliações
// v1.2.0 - Implementação com busca textual e base de conhecimento estruturada

import matrizesData from '../data/knowledge-base/matrizes-curriculares.json';
import metodologiaData from '../data/knowledge-base/metodologia-senai.json';

/**
 * Índice de busca textual para RAG
 * Implementação de TF-IDF simplificado para busca por relevância
 */
class RAGSearchIndex {
  constructor() {
    this.documents = [];
    this.invertedIndex = {};
  }

  // Tokenizar texto em palavras
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  // Adicionar documento ao índice
  addDocument(id, content, metadata = {}) {
    const tokens = this.tokenize(content);
    const doc = { id, content, metadata, tokens };
    this.documents.push(doc);

    // Construir índice invertido
    tokens.forEach(token => {
      if (!this.invertedIndex[token]) {
        this.invertedIndex[token] = [];
      }
      if (!this.invertedIndex[token].includes(id)) {
        this.invertedIndex[token].push(id);
      }
    });
  }

  // Buscar documentos relevantes
  search(query, maxResults = 5) {
    const queryTokens = this.tokenize(query);
    const scores = {};

    // Calcular score de relevância (TF-IDF simplificado)
    queryTokens.forEach(token => {
      const matchingDocs = this.invertedIndex[token] || [];
      const idf = Math.log(this.documents.length / (matchingDocs.length + 1));

      matchingDocs.forEach(docId => {
        if (!scores[docId]) scores[docId] = 0;
        const doc = this.documents.find(d => d.id === docId);
        const tf = doc.tokens.filter(t => t === token).length / doc.tokens.length;
        scores[docId] += tf * idf;
      });
    });

    // Ordenar por relevância e retornar top resultados
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults)
      .map(([docId, score]) => ({
        ...this.documents.find(d => d.id === docId),
        score
      }));
  }
}

// Instância global do índice RAG
const ragIndex = new RAGSearchIndex();
let indexInitialized = false;

/**
 * Inicializar índice RAG com a base de conhecimento
 */
export function initializeRAGIndex() {
  if (indexInitialized) return;

  // Indexar matrizes curriculares
  matrizesData.cursos.forEach(curso => {
    // Indexar curso
    ragIndex.addDocument(
      `curso-${curso.id}`,
      `${curso.nome} ${curso.perfilProfissional} ${curso.competenciaGeral}`,
      { type: 'curso', curso: curso.nome }
    );

    // Indexar unidades curriculares
    curso.unidadesCurriculares.forEach(uc => {
      const capacidadesText = uc.capacidadesTecnicas?.map(c => `${c.codigo} ${c.descricao}`).join(' ') || '';
      
      // Processar conhecimentos (podem ser strings simples ou objetos hierárquicos)
      let conhecimentosText = '';
      if (uc.conhecimentos) {
        conhecimentosText = uc.conhecimentos.map(c => {
          if (typeof c === 'string') return c;
          if (typeof c === 'object' && c.topico) {
            return `${c.topico} ${c.subtopicos?.join(' ') || ''}`;
          }
          return '';
        }).join(' ');
      }
      
      // Adicionar conhecimentos resumidos se existirem
      if (uc.conhecimentosResumidos) {
        conhecimentosText += ' ' + uc.conhecimentosResumidos.join(' ');
      }
      
      ragIndex.addDocument(
        `uc-${curso.id}-${uc.nome.replace(/\s+/g, '-').toLowerCase()}`,
        `${uc.nome} ${uc.objetivo} ${capacidadesText} ${conhecimentosText}`,
        { type: 'unidadeCurricular', curso: curso.nome, uc: uc.nome, cargaHoraria: uc.cargaHoraria }
      );

      // Indexar capacidades individualmente
      uc.capacidadesTecnicas?.forEach(cap => {
        ragIndex.addDocument(
          `cap-${curso.id}-${uc.nome}-${cap.codigo}`,
          `${cap.codigo} ${cap.descricao}`,
          { type: 'capacidade', curso: curso.nome, uc: uc.nome, codigo: cap.codigo }
        );
      });

      // Indexar conhecimentos hierárquicos individualmente (para Plano de Ensino)
      if (uc.conhecimentos && Array.isArray(uc.conhecimentos)) {
        uc.conhecimentos.forEach((conhecimento, idx) => {
          if (typeof conhecimento === 'object' && conhecimento.topico) {
            ragIndex.addDocument(
              `conhecimento-${curso.id}-${uc.nome}-${idx}`,
              `${conhecimento.topico} ${conhecimento.subtopicos?.join(' ') || ''}`,
              { 
                type: 'conhecimento', 
                curso: curso.nome, 
                uc: uc.nome, 
                topico: conhecimento.topico,
                subtopicos: conhecimento.subtopicos 
              }
            );
          }
        });
      }
    });
  });

  // Indexar metodologia SENAI
  const metodologia = metodologiaData.metodologia;
  
  // Indexar SA
  ragIndex.addDocument(
    'metodologia-sa',
    `${metodologia.situacaoAprendizagem.definicao} ${JSON.stringify(metodologia.situacaoAprendizagem.estrutura)} ${metodologia.situacaoAprendizagem.caracteristicas.join(' ')}`,
    { type: 'metodologia', tema: 'Situação de Aprendizagem' }
  );

  // Indexar avaliação prática
  ragIndex.addDocument(
    'metodologia-avaliacao-pratica',
    `${metodologia.avaliacaoPratica.definicao} ${JSON.stringify(metodologia.avaliacaoPratica.estrutura)}`,
    { type: 'metodologia', tema: 'Avaliação Prática' }
  );

  // Indexar taxonomia de Bloom
  metodologia.taxonomiaBloom.niveis.forEach(nivel => {
    ragIndex.addDocument(
      `bloom-${nivel.nome.toLowerCase()}`,
      `${nivel.nome} ${nivel.descricao} ${nivel.verbos.join(' ')}`,
      { type: 'taxonomia', nivel: nivel.nivel, nome: nivel.nome }
    );
  });

  // Indexar estratégias pedagógicas
  metodologia.estrategiasPedagogicas.forEach(estrategia => {
    ragIndex.addDocument(
      `estrategia-${estrategia.nome.toLowerCase()}`,
      `${estrategia.nome} ${estrategia.descricao} ${estrategia.quando_usar}`,
      { type: 'estrategia', nome: estrategia.nome }
    );
  });

  indexInitialized = true;
  console.log(`[RAG] Índice inicializado com ${ragIndex.documents.length} documentos`);
}

/**
 * Base de conhecimento da metodologia SENAI (legado - mantido para compatibilidade)
 * Extraído do Guia Prático SENAI e metodologia SAEP
 */
const baseConhecimento = {
  // Metodologia SENAI de Educação Profissional (MSEP)
  metodologia: {
    principios: `
A Metodologia SENAI de Educação Profissional (MSEP) é baseada no desenvolvimento de competências profissionais.

PRINCÍPIOS FUNDAMENTAIS:
1. Formação baseada em competências profissionais
2. Integração entre teoria e prática
3. Contextualização do conhecimento no mundo do trabalho
4. Avaliação contínua e formativa
5. Desenvolvimento de capacidades técnicas, sociais, organizativas e metodológicas

COMPETÊNCIA PROFISSIONAL:
É a mobilização de conhecimentos, habilidades e atitudes necessários ao desempenho de atividades ou funções típicas de uma ocupação, segundo padrões de qualidade e produtividade requeridos pela natureza do trabalho.

TIPOS DE CAPACIDADES:
- Capacidades Técnicas (CT): Relacionadas ao saber fazer técnico da profissão
- Capacidades Sociais: Relacionadas à interação e comunicação
- Capacidades Organizativas: Relacionadas à organização do trabalho
- Capacidades Metodológicas: Relacionadas à resolução de problemas e tomada de decisão
`,
    situacaoAprendizagem: `
SITUAÇÃO DE APRENDIZAGEM (SA):
É uma estratégia de ensino que contextualiza o processo de aprendizagem em situações reais ou simuladas do mundo do trabalho.

CARACTERÍSTICAS DA SA:
1. Baseada em situação-problema real do mundo do trabalho
2. Integra conhecimentos, habilidades e atitudes
3. Desenvolve autonomia e protagonismo do aluno
4. Permite avaliação por competências
5. Contextualiza o conteúdo técnico

ELEMENTOS DA SA:
- Desafio: Situação-problema a ser resolvida
- Contexto: Ambiente profissional simulado
- Entregas: Produtos ou resultados esperados
- Critérios: Parâmetros de avaliação
`
  },

  // Sistema de Avaliação da Educação Profissional (SAEP)
  saep: {
    estruturaQuestao: `
ESTRUTURA DA QUESTÃO SAEP:

1. CONTEXTO (Situação-Problema)
- Apresenta uma situação real do mundo do trabalho
- Deve ser claro, objetivo e relevante para a área profissional
- Fornece informações necessárias para a resolução
- Não deve conter informações desnecessárias que confundam
- Deve simular um ambiente profissional autêntico

2. COMANDO (Pergunta)
- É a pergunta propriamente dita
- Deve estar DIRETAMENTE relacionado ao contexto
- O aluno NÃO deve conseguir responder apenas lendo o comando
- Evitar comandos subjetivos como "qual a melhor opção"
- Usar verbos de ação: identificar, aplicar, analisar, avaliar

3. ALTERNATIVAS (4 opções: a, b, c, d)
- Apenas UMA correta (gabarito)
- Distratores (alternativas incorretas) devem ser PLAUSÍVEIS
- Tamanhos SEMELHANTES entre as alternativas
- A resposta correta NÃO pode ser maior que as outras
- NÃO usar "todas as anteriores" ou "nenhuma das anteriores"
- NÃO usar pegadinhas ou termos inexistentes
- Todas devem ser relacionadas ao conteúdo avaliado
`,
    regrasElaboracao: `
REGRAS PARA ELABORAÇÃO DE ITENS SAEP:

1. VINCULAÇÃO À CAPACIDADE
- Cada questão deve avaliar UMA capacidade específica
- A capacidade deve estar claramente identificada
- O item deve permitir verificar se o aluno desenvolveu a capacidade

2. CONTEXTUALIZAÇÃO PROFISSIONAL
- Usar situações REAIS do ambiente de trabalho
- Incluir elementos técnicos da área profissional
- Evitar situações genéricas ou acadêmicas demais
- Simular desafios que o profissional enfrentaria

3. CLAREZA E OBJETIVIDADE
- Linguagem clara e acessível
- Evitar dupla interpretação
- Comando direto e objetivo
- Não usar negativas duplas

4. DISTRATORES EFICAZES
- Alternativas incorretas devem ser plausíveis
- Baseadas em erros comuns dos alunos
- Não devem ser obviamente erradas
- Devem ter relação com o conteúdo avaliado

5. DISTRIBUIÇÃO DO GABARITO
- Variar a posição da resposta correta
- Não criar padrões previsíveis
- Distribuir equilibradamente entre a, b, c, d

6. INDEPENDÊNCIA DOS ITENS
- Cada questão deve ser independente
- A resposta de uma não deve depender de outra
- Não revelar respostas de outras questões
`,
    verbosAcao: `
VERBOS DE AÇÃO POR NÍVEL DE COMPLEXIDADE:

NÍVEL BÁSICO (Conhecimento/Compreensão) - Dificuldade FÁCIL:
- Identificar: Reconhecer elementos, conceitos ou características
- Reconhecer: Distinguir entre opções apresentadas
- Descrever: Relatar características ou processos
- Listar: Enumerar elementos ou etapas
- Nomear: Atribuir nome correto a elementos
- Definir: Apresentar significado de termos
- Citar: Mencionar exemplos ou casos

NÍVEL INTERMEDIÁRIO (Aplicação/Análise) - Dificuldade MÉDIA:
- Aplicar: Usar conhecimento em situação prática
- Utilizar: Empregar ferramentas ou técnicas
- Demonstrar: Mostrar como realizar procedimento
- Calcular: Realizar operações matemáticas
- Resolver: Encontrar solução para problema
- Analisar: Examinar partes de um todo
- Comparar: Identificar semelhanças e diferenças
- Diferenciar: Distinguir características específicas

NÍVEL AVANÇADO (Síntese/Avaliação) - Dificuldade DIFÍCIL:
- Avaliar: Julgar com base em critérios
- Julgar: Emitir parecer fundamentado
- Propor: Sugerir soluções ou alternativas
- Planejar: Elaborar estratégias ou projetos
- Criar: Desenvolver algo novo
- Desenvolver: Elaborar de forma completa
- Criticar: Analisar pontos fortes e fracos
`
  },

  // Exemplos de questões por área
  exemplos: {
    bancoDados: `
EXEMPLO - BANCO DE DADOS:

CAPACIDADE: CT3 - Aplicar linguagem para consulta, manipulação e controle do banco de dados

CONTEXTO:
Uma empresa de e-commerce precisa gerar um relatório mensal de vendas. O desenvolvedor deve consultar o banco de dados PostgreSQL para obter o nome dos produtos e a quantidade vendida de cada um no mês de outubro, ordenando do mais vendido para o menos vendido.

COMANDO:
Considerando o contexto apresentado, qual comando SQL atende à necessidade descrita?

ALTERNATIVAS:
a) SELECT nome, quantidade FROM vendas WHERE mes = 'outubro' ORDER BY quantidade DESC;
b) SELECT nome, quantidade FROM vendas WHERE mes = 'outubro' ORDER BY quantidade ASC;
c) UPDATE vendas SET quantidade WHERE mes = 'outubro';
d) INSERT INTO vendas (nome, quantidade) VALUES ('outubro');

RESPOSTA CORRETA: a

ANÁLISE:
- Contexto: Situação real de trabalho (relatório de vendas)
- Comando: Direto, relacionado ao contexto
- Alternativas: Todas são comandos SQL válidos, mas apenas uma atende ao contexto
- Distratores: Baseados em erros comuns (ordenação errada, comando errado)
`,
    programacao: `
EXEMPLO - PROGRAMAÇÃO:

CAPACIDADE: CT2 - Implementar encapsulamento, herança e polimorfismo

CONTEXTO:
Uma software house está desenvolvendo um sistema de gestão de funcionários. O analista precisa criar uma classe base "Funcionario" com atributos protegidos (nome, salário) e uma classe derivada "Gerente" que herda de Funcionario e adiciona o atributo "bonus".

COMANDO:
De acordo com o contexto, qual conceito de POO está sendo aplicado na relação entre as classes Funcionario e Gerente?

ALTERNATIVAS:
a) Herança, pois Gerente estende as características de Funcionario
b) Composição, pois Gerente contém um objeto Funcionario
c) Agregação, pois Gerente referencia Funcionario externamente
d) Interface, pois Gerente implementa o contrato de Funcionario

RESPOSTA CORRETA: a
`,
    webDev: `
EXEMPLO - DESENVOLVIMENTO WEB:

CAPACIDADE: CT4 - Aplicar JavaScript para interatividade client-side

CONTEXTO:
Um desenvolvedor front-end precisa implementar uma funcionalidade em um formulário de cadastro. Quando o usuário clicar no botão "Enviar", o sistema deve validar se o campo "email" está preenchido antes de submeter o formulário.

COMANDO:
Segundo o contexto, qual evento JavaScript deve ser utilizado para executar a validação no momento correto?

ALTERNATIVAS:
a) onclick no botão de envio
b) onload na página
c) onchange no campo de email
d) onmouseover no formulário

RESPOSTA CORRETA: a
`
  },

  // Conhecimento técnico por área
  conhecimentoTecnico: {
    logicaProgramacao: [
      'Algoritmos e fluxogramas',
      'Variáveis e tipos de dados',
      'Operadores aritméticos, relacionais e lógicos',
      'Estruturas de controle: sequência, seleção (if/else, switch), repetição (for, while, do-while)',
      'Vetores e matrizes',
      'Funções e procedimentos',
      'Recursividade',
      'Ordenação e busca'
    ],
    bancoDados: [
      'Modelo Entidade-Relacionamento (MER)',
      'Normalização (1FN, 2FN, 3FN)',
      'SQL DDL: CREATE, ALTER, DROP',
      'SQL DML: INSERT, UPDATE, DELETE',
      'SQL DQL: SELECT, JOIN, GROUP BY, ORDER BY',
      'SQL DCL: GRANT, REVOKE',
      'Índices e otimização',
      'Procedures, Functions e Triggers',
      'Transações e ACID'
    ],
    programacaoOO: [
      'Classes e objetos',
      'Atributos e métodos',
      'Encapsulamento (public, private, protected)',
      'Herança e polimorfismo',
      'Classes abstratas e interfaces',
      'Sobrecarga e sobrescrita',
      'Coleções (List, Set, Map)',
      'Tratamento de exceções',
      'Padrões de projeto (Singleton, Factory, MVC)'
    ],
    desenvolvimentoWeb: [
      'HTML5: semântica, formulários, multimídia',
      'CSS3: seletores, box model, flexbox, grid',
      'JavaScript: DOM, eventos, AJAX, fetch',
      'Responsividade e mobile-first',
      'Frameworks front-end (React, Vue, Angular)',
      'Node.js e Express',
      'APIs RESTful',
      'Autenticação (JWT, OAuth)',
      'Banco de dados para web'
    ],
    mobile: [
      'Arquiteturas mobile (nativo, híbrido, PWA)',
      'Componentes de interface',
      'Navegação entre telas',
      'Armazenamento local (SQLite, SharedPreferences)',
      'Consumo de APIs',
      'Recursos nativos (câmera, GPS, sensores)',
      'Publicação em lojas'
    ]
  }
};

/**
 * Busca conhecimento relevante do RAG baseado na UC e assunto
 * @param {string} unidadeCurricular - Nome da UC
 * @param {string} assunto - Assunto da prova
 * @param {array} capacidades - Capacidades selecionadas
 * @returns {string} - Contexto relevante para a geração
 */
export function buscarConhecimentoRAG(unidadeCurricular, assunto, capacidades) {
  let contexto = '';
  
  // Sempre incluir metodologia SAEP
  contexto += baseConhecimento.saep.estruturaQuestao;
  contexto += '\n\n';
  contexto += baseConhecimento.saep.regrasElaboracao;
  contexto += '\n\n';
  contexto += baseConhecimento.saep.verbosAcao;
  
  // Buscar exemplo relevante baseado na UC
  const ucLower = unidadeCurricular.toLowerCase();
  const assuntoLower = assunto.toLowerCase();
  
  if (ucLower.includes('banco') || ucLower.includes('dados') || assuntoLower.includes('sql')) {
    contexto += '\n\nEXEMPLO DE QUESTÃO MODELO:\n';
    contexto += baseConhecimento.exemplos.bancoDados;
    contexto += '\n\nCONTEÚDOS TÉCNICOS RELEVANTES:\n';
    contexto += baseConhecimento.conhecimentoTecnico.bancoDados.join('\n- ');
  }
  
  if (ucLower.includes('programação') || ucLower.includes('orientada') || ucLower.includes('objetos') || assuntoLower.includes('poo') || assuntoLower.includes('classe')) {
    contexto += '\n\nEXEMPLO DE QUESTÃO MODELO:\n';
    contexto += baseConhecimento.exemplos.programacao;
    contexto += '\n\nCONTEÚDOS TÉCNICOS RELEVANTES:\n';
    contexto += baseConhecimento.conhecimentoTecnico.programacaoOO.join('\n- ');
  }
  
  if (ucLower.includes('web') || ucLower.includes('front') || ucLower.includes('back') || assuntoLower.includes('html') || assuntoLower.includes('javascript')) {
    contexto += '\n\nEXEMPLO DE QUESTÃO MODELO:\n';
    contexto += baseConhecimento.exemplos.webDev;
    contexto += '\n\nCONTEÚDOS TÉCNICOS RELEVANTES:\n';
    contexto += baseConhecimento.conhecimentoTecnico.desenvolvimentoWeb.join('\n- ');
  }
  
  if (ucLower.includes('lógica') || ucLower.includes('algoritmo') || assuntoLower.includes('algoritmo') || assuntoLower.includes('estrutura')) {
    contexto += '\n\nCONTEÚDOS TÉCNICOS RELEVANTES:\n';
    contexto += baseConhecimento.conhecimentoTecnico.logicaProgramacao.join('\n- ');
  }
  
  if (ucLower.includes('mobile') || ucLower.includes('aplicativo') || assuntoLower.includes('android') || assuntoLower.includes('ios')) {
    contexto += '\n\nCONTEÚDOS TÉCNICOS RELEVANTES:\n';
    contexto += baseConhecimento.conhecimentoTecnico.mobile.join('\n- ');
  }
  
  return contexto;
}

/**
 * Obtém sugestões de temas baseado na UC
 * @param {string} unidadeCurricular - Nome da UC
 * @returns {array} - Lista de sugestões de temas
 */
export function getSugestoesTemas(unidadeCurricular) {
  const ucLower = unidadeCurricular.toLowerCase();
  
  if (ucLower.includes('banco') || ucLower.includes('dados')) {
    return baseConhecimento.conhecimentoTecnico.bancoDados;
  }
  
  if (ucLower.includes('programação') && (ucLower.includes('orientada') || ucLower.includes('objetos'))) {
    return baseConhecimento.conhecimentoTecnico.programacaoOO;
  }
  
  if (ucLower.includes('web') || ucLower.includes('front') || ucLower.includes('back')) {
    return baseConhecimento.conhecimentoTecnico.desenvolvimentoWeb;
  }
  
  if (ucLower.includes('lógica') || ucLower.includes('algoritmo')) {
    return baseConhecimento.conhecimentoTecnico.logicaProgramacao;
  }
  
  if (ucLower.includes('mobile') || ucLower.includes('aplicativo')) {
    return baseConhecimento.conhecimentoTecnico.mobile;
  }
  
  // Retorna sugestões genéricas
  return [
    'Conceitos fundamentais da área',
    'Aplicação prática de técnicas',
    'Ferramentas e tecnologias',
    'Boas práticas profissionais',
    'Resolução de problemas'
  ];
}

/**
 * Obtém o contexto completo do RAG (para uso externo)
 */
export function getContextoRAG(unidadeCurricular, assunto) {
  return buscarConhecimentoRAG(unidadeCurricular, assunto, []);
}

// ============================================
// NOVAS FUNÇÕES RAG v1.2.0
// ============================================

/**
 * Busca avançada no RAG usando índice TF-IDF
 * @param {string} query - Consulta de busca
 * @param {object} options - Opções de busca
 * @returns {object} - Resultados da busca com contexto
 */
export function searchRAG(query, options = {}) {
  initializeRAGIndex();
  
  const { maxResults = 5, types = null } = options;
  let results = ragIndex.search(query, maxResults * 2);
  
  // Filtrar por tipo se especificado
  if (types && Array.isArray(types)) {
    results = results.filter(r => types.includes(r.metadata?.type));
  }
  
  return results.slice(0, maxResults);
}

/**
 * Buscar informações de curso específico
 * @param {string} cursoNome - Nome do curso
 * @returns {object|null} - Dados do curso
 */
export function getCursoInfo(cursoNome) {
  initializeRAGIndex();
  
  const cursoLower = cursoNome.toLowerCase();
  return matrizesData.cursos.find(c => 
    c.nome.toLowerCase().includes(cursoLower) ||
    c.id.toLowerCase().includes(cursoLower.replace(/\s+/g, '-'))
  );
}

/**
 * Buscar informações de UC específica
 * @param {string} cursoNome - Nome do curso
 * @param {string} ucNome - Nome da UC
 * @returns {object|null} - Dados da UC
 */
export function getUCInfo(cursoNome, ucNome) {
  const curso = getCursoInfo(cursoNome);
  if (!curso) return null;
  
  const ucLower = ucNome.toLowerCase();
  return curso.unidadesCurriculares.find(uc => 
    uc.nome.toLowerCase().includes(ucLower)
  );
}

/**
 * Obter conhecimentos detalhados de uma UC para Plano de Ensino
 * @param {string} cursoNome - Nome do curso
 * @param {string} ucNome - Nome da UC
 * @returns {object} - Conhecimentos formatados para blocos de aula
 */
export function getConhecimentosUC(cursoNome, ucNome) {
  const uc = getUCInfo(cursoNome, ucNome);
  if (!uc) return null;
  
  const resultado = {
    uc: uc.nome,
    cargaHoraria: uc.cargaHoraria,
    objetivo: uc.objetivo,
    conhecimentos: [],
    conhecimentosTexto: ''
  };
  
  if (uc.conhecimentos) {
    resultado.conhecimentos = uc.conhecimentos.map(c => {
      if (typeof c === 'string') {
        return { topico: c, subtopicos: [] };
      }
      return c;
    });
    
    // Formatar texto para prompt
    resultado.conhecimentosTexto = resultado.conhecimentos.map(c => {
      if (c.subtopicos && c.subtopicos.length > 0) {
        return `${c.topico}\n  ${c.subtopicos.join('\n  ')}`;
      }
      return c.topico || c;
    }).join('\n');
  }
  
  if (uc.conhecimentosResumidos) {
    resultado.conhecimentosResumidos = uc.conhecimentosResumidos;
  }
  
  return resultado;
}

/**
 * Gerar contexto RAG específico para Plano de Ensino
 * @param {object} params - Parâmetros
 * @returns {string} - Contexto formatado para geração de Plano de Ensino
 */
export function gerarContextoPlanoEnsino(params) {
  initializeRAGIndex();
  
  const { curso, unidadeCurricular, capacidades } = params;
  let contexto = '';
  
  // 1. Informações do curso
  const cursoInfo = getCursoInfo(curso);
  if (cursoInfo) {
    contexto += `=== CURSO ===\n`;
    contexto += `Nome: ${cursoInfo.nome}\n`;
    contexto += `Competência Geral: ${cursoInfo.competenciaGeral}\n\n`;
  }
  
  // 2. Conhecimentos detalhados da UC
  const conhecimentosUC = getConhecimentosUC(curso, unidadeCurricular);
  if (conhecimentosUC) {
    contexto += `=== UNIDADE CURRICULAR ===\n`;
    contexto += `UC: ${conhecimentosUC.uc}\n`;
    contexto += `Carga Horária: ${conhecimentosUC.cargaHoraria}h\n`;
    contexto += `Objetivo: ${conhecimentosUC.objetivo}\n\n`;
    
    contexto += `=== CONHECIMENTOS DA MATRIZ CURRICULAR ===\n`;
    contexto += `Os blocos de aula devem ser baseados nos seguintes conhecimentos:\n\n`;
    contexto += conhecimentosUC.conhecimentosTexto;
    contexto += '\n\n';
    
    if (conhecimentosUC.conhecimentosResumidos) {
      contexto += `=== RESUMO DOS CONHECIMENTOS ===\n`;
      conhecimentosUC.conhecimentosResumidos.forEach(c => {
        contexto += `- ${c}\n`;
      });
      contexto += '\n';
    }
  }
  
  // 3. Capacidades selecionadas
  if (capacidades && capacidades.length > 0) {
    contexto += `=== CAPACIDADES A DESENVOLVER ===\n`;
    capacidades.forEach(cap => {
      contexto += `- ${cap.codigo}: ${cap.descricao}\n`;
    });
    contexto += '\n';
  }
  
  // 4. Metodologia de Plano de Ensino
  const planoEnsino = metodologiaData.metodologia.planoEnsino;
  if (planoEnsino) {
    contexto += `=== METODOLOGIA SENAI - PLANO DE ENSINO ===\n`;
    contexto += `${planoEnsino.definicao}\n\n`;
    contexto += `Elementos do Plano de Ensino:\n`;
    planoEnsino.elementos.forEach(el => {
      contexto += `- ${el.elemento}: ${el.descricao}\n`;
    });
  }
  
  return contexto;
}

/**
 * Obter metodologia SENAI para SA
 * @returns {object} - Dados da metodologia de SA
 */
export function getMetodologiaSA() {
  return metodologiaData.metodologia.situacaoAprendizagem;
}

/**
 * Obter metodologia SENAI para Avaliação Prática
 * @returns {object} - Dados da metodologia de avaliação prática
 */
export function getMetodologiaAvaliacaoPratica() {
  return metodologiaData.metodologia.avaliacaoPratica;
}

/**
 * Obter taxonomia de Bloom
 * @param {string} nivel - Nome do nível (opcional)
 * @returns {object|array} - Dados da taxonomia
 */
export function getTaxonomiaBloom(nivel = null) {
  const taxonomia = metodologiaData.metodologia.taxonomiaBloom;
  if (nivel) {
    return taxonomia.niveis.find(n => 
      n.nome.toLowerCase() === nivel.toLowerCase()
    );
  }
  return taxonomia;
}

/**
 * Obter estratégias pedagógicas
 * @param {string} nome - Nome da estratégia (opcional)
 * @returns {object|array} - Dados das estratégias
 */
export function getEstrategiasPedagogicas(nome = null) {
  const estrategias = metodologiaData.metodologia.estrategiasPedagogicas;
  if (nome) {
    return estrategias.find(e => 
      e.nome.toLowerCase() === nome.toLowerCase()
    );
  }
  return estrategias;
}

/**
 * Gerar contexto RAG completo para geração de conteúdo
 * @param {object} params - Parâmetros da busca
 * @returns {string} - Contexto formatado para LLM
 */
export function gerarContextoRAGCompleto(params) {
  initializeRAGIndex();
  
  const { curso, unidadeCurricular, capacidades, tipoConteudo, assunto } = params;
  let contexto = '';
  
  // 1. Buscar informações do curso e UC
  const cursoInfo = getCursoInfo(curso);
  const ucInfo = cursoInfo ? getUCInfo(curso, unidadeCurricular) : null;
  
  if (cursoInfo) {
    contexto += `\n=== INFORMAÇÕES DO CURSO ===\n`;
    contexto += `Curso: ${cursoInfo.nome}\n`;
    contexto += `Perfil Profissional: ${cursoInfo.perfilProfissional}\n`;
    contexto += `Competência Geral: ${cursoInfo.competenciaGeral}\n`;
  }
  
  if (ucInfo) {
    contexto += `\n=== UNIDADE CURRICULAR ===\n`;
    contexto += `UC: ${ucInfo.nome}\n`;
    contexto += `Carga Horária: ${ucInfo.cargaHoraria}h\n`;
    contexto += `Objetivo: ${ucInfo.objetivo}\n`;
    
    if (ucInfo.capacidadesTecnicas) {
      contexto += `\nCapacidades Técnicas:\n`;
      ucInfo.capacidadesTecnicas.forEach(cap => {
        contexto += `- ${cap.codigo}: ${cap.descricao}\n`;
      });
    }
    
    if (ucInfo.conhecimentos) {
      contexto += `\nConhecimentos:\n`;
      ucInfo.conhecimentos.forEach(c => {
        contexto += `- ${c}\n`;
      });
    }
  }
  
  // 2. Buscar metodologia relevante
  if (tipoConteudo === 'sa' || tipoConteudo === 'situacao_aprendizagem') {
    const metodologiaSA = getMetodologiaSA();
    contexto += `\n=== METODOLOGIA SENAI - SITUAÇÃO DE APRENDIZAGEM ===\n`;
    contexto += `Definição: ${metodologiaSA.definicao}\n`;
    contexto += `\nEstrutura da SA:\n`;
    Object.entries(metodologiaSA.estrutura).forEach(([key, value]) => {
      contexto += `- ${key}: ${value}\n`;
    });
    contexto += `\nCaracterísticas:\n`;
    metodologiaSA.caracteristicas.forEach(c => {
      contexto += `- ${c}\n`;
    });
  }
  
  if (tipoConteudo === 'pratica' || tipoConteudo === 'avaliacao_pratica') {
    const metodologiaPratica = getMetodologiaAvaliacaoPratica();
    contexto += `\n=== METODOLOGIA SENAI - AVALIAÇÃO PRÁTICA ===\n`;
    contexto += `Definição: ${metodologiaPratica.definicao}\n`;
    contexto += `\nEstrutura:\n`;
    Object.entries(metodologiaPratica.estrutura).forEach(([key, value]) => {
      contexto += `- ${key}: ${value}\n`;
    });
  }
  
  // 3. Buscar por relevância textual
  if (assunto) {
    const resultadosBusca = searchRAG(assunto, { maxResults: 3 });
    if (resultadosBusca.length > 0) {
      contexto += `\n=== CONTEÚDO RELEVANTE (RAG) ===\n`;
      resultadosBusca.forEach(r => {
        contexto += `[${r.metadata?.type || 'doc'}] ${r.content.substring(0, 300)}...\n\n`;
      });
    }
  }
  
  // 4. Incluir base de conhecimento legada
  contexto += '\n' + buscarConhecimentoRAG(unidadeCurricular, assunto || '', capacidades || []);
  
  return contexto;
}

/**
 * Obter estatísticas do índice RAG
 * @returns {object} - Estatísticas do índice
 */
export function getRAGStats() {
  initializeRAGIndex();
  
  const stats = {
    totalDocumentos: ragIndex.documents.length,
    totalTermos: Object.keys(ragIndex.invertedIndex).length,
    documentosPorTipo: {}
  };
  
  ragIndex.documents.forEach(doc => {
    const type = doc.metadata?.type || 'unknown';
    stats.documentosPorTipo[type] = (stats.documentosPorTipo[type] || 0) + 1;
  });
  
  return stats;
}

/**
 * Obter dados brutos da base de conhecimento
 */
export function getKnowledgeBase() {
  return {
    matrizes: matrizesData,
    metodologia: metodologiaData
  };
}

export default {
  buscarConhecimentoRAG,
  getSugestoesTemas,
  getContextoRAG,
  baseConhecimento,
  // Novas funções RAG v1.2.0
  searchRAG,
  getCursoInfo,
  getUCInfo,
  getConhecimentosUC,
  gerarContextoPlanoEnsino,
  getMetodologiaSA,
  getMetodologiaAvaliacaoPratica,
  getTaxonomiaBloom,
  getEstrategiasPedagogicas,
  gerarContextoRAGCompleto,
  getRAGStats,
  getKnowledgeBase,
  initializeRAGIndex
};
