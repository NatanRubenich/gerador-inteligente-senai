// Serviço de integração com LLM (Google Gemini / Groq)
// Documentação Gemini: https://ai.google.dev/gemini-api/docs
// v1.4.0 - Integração com Google Gemini API

import { 
  GEMINI_API_KEY, 
  GEMINI_API_URL, 
  GEMINI_MODEL,
  GROQ_API_KEY, 
  GROQ_API_URL, 
  GROQ_MODEL,
  LLM_PROVIDER 
} from '../config/api';
import { 
  getContextoRAG, 
  buscarConhecimentoRAG, 
  gerarContextoRAGCompleto,
  getRAGStats,
  initializeRAGIndex
} from './ragService';

// Inicializar índice RAG ao carregar o serviço
try {
  initializeRAGIndex();
  console.log('[LLM Service] RAG inicializado:', getRAGStats());
} catch (e) {
  console.warn('[LLM Service] Erro ao inicializar RAG:', e);
}

/**
 * Limpa e corrige JSON malformado retornado pela API
 * @param {string} jsonString - String JSON potencialmente malformada
 * @returns {string} - String JSON corrigida
 */
function sanitizeJsonString(jsonString) {
  let cleaned = jsonString.trim();
  
  // 1. Remover marcadores markdown de código
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  
  // 2. Remover possíveis prefixos de texto antes do JSON
  const jsonStart = cleaned.indexOf('{');
  if (jsonStart > 0) {
    cleaned = cleaned.substring(jsonStart);
  }
  
  // 3. Remover possíveis sufixos de texto após o JSON
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1 && lastBrace < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }
  
  // 4. Remover caracteres de controle (exceto \n, \r, \t)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // 5. Corrigir quebras de linha dentro de strings JSON
  // Substituir quebras de linha literais dentro de valores por \n escapado
  cleaned = cleaned.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
    return `: "${p1}\\n${p2}"`;
  });
  
  // 6. Corrigir aspas simples usadas como delimitadores de string
  // Isso é mais complexo - precisamos identificar aspas simples que delimitam valores
  // Primeiro, vamos tentar parsear. Se falhar, tentamos corrigir aspas
  
  // 7. Remover vírgulas extras antes de } ou ]
  cleaned = cleaned.replace(/,\s*}/g, '}');
  cleaned = cleaned.replace(/,\s*]/g, ']');
  
  // 8. Adicionar aspas em propriedades não quotadas (comum em respostas de IA)
  // Padrão: palavra seguida de : sem aspas
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  return cleaned.trim();
}

/**
 * Tenta parsear JSON com múltiplas estratégias de correção
 * @param {string} content - Conteúdo retornado pela API
 * @returns {object} - Objeto JSON parseado
 */
function parseJsonSafely(content) {
  // Primeira tentativa: limpar e parsear
  let jsonString = sanitizeJsonString(content);
  
  try {
    return JSON.parse(jsonString);
  } catch (firstError) {
    console.warn('Primeira tentativa de parse falhou, tentando correções adicionais...');
    
    // Segunda tentativa: corrigir aspas simples para duplas em propriedades
    try {
      // Substituir aspas simples por duplas (cuidado com apóstrofos em texto)
      let fixed = jsonString;
      
      // Corrigir propriedades com aspas simples: 'prop': -> "prop":
      fixed = fixed.replace(/'([^']+)'(\s*:)/g, '"$1"$2');
      
      // Corrigir valores string com aspas simples no início/fim de valor
      // Isso é arriscado, então só fazemos se o parse anterior falhou
      fixed = fixed.replace(/:\s*'([^']*)'/g, ': "$1"');
      
      return JSON.parse(fixed);
    } catch (secondError) {
      console.warn('Segunda tentativa falhou, tentando extrair JSON válido...');
      
      // Terceira tentativa: usar regex para extrair estrutura JSON
      try {
        // Tentar encontrar o objeto principal
        const match = jsonString.match(/\{[\s\S]*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
      } catch (thirdError) {
        // Falhou todas as tentativas
      }
      
      // Lançar erro original com mais contexto
      const errorPosition = firstError.message.match(/position (\d+)/);
      const pos = errorPosition ? parseInt(errorPosition[1]) : 0;
      const context = jsonString.substring(Math.max(0, pos - 50), pos + 50);
      
      throw new Error(
        `Erro ao parsear JSON da API: ${firstError.message}\n` +
        `Contexto próximo ao erro: ...${context}...\n` +
        `Tente gerar novamente ou reduza o número de questões.`
      );
    }
  }
}

