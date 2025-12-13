/**
 * Serviço para geração de Plano de Ensino
 * Compatível com o sistema SGN do SENAI
 * Baseado na Metodologia SENAI de Educação Profissional (MSEP)
 */

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
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
 * Gera um Plano de Ensino completo usando IA
 * Compatível com os campos do sistema SGN
 * Inclui Planos de Aula (Módulos) conforme estrutura do SGN
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
  quantidadeModulos = 3
}) {
  if (!API_KEY) {
    throw new Error('API Key não configurada. Configure VITE_GROQ_API_KEY no arquivo .env');
  }

  // Formatar capacidades para o prompt
  const capacidadesTexto = capacidades.map((cap, i) => 
    `${i}. ${cap.codigo} - ${cap.descricao}`
  ).join('\n');

  // Formatar ambientes
  const ambientesTexto = ambientesPedagogicos.join('\n');

  // Formatar instrumentos
  const instrumentosTexto = instrumentosAvaliacao.join(';\n');

  // Calcular carga horária por módulo (aproximada)
  const chPorModulo = Math.floor(cargaHoraria / quantidadeModulos);

  const prompt = `Você é um especialista em educação profissional do SENAI, seguindo a Metodologia SENAI de Educação Profissional (MSEP).

Gere um PLANO DE ENSINO para preencher o sistema SGN do SENAI com os seguintes dados:

DADOS DO CURSO:
- Curso: ${curso}
- Unidade Curricular: ${unidadeCurricular}
- Carga Horária Total: ${cargaHoraria}h
- Período: ${periodo}
- Competência Geral do Curso: ${competenciaGeral}

${termoCapacidade.toUpperCase()}S/HABILIDADES A DESENVOLVER (índice começa em 0):
${capacidadesTexto}

AMBIENTES PEDAGÓGICOS DISPONÍVEIS:
${ambientesTexto}

FERRAMENTAS/SOFTWARES DISPONÍVEIS:
${ferramentas.join(', ')}

INSTRUMENTOS DE AVALIAÇÃO A UTILIZAR:
${instrumentosTexto}

${contextoAdicional ? `ORIENTAÇÕES ADICIONAIS DO DOCENTE: ${contextoAdicional}` : ''}

Gere ${quantidadeModulos} PLANOS DE AULA (MÓDULOS) para dividir a UC.
Carga horária aproximada por módulo: ${chPorModulo}h (pode variar conforme conteúdo).

ESTRUTURA DE CADA PLANO DE AULA (MÓDULO) - CONFORME SGN:

1. TÍTULO: Formato "MÓDULO X - [Tema principal do módulo]"
   Exemplo: "MÓDULO 1 - Introdução à lógica e algoritmo com pseudocódigo em Portugol"

2. C.H. PLANEJADA: Carga horária do módulo em horas (formato "XX:00")

3. CAPACIDADES A SEREM TRABALHADAS: Índices das capacidades que serão desenvolvidas neste módulo

4. CONHECIMENTOS RELACIONADOS: Lista de conhecimentos/conteúdos que serão abordados

5. ESTRATÉGIAS DE ENSINO: Escolha entre: Exposição Dialogada, Atividade Prática, Gamificação, Trabalho em Grupo, Dinâmica de Grupo, Visita Técnica, Workshop, Seminário, Sala de Aula Invertida, Design Thinking

6. CRITÉRIOS DE AVALIAÇÃO: Perguntas no formato "Verbo + complemento ?" para avaliar o aluno
   Exemplo: "Aplicou lógica de programação para resolução dos problemas ?"

7. INSTRUMENTOS DE AVALIAÇÃO DA APRENDIZAGEM: Como será avaliado
   Exemplo: "AV1-Avaliação objetiva múltipla escolha sobre Portugol"
   Se não houver avaliação neste módulo, use: "Será avaliado no próximo bloco"

8. RECURSOS E AMBIENTES PEDAGÓGICOS: Recursos e ambientes utilizados
   Exemplo: "Laboratório de informática; Projetor multimídia; VSCode; Git/GitHub"

REGRAS IMPORTANTES:
- Divida as ${termoCapacidade}s de forma lógica entre os módulos
- Cada ${termoCapacidade} deve aparecer em pelo menos um módulo
- Os módulos devem ter progressão lógica de complexidade
- O último módulo pode ser um "Projeto Final" integrando todas as capacidades
- Os critérios de avaliação devem ser perguntas mensuráveis
- Use as ferramentas fornecidas nos recursos pedagógicos
- A soma das cargas horárias deve ser aproximadamente ${cargaHoraria}h

Retorne APENAS um JSON válido (sem markdown, sem texto antes ou depois) com a estrutura:
{
  "ambientesPedagogicos": "texto formatado para o campo do SGN",
  "outrosInstrumentos": "texto formatado para o campo do SGN",
  "referenciasBasicas": "texto formatado para o campo do SGN",
  "referenciasComplementares": "texto formatado para o campo do SGN",
  "observacoes": "texto para observações ou string vazia",
  "planosAula": [
    {
      "titulo": "MÓDULO 1 - Título descritivo",
      "cargaHoraria": "40:00",
      "capacidadesIndices": [0, 1, 2],
      "conhecimentosRelacionados": ["Conhecimento 1", "Conhecimento 2"],
      "estrategiasEnsino": ["Exposição Dialogada", "Atividade Prática"],
      "criteriosAvaliacao": "Pergunta 1 ?\\nPergunta 2 ?\\nPergunta 3 ?",
      "instrumentosAvaliacao": "AV1-Descrição do instrumento",
      "recursosPedagogicos": "Laboratório de informática; VSCode; Git/GitHub"
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

    // Mapear índices de capacidades para os códigos reais nos Planos de Aula
    if (planoEnsino.planosAula) {
      planoEnsino.planosAula = planoEnsino.planosAula.map(modulo => ({
        ...modulo,
        capacidadesTrabalhadas: (modulo.capacidadesIndices || []).map(idx => 
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
