/**
 * Serviço para geração de Plano de Ensino
 * Compatível com o sistema SGN do SENAI
 * Baseado na Metodologia SENAI de Educação Profissional (MSEP)
 */

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
 * Inclui Planos de Aula (Blocos) conforme estrutura do SGN
 * Cada bloco tem no mínimo 20h de aula
 * Os conhecimentos relacionados vêm da matriz curricular
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
  if (!API_KEY) {
    throw new Error('API Key não configurada. Configure VITE_GROQ_API_KEY no arquivo .env');
  }

  // Calcular quantidade de blocos automaticamente (mínimo 20h por bloco)
  const numBlocos = quantidadeBlocos || Math.max(1, Math.floor(cargaHoraria / 20));
  const chPorBloco = Math.floor(cargaHoraria / numBlocos);
  const numAulasPorBloco = Math.floor(chPorBloco / 4); // 4h por aula

  // Formatar capacidades para o prompt
  const capacidadesTexto = capacidades.map((cap, i) => 
    `${i}. ${cap.codigo} - ${cap.descricao}`
  ).join('\n');

  // Formatar ambientes
  const ambientesTexto = ambientesPedagogicos.join('\n');

  // Formatar instrumentos
  const instrumentosTexto = instrumentosAvaliacao.join(';\n');

  // Formatar conhecimentos da matriz curricular
  const conhecimentosTexto = conhecimentosUC.length > 0 
    ? formatarConhecimentos(conhecimentosUC)
    : 'Não especificados - gerar com base nas capacidades';

  // Lista plana de conhecimentos para referência
  const conhecimentosPlanos = extrairConhecimentosPlanos(conhecimentosUC);

  const prompt = `Você é um especialista em educação profissional do SENAI, seguindo a Metodologia SENAI de Educação Profissional (MSEP).

Gere um PLANO DE ENSINO para preencher o sistema SGN do SENAI.

DADOS DO CURSO:
- Curso: ${curso}
- Unidade Curricular: ${unidadeCurricular}
- Carga Horária Total: ${cargaHoraria}h
- Período: ${periodo}
- Competência Geral do Curso: ${competenciaGeral}

${termoCapacidade.toUpperCase()}S A DESENVOLVER (índice começa em 0):
${capacidadesTexto}

CONHECIMENTOS DA MATRIZ CURRICULAR (USE ESTES EXATAMENTE):
${conhecimentosTexto}

AMBIENTES PEDAGÓGICOS DISPONÍVEIS:
${ambientesTexto}

FERRAMENTAS/SOFTWARES DISPONÍVEIS:
${ferramentas.join(', ')}

INSTRUMENTOS DE AVALIAÇÃO:
${instrumentosTexto}

${contextoAdicional ? `ORIENTAÇÕES ADICIONAIS DO DOCENTE: ${contextoAdicional}` : ''}

=== ESTRUTURA DO PLANO DE ENSINO ===

1. INFORMAÇÕES GERAIS DO PLANO:
   - Objetivo da UC (texto descritivo do objetivo geral)
   - Número de capacidades básicas, técnicas e socioemocionais

2. PLANOS DE AULA (BLOCOS):
   Gere ${numBlocos} BLOCOS DE AULA para dividir a UC.
   REGRA: Cada bloco deve ter no MÍNIMO 20 horas (${numAulasPorBloco} aulas de 4h).
   Carga horária por bloco: aproximadamente ${chPorBloco}h.

ESTRUTURA DE CADA BLOCO DE AULA:

1. TÍTULO DO BLOCO: Título descritivo do tema principal
   Exemplo: "Fundamentos de Banco de Dados e Modelagem"

2. NÚMERO DE AULAS E CARGA HORÁRIA: 
   Formato: "X aulas - XXh"
   Exemplo: "5 aulas - 20 horas"

3. CAPACIDADES A SEREM TRABALHADAS: 
   Índices das capacidades que serão desenvolvidas neste bloco

4. CONHECIMENTOS RELACIONADOS:
   IMPORTANTE: Use EXATAMENTE os conhecimentos da matriz curricular fornecida acima.
   Distribua os conhecimentos entre os blocos de forma lógica.
   Use o formato "código - título" (ex: "3.1.1 - Definições")
   TODOS os conhecimentos da matriz devem ser contemplados em algum bloco.

5. ESTRATÉGIAS DE ENSINO E DESCRIÇÃO DAS ATIVIDADES:
   Descrição DETALHADA de cada aula do bloco, incluindo:
   - Número da aula e duração
   - Estratégia utilizada (Exposição Dialogada, Atividade Prática, Gamificação, etc.)
   - Descrição da atividade
   - Atividades práticas ou entregas quando houver
   
   Exemplo:
   "Aula 1 (4h): Apresentação da UC e introdução aos conceitos de banco de dados. Exposição dialogada sobre definições e tipos de SGBD.
   Aula 2 (4h): Aula prática - Instalação e configuração do MySQL. Primeiros comandos DDL.
   Aula 3-5 (12h): Modelagem conceitual - Criação de diagramas ER. Atividade prática em grupo."

6. RECURSOS E AMBIENTES PEDAGÓGICOS:
   Lista de recursos, ferramentas e ambientes utilizados

7. CRITÉRIOS DE AVALIAÇÃO:
   Perguntas no formato "Verbo + complemento ?" ou referência ao anexo
   Exemplo: "Anexo ao formulário da Avaliação Prática 1"

8. INSTRUMENTOS DE AVALIAÇÃO DA APRENDIZAGEM:
   Instrumentos específicos do bloco
   Exemplo: "Avaliação Prática 1: Modelagem de banco de dados"
   Se não houver avaliação neste bloco: "Será avaliado no próximo bloco"

REGRAS IMPORTANTES:
- Cada bloco deve ter NO MÍNIMO 20 horas
- Divida as ${termoCapacidade}s de forma lógica entre os blocos
- Cada ${termoCapacidade} deve aparecer em pelo menos um bloco
- TODOS os conhecimentos da matriz curricular devem ser contemplados
- Os blocos devem ter progressão lógica de complexidade
- O último bloco pode ser "Finalização e Projeto Integrador"
- As estratégias de ensino devem ser DETALHADAS aula por aula
- A soma das cargas horárias deve ser ${cargaHoraria}h
- Use as ferramentas fornecidas nos recursos pedagógicos

Retorne APENAS um JSON válido (sem markdown, sem texto antes ou depois) com a estrutura:
{
  "objetivoUC": "Texto descritivo do objetivo da UC",
  "numCapacidadesBasicas": 0,
  "numCapacidadesTecnicas": 0,
  "numCapacidadesSocioemocionais": 3,
  "ambientesPedagogicos": "texto formatado para o campo do SGN",
  "outrosInstrumentos": "texto formatado para o campo do SGN",
  "referenciasBasicas": "texto formatado para o campo do SGN",
  "referenciasComplementares": "texto formatado para o campo do SGN",
  "observacoes": "",
  "blocosAula": [
    {
      "titulo": "Título descritivo do bloco",
      "numAulas": 5,
      "cargaHoraria": 20,
      "capacidadesIndices": [0, 1, 2],
      "conhecimentosRelacionados": ["3.1.1 - Definições", "3.1.2 - Tipos", "3.1.3 - Características"],
      "estrategiasDetalhadas": "Aula 1 (4h): Descrição detalhada...\\nAula 2 (4h): Descrição...",
      "recursosPedagogicos": "Laboratório de informática; MySQL; DBeaver",
      "criteriosAvaliacao": "Anexo ao formulário da Avaliação Prática 1",
      "instrumentosAvaliacao": "Avaliação Prática 1: Descrição do instrumento"
    }
  ]
}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em educação profissional do SENAI. Gere conteúdo para preencher o sistema SGN. Responda APENAS com JSON válido, sem markdown ou texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Limpar e parsear JSON
    let jsonStr = content.trim();
    
    // Remover markdown se presente
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }

    const planoEnsino = JSON.parse(jsonStr);

    // Mapear índices de capacidades para os códigos reais nos Blocos de Aula
    if (planoEnsino.blocosAula) {
      planoEnsino.blocosAula = planoEnsino.blocosAula.map(bloco => ({
        ...bloco,
        capacidadesTrabalhadas: (bloco.capacidadesIndices || []).map(idx => 
          capacidades[idx] ? { codigo: capacidades[idx].codigo, descricao: capacidades[idx].descricao } : null
        ).filter(Boolean)
      }));
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
      // Capacidades originais
      capacidades: capacidades.map((cap, i) => ({
        indice: i,
        codigo: cap.codigo,
        descricao: cap.descricao
      })),
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

export default {
  gerarPlanoEnsino,
  AMBIENTES_PEDAGOGICOS,
  INSTRUMENTOS_AVALIACAO,
  FERRAMENTAS_COMUNS,
  ESTRATEGIAS_ENSINO
};