/**
 * Obtém a API Key configurada (Gemini ou Groq)
 */
export function getApiKey() {
  return LLM_PROVIDER === 'gemini' ? GEMINI_API_KEY : GROQ_API_KEY;
}

/**
 * Verifica se a API está configurada
 */
export function isApiConfigured() {
  const key = getApiKey();
  return Boolean(key && key.length > 10);
}

/**
 * Faz chamada à API do Google Gemini
 * @param {string} systemPrompt - Prompt do sistema
 * @param {string} userPrompt - Prompt do usuário
 * @param {number} maxTokens - Máximo de tokens na resposta
 * @returns {Promise<string>} - Conteúdo da resposta
 */
async function callGeminiAPI(systemPrompt, userPrompt, maxTokens = 8192) {
  const apiKey = GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key do Gemini não configurada. Crie o arquivo .env com VITE_GEMINI_API_KEY');
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  console.log('[Gemini] Chamando API:', GEMINI_MODEL);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await response.json();
    console.log('[Gemini] Response status:', response.status, 'finishReason:', data.candidates?.[0]?.finishReason);

    if (!response.ok) {
      console.error('[Gemini] Erro:', data);
      throw new Error(data.error?.message || `Erro na API Gemini: ${response.status}`);
    }
    
    // Verificar bloqueio de segurança
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Conteúdo bloqueado por políticas de segurança. Tente reformular.');
    }
    
    if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      throw new Error('Resposta truncada. Tente gerar menos questões.');
    }
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error('[Gemini] Resposta sem conteúdo:', data);
      throw new Error('Resposta vazia da API Gemini');
    }
    
    console.log('[Gemini] Resposta recebida:', content.length, 'caracteres');
    return content;
  } catch (error) {
    console.error('[Gemini] Erro na chamada:', error.message);
    throw error;
  }
}

/**
 * Faz chamada à API do Groq (formato OpenAI) - Fallback
 * @param {string} systemPrompt - Prompt do sistema
 * @param {string} userPrompt - Prompt do usuário
 * @param {number} maxTokens - Máximo de tokens na resposta
 * @returns {Promise<string>} - Conteúdo da resposta
 */
async function callGroqAPI(systemPrompt, userPrompt, maxTokens = 8192) {
  const apiKey = GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key do Groq não configurada. Configure a variável VITE_GROQ_API_KEY no arquivo .env');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Erro na API Groq: ${response.status}`);
  }

  const data = await response.json();
  
  // Verificar se a resposta foi truncada
  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    throw new Error('Resposta truncada. Tente gerar menos questões.');
  }
  
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Resposta vazia da API Groq');
  }

  return content;
}

/**
 * Faz chamada à API LLM configurada (Gemini ou Groq)
 * @param {string} systemPrompt - Prompt do sistema
 * @param {string} userPrompt - Prompt do usuário
 * @param {number} maxTokens - Máximo de tokens na resposta
 * @returns {Promise<string>} - Conteúdo da resposta
 */
async function callLLMAPI(systemPrompt, userPrompt, maxTokens = 8192) {
  console.log(`[LLM] Usando provider: ${LLM_PROVIDER}`);
  
  if (LLM_PROVIDER === 'gemini') {
    return callGeminiAPI(systemPrompt, userPrompt, maxTokens);
  } else {
    return callGroqAPI(systemPrompt, userPrompt, maxTokens);
  }
}

/**
 * Gera questões usando a API do Groq (Llama 3.3) com RAG integrado
 * @param {object} dadosProva - Dados da prova
 * @returns {Promise<object>} - JSON com as questões geradas
 */
