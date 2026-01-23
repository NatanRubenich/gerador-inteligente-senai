/**
 * Serviço para geração de Plano de Ensino
 * Compatível com o sistema SGN do SENAI
 * Baseado na Metodologia SENAI de Educação Profissional (MSEP)
 * Seguindo o Guia Prático SENAI/SC para elaboração de Plano de Ensino
 * v3.0.0 - Estrutura de blocos conforme guia SENAI
 */

// URL da API do backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Faz chamada à API do Google Gemini via BACKEND
 * A API Key fica APENAS no servidor (segurança)
 */
async function callGeminiAPI(systemPrompt, userPrompt, maxTokens = 16384) {
  console.log('[Gemini] Chamando API via backend...');

  try {
    const response = await fetch(`${API_URL}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt, maxTokens })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro na API Gemini');
    }
    
    console.log('[Gemini] Resposta recebida:', result.content.length, 'caracteres');
    return result.content;
  } catch (error) {
    console.error('[Gemini] Erro na chamada:', error.message);
    throw error;
  }
}

/**
 * Faz chamada à API LLM (Gemini via backend)
 */
async function callLLMAPI(systemPrompt, userPrompt, maxTokens = 16384) {
  console.log('[Plano Ensino Service] Usando Gemini via backend');
  return callGeminiAPI(systemPrompt, userPrompt, maxTokens);
}

/**
 * Calcula a estrutura de blocos conforme regras do guia SENAI
 * - Cursos >= 40h: blocos de no máximo 20h
 * - Cursos < 40h: blocos de no máximo 10h
 * - Cursos muito curtos: múltiplos de 2h
 */
function calcularEstruturaBlocos(cargaHorariaTotal) {
  let maxHorasPorBloco;
  
  if (cargaHorariaTotal >= 40) {
    maxHorasPorBloco = 20;
  } else if (cargaHorariaTotal >= 20) {
    maxHorasPorBloco = 10;
  } else {
    // Para cursos muito curtos, usar múltiplos de 2h
    maxHorasPorBloco = Math.max(2, Math.floor(cargaHorariaTotal / 2));
  }
  
  const numBlocos = Math.ceil(cargaHorariaTotal / maxHorasPorBloco);
  const horasPorBloco = Math.floor(cargaHorariaTotal / numBlocos);
  const horasRestantes = cargaHorariaTotal % numBlocos;
  
  return {
    numBlocos,
    horasPorBloco,
    horasRestantes,
    maxHorasPorBloco
  };
}

/**
 * Determina quantidade de avaliações objetivas conforme carga horária
 * - Até 70h: 1 avaliação objetiva
 * - 71h a 120h: 2 avaliações objetivas
 * - Acima de 120h: 3 ou mais avaliações objetivas
 */
function calcularAvaliacoes(cargaHorariaTotal) {
  let numAvaliacoesObjetivas;
  
  if (cargaHorariaTotal <= 70) {
    numAvaliacoesObjetivas = 1;
  } else if (cargaHorariaTotal <= 120) {
    numAvaliacoesObjetivas = 2;
  } else {
    numAvaliacoesObjetivas = Math.ceil(cargaHorariaTotal / 60);
  }
  
  return {
    numAvaliacoesObjetivas,
    temAvaliacaoDiagnostica: true, // Sempre no primeiro bloco
    temAvaliacaoPratica: true // Ao longo dos blocos
  };
}

// Ambientes Pedagógicos comuns
export const AMBIENTES_PEDAGOGICOS = [
  'Sala de Aula',
  'Laboratório de informática',
  'Oficina/Laboratório prático',
  'Biblioteca',
  'Ambiente Virtual de Aprendizagem (AVA)',
  'Auditório',
  'Sala de reuniões',
  'Empresa parceira (visita técnica)'
];

// Instrumentos de Avaliação para o SGN
export const INSTRUMENTOS_AVALIACAO = [
  'Exercícios teóricos e práticos',
  'Avaliações objetivas',
  'Avaliações práticas',
  'Trabalhos em grupo',
  'Trabalhos individuais',
  'Apresentação de seminários',
  'Relatórios técnicos',
  'Projeto integrador',
  'Portfólio',
  'Autoavaliação',
  'Observação direta'
];

// Softwares/Ferramentas comuns por área (ordenados por prioridade)
export const FERRAMENTAS_COMUNS = {
  prioritarias: [
    'Quadro branco',
    'Projetor multimídia',
    'VSCode',
    'Portugol Studio',
    'pgAdmin',
    'Node.js',
    'Postman',
    'Git/GitHub'
  ],
  informatica: [
    'Visual Studio',
    'MySQL Workbench',
    'Docker',
    'Figma',
    'DBeaver'
  ],
  programacao: [
    'Python IDLE',
    'Eclipse',
    'IntelliJ IDEA',
    'NetBeans',
    'Jupyter Notebook'
  ],
  redes: [
    'Packet Tracer',
    'Wireshark',
    'VirtualBox',
    'VMware',
    'PuTTY'
  ],
  geral: [
    'Microsoft Office',
    'Google Workspace',
    'Google Chrome',
    'Google Drive'
  ]
};

// Estratégias de Ensino disponíveis no SGN
export const ESTRATEGIAS_ENSINO = [
  'Exposição Dialogada',
  'Atividade Prática',
  'Gamificação',
  'Trabalho em Grupo',
  'Dinâmica de Grupo',
  'Visita Técnica',
  'Ensaio Tecnológico',
  'Workshop',
  'Seminário',
  'Painel Temático',
  'Sala de Aula Invertida',
  'Design Thinking'
];

/**
 * Função auxiliar para formatar conhecimentos da matriz curricular em texto
 */
function formatarConhecimentos(conhecimentos, nivel = 0) {
  if (!conhecimentos || conhecimentos.length === 0) return '';
  
  return conhecimentos.map(c => {
    const indent = '  '.repeat(nivel);
    let texto = `${indent}${c.codigo} ${c.titulo}`;
    if (c.subitens && c.subitens.length > 0) {
      texto += '\n' + formatarConhecimentos(c.subitens, nivel + 1);
    }
    return texto;
  }).join('\n');
}

/**
 * Função auxiliar para extrair lista plana de conhecimentos
 */
function extrairConhecimentosPlanos(conhecimentos, resultado = []) {
  if (!conhecimentos) return resultado;
  
  conhecimentos.forEach(c => {
    resultado.push({ codigo: c.codigo, titulo: c.titulo });
    if (c.subitens && c.subitens.length > 0) {
      extrairConhecimentosPlanos(c.subitens, resultado);
    }
  });
  
  return resultado;
}

/**
 * Gera um Plano de Ensino completo usando IA
 * Compatível com os campos do sistema SGN
 * Seguindo o Guia Prático SENAI/SC para elaboração de Plano de Ensino
 * Estrutura de blocos conforme regras do guia:
 * - Cursos >= 40h: blocos de no máximo 20h
 * - Cursos < 40h: blocos de no máximo 10h
 * - Cursos muito curtos: múltiplos de 2h
 */
export async function gerarPlanoEnsino({
  curso,
  unidadeCurricular,
  capacidades,
  cargaHoraria,
  periodo,
  competenciaGeral,
  ambientesPedagogicos,
  instrumentosAvaliacao,
  ferramentas,
  contextoAdicional,
  termoCapacidade = 'Capacidade',
  quantidadeBlocos = null,
  conhecimentosUC = [] // Conhecimentos da matriz curricular
}) {
  // Calcular estrutura de blocos conforme guia SENAI
  const estrutura = calcularEstruturaBlocos(cargaHoraria);
  const numBlocos = quantidadeBlocos || estrutura.numBlocos;
  const maxHorasPorBloco = estrutura.maxHorasPorBloco;
  
  // Calcular avaliações conforme carga horária
  const avaliacoes = calcularAvaliacoes(cargaHoraria);

  // Separar capacidades por tipo
  const capacidadesBasicas = capacidades.filter(c => 
    c.codigo?.toLowerCase().includes('cb') || c.tipo === 'basica'
  );
  const capacidadesTecnicas = capacidades.filter(c => 
    c.codigo?.toLowerCase().includes('ct') || c.tipo === 'tecnica'
  );
  const capacidadesSocioemocionais = capacidades.filter(c => 
    c.codigo?.toLowerCase().includes('cse') || c.tipo === 'socioemocional'
  );

  // Formatar capacidades para o prompt com separação por tipo
  let capacidadesTexto = '';
  if (capacidadesBasicas.length > 0) {
    capacidadesTexto += `\nCAPACIDADES BÁSICAS:\n`;
    capacidadesBasicas.forEach((cap, i) => {
      capacidadesTexto += `  ${cap.codigo} - ${cap.descricao}\n`;
    });
  }
  if (capacidadesTecnicas.length > 0) {
    capacidadesTexto += `\nCAPACIDADES TÉCNICAS:\n`;
    capacidadesTecnicas.forEach((cap, i) => {
      capacidadesTexto += `  ${cap.codigo} - ${cap.descricao}\n`;
    });
  }
  if (capacidadesSocioemocionais.length > 0) {
    capacidadesTexto += `\nCAPACIDADES SOCIOEMOCIONAIS:\n`;
    capacidadesSocioemocionais.forEach((cap, i) => {
      capacidadesTexto += `  ${cap.codigo} - ${cap.descricao}\n`;
    });
  }
  
  // Também criar lista indexada para referência nos blocos
  const capacidadesIndexadas = capacidades.map((cap, i) => 
    `${i}. ${cap.codigo} - ${cap.descricao}`
  ).join('\n');

  // Formatar ambientes
  const ambientesTexto = ambientesPedagogicos.join('; ');

  // Formatar instrumentos
  const instrumentosTexto = instrumentosAvaliacao.join('; ');

  // Formatar conhecimentos da matriz curricular
  const conhecimentosTexto = conhecimentosUC.length > 0 
    ? formatarConhecimentos(conhecimentosUC)
    : 'Não especificados - gerar com base nas capacidades';

  // Lista plana de conhecimentos para referência
  const conhecimentosPlanos = extrairConhecimentosPlanos(conhecimentosUC);

  const prompt = `Você é um especialista em educação profissional do SENAI, seguindo a Metodologia SENAI de Educação Profissional (MSEP) e o Guia Prático SENAI/SC para elaboração de Plano de Ensino.

REGRAS DE CONTEÚDO PROIBIDO (OBRIGATÓRIO):
- JAMAIS aborde temas relacionados a pornografia, conteúdo sexual ou adulto
- JAMAIS aborde jogos de azar, apostas ou cassinos
- JAMAIS crie conteúdo que fira os direitos humanos, seja discriminatório ou preconceituoso
- JAMAIS inclua conteúdo violento, que incite ódio ou seja ofensivo
- Mantenha sempre um tom profissional e educacional adequado ao ambiente escolar

=== DADOS DO CURSO ===
- Curso: ${curso}
- Unidade Curricular: ${unidadeCurricular}
- Carga Horária Total: ${cargaHoraria}h
- Período: ${periodo}
- Competência Geral do Curso: ${competenciaGeral}

=== ${termoCapacidade.toUpperCase()}S A DESENVOLVER ===
IMPORTANTE: Use APENAS estas capacidades que existem na UC. NÃO invente capacidades.
${capacidadesTexto}

Lista indexada para referência nos blocos (índice começa em 0):
${capacidadesIndexadas}

=== CONHECIMENTOS DA MATRIZ CURRICULAR ===
IMPORTANTE: Use EXATAMENTE estes conhecimentos. NÃO invente conhecimentos.
${conhecimentosTexto}

=== RECURSOS DISPONÍVEIS ===
Ambientes Pedagógicos: ${ambientesTexto}
Ferramentas/Softwares: ${ferramentas.join(', ')}
Instrumentos de Avaliação: ${instrumentosTexto}

${contextoAdicional ? `=== ORIENTAÇÕES ADICIONAIS DO DOCENTE ===\n${contextoAdicional}` : ''}

=== ESTRUTURA DO PLANO DE ENSINO ===

REGRAS DE DIVISÃO EM BLOCOS (OBRIGATÓRIO):
- Carga horária total: ${cargaHoraria}h
- Máximo de horas por bloco: ${maxHorasPorBloco}h
- Número de blocos: ${numBlocos}
- Cada bloco deve ter carga horária em múltiplos de 2h

REGRAS DE AVALIAÇÃO (OBRIGATÓRIO):
- 1 avaliação diagnóstica OBRIGATÓRIA no primeiro bloco (para aferir conhecimento prévio)
- ${avaliacoes.numAvaliacoesObjetivas} avaliação(ões) objetiva(s) distribuída(s) ao longo dos blocos
- 1 avaliação prática ao longo dos blocos
- Entregas parciais da Situação de Aprendizagem entre os blocos
- Entrega final da Situação de Aprendizagem no último bloco
- Avaliações formativas em cada bloco para acompanhamento

REGRAS DE CAPACIDADES (OBRIGATÓRIO):
- Organizar em ordem CRESCENTE de complexidade (Taxonomia de Bloom)
- Agrupar de forma coerente e exequível para a prática pedagógica
- Separar por tipo: Básicas, Técnicas, Socioemocionais
- TODAS as capacidades devem ser utilizadas em algum bloco
- Capacidades podem ser repetidas em blocos diferentes se houver justificativa pedagógica

REGRAS DE CONHECIMENTOS (OBRIGATÓRIO):
- Devem estar associados DIRETAMENTE às capacidades
- Seguir progressão CRESCENTE de complexidade
- TODOS os conhecimentos devem ser utilizados em algum bloco
- Podem ser repetidos se coerente com a prática pedagógica

REGRAS DE ESTRATÉGIAS DE ENSINO (OBRIGATÓRIO):
- Devem ser DIVERSIFICADAS no mesmo bloco
- Podem ser repetidas em blocos diferentes
- Devem ser EXEQUÍVEIS em sala
- Cada estratégia descrita em no máximo um parágrafo
- Estratégias disponíveis: Exposição Dialogada, Atividade Prática, Trabalho em Grupo, Dinâmica de Grupo, Visita Técnica, Ensaio Tecnológico, Workshop, Seminário, Painel Temático, Gamificação, Sala de Aula Invertida, Design Thinking

REGRAS DE REFERÊNCIAS BIBLIOGRÁFICAS (OBRIGATÓRIO):
- Referências Básicas: 2-3 livros REAIS e EXISTENTES relacionados ao tema
- Referências Complementares: 2-3 livros/artigos REAIS e EXISTENTES
- Formato ABNT: SOBRENOME, Nome. Título: subtítulo. Edição. Cidade: Editora, Ano.
- NÃO invente livros ou autores. Use apenas referências que você tem certeza que existem.

=== ESTRUTURA DE CADA BLOCO (TABELA DE 6 LINHAS) ===

Cada bloco deve ter EXATAMENTE estas 6 categorias:

1. CAPACIDADES: Lista das capacidades trabalhadas neste bloco (usar códigos)
2. CONHECIMENTOS: Lista dos conhecimentos relacionados às capacidades
3. ESTRATÉGIAS DE ENSINO E DESCRIÇÃO DA ATIVIDADE: Descrição detalhada das atividades
4. AMBIENTES PEDAGÓGICOS: Sala de aula, Laboratório, etc.
5. INSTRUMENTOS DE AVALIAÇÃO (SOMATIVA): Avaliações formais do bloco
6. INSTRUMENTOS DE AVALIAÇÃO (FORMATIVA): Acompanhamento contínuo

=== FORMATO DE RESPOSTA ===

Retorne APENAS um JSON válido (sem markdown, sem texto antes ou depois):

{
  "objetivoUC": "Texto descritivo do objetivo geral da UC",
  "numCapacidadesBasicas": ${capacidadesBasicas.length},
  "numCapacidadesTecnicas": ${capacidadesTecnicas.length},
  "numCapacidadesSocioemocionais": ${capacidadesSocioemocionais.length},
  "ambientesPedagogicos": "${ambientesTexto}",
  "referenciasBasicas": "SOBRENOME, Nome. Título do Livro Real. Edição. Cidade: Editora, Ano.\\nSOBRENOME, Nome. Outro Livro Real. Edição. Cidade: Editora, Ano.",
  "referenciasComplementares": "SOBRENOME, Nome. Título Complementar Real. Edição. Cidade: Editora, Ano.\\nSOBRENOME, Nome. Artigo ou Livro Real. Edição. Cidade: Editora, Ano.",
  "observacoes": "",
  "totalCapacidadesUtilizadas": ${capacidades.length},
  "totalConhecimentosUtilizados": ${conhecimentosPlanos.length},
  "blocosAula": [
    {
      "numero": 1,
      "titulo": "Título descritivo do bloco",
      "cargaHoraria": ${Math.floor(cargaHoraria / numBlocos)},
      "capacidades": {
        "basicas": ["CB1", "CB2"],
        "tecnicas": ["CT1"],
        "socioemocionais": ["CSE1"]
      },
      "capacidadesIndices": [0, 1, 2],
      "conhecimentos": ["1.1 - Conhecimento X", "1.2 - Conhecimento Y"],
      "estrategiasEnsino": [
        {
          "estrategia": "Exposição Dialogada",
          "descricao": "Apresentação dos conceitos fundamentais com discussão em sala."
        },
        {
          "estrategia": "Atividade Prática",
          "descricao": "Exercícios práticos de aplicação dos conceitos."
        }
      ],
      "ambientesPedagogicos": "Sala de Aula; Laboratório de informática",
      "avaliacaoSomativa": {
        "diagnostica": "Questionário inicial para aferir conhecimentos prévios",
        "objetiva": "",
        "pratica": "",
        "entregaParcial": "Entrega parcial 1: Descrição da entrega"
      },
      "avaliacaoFormativa": "Observação direta; Feedback contínuo; Autoavaliação"
    }
  ]
}`;

  try {
    const systemPrompt = `Você é um especialista em educação profissional do SENAI, seguindo a Metodologia SENAI de Educação Profissional (MSEP) e o Guia Prático SENAI/SC.

REGRAS CRÍTICAS:
1. Responda APENAS com JSON válido, sem markdown ou texto adicional
2. Use APENAS as capacidades fornecidas - NÃO invente capacidades
3. Use APENAS os conhecimentos fornecidos - NÃO invente conhecimentos
4. Referências bibliográficas devem ser REAIS e EXISTENTES
5. Siga a estrutura de blocos conforme especificado`;
    
    const content = await callLLMAPI(systemPrompt, prompt);

    // Limpar e parsear JSON
    let jsonStr = content.trim();
    jsonStr = jsonStr.replace(/^```json\s*/i, '');
    jsonStr = jsonStr.replace(/^```\s*/i, '');
    jsonStr = jsonStr.replace(/\s*```$/i, '');
    jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') return char;
      return '';
    });
    jsonStr = jsonStr.trim();

    const planoEnsino = JSON.parse(jsonStr);

    // Mapear índices de capacidades para os códigos reais nos Blocos de Aula
    if (planoEnsino.blocosAula) {
      planoEnsino.blocosAula = planoEnsino.blocosAula.map((bloco, idx) => {
        // Mapear capacidades por índice
        const capacidadesTrabalhadas = (bloco.capacidadesIndices || []).map(i => 
          capacidades[i] ? { codigo: capacidades[i].codigo, descricao: capacidades[i].descricao } : null
        ).filter(Boolean);
        
        // Formatar estratégias para exibição
        const estrategiasFormatadas = Array.isArray(bloco.estrategiasEnsino) 
          ? bloco.estrategiasEnsino.map(e => `${e.estrategia}: ${e.descricao}`).join('\n')
          : bloco.estrategiasEnsino || bloco.estrategiasDetalhadas || '';
        
        return {
          ...bloco,
          numero: bloco.numero || idx + 1,
          capacidadesTrabalhadas,
          estrategiasFormatadas,
          // Compatibilidade com estrutura antiga
          estrategiasDetalhadas: estrategiasFormatadas,
          recursosPedagogicos: bloco.ambientesPedagogicos || bloco.recursosPedagogicos,
          conhecimentosRelacionados: bloco.conhecimentos || bloco.conhecimentosRelacionados,
          // Avaliações formatadas
          instrumentosAvaliacao: formatarAvaliacoes(bloco.avaliacaoSomativa, bloco.avaliacaoFormativa),
          criteriosAvaliacao: bloco.avaliacaoSomativa?.entregaParcial || bloco.criteriosAvaliacao || ''
        };
      });
    }

    // Adicionar metadados para o SGN
    return {
      ...planoEnsino,
      // Metadados
      curso,
      unidadeCurricular,
      cargaHoraria,
      periodo,
      competenciaGeral,
      numBlocos,
      maxHorasPorBloco,
      // Informações de avaliação
      avaliacoes: {
        numAvaliacoesObjetivas: avaliacoes.numAvaliacoesObjetivas,
        temAvaliacaoDiagnostica: avaliacoes.temAvaliacaoDiagnostica,
        temAvaliacaoPratica: avaliacoes.temAvaliacaoPratica
      },
      // Capacidades originais separadas por tipo
      capacidades: capacidades.map((cap, i) => ({
        indice: i,
        codigo: cap.codigo,
        descricao: cap.descricao,
        tipo: cap.tipo || inferirTipoCapacidade(cap.codigo)
      })),
      capacidadesBasicas: capacidadesBasicas.map(c => ({ codigo: c.codigo, descricao: c.descricao })),
      capacidadesTecnicas: capacidadesTecnicas.map(c => ({ codigo: c.codigo, descricao: c.descricao })),
      capacidadesSocioemocionais: capacidadesSocioemocionais.map(c => ({ codigo: c.codigo, descricao: c.descricao })),
      // Configurações usadas
      configAmbientes: ambientesPedagogicos,
      configInstrumentos: instrumentosAvaliacao,
      configFerramentas: ferramentas,
      // Timestamp
      geradoEm: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro ao gerar Plano de Ensino:', error);
    throw error;
  }
}

