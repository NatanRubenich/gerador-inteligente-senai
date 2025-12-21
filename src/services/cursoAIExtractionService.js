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
        let cursoNome = '';
        
        // Processar apenas a primeira planilha (ou a que contém "Matriz")
        const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('matriz')) || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        console.log('[Excel] Processando planilha:', sheetName);
        console.log('[Excel] Total de linhas:', jsonData.length);
        
        // Converter para texto
        jsonData.forEach(row => {
          if (row && row.length > 0) {
            allText += row.join(' | ') + '\n';
          }
        });
        
        // Detectar estrutura da planilha
        // Estrutura típica SENAI:
        // Coluna 0: Ano (1º ANO, 2º ANO) - pode estar vazia
        // Coluna 1: Período (1º Período)
        // Coluna 2: Módulo (Indústria, Introdutório, Específico I, etc)
        // Coluna 4: Número da UC (1.0, 2.0, etc)
        // Coluna 5: Nome da UC
        // Coluna 6: Carga Horária Total
        
        let currentPeriodo = '';
        let currentAno = '';
        
        jsonData.forEach((row, index) => {
          if (!row || row.length < 5) return;
          
          // Tentar extrair nome do curso da primeira linha
          if (index <= 2 && !cursoNome) {
            for (const cell of row) {
              const cellStr = String(cell || '').trim();
              if (cellStr.toLowerCase().includes('técnico') || cellStr.toLowerCase().includes('tecnico')) {
                cursoNome = cellStr.split('\n')[0].trim();
                break;
              }
            }
          }
          
          // Atualizar ano atual
          const col0 = String(row[0] || '').trim();
          if (col0.match(/^\d+º\s*ANO/i)) {
            currentAno = col0;
          }
          
          // Atualizar período atual
          const col1 = String(row[1] || '').trim();
          if (col1.match(/período|semestre/i)) {
            currentPeriodo = col1;
          }
          
          // Detectar linha de UC
          // Procurar por: número (coluna 4), nome (coluna 5), carga horária (coluna 6)
          const numUC = row[4];
          const nomeUC = String(row[5] || '').trim();
          const cargaHoraria = row[6];
          const modulo = String(row[2] || '').trim();
          
          // Validar se é uma UC válida
          if (nomeUC && 
              nomeUC.length > 3 && 
              !nomeUC.toLowerCase().includes('unidades curriculares') &&
              !nomeUC.toLowerCase().includes('carga horária') &&
              typeof numUC === 'number' && 
              numUC > 0 && 
              numUC < 100) {
            
            const ch = typeof cargaHoraria === 'number' ? cargaHoraria : parseInt(String(cargaHoraria).replace(/[^\d]/g, '')) || 0;
            
            if (ch > 0) {
              ucs.push({
                numero: numUC,
                nome: nomeUC,
                cargaHoraria: ch,
                modulo: normalizeModulo(modulo),
                periodo: currentPeriodo,
                ano: currentAno
              });
              console.log(`[Excel] UC encontrada: ${numUC}. ${nomeUC} (${ch}h) - ${modulo}`);
            }
          }
        });
        
        // Se não encontrou UCs com a estrutura acima, tentar estrutura alternativa
        if (ucs.length === 0) {
          console.log('[Excel] Tentando estrutura alternativa...');
          ucs = extractUCsAlternativeStructure(jsonData);
        }
        
        console.log(`[Excel] Total de UCs extraídas: ${ucs.length}`);
        resolve({ text: allText, ucs, cursoNome });
      } catch (error) {
        console.error('[Excel] Erro ao processar:', error);
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extrai UCs usando estrutura alternativa (quando a estrutura padrão não funciona)
 */
function extractUCsAlternativeStructure(jsonData) {
  const ucs = [];
  
  jsonData.forEach((row, index) => {
    if (!row || row.length < 2) return;
    
    // Procurar por qualquer célula que pareça ser nome de UC seguida de carga horária
    for (let i = 0; i < row.length - 1; i++) {
      const cell = String(row[i] || '').trim();
      const nextCell = row[i + 1];
      
      // Verificar se parece ser uma UC (nome com mais de 10 caracteres, não é cabeçalho)
      if (cell.length > 10 && 
          !cell.toLowerCase().match(/^(módulo|período|total|carga|unidade|ano|semestre)/i) &&
          !cell.includes('=') && // Não é fórmula
          typeof nextCell === 'number' && 
          nextCell > 0 && 
          nextCell <= 500) { // Carga horária razoável
        
        // Verificar se já não foi adicionada
        if (!ucs.find(uc => uc.nome === cell)) {
          ucs.push({
            nome: cell,
            cargaHoraria: nextCell,
            modulo: detectModuloFromRow(row)
          });
        }
      }
    }
  });
  
  return ucs;
}

/**
 * Detecta o módulo a partir de uma linha
 */
function detectModuloFromRow(row) {
  for (const cell of row) {
    const text = String(cell || '').toLowerCase();
    if (text.includes('básico')) return 'Básico';
    if (text.includes('introdutório') || text.includes('introdutorio')) return 'Introdutório';
    if (text.includes('indústria') || text.includes('industria')) return 'Indústria';
    if (text.includes('inovação') || text.includes('inovacao')) return 'Inovação';
    if (text.includes('específico iii') || text.includes('especifico iii')) return 'Específico III';
    if (text.includes('específico ii') || text.includes('especifico ii')) return 'Específico II';
    if (text.includes('específico i') || text.includes('especifico i')) return 'Específico I';
    if (text.includes('específico') || text.includes('especifico')) return 'Específico I';
  }
  return 'Específico I';
}

/**
 * Normaliza o nome do módulo
 */
function normalizeModulo(modulo) {
  const m = modulo.toLowerCase();
  if (m.includes('básico')) return 'Básico';
  if (m.includes('introdutório') || m.includes('introdutorio')) return 'Introdutório';
  if (m.includes('indústria') || m.includes('industria')) return 'Indústria';
  if (m.includes('inovação') || m.includes('inovacao')) return 'Inovação';
  if (m.includes('específico iii') || m.includes('especifico iii')) return 'Específico III';
  if (m.includes('específico ii') || m.includes('especifico ii')) return 'Específico II';
  if (m.includes('específico i') || m.includes('especifico i')) return 'Específico I';
  if (m.includes('específico') || m.includes('especifico')) return 'Específico I';
  return modulo || 'Específico I';
}

/**
 * Chama a API do Gemini para extrair dados do curso - Etapa 1: Dados gerais do curso
 * Usa as UCs da Matriz Curricular como referência
 */
async function callGeminiStep1(pdfBase64, ucsFromExcel, onStatus) {
  onStatus?.('Etapa 1/3: Extraindo dados gerais do curso...');

  const ucListText = ucsFromExcel.map((uc, i) => 
    `${i + 1}. ${uc.nome} (${uc.cargaHoraria}h - ${uc.modulo || 'Módulo não identificado'})`
  ).join('\n');

  const prompt = `Você é um especialista em educação profissional do SENAI. Analise o documento PDF anexado (PPC/Itinerário Nacional) e extraia os DADOS GERAIS do curso.

A MATRIZ CURRICULAR já foi processada e contém as seguintes Unidades Curriculares:
${ucListText}

EXTRAIA APENAS os dados gerais do curso:
1. Nome completo do curso
2. CBO (Classificação Brasileira de Ocupações)
3. Carga horária total
4. Eixo tecnológico
5. Área tecnológica
6. Competência geral (texto completo)

NÃO extraia as UCs - elas já foram identificadas na matriz curricular.

Retorne APENAS JSON válido:
{
  "nome": "TÉCNICO EM EDIFICAÇÕES",
  "id": "tecnico-em-edificacoes",
  "cbo": "3121-05",
  "cargaHorariaTotal": 1200,
  "eixoTecnologico": "Infraestrutura",
  "areaTecnologica": "CC- Edificações",
  "competenciaGeral": "Texto completo da competência geral..."
}`;

  return await callGeminiAPI(pdfBase64, prompt);
}

/**
 * Chama a API do Gemini para extrair CAPACIDADES de UCs específicas - Etapa 2
 */
async function callGeminiStep2Capacidades(pdfBase64, ucs, onStatus) {
  const ucNames = ucs.map(uc => uc.nome);
  onStatus?.(`Etapa 2/3: Extraindo capacidades de ${ucNames.length} UCs...`);

  const prompt = `Analise o documento PDF (PPC/Itinerário Nacional do SENAI) e extraia as CAPACIDADES das seguintes Unidades Curriculares:

${ucs.map((uc, i) => `${i + 1}. "${uc.nome}" (${uc.cargaHoraria}h)`).join('\n')}

Para CADA UC acima, extraia:
- Objetivo da UC (texto completo)
- TODAS as Capacidades Técnicas (CT1, CT2...) ou Capacidades Básicas (CB1, CB2...) ou Capacidades Socioemocionais (CS1, CS2...)

IMPORTANTE: 
- Extraia TODAS as capacidades de cada UC, não resuma
- Use os códigos exatos do documento (CT, CB, CS)
- Mantenha a descrição completa de cada capacidade

Retorne APENAS JSON válido:
{
  "detalhesUCs": [
    {
      "nome": "Nome exato da UC",
      "objetivo": "Objetivo completo da UC...",
      "capacidadesTecnicas": [
        { "codigo": "CT1", "descricao": "Descrição completa da capacidade..." },
        { "codigo": "CT2", "descricao": "Descrição completa da capacidade..." }
      ]
    }
  ]
}`;

  return await callGeminiAPI(pdfBase64, prompt);
}

/**
 * Chama a API do Gemini para extrair CONHECIMENTOS de UCs específicas - Etapa 3
 */
async function callGeminiStep3Conhecimentos(pdfBase64, ucs, onStatus) {
  const ucNames = ucs.map(uc => uc.nome);
  onStatus?.(`Etapa 3/3: Extraindo conhecimentos de ${ucNames.length} UCs...`);

  const prompt = `Analise o documento PDF (PPC/Itinerário Nacional do SENAI) e extraia os CONHECIMENTOS das seguintes Unidades Curriculares:

${ucs.map((uc, i) => `${i + 1}. "${uc.nome}" (${uc.cargaHoraria}h)`).join('\n')}

Para CADA UC acima, extraia TODOS os CONHECIMENTOS com sua hierarquia completa:
- Tópicos principais (1, 2, 3...)
- Subtópicos (1.1, 1.2, 2.1, 2.2...)
- Sub-subtópicos se existirem (1.1.1, 1.1.2...)

IMPORTANTE:
- Extraia TODOS os conhecimentos de cada UC
- Mantenha a hierarquia e numeração original
- Inclua todos os níveis de detalhamento

Retorne APENAS JSON válido:
{
  "conhecimentosUCs": [
    {
      "nome": "Nome exato da UC",
      "conhecimentos": [
        { 
          "topico": "1 NOME DO TÓPICO PRINCIPAL", 
          "subtopicos": ["1.1 Subtópico A", "1.2 Subtópico B", "1.3 Subtópico C"] 
        },
        { 
          "topico": "2 OUTRO TÓPICO", 
          "subtopicos": ["2.1 Subtópico", "2.2 Subtópico"] 
        }
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
 * NOVA VERSÃO: Usa UCs da Matriz Curricular como guia
 */
async function callGeminiForExtraction(pdfBase64, matrizText, ucsFromExcel, onStatus) {
  if (!ucsFromExcel || ucsFromExcel.length === 0) {
    throw new Error('A Matriz Curricular é obrigatória e deve conter as Unidades Curriculares.');
  }

  console.log('[Gemini] UCs da Matriz Curricular:', ucsFromExcel);

  // Etapa 1: Extrair dados gerais do curso (usando UCs da matriz como referência)
  const step1Data = await callGeminiStep1(pdfBase64, ucsFromExcel, onStatus);
  console.log('[Gemini] Etapa 1 concluída - Dados gerais:', step1Data);

  // Etapa 2: Extrair CAPACIDADES das UCs em lotes
  const batchSize = 4; // Processar 4 UCs por vez para evitar truncamento
  const allCapacidades = [];
  const allConhecimentos = [];

  for (let i = 0; i < ucsFromExcel.length; i += batchSize) {
    const batch = ucsFromExcel.slice(i, i + batchSize);
    onStatus?.(`Extraindo capacidades das UCs ${i + 1}-${Math.min(i + batchSize, ucsFromExcel.length)} de ${ucsFromExcel.length}...`);
    
    try {
      const batchData = await callGeminiStep2Capacidades(pdfBase64, batch, onStatus);
      if (batchData.detalhesUCs) {
        allCapacidades.push(...batchData.detalhesUCs);
      }
    } catch (e) {
      console.warn(`[Gemini] Erro ao extrair capacidades do lote ${i + 1}-${i + batchSize}:`, e.message);
    }
  }

  // Etapa 3: Extrair CONHECIMENTOS das UCs em lotes
  for (let i = 0; i < ucsFromExcel.length; i += batchSize) {
    const batch = ucsFromExcel.slice(i, i + batchSize);
    onStatus?.(`Extraindo conhecimentos das UCs ${i + 1}-${Math.min(i + batchSize, ucsFromExcel.length)} de ${ucsFromExcel.length}...`);
    
    try {
      const batchData = await callGeminiStep3Conhecimentos(pdfBase64, batch, onStatus);
      if (batchData.conhecimentosUCs) {
        allConhecimentos.push(...batchData.conhecimentosUCs);
      }
    } catch (e) {
      console.warn(`[Gemini] Erro ao extrair conhecimentos do lote ${i + 1}-${i + batchSize}:`, e.message);
    }
  }

  // Mesclar dados: UCs da matriz + capacidades + conhecimentos do PPC
  const finalData = {
    ...step1Data,
    unidadesCurriculares: ucsFromExcel.map(uc => {
      // Encontrar capacidades correspondentes
      const capDetails = allCapacidades.find(d => 
        d.nome.toLowerCase().includes(uc.nome.toLowerCase().substring(0, 15)) ||
        uc.nome.toLowerCase().includes(d.nome.toLowerCase().substring(0, 15))
      );
      
      // Encontrar conhecimentos correspondentes
      const conDetails = allConhecimentos.find(d => 
        d.nome.toLowerCase().includes(uc.nome.toLowerCase().substring(0, 15)) ||
        uc.nome.toLowerCase().includes(d.nome.toLowerCase().substring(0, 15))
      );
      
      return {
        nome: uc.nome,
        modulo: uc.modulo || 'Específico I',
        cargaHoraria: uc.cargaHoraria || 0,
        objetivo: capDetails?.objetivo || '',
        capacidadesTecnicas: capDetails?.capacidadesTecnicas || [],
        conhecimentos: conDetails?.conhecimentos || []
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
 * IMPORTANTE: A Matriz Curricular (Excel) é OBRIGATÓRIA
 */
export async function extractCourseWithAI(matrizFile, pdfFile, onStatus) {
  onStatus?.('Iniciando extração...');

  // 1. Validar arquivos obrigatórios
  if (!matrizFile) {
    throw new Error('A Matriz Curricular (Excel) é OBRIGATÓRIA. Ela contém as UCs e cargas horárias que serão usadas como referência para extrair os dados do PPC.');
  }
  
  if (!pdfFile) {
    throw new Error('O PPC do Curso (PDF) é OBRIGATÓRIO. Ele contém as capacidades e conhecimentos de cada UC.');
  }

  // 2. Extrair dados da Matriz Curricular (Excel) - OBRIGATÓRIO
  onStatus?.('Processando Matriz Curricular (Excel)...');
  let matrizText = '';
  let ucsFromExcel = [];
  
  try {
    const matrizData = await extractMatrizFromExcel(matrizFile);
    matrizText = matrizData.text;
    ucsFromExcel = matrizData.ucs;
    console.log('[Extraction] UCs extraídas da Matriz:', ucsFromExcel);
    
    if (ucsFromExcel.length === 0) {
      throw new Error('Nenhuma Unidade Curricular foi identificada na Matriz Curricular. Verifique se o arquivo Excel contém as UCs com nome e carga horária.');
    }
    
    onStatus?.(`Matriz processada: ${ucsFromExcel.length} UCs identificadas`);
  } catch (e) {
    console.error('Erro ao processar Excel:', e);
    throw new Error(`Erro ao processar Matriz Curricular: ${e.message}`);
  }

  // 3. Converter PDF para Base64
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