export async function gerarQuestoes(dadosProva) {

  // Buscar contexto do RAG aprimorado (v1.3.0)
  const contextoRAG = gerarContextoRAGCompleto({
    curso: dadosProva.curso,
    unidadeCurricular: dadosProva.unidadeCurricular,
    capacidades: dadosProva.capacidades,
    tipoConteudo: 'questoes',
    assunto: dadosProva.assunto
  });
  
  console.log('[RAG] Contexto gerado para questões:', contextoRAG.length, 'caracteres');
  const { 
    turma, 
    professor, 
    unidadeCurricular, 
    data, 
    curso, 
    dificuldades = ['Médio'], 
    capacidades, 
    quantidade, 
    assunto,
    tipoEnsino,
    termoCapacidade 
  } = dadosProva;

  // Calcular distribuição de questões por dificuldade
  const calcularDistribuicaoQuestoes = (qtd, difs) => {
    const numDificuldades = difs.length;
    const base = Math.floor(qtd / numDificuldades);
    const resto = qtd % numDificuldades;
    
    return difs.map((dif, idx) => ({
      dificuldade: dif,
      quantidade: base + (idx < resto ? 1 : 0)
    }));
  };

  const distribuicao = calcularDistribuicaoQuestoes(quantidade, dificuldades);
  const distribuicaoTexto = distribuicao
    .map(d => `${d.quantidade} questão(ões) de nível ${d.dificuldade}`)
    .join(', ');

  const capacidadesFormatadas = capacidades
    .map(c => `${c.codigo} - ${c.descricao}`)
    .join('\n');

  const capacidadesJSON = {};
  capacidades.forEach(c => {
    capacidadesJSON[c.codigo] = c.descricao;
  });

  const systemPrompt = `Você é um especialista em elaboração de provas do SENAI seguindo a metodologia SAEP (Sistema de Avaliação da Educação Profissional).

REGRAS DE CONTEÚDO PROIBIDO (OBRIGATÓRIO):
- JAMAIS aborde temas relacionados a pornografia, conteúdo sexual ou adulto
- JAMAIS aborde jogos de azar, apostas ou cassinos
- JAMAIS crie conteúdo que fira os direitos humanos, seja discriminatório ou preconceituoso
- JAMAIS inclua conteúdo violento, que incite ódio ou seja ofensivo
- Mantenha sempre um tom profissional e educacional adequado ao ambiente escolar

REGRAS IMPORTANTES PARA ELABORAÇÃO DE QUESTÕES:
1. Cada questão deve ter: contexto, comando e 4 alternativas (a, b, c, d)
2. O contexto deve ser uma situação-problema realista e profissional
3. O comando deve estar diretamente ligado ao contexto - o aluno NÃO deve conseguir responder apenas lendo o comando
4. NÃO use pegadinhas nas alternativas (termos ou comandos que não existem)
5. TODAS AS ALTERNATIVAS DEVEM TER COMPRIMENTO SEMELHANTE - Esta é uma regra crítica:
   - A resposta correta NÃO pode ser visivelmente mais longa ou mais curta que as outras
   - Todas as 4 alternativas devem ter aproximadamente o mesmo número de palavras (variação máxima de 20%)
   - Se uma alternativa precisa ser mais detalhada, ajuste as outras para terem tamanho similar
   - Evite que a alternativa correta seja sempre a mais completa ou elaborada
6. NÃO use frases subjetivas como "qual a melhor alternativa" ou "qual a melhor opção"
7. Todas as alternativas devem ser plausíveis e relacionadas ao assunto
8. Distribua as respostas corretas entre as letras a, b, c, d de forma equilibrada
9. Use o termo "${termoCapacidade}" ao invés de "Capacidade" ou "Habilidade" conforme o tipo de ensino

${contextoRAG ? `CONTEXTO ADICIONAL DA METODOLOGIA SENAI:\n${contextoRAG}\n` : ''}

Retorne APENAS o JSON válido, sem markdown, sem explicações adicionais.`;

  const userPrompt = `Gere ${quantidade} questões para a seguinte prova:

Turma: ${turma}
Professor: ${professor}
Unidade Curricular: ${unidadeCurricular}
Data: ${data}
Curso Técnico em: ${curso}

DISTRIBUIÇÃO DE DIFICULDADE (OBRIGATÓRIO SEGUIR):
${distribuicaoTexto}

${termoCapacidade}s:
${capacidadesFormatadas}
Assunto: ${assunto}

Gere as questões no formato JSON seguindo EXATAMENTE esta estrutura:

{
  "prova": {
    "data": "${data}",
    "docente": "${professor}",
    "curso": "${curso}",
    "unidade_curricular": "${unidadeCurricular}",
    "turma": "${turma}",
    "${termoCapacidade.toLowerCase()}s": ${JSON.stringify(capacidadesJSON)},
    "questoes": [
      {
        "numero": 1,
        "${termoCapacidade.toLowerCase()}": "${capacidades[0]?.codigo || 'CT1'}",
        "dificuldade": "Fácil",
        "contexto": "Contexto da situação-problema...",
        "comando": "Pergunta relacionada ao contexto...",
        "alternativas": {
          "a": "Alternativa A",
          "b": "Alternativa B",
          "c": "Alternativa C",
          "d": "Alternativa D"
        },
        "resposta_correta": "a"
      }
    ]
  }
}

IMPORTANTE: 
- SIGA EXATAMENTE a distribuição de dificuldade solicitada: ${distribuicaoTexto}
- Cada questão DEVE ter o campo "dificuldade" com valor "Fácil", "Médio" ou "Difícil"
- Distribua as questões entre as ${termoCapacidade.toLowerCase()}s fornecidas
- Varie as respostas corretas (não coloque todas como "a")
- Questões Fáceis: conceitos básicos, definições, identificação
- Questões Médias: aplicação prática, resolução de problemas simples
- Questões Difíceis: análise, síntese, avaliação crítica, problemas complexos`;

  try {
    const content = await callLLMAPI(systemPrompt, userPrompt);

    // Usar parser seguro com múltiplas estratégias de correção
    return parseJsonSafely(content);
  } catch (error) {
    console.error('Erro ao gerar questões:', error);
    throw error;
  }
}

