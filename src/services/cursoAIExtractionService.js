/**
 * Serviço de Extração de Cursos com Gemini AI
 * Extrai informações de PDFs de PPC e Matrizes Curriculares
 * v1.0.0
 */

import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/api';
import * as XLSX from 'xlsx';

/**
 * Converte arquivo para Base64
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Extrai texto de arquivo Excel (Matriz Curricular)
 */
export async function extractMatrizFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let allText = '';
        let ucs = [];
        
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          // Converter para texto
          jsonData.forEach(row => {
            if (row && row.length > 0) {
              allText += row.join(' | ') + '\n';
            }
          });
          
          // Tentar extrair UCs da planilha
          jsonData.forEach((row, index) => {
            if (row && row.length >= 2) {
              const firstCell = String(row[0] || '').trim();
              const secondCell = String(row[1] || '').trim();
              
              // Detectar linhas que parecem ser UCs (tem nome e carga horária)
              const horasMatch = String(row[row.length - 1] || row[row.length - 2] || '').match(/(\d+)/);
              if (firstCell && horasMatch && !firstCell.match(/^(módulo|período|total|carga)/i)) {
                ucs.push({
                  nome: firstCell,
                  cargaHoraria: parseInt(horasMatch[1]) || 0,
                  modulo: detectModulo(jsonData, index)
                });
              }
            }
          });
        });
        
        resolve({ text: allText, ucs });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Detecta o módulo de uma UC baseado no contexto
 */
function detectModulo(data, ucIndex) {
  // Procurar para cima por uma linha que indique o módulo
  for (let i = ucIndex - 1; i >= 0 && i > ucIndex - 10; i--) {
    const row = data[i];
    if (row && row[0]) {
      const text = String(row[0]).toLowerCase();
      if (text.includes('básico')) return 'Básico';
      if (text.includes('introdutório')) return 'Introdutório';
      if (text.includes('específico iii') || text.includes('especifico iii')) return 'Específico III';
      if (text.includes('específico ii') || text.includes('especifico ii')) return 'Específico II';
      if (text.includes('específico i') || text.includes('especifico i')) return 'Específico I';
      if (text.includes('específico') || text.includes('especifico')) return 'Específico I';
    }
  }
  return 'Específico I';
}

/**
 * Chama a API do Gemini para extrair dados do curso - Etapa 1: Dados gerais e lista de UCs
 */
async function callGeminiStep1(pdfBase64, onStatus) {
  onStatus?.('Etapa 1/2: Extraindo dados gerais do curso...');

  const prompt = `Você é um especialista em educação profissional do SENAI. Analise o documento PDF anexado (PPC/Itinerário Nacional) e extraia os DADOS GERAIS do curso e a LISTA de Unidades Curriculares.

EXTRAIA:
1. Nome completo do curso
2. CBO (Classificação Brasileira de Ocupações)
3. Carga horária total
4. Eixo tecnológico
5. Área tecnológica
6. Competência geral (texto completo)
7. Lista de TODAS as Unidades Curriculares com: nome, módulo e carga horária

IMPORTANTE: Liste TODAS as UCs encontradas no documento, mesmo que sejam muitas.

Retorne APENAS JSON válido:
{
  "nome": "TÉCNICO EM EDIFICAÇÕES",
  "id": "tecnico-em-edificacoes",
  "cbo": "3121-05",
  "cargaHorariaTotal": 1200,
  "eixoTecnologico": "Infraestrutura",
  "areaTecnologica": "CC- Edificações",
  "competenciaGeral": "Texto completo da competência geral...",
  "unidadesCurriculares": [
    { "nome": "Nome da UC 1", "modulo": "BÁSICO", "cargaHoraria": 40 },
    { "nome": "Nome da UC 2", "modulo": "ESPECÍFICO I", "cargaHoraria": 80 }
  ]
}`;

  return await callGeminiAPI(pdfBase64, prompt);
}

/**
 * Chama a API do Gemini para extrair detalhes de UCs específicas - Etapa 2
 */
async function callGeminiStep2(pdfBase64, ucNames, onStatus) {
  onStatus?.(`Etapa 2/2: Extraindo capacidades de ${ucNames.length} UCs...`);

  const prompt = `Analise o documento PDF e extraia os DETALHES das seguintes Unidades Curriculares:

${ucNames.map((name, i) => `${i + 1}. "${name}"`).join('\n')}

Para CADA UC acima, extraia:
- Objetivo da UC
- TODAS as Capacidades Técnicas (CT1, CT2...) ou Básicas (CB1, CB2...)
- TODOS os Conhecimentos com hierarquia (1, 1.1, 1.2...)

IMPORTANTE: Extraia TODAS as capacidades de cada UC, não resuma.

Retorne APENAS JSON válido:
{
  "detalhesUCs": [
    {
      "nome": "Nome exato da UC",
      "objetivo": "Objetivo da UC...",
      "capacidadesTecnicas": [
        { "codigo": "CT1", "descricao": "Descrição completa..." },
        { "codigo": "CT2", "descricao": "Descrição completa..." }
      ],
      "conhecimentos": [
        { "topico": "1 NOME DO TÓPICO", "subtopicos": ["1.1 Sub", "1.2 Sub"] }
      ]
    }
  ]
}`;

  return await callGeminiAPI(pdfBase64, prompt);
}

