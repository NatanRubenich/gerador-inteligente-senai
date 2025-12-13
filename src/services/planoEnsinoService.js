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

// Softwares/Ferramentas comuns por área
export const FERRAMENTAS_COMUNS = {
  informatica: [
    'VSCode',
    'Visual Studio',
    'Git/GitHub',
    'Postman',
    'MySQL Workbench',
    'pgAdmin',
    'Node.js',
    'Docker',
    'Figma'
  ],
  programacao: [
    'Portugol Studio',
    'VSCode',
    'Python IDLE',
    'Eclipse',
    'IntelliJ IDEA',
    'NetBeans'
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
    'Projetor multimídia',
    'Quadro branco'
  ]
};

/**
 * Gera um Plano de Ensino completo usando IA
 * Compatível com os campos do sistema SGN
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
  quantidadeSAs = 1
}) {
  if (!API_KEY) {
    throw new Error('API Key não configurada. Configure VITE_GROQ_API_KEY no arquivo .env');
  }

  // Formatar capacidades para o prompt
  const capacidadesTexto = capacidades.map((cap, i) => 
    `${i + 1}. ${cap.codigo} - ${cap.descricao}`
  ).join('\n');

  // Formatar ambientes
  const ambientesTexto = ambientesPedagogicos.join('\n');

  // Formatar instrumentos
  const instrumentosTexto = instrumentosAvaliacao.join(';\n');

  const prompt = `Você é um especialista em educação profissional do SENAI, seguindo a Metodologia SENAI de Educação Profissional (MSEP).

Gere um PLANO DE ENSINO para preencher o sistema SGN do SENAI com os seguintes dados:

DADOS DO CURSO:
- Curso: ${curso}
- Unidade Curricular: ${unidadeCurricular}
- Carga Horária Total: ${cargaHoraria}h
- Período: ${periodo}
- Competência Geral do Curso: ${competenciaGeral}

${termoCapacidade.toUpperCase()}S/HABILIDADES A DESENVOLVER:
${capacidadesTexto}

AMBIENTES PEDAGÓGICOS DISPONÍVEIS:
${ambientesTexto}

FERRAMENTAS/SOFTWARES DISPONÍVEIS:
${ferramentas.join(', ')}

INSTRUMENTOS DE AVALIAÇÃO A UTILIZAR:
${instrumentosTexto}

${contextoAdicional ? `ORIENTAÇÕES ADICIONAIS DO DOCENTE: ${contextoAdicional}` : ''}

Gere ${quantidadeSAs} Situação(ões) de Aprendizagem.

CAMPOS DO SGN A PREENCHER:

1. AMBIENTES PEDAGÓGICOS: Liste os ambientes onde as aulas serão ministradas e as ferramentas/softwares utilizados. Formato de lista simples.

2. OUTROS INSTRUMENTOS DE AVALIAÇÃO: Liste os instrumentos de avaliação que serão utilizados. Formato de lista simples com ponto e vírgula.

3. REFERÊNCIAS BIBLIOGRÁFICAS - BÁSICAS: 3-4 referências principais no formato ABNT (Autor, Título, Editora, Ano).

4. REFERÊNCIAS BIBLIOGRÁFICAS - COMPLEMENTARES: 2-3 referências complementares no formato ABNT.

5. OBSERVAÇÕES: Informações adicionais relevantes sobre a UC (pode ser vazio).

6. SITUAÇÕES DE APRENDIZAGEM: Para cada SA, gere:
   - Título descritivo
   - Contextualização (cenário/problema do mundo real)
   - Desafio proposto aos alunos
   - Resultados esperados (entregas)
   - ${termoCapacidade}s trabalhadas
   - Critérios de avaliação
   - Carga horária estimada

REGRAS IMPORTANTES:
- Seja específico para a área de ${curso}
- Use linguagem técnica apropriada
- As SAs devem ser contextualizadas no mercado de trabalho
- Cada ${termoCapacidade} deve ser contemplada em pelo menos uma SA
- Os critérios de avaliação devem ser mensuráveis
- As referências devem ser reais e atualizadas

Retorne APENAS um JSON válido (sem markdown, sem texto antes ou depois) com a estrutura:
{
  "ambientesPedagogicos": "texto formatado para o campo do SGN",
  "outrosInstrumentos": "texto formatado para o campo do SGN",
  "referenciasBasicas": "texto formatado para o campo do SGN",
  "referenciasComplementares": "texto formatado para o campo do SGN",
  "observacoes": "texto para observações ou string vazia",
  "situacoesAprendizagem": [
    {
      "titulo": "Título da SA",
      "contextualizacao": "Texto de contextualização detalhado",
      "desafio": "Descrição do desafio proposto",
      "resultadosEsperados": "Entregas/produtos esperados",
      "capacidadesTrabalhadasIndices": [0, 1],
      "criteriosAvaliacao": ["critério 1", "critério 2", "critério 3"],
      "cargaHoraria": 20
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

    // Mapear índices de capacidades para os códigos reais
    if (planoEnsino.situacoesAprendizagem) {
      planoEnsino.situacoesAprendizagem = planoEnsino.situacoesAprendizagem.map(sa => ({
        ...sa,
        capacidadesTrabalhadas: (sa.capacidadesTrabalhadasIndices || []).map(idx => 
          capacidades[idx] ? `${capacidades[idx].codigo}: ${capacidades[idx].descricao}` : ''
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
        indice: i + 1,
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
  FERRAMENTAS_COMUNS
};