/**
 * Formata as avaliações somativas e formativas para exibição
 */
function formatarAvaliacoes(somativa, formativa) {
  let resultado = '';
  
  if (somativa) {
    if (somativa.diagnostica) resultado += `Diagnóstica: ${somativa.diagnostica}\n`;
    if (somativa.objetiva) resultado += `Objetiva: ${somativa.objetiva}\n`;
    if (somativa.pratica) resultado += `Prática: ${somativa.pratica}\n`;
    if (somativa.entregaParcial) resultado += `Entrega: ${somativa.entregaParcial}\n`;
    if (somativa.entregaFinal) resultado += `Entrega Final: ${somativa.entregaFinal}\n`;
  }
  
  if (formativa) {
    resultado += `Formativa: ${formativa}`;
  }
  
  return resultado.trim() || 'Avaliação contínua através de observação e feedback';
}

/**
 * Infere o tipo de capacidade pelo código
 */
function inferirTipoCapacidade(codigo) {
  if (!codigo) return 'tecnica';
  const cod = codigo.toLowerCase();
  if (cod.includes('cb')) return 'basica';
  if (cod.includes('cse')) return 'socioemocional';
  return 'tecnica';
}

export default {
  gerarPlanoEnsino,
  AMBIENTES_PEDAGOGICOS,
  INSTRUMENTOS_AVALIACAO,
  FERRAMENTAS_COMUNS,
  ESTRATEGIAS_ENSINO
};