/**
 * Sugere questões baseadas no contexto do RAG
 * @param {string} apiKey - Chave da API (mantido para compatibilidade)
 * @param {object} dadosContexto - Dados do contexto
 * @returns {Promise<array>} - Array com sugestões de questões
 */
export async function sugerirQuestoes(apiKey, dadosContexto) {
  const { unidadeCurricular, capacidades, assunto, termoCapacidade } = dadosContexto;

  const systemPrompt = `Você é um especialista em elaboração de provas do SENAI.
Sugira temas e tipos de questões que podem ser elaborados para uma avaliação objetiva.
Seja conciso e objetivo nas sugestões.`;

  const userPrompt = `Sugira 5 temas de questões para:
Unidade Curricular: ${unidadeCurricular}
${termoCapacidade}s: ${capacidades.map(c => `${c.codigo} - ${c.descricao}`).join(', ')}
Assunto: ${assunto}

Retorne um JSON com a estrutura:
{
  "sugestoes": [
    {
      "tema": "Tema da questão",
      "${termoCapacidade.toLowerCase()}": "Código da ${termoCapacidade.toLowerCase()}",
      "tipo_contexto": "Breve descrição do tipo de contexto sugerido"
    }
  ]
}`;

  try {
    const content = await callLLMAPI(systemPrompt, userPrompt);

    // Usar parser seguro com múltiplas estratégias de correção
    const result = parseJsonSafely(content);
    return result.sugestoes || [];
  } catch (error) {
    console.error('Erro ao sugerir questões:', error);
    return [];
  }
}

/**
 * Gera avaliação prática usando a API do Gemini com RAG integrado
 * @param {object} dadosProva - Dados da prova
 * @returns {Promise<object>} - JSON com a avaliação prática gerada
 */