/**
 * Função auxiliar para chamar a API do Gemini
 */
async function callGeminiAPI(pdfBase64, prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('API Key do Gemini não configurada. Crie o arquivo .env com VITE_GEMINI_API_KEY');
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: 'application/pdf',
            data: pdfBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 65536,
      responseMimeType: 'application/json'
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Gemini] Erro:', data);
    throw new Error(data.error?.message || `Erro na API Gemini: ${response.status}`);
  }

  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === 'SAFETY') {
    throw new Error('Conteúdo bloqueado por políticas de segurança.');
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Resposta vazia da API Gemini');
  }

  let jsonStr = content.trim();
  jsonStr = jsonStr.replace(/^```json\s*/i, '');
  jsonStr = jsonStr.replace(/^```\s*/i, '');
  jsonStr = jsonStr.replace(/\s*```$/i, '');

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[Gemini] Erro ao parsear JSON:', e.message);
    const recovered = tryRecoverTruncatedJSON(jsonStr);
    if (recovered) return recovered;
    throw new Error('Erro ao processar resposta da IA.');
  }
}

/**
 * Chama a API do Gemini para extrair dados do curso em múltiplas etapas
 */
async function callGeminiForExtraction(pdfBase64, matrizText, ucsFromExcel, onStatus) {
  // Etapa 1: Extrair dados gerais e lista de UCs
  const step1Data = await callGeminiStep1(pdfBase64, onStatus);
  console.log('[Gemini] Etapa 1 concluída:', step1Data);

  if (!step1Data.unidadesCurriculares || step1Data.unidadesCurriculares.length === 0) {
    throw new Error('Nenhuma Unidade Curricular encontrada no documento.');
  }

  // Etapa 2: Extrair detalhes das UCs em lotes
  const ucNames = step1Data.unidadesCurriculares.map(uc => uc.nome);
  const batchSize = 5; // Processar 5 UCs por vez para evitar truncamento
  const allDetails = [];

  for (let i = 0; i < ucNames.length; i += batchSize) {
    const batch = ucNames.slice(i, i + batchSize);
    onStatus?.(`Extraindo detalhes das UCs ${i + 1}-${Math.min(i + batchSize, ucNames.length)} de ${ucNames.length}...`);
    
    try {
      const batchData = await callGeminiStep2(pdfBase64, batch, onStatus);
      if (batchData.detalhesUCs) {
        allDetails.push(...batchData.detalhesUCs);
      }
    } catch (e) {
      console.warn(`[Gemini] Erro no lote ${i + 1}-${i + batchSize}:`, e.message);
    }
  }

  // Mesclar dados
  const finalData = {
    ...step1Data,
    unidadesCurriculares: step1Data.unidadesCurriculares.map(uc => {
      const details = allDetails.find(d => 
        d.nome.toLowerCase().includes(uc.nome.toLowerCase().substring(0, 20)) ||
        uc.nome.toLowerCase().includes(d.nome.toLowerCase().substring(0, 20))
      );
      return {
        ...uc,
        objetivo: details?.objetivo || '',
        capacidadesTecnicas: details?.capacidadesTecnicas || [],
        conhecimentos: details?.conhecimentos || []
      };
    })
  };

  console.log('[Gemini] Extração completa:', finalData);
  return finalData;
}

/**
 * Tenta recuperar um JSON truncado
 */
function tryRecoverTruncatedJSON(jsonStr) {
  try {
    // Tentar fechar arrays e objetos abertos
    let fixed = jsonStr;
    
    // Contar chaves e colchetes abertos
    let braces = 0;
    let brackets = 0;
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < fixed.length; i++) {
      const char = fixed[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
    }
    
    // Se estamos no meio de uma string, fechar
    if (inString) {
      fixed += '"';
    }
    
    // Remover última propriedade incompleta se necessário
    const lastComma = fixed.lastIndexOf(',');
    const lastBrace = fixed.lastIndexOf('}');
    const lastBracket = fixed.lastIndexOf(']');
    
    if (lastComma > lastBrace && lastComma > lastBracket) {
      // Há uma vírgula depois do último fechamento - remover conteúdo após ela
      fixed = fixed.substring(0, lastComma);
    }
    
    // Fechar arrays e objetos
    while (brackets > 0) {
      fixed += ']';
      brackets--;
    }
    while (braces > 0) {
      fixed += '}';
      braces--;
    }
    
    const parsed = JSON.parse(fixed);
    
    // Validar estrutura mínima
    if (parsed.nome && parsed.unidadesCurriculares) {
      return parsed;
    }
    
    return null;
  } catch (e) {
    console.error('[Gemini] Falha ao recuperar JSON:', e.message);
    return null;
  }
}

/**
 * Processa os arquivos e extrai dados do curso usando Gemini AI
 */
export async function extractCourseWithAI(matrizFile, pdfFile, onStatus) {
  onStatus?.('Iniciando extração...');

  // 1. Extrair dados da Matriz Curricular (Excel)
  let matrizText = '';
  let ucsFromExcel = [];
  
  if (matrizFile) {
    onStatus?.('Processando Matriz Curricular (Excel)...');
    try {
      const matrizData = await extractMatrizFromExcel(matrizFile);
      matrizText = matrizData.text;
      ucsFromExcel = matrizData.ucs;
      console.log('[Extraction] UCs do Excel:', ucsFromExcel);
    } catch (e) {
      console.error('Erro ao processar Excel:', e);
    }
  }

  // 2. Converter PDF para Base64
  onStatus?.('Preparando PDF para análise...');
  const pdfBase64 = await fileToBase64(pdfFile);

  // 3. Chamar Gemini AI para extrair dados
  const courseData = await callGeminiForExtraction(pdfBase64, matrizText, ucsFromExcel, onStatus);

  // 4. Mesclar com dados do Excel se necessário
  if (ucsFromExcel.length > 0 && courseData.unidadesCurriculares) {
    // Verificar se alguma UC do Excel não foi encontrada no PDF
    ucsFromExcel.forEach(excelUC => {
      const found = courseData.unidadesCurriculares.find(uc => 
        uc.nome.toLowerCase().includes(excelUC.nome.toLowerCase().substring(0, 15)) ||
        excelUC.nome.toLowerCase().includes(uc.nome.toLowerCase().substring(0, 15))
      );
      
      if (!found && excelUC.nome && excelUC.cargaHoraria > 0) {
        courseData.unidadesCurriculares.push({
          nome: excelUC.nome,
          modulo: excelUC.modulo || 'Específico I',
          cargaHoraria: excelUC.cargaHoraria,
          objetivo: '',
          capacidadesTecnicas: [],
          conhecimentos: []
        });
      }
    });
  }

  // 5. Validar e ajustar dados
  onStatus?.('Validando dados extraídos...');
  
  // Garantir que o ID existe
  if (!courseData.id) {
    courseData.id = courseData.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Calcular carga horária total se não existir
  if (!courseData.cargaHorariaTotal && courseData.unidadesCurriculares) {
    courseData.cargaHorariaTotal = courseData.unidadesCurriculares.reduce(
      (sum, uc) => sum + (uc.cargaHoraria || 0), 0
    );
  }

  // Garantir que tipoEnsino existe (padrão: técnico)
  if (!courseData.tipoEnsino) {
    courseData.tipoEnsino = 'tecnico';
  }

  return courseData;
}

/**
 * Valida os dados do curso extraído
 */
export function validateCourseData(courseData) {
  const errors = [];
  const warnings = [];

  if (!courseData.nome) errors.push('Nome do curso não identificado');
  if (!courseData.id) errors.push('ID do curso não gerado');
  if (!courseData.cargaHorariaTotal) warnings.push('Carga horária total não identificada');
  if (!courseData.competenciaGeral) warnings.push('Competência geral não identificada');
  
  if (!courseData.unidadesCurriculares || courseData.unidadesCurriculares.length === 0) {
    errors.push('Nenhuma unidade curricular identificada');
  } else {
    courseData.unidadesCurriculares.forEach((uc, i) => {
      if (!uc.nome) errors.push(`UC ${i + 1}: Nome não identificado`);
      if (!uc.cargaHoraria) warnings.push(`UC "${uc.nome}": Carga horária não identificada`);
      if (!uc.capacidadesTecnicas || uc.capacidadesTecnicas.length === 0) {
        warnings.push(`UC "${uc.nome}": Nenhuma capacidade identificada`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Salva o curso no MongoDB via API
 */
export async function saveCourseToDatabase(courseData) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  const response = await fetch(`${API_URL}/api/cursos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erro ao salvar: ${response.status}`);
  }

  return response.json();
}

export default {
  extractCourseWithAI,
  extractMatrizFromExcel,
  validateCourseData,
  saveCourseToDatabase
};
