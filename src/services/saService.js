/**
 * Serviço para geração de Situação de Aprendizagem (SA)
 * Baseado no Guia Prático SENAI - Etapas para elaboração do Plano de Ensino e SA
 * Utiliza a API Gemini para gerar SAs seguindo a Metodologia SENAI de Educação Profissional
 */

import { GEMINI_API_KEY, GEMINI_API_URL, LLM_MODEL } from '../config/api';

/**
 * Verifica se a API está configurada
 */
export const isApiConfigured = () => {
  return GEMINI_API_KEY && GEMINI_API_KEY.length > 0 && GEMINI_API_KEY !== 'sua_chave_aqui';
};

/**
 * Faz chamada à API do Gemini
 */
async function callGeminiAPI(systemPrompt, userPrompt, maxTokens = 65536) {
  if (!GEMINI_API_KEY) {
    throw new Error('API Key não configurada. Configure a variável VITE_GEMINI_API_KEY no arquivo .env');
  }

  const url = `${GEMINI_API_URL}/${LLM_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\n${userPrompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Erro na API Gemini: ${response.status}`);
  }

  const data = await response.json();
  
  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === 'MAX_TOKENS') {
    throw new Error('Resposta truncada. Tente reduzir a complexidade.');
  }
  
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Resposta vazia da API Gemini');
  }

  return content;
}

/**
 * Estratégias pedagógicas disponíveis conforme MSEP
 */
export const ESTRATEGIAS_PEDAGOGICAS = [
  'Projeto',
  'Estudo de Caso',
  'Exposição Dialogada',
  'Atividade Prática',
  'Trabalho em Grupo',
  'Simulação',
  'Visita Técnica',
  'Workshop',
  'Seminário',
  'Gamificação',
  'Sala de Aula Invertida',
  'Design Thinking'
];

/**
 * Níveis de dificuldade
 */
export const NIVEIS_DIFICULDADE = [
  { id: 'facil', nome: 'Fácil', descricao: 'Conceitos básicos e aplicação direta' },
  { id: 'intermediario', nome: 'Intermediário', descricao: 'Aplicação prática e análise' },
  { id: 'dificil', nome: 'Difícil', descricao: 'Análise, síntese e avaliação' }
];

/**
 * Tipos de rubrica
 */
export const TIPOS_RUBRICA = [
  { id: 'gradual', nome: 'Gradual', descricao: 'Níveis progressivos: Abaixo do Básico, Básico, Adequado, Avançado' },
  { id: 'dicotomica', nome: 'Dicotômica', descricao: 'Avaliação binária: Atende ou Não Atende' }
];

/**
 * Gera uma Situação de Aprendizagem usando IA
 */