export async function gerarAvaliacaoPratica(dadosProva) {
  // Buscar contexto do RAG
  const contextoRAG = buscarConhecimentoRAG(
    dadosProva.unidadeCurricular, 
    dadosProva.contextoAdicional || dadosProva.assunto,
    dadosProva.capacidades
  );

  const { 
    turma, 
    professor, 
    unidadeCurricular, 
    data, 
    curso, 
    capacidades,
    nivelCognitivo,
    tempoExecucao,
    contextoAdicional,
    termoCapacidade = 'Capacidade'
  } = dadosProva;

  const capacidadesFormatadas = capacidades
    .map(c => `${c.codigo} - ${c.descricao}`)
    .join('\n');

  const capacidadesJSON = {};
  capacidades.forEach(c => {
    capacidadesJSON[c.codigo] = c.descricao;
  });

  const systemPrompt = `Você é um especialista em elaboração de avaliações práticas do SENAI seguindo a Metodologia SENAI de Educação Profissional (MSEP).

REGRAS DE CONTEÚDO PROIBIDO (OBRIGATÓRIO):
- JAMAIS aborde temas relacionados a pornografia, conteúdo sexual ou adulto
- JAMAIS aborde jogos de azar, apostas ou cassinos
- JAMAIS crie conteúdo que fira os direitos humanos, seja discriminatório ou preconceituoso
- JAMAIS inclua conteúdo violento, que incite ódio ou seja ofensivo
- Mantenha sempre um tom profissional e educacional adequado ao ambiente escolar

ESTRUTURA DA AVALIAÇÃO PRÁTICA:
Uma avaliação prática deve conter:

1. CAPACIDADES: Lista das capacidades que serão avaliadas (técnicas, básicas ou socioemocionais)
   - Devem estar de acordo com o perfil profissional do curso técnico
   - Seguir a Taxonomia de Bloom para o nível cognitivo

2. CONTEXTUALIZAÇÃO (MUITO IMPORTANTE - DEVE SER DETALHADA E ROBUSTA):
   A contextualização é fundamental e deve ser RICA e DETALHADA, contendo:
   - Nome fictício de uma empresa/organização realista do setor
   - Descrição do ramo de atuação e porte da empresa
   - Situação atual da empresa (contexto de mercado, desafios, oportunidades)
   - Papel/função que o estudante assume na situação (ex: desenvolvedor júnior, técnico de suporte, etc.)
   - Problema ou necessidade específica que motivou a demanda
   - Stakeholders envolvidos (cliente, gestor, equipe, etc.)
   - Restrições e requisitos do projeto (prazo, tecnologias, padrões)
   - Mínimo de 3-4 parágrafos bem desenvolvidos
   
   EXEMPLO DE BOA CONTEXTUALIZAÇÃO:
   "A TechSolutions é uma software house de médio porte localizada em Florianópolis/SC, especializada no desenvolvimento de sistemas web para o setor varejista. A empresa possui uma carteira de 45 clientes ativos e uma equipe de 12 desenvolvedores. Recentemente, a TechSolutions fechou contrato com a rede de lojas 'Moda Express', que possui 8 filiais no estado e fatura aproximadamente R$ 15 milhões anuais.
   
   O gerente de TI da Moda Express, Sr. Carlos Mendes, solicitou o desenvolvimento de um sistema de controle de estoque integrado que permita visualizar em tempo real a disponibilidade de produtos em todas as filiais. O sistema atual é baseado em planilhas Excel e frequentemente apresenta inconsistências, causando problemas como vendas de produtos indisponíveis e excesso de estoque em algumas lojas.
   
   Você foi designado como desenvolvedor responsável pelo módulo de cadastro e consulta de produtos. O prazo para entrega do protótipo funcional é de 2 horas, e o sistema deve seguir os padrões de desenvolvimento da empresa, utilizando as tecnologias definidas pela equipe de arquitetura."

3. DESAFIO: Descrição das atividades a serem realizadas
   - Apresenta o desafio a ser solucionado de forma clara
   - Descreve as atividades que o estudante irá realizar
   - NÃO pode ser um roteiro passo a passo
   - Deve ter complexidade adequada ao perfil profissional

4. RESULTADOS E ENTREGAS: Evidências esperadas
   - Cada atividade deve ter uma evidência (relatório, projeto, protótipo, instalação, programação, etc.)
   - Incluir tempo estimado para cada atividade

5. LISTA DE VERIFICAÇÃO: Critérios de avaliação
   - Relacionar atividades com capacidades avaliadas
   - Critérios claros de SIM/NÃO para cada item
   - Mínimo de 3-5 critérios por atividade

NÍVEL COGNITIVO (Taxonomia de Bloom):
- Lembrar: Recordar informações e conceitos
- Entender: Compreender e interpretar significados
- Aplicar: Usar conhecimento em situações novas
- Analisar: Dividir em partes e identificar relações
- Avaliar: Julgar com base em critérios e padrões
- Criar: Produzir algo novo ou reorganizar elementos

${contextoRAG ? `CONTEXTO ADICIONAL DA METODOLOGIA SENAI:\n${contextoRAG}\n` : ''}

Retorne APENAS o JSON válido, sem markdown, sem explicações adicionais.`;

  const userPrompt = `Gere uma avaliação prática completa para:

Turma: ${turma}
Professor: ${professor}
Unidade Curricular: ${unidadeCurricular}
Data: ${data}
Curso Técnico em: ${curso}
Nível Cognitivo: ${nivelCognitivo}
Tempo Total de Execução: ${tempoExecucao} minutos
${termoCapacidade}s a serem avaliadas:
${capacidadesFormatadas}
${contextoAdicional ? `Contexto/Tema específico: ${contextoAdicional}` : ''}

Gere a avaliação prática no formato JSON seguindo EXATAMENTE esta estrutura:

{
  "avaliacao_pratica": {
    "data": "${data}",
    "docente": "${professor}",
    "curso": "${curso}",
    "unidade_curricular": "${unidadeCurricular}",
    "turma": "${turma}",
    "nivel_cognitivo": "${nivelCognitivo}",
    "tempo_total": "${tempoExecucao} minutos",
    "capacidades": ${JSON.stringify(capacidadesJSON)},
    "contextualizacao": "Descrição detalhada da situação-problema do mundo do trabalho...",
    "desafio": "Descrição do desafio e das atividades que o estudante deve realizar (NÃO é um passo a passo)...",
    "resultados_entregas": [
      {
        "atividade": "Nome/descrição da atividade 1",
        "evidencia": "O que deve ser entregue/demonstrado",
        "tempo": "XX min"
      },
      {
        "atividade": "Nome/descrição da atividade 2",
        "evidencia": "O que deve ser entregue/demonstrado",
        "tempo": "XX min"
      }
    ],
    "anexos": ["Lista de anexos necessários, se houver"],
    "observacoes": "Observações importantes para o estudante",
    "lista_verificacao": [
      {
        "titulo": "Atividade 1",
        "criterios": [
          {
            "descricao": "Critério de avaliação específico",
            "capacidade": "${capacidades[0]?.codigo || 'CT1'}"
          }
        ]
      }
    ]
  }
}

IMPORTANTE:
- A CONTEXTUALIZAÇÃO DEVE SER LONGA E DETALHADA (mínimo 3 parágrafos), incluindo nome de empresa fictícia, ramo de atuação, situação-problema específica, papel do estudante e stakeholders envolvidos
- O desafio NÃO pode ser um roteiro passo a passo - deve apresentar o problema e deixar o estudante encontrar a solução
- Cada atividade deve ter critérios de avaliação na lista de verificação (mínimo 3-5 critérios por atividade)
- Os critérios devem estar vinculados às capacidades
- O tempo total deve ser distribuído entre as atividades (soma = ${tempoExecucao} min)
- Use o nível cognitivo "${nivelCognitivo}" para definir a complexidade
- A contextualização deve parecer uma situação REAL de trabalho, não genérica`;

  try {
    const content = await callLLMAPI(systemPrompt, userPrompt);

    // Usar parser seguro com múltiplas estratégias de correção
    const result = parseJsonSafely(content);
    return result.avaliacao_pratica;
  } catch (error) {
    console.error('Erro ao gerar avaliação prática:', error);
    throw error;
  }
}

export default { gerarQuestoes, sugerirQuestoes, gerarAvaliacaoPratica };