export async function gerarSituacaoAprendizagem({
  curso,
  unidadeCurricular,
  capacidades,
  cargaHoraria,
  tema,
  contextoAdicional,
  termoCapacidade = 'Capacidade',
  estrategiaPedagogica = 'Projeto',
  nivelDificuldade = 'intermediario',
  tipoRubrica = 'gradual'
}) {
  // Formatar capacidades numeradas
  const capacidadesTexto = capacidades
    .map((cap, idx) => `C${idx + 1} - ${cap.codigo}: ${cap.descricao}`)
    .join('\n');

  const capacidadesMap = capacidades.reduce((acc, cap, idx) => {
    acc[`C${idx + 1}`] = { codigo: cap.codigo, descricao: cap.descricao };
    return acc;
  }, {});

  // Definir estrutura da rubrica baseada no tipo
  const rubricaInstrucao = tipoRubrica === 'gradual' 
    ? `RUBRICA GRADUAL com 4 níveis:
       - Abaixo do Básico (1-2 pontos): Não atende aos requisitos mínimos
       - Básico (3-5 pontos): Atende parcialmente aos requisitos
       - Adequado (6-7 pontos): Atende aos requisitos esperados
       - Avançado (8-10 pontos): Supera as expectativas`
    : `RUBRICA DICOTÔMICA com 2 níveis:
       - Atende: Cumpriu o critério satisfatoriamente
       - Não Atende: Não cumpriu o critério`;

  const systemPrompt = `Você é um especialista em educação profissional do SENAI, com profundo conhecimento da Metodologia SENAI de Educação Profissional (MSEP) e do Guia Prático para elaboração de Situações de Aprendizagem.

CONCEITO DE SITUAÇÃO DE APRENDIZAGEM (conforme MSEP):
Uma SA é uma estratégia de ensino que contextualiza o processo de aprendizagem em situações REAIS ou SIMULADAS do mundo do trabalho. Ela deve:
- Integrar conhecimentos, habilidades e atitudes (saber, saber fazer, saber ser)
- Desenvolver autonomia e protagonismo do estudante
- Conectar teoria e prática profissional
- Permitir avaliação por competências

ESTRUTURA OBRIGATÓRIA DA SA (3 partes essenciais):

1. CONTEXTO:
   - Situação REAL da indústria/área profissional
   - Detalhado, plausível e que situe claramente o ambiente profissional
   - NÃO mencionar nomes de pessoas ou empresas (reais ou fictícios)
   - Deve destacar um problema específico relacionado ao tema

2. DESAFIO:
   - CURTO e objetivo
   - Inserir o profissional como protagonista da ação
   - Depender diretamente do contexto
   - NÃO conter o desenvolvimento da atividade
   - Apenas descrever claramente o problema a ser solucionado

3. RESULTADO:
   - Objetivo e simplificado
   - Indicar apenas a ENTREGA FINAL (documento ou objeto)
   - Sem detalhar etapas ou descrições extensas

RUBRICA DE AVALIAÇÃO:
- Critérios em formato de PERGUNTA no pretérito perfeito
- Estrutura: verbo de ação + objeto + condição
- Cada critério associado a UMA capacidade específica
- Critérios devem ser OBSERVÁVEIS (qualitativos ou quantitativos)
- Usar verbos conforme Taxonomia de Bloom

TAXONOMIA DE BLOOM - Níveis:
1. Lembrar/Reconhecer (básico)
2. Compreender/Identificar
3. Aplicar/Utilizar
4. Analisar/Diferenciar
5. Avaliar/Julgar
6. Criar/Desenvolver (avançado)

Use linguagem clara e profissional. A SA deve ser PRÁTICA e APLICÁVEL.`;

  const userPrompt = `Crie uma Situação de Aprendizagem COMPLETA seguindo rigorosamente a estrutura MSEP:

DADOS DO CURSO:
- Curso: ${curso}
- Unidade Curricular: ${unidadeCurricular}
- Carga Horária: ${cargaHoraria} horas
- Tema/Assunto: ${tema}
- Estratégia Pedagógica: ${estrategiaPedagogica}
- Nível de Dificuldade: ${nivelDificuldade}

${termoCapacidade.toUpperCase()}S A SEREM DESENVOLVIDAS (numeradas):
${capacidadesTexto}

${contextoAdicional ? `ORIENTAÇÕES ADICIONAIS DO DOCENTE:\n${contextoAdicional}\n` : ''}

TIPO DE RUBRICA: ${rubricaInstrucao}

Retorne a SA em formato JSON com a seguinte estrutura:
{
  "titulo": "Título criativo e relacionado ao desafio",
  "nivelDificuldade": "${nivelDificuldade}",
  "estrategiaPedagogica": "${estrategiaPedagogica}",
  "cargaHoraria": ${cargaHoraria},
  
  "contexto": "Texto detalhado descrevendo a situação real da indústria, o ambiente profissional e o problema específico. Deve ser envolvente e realista, sem mencionar nomes.",
  
  "desafio": "Texto curto e objetivo descrevendo o problema que o estudante (como profissional) deve resolver.",
  
  "resultado": "Entrega final objetiva (ex: Relatório de análise, Plano de ação, Protótipo funcional)",
  
  "atividades": [
    {
      "numero": 1,
      "titulo": "Título da atividade",
      "descricao": "O que o estudante deve fazer",
      "duracao": "2 horas",
      "capacidadesRelacionadas": ["C1", "C2"]
    }
  ],
  
  "recursosNecessarios": [
    "Recurso 1",
    "Recurso 2"
  ],
  
  "conhecimentosMobilizados": [
    "Conhecimento técnico 1",
    "Conhecimento técnico 2"
  ],
  
  "rubrica": {
    "tipo": "${tipoRubrica}",
    "criterios": [
      {
        "numero": 1,
        "criterio": "Elaborou o [objeto] conforme [condição]?",
        "capacidadeAssociada": "C1",
        "peso": 2,
        "descritores": ${tipoRubrica === 'gradual' 
          ? `{
          "abaixoDoBasico": "Descrição do nível 1-2",
          "basico": "Descrição do nível 3-5",
          "adequado": "Descrição do nível 6-7",
          "avancado": "Descrição do nível 8-10"
        }`
          : `{
          "atende": "Descrição do que significa atender",
          "naoAtende": "Descrição do que significa não atender"
        }`}
      }
    ]
  },
  
  "capacidades": ${JSON.stringify(capacidadesMap)}
}

IMPORTANTE: 
- Retorne APENAS o JSON válido, sem texto adicional, sem markdown
- Crie pelo menos 3-5 atividades coerentes com a carga horária
- Crie pelo menos 4-6 critérios de avaliação na rubrica
- Cada critério deve estar associado a uma capacidade específica
- Os critérios devem ser em formato de pergunta no pretérito`;

  try {
    const content = await callGeminiAPI(systemPrompt, userPrompt);

    // Limpar e parsear JSON
    let jsonContent = content.trim();
    jsonContent = jsonContent.replace(/^```json\s*/i, '');
    jsonContent = jsonContent.replace(/^```\s*/i, '');
    jsonContent = jsonContent.replace(/\s*```$/i, '');
    jsonContent = jsonContent.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') return char;
      return '';
    });
    jsonContent = jsonContent.trim();

    const sa = JSON.parse(jsonContent);

    // Adicionar metadados
    return {
      ...sa,
      curso,
      unidadeCurricular,
      dataGeracao: new Date().toISOString(),
      termoCapacidade,
      tipoRubrica
    };

  } catch (error) {
    console.error('Erro ao gerar SA:', error);
    throw error;
  }
}

export default {
  gerarSituacaoAprendizagem,
  isApiConfigured,
  ESTRATEGIAS_PEDAGOGICAS,
  NIVEIS_DIFICULDADE,
  TIPOS_RUBRICA
};
