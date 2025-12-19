/**
 * Serviço de Extração de Dados de Cursos
 * Extrai informações de PDFs (Projeto do Curso) e XLS (Matriz SAEP)
 * para alimentar o sistema RAG
 * 
 * Estrutura dos PDFs SENAI:
 * - Identificação da ocupação (Nome, CBO, Carga Horária, Eixo Tecnológico)
 * - Competência Geral
 * - Relação das Funções
 * - Descrição das Funções (Subfunções e Padrões de Desempenho)
 * - Unidades Curriculares (Capacidades Técnicas, Capacidades Socioemocionais, Conhecimentos)
 */

import * as XLSX from 'xlsx';

/**
 * Extrai texto de um arquivo PDF usando pdf.js
 * Otimizado para PDFs SENAI com estrutura de tabelas
 * 
 * Para PDFs grandes (>50 páginas), processa em duas fases:
 * 1. Extrai páginas iniciais para identificação do curso
 * 2. Busca páginas com "Unidade Curricular" para extrair UCs
 * 
 * @param {File} file - Arquivo PDF
 * @param {Function} onProgress - Callback de progresso (opcional)
 * @returns {Promise<string>} - Texto extraído
 */
export async function extractTextFromPDF(file, onProgress = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        
        // Usar pdf.js para extrair texto
        const pdfjsLib = await import('pdfjs-dist');
        // Usar worker inline para evitar problemas de CORS/CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const totalPages = pdf.numPages;
        let fullText = '';
        
        console.log(`[PDF] Total de páginas: ${totalPages}`);
        
        // Para PDFs grandes, processar de forma inteligente
        const isLargePDF = totalPages > 50;
        
        if (isLargePDF) {
          console.log('[PDF] PDF grande detectado, usando extração otimizada...');
          
          // Fase 1: Extrair primeiras 10 páginas (identificação do curso)
          for (let i = 1; i <= Math.min(10, totalPages); i++) {
            if (onProgress) onProgress(`Extraindo página ${i}/${totalPages}...`);
            const pageText = await extractPageText(pdf, i);
            fullText += pageText + '\n\n--- PAGE BREAK ---\n\n';
          }
          
          // Fase 2: Buscar páginas com "Unidade Curricular" ou "Detalhamento"
          const relevantPages = [];
          
          for (let i = 11; i <= totalPages; i++) {
            if (onProgress && i % 20 === 0) {
              onProgress(`Analisando página ${i}/${totalPages}...`);
            }
            
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const quickText = textContent.items.map(item => item.str).join(' ');
            
            // Verificar se página contém conteúdo relevante
            if (quickText.includes('Unidade Curricular') || 
                quickText.includes('Capacidades Técnicas') ||
                quickText.includes('Capacidades Básicas') ||
                quickText.includes('Detalhamento das Unidades') ||
                quickText.includes('CONTEÚDOS FORMATIVOS')) {
              relevantPages.push(i);
            }
          }
          
          console.log(`[PDF] Páginas relevantes encontradas: ${relevantPages.length}`);
          
          // Extrair apenas páginas relevantes
          for (let i = 0; i < relevantPages.length; i++) {
            const pageNum = relevantPages[i];
            if (onProgress) onProgress(`Extraindo UC ${i + 1}/${relevantPages.length}...`);
            const pageText = await extractPageText(pdf, pageNum);
            fullText += pageText + '\n\n--- PAGE BREAK ---\n\n';
          }
        } else {
          // PDF pequeno: processar todas as páginas
          for (let i = 1; i <= totalPages; i++) {
            if (onProgress) onProgress(`Extraindo página ${i}/${totalPages}...`);
            const pageText = await extractPageText(pdf, i);
            fullText += pageText + '\n\n--- PAGE BREAK ---\n\n';
          }
        }
        
        console.log(`[PDF] Texto extraído: ${fullText.length} caracteres`);
        resolve(fullText);
      } catch (error) {
        console.error('[PDF] Erro na extração:', error);
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extrai texto de uma página específica do PDF
 * Separa conteúdo em duas colunas para PDFs SENAI:
 * - Coluna esquerda (x < 350): Capacidades
 * - Coluna direita (x >= 350): Conhecimentos
 */
async function extractPageText(pdf, pageNum) {
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();
  
  const items = textContent.items;
  
  // Separar itens por coluna baseado na posição X
  const leftItems = [];  // Capacidades (x < 350)
  const rightItems = []; // Conhecimentos (x >= 350)
  
  for (const item of items) {
    const x = Math.round(item.transform[4]);
    const y = Math.round(item.transform[5]);
    const text = item.str;
    
    if (x < 350) {
      leftItems.push({ x, y, text });
    } else {
      rightItems.push({ x, y, text });
    }
  }
  
  // Função para agrupar itens por linha (Y) e concatenar
  const groupByLine = (items) => {
    const lines = {};
    for (const item of items) {
      const y = Math.round(item.y / 10) * 10; // Agrupar por faixas de 10px
      if (!lines[y]) lines[y] = [];
      lines[y].push(item);
    }
    
    // Ordenar por Y (de cima para baixo) e X (esquerda para direita)
    const sortedYs = Object.keys(lines).map(Number).sort((a, b) => b - a);
    let text = '';
    
    for (const y of sortedYs) {
      const lineItems = lines[y].sort((a, b) => a.x - b.x);
      const lineText = lineItems.map(i => i.text).join(' ').trim();
      if (lineText.length > 0) {
        text += lineText + '\n';
      }
    }
    
    return text;
  };
  
  // Gerar texto separado por seções
  const leftText = groupByLine(leftItems);
  const rightText = groupByLine(rightItems);
  
  // Retornar com marcadores de seção para facilitar parsing
  let pageText = '';
  
  if (leftText.trim()) {
    pageText += '<<COLUNA_ESQUERDA>>\n' + leftText + '\n<</COLUNA_ESQUERDA>>\n';
  }
  
  if (rightText.trim()) {
    pageText += '<<COLUNA_DIREITA>>\n' + rightText + '\n<</COLUNA_DIREITA>>\n';
  }
  
  return pageText;
}

/**
 * Extrai dados de um arquivo XLS/XLSX
 * @param {File} file - Arquivo Excel
 * @returns {Promise<Array>} - Dados extraídos
 */
export async function extractDataFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const allSheets = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          allSheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        });
        
        resolve(allSheets);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Analisa o texto do PDF para extrair informações do curso
 * Estrutura SENAI:
 * - Ocupação: TÉCNICO EM EDIFICAÇÕES | CBO: 3121-05
 * - C.H MÍNIMA: 1200h
 * - COMPETÊNCIA GERAL: texto
 * - Relação das Funções: Função 1, Função 2, Função 3
 * - Descrição das Funções: FUNÇÃO 1 > Subfunção > Padrões de Desempenho
 * 
 * @param {string} text - Texto extraído do PDF
 * @returns {Object} - Dados estruturados do curso
 */
export function parseCourseFromPDF(text) {
  const curso = {
    id: '',
    nome: '',
    cbo: '',
    cargaHorariaTotal: 0,
    eixoTecnologico: '',
    areaTecnologica: '',
    perfilProfissional: '',
    competenciaGeral: '',
    requisitoAcesso: '',
    funcoes: [],
    unidadesCurriculares: []
  };

  // Normalizar texto para facilitar parsing
  const normalizedText = text.replace(/\s+/g, ' ').trim();

  // ============================================
  // EXTRAIR IDENTIFICAÇÃO DA OCUPAÇÃO
  // ============================================
  
  // Padrão: "Ocupação TÉCNICO EM EDIFICAÇÕES CBO 3121-05"
  const ocupacaoMatch = normalizedText.match(/Ocupação\s+(TÉCNICO\s+EM\s+[A-ZÀ-ÿÇ\s]+?)\s+CBO\s+(\d{4}-\d{2})/i);
  if (ocupacaoMatch) {
    curso.nome = ocupacaoMatch[1].trim();
    curso.cbo = ocupacaoMatch[2];
    curso.id = generateCourseId(curso.nome);
  } else {
    // Fallback: tentar outros padrões
    const nomeAlt = normalizedText.match(/(\d+)\.\s*(TÉCNICO\s+EM\s+[A-ZÀ-ÿÇ\s]+?)(?:\s+Identificação|CBO)/i);
    if (nomeAlt) {
      curso.nome = nomeAlt[2].trim();
      curso.id = generateCourseId(curso.nome);
    }
    
    const cboAlt = normalizedText.match(/CBO\s+(\d{4}-\d{2})/i);
    if (cboAlt) curso.cbo = cboAlt[1];
  }

  // Extrair carga horária
  const chMatch = normalizedText.match(/C\.?\s*H\.?\s*(?:MÍNIMA|TOTAL)?[:\s]*(\d{3,4})\s*h/i);
  if (chMatch) {
    curso.cargaHorariaTotal = parseInt(chMatch[1]);
  }

  // Extrair Eixo Tecnológico
  const eixoMatch = normalizedText.match(/EIXO\s+TECNOLÓGICO\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+ÁREA|SEGMENTO)/i);
  if (eixoMatch) {
    curso.eixoTecnologico = eixoMatch[1].trim();
  }

  // Extrair Área Tecnológica
  const areaMatch = normalizedText.match(/ÁREA\s+TECNOLÓGICA\s+(?:CC-\s*)?([A-Za-zÀ-ÿ\s]+?)(?:\s+ÁREA|SEGMENTO)/i);
  if (areaMatch) {
    curso.areaTecnologica = areaMatch[1].trim();
  }

  // ============================================
  // EXTRAIR COMPETÊNCIA GERAL
  // ============================================
  const compGeralMatch = normalizedText.match(/COMPETÊNCIA\s+GERAL\s+(.+?)(?:REQUISITO\s+DE\s+ACESSO|Relação\s+das\s+Funções)/is);
  if (compGeralMatch) {
    curso.competenciaGeral = compGeralMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extrair Requisito de Acesso
  const reqMatch = normalizedText.match(/REQUISITO\s+DE\s+ACESSO\s+(.+?)(?:Relação\s+das\s+Funções)/is);
  if (reqMatch) {
    curso.requisitoAcesso = reqMatch[1].trim();
  }

  // ============================================
  // EXTRAIR FUNÇÕES
  // ============================================
  curso.funcoes = extractFuncoes(normalizedText);

  // ============================================
  // EXTRAIR UNIDADES CURRICULARES
  // ============================================
  curso.unidadesCurriculares = extractUnidadesCurricularesV2(text);

  return curso;
}

/**
 * Extrai as Funções do curso
 */
function extractFuncoes(text) {
  const funcoes = [];
  
  // Padrão: "Função 1 Desenvolver projetos de edificações..."
  const funcaoPattern = /Função\s+(\d+)\s+(.+?)(?=Função\s+\d+|Descrição\s+das\s+Funções|$)/gi;
  
  let match;
  while ((match = funcaoPattern.exec(text)) !== null) {
    funcoes.push({
      numero: parseInt(match[1]),
      descricao: match[2].trim().replace(/\s+/g, ' ').substring(0, 500)
    });
  }
  
  return funcoes;
}

/**
 * Extrai Unidades Curriculares do texto do PDF - Versão 4 (Colunas Separadas)
 * 
 * Esta versão processa o texto com marcadores de coluna:
 * - <<COLUNA_ESQUERDA>>: Contém capacidades (verbos de ação)
 * - <<COLUNA_DIREITA>>: Contém conhecimentos (estrutura numerada)
 * 
 * @param {string} text - Texto extraído do PDF com marcadores de coluna
 * @returns {Array} - Lista de UCs
 */
function extractUnidadesCurricularesV2(text) {
  const ucs = [];
  
  console.log('[PDF] Extraindo UCs com separação de colunas...');
  
  // Encontrar todas as ocorrências de "Unidade Curricular:" no texto
  const ucPattern = /Unidade\s+Curricular[:\s]+([A-ZÀ-ÿa-zà-ÿ\s\d\-\/\(\),\.]+?)(?=\s+Carga\s+Horária|\s+Função|\s+Indicador)/gi;
  const ucMatches = [];
  let match;
  
  while ((match = ucPattern.exec(text)) !== null) {
    let ucName = match[1].trim()
      .replace(/\s+/g, ' ')
      .replace(/Carga\s*Horária.*$/i, '')
      .replace(/Função.*$/i, '')
      .trim();
    
    // Filtrar nomes inválidos
    if (ucName.length >= 5 && !ucName.match(/^(MÓDULO|BÁSICO|ESPECÍFICO|Indicador|Capacidades|Perfil|Unidade\s+Curricular)/i)) {
      ucMatches.push({
        nome: ucName,
        posicao: match.index
      });
    }
  }
  
  console.log('[PDF] Encontradas', ucMatches.length, 'UCs no texto');
  
  // Para cada UC, extrair o conteúdo completo até a próxima UC
  for (let i = 0; i < ucMatches.length; i++) {
    const ucInfo = ucMatches[i];
    const startPos = ucInfo.posicao;
    const endPos = i < ucMatches.length - 1 ? ucMatches[i + 1].posicao : text.length;
    
    // Extrair seção completa da UC (pode ter várias páginas)
    const ucSection = text.substring(startPos, endPos);
    
    // Detectar módulo (procurar antes da UC)
    const beforeText = text.substring(Math.max(0, startPos - 3000), startPos);
    let modulo = detectModuloFromText(beforeText);
    
    // Extrair carga horária
    const chMatch = ucSection.match(/Carga\s+Horária[:\s]+(\d+)\s*h/i);
    const cargaHoraria = chMatch ? parseInt(chMatch[1]) : 0;
    
    // Extrair objetivo
    const objetivoMatch = ucSection.match(/Objetivo\s+(?:Geral)?[:\s]+(.+?)(?:CONTEÚDOS|Capacidades|Função|Indicador|<<)/is);
    const objetivo = objetivoMatch ? objetivoMatch[1].trim().replace(/\s+/g, ' ').substring(0, 800) : '';
    
    // Extrair capacidades da COLUNA ESQUERDA
    const capacidades = extractCapacidadesFromColumns(ucSection);
    
    // Extrair conhecimentos da COLUNA DIREITA
    const conhecimentos = extractConhecimentosFromColumns(ucSection);
    
    // Verificar se UC já existe (evitar duplicatas por nome similar)
    const existingUC = ucs.find(u => {
      const nome1 = u.nome.toLowerCase().substring(0, 30);
      const nome2 = ucInfo.nome.toLowerCase().substring(0, 30);
      return nome1 === nome2;
    });
    
    if (!existingUC) {
      ucs.push({
        nome: ucInfo.nome,
        modulo: modulo,
        cargaHoraria: cargaHoraria,
        objetivo: objetivo,
        capacidadesTecnicas: capacidades,
        conhecimentos: conhecimentos
      });
      
      console.log('[PDF] UC extraída:', ucInfo.nome.substring(0, 40), '- Cap:', capacidades.length, '- Conh:', conhecimentos.length);
    }
  }
  
  return ucs;
}

/**
 * Detecta o módulo a partir do texto anterior à UC
 */
function detectModuloFromText(text) {
  // Procurar de trás para frente o módulo mais recente
  if (/Módulo[:\s]+ESPECÍFICO\s+III/i.test(text)) return 'Específico III';
  if (/Módulo[:\s]+ESPECÍFICO\s+II(?!\s*I)/i.test(text)) return 'Específico II';
  if (/Módulo[:\s]+ESPECÍFICO\s+I(?!\s*I)/i.test(text)) return 'Específico I';
  if (/Módulo[:\s]+INTRODUTÓRIO/i.test(text)) return 'Introdutório';
  if (/Módulo[:\s]+BÁSICO/i.test(text)) return 'Básico';
  if (/Básico\s+da\s+Indústria/i.test(text)) return 'Básico';
  
  return 'Específico I';
}

/**
 * Extrai capacidades das colunas esquerdas do PDF
 * As capacidades estão marcadas com <<COLUNA_ESQUERDA>>
 */
function extractCapacidadesFromColumns(ucSection) {
  const capacidades = [];
  
  // Extrair todo o texto das colunas esquerdas
  const leftColumnPattern = /<<COLUNA_ESQUERDA>>([\s\S]*?)(?:<<|$)/g;
  let allLeftText = '';
  let match;
  
  while ((match = leftColumnPattern.exec(ucSection)) !== null) {
    allLeftText += match[1] + '\n';
  }
  
  // Se não encontrou marcadores, usar texto completo (fallback)
  if (!allLeftText.trim()) {
    allLeftText = ucSection;
  }
  
  // Detectar tipo de capacidade (Básicas ou Técnicas)
  const tipoMatch = ucSection.match(/Capacidades\s+(Básicas|Técnicas)/i);
  const prefixo = tipoMatch && tipoMatch[1].toLowerCase() === 'básicas' ? 'CB' : 'CT';
  
  // Verbos que iniciam capacidades (mais completo)
  const verbosCapacidade = [
    'Reconhecer', 'Identificar', 'Aplicar', 'Utilizar', 'Interpretar',
    'Analisar', 'Correlacionar', 'Compreender', 'Desenvolver', 'Elaborar',
    'Realizar', 'Selecionar', 'Definir', 'Planejar', 'Executar', 'Avaliar',
    'Verificar', 'Orientar', 'Controlar', 'Coordenar', 'Subsidiar', 'Situar',
    'Representar', 'Propiciar', 'Demonstrar', 'Comunicar', 'Manter', 'Atuar',
    'Aceitar', 'Dimensionar', 'Especificar', 'Projetar', 'Calcular', 'Quantificar',
    'Organizar', 'Gerenciar', 'Supervisionar', 'Monitorar', 'Implementar',
    'Configurar', 'Instalar', 'Testar', 'Validar', 'Documentar', 'Registrar',
    'Acompanhar', 'Participar', 'Colaborar', 'Contribuir', 'Propor', 'Sugerir',
    'Estabelecer', 'Determinar', 'Distinguir', 'Diferenciar', 'Comparar',
    'Classificar', 'Categorizar', 'Ordenar', 'Priorizar', 'Otimizar',
    'Resolver', 'Solucionar', 'Diagnosticar', 'Detectar', 'Localizar',
    'Prevenir', 'Corrigir', 'Ajustar', 'Calibrar', 'Regular', 'Operar',
    'Manipular', 'Manusear', 'Preparar', 'Processar', 'Transformar',
    'Construir', 'Fabricar', 'Produzir', 'Montar', 'Desmontar', 'Reparar',
    'Restaurar', 'Recuperar', 'Substituir', 'Trocar', 'Remover', 'Inserir',
    'Conectar', 'Desconectar', 'Ligar', 'Desligar', 'Ativar', 'Desativar',
    'Programar', 'Codificar', 'Modelar', 'Simular', 'Prototipar',
    'Negociar', 'Mediar', 'Conciliar', 'Argumentar', 'Persuadir', 'Convencer',
    'Liderar', 'Motivar', 'Inspirar', 'Delegar', 'Distribuir', 'Alocar',
    'Estimar', 'Prever', 'Prospectar', 'Pesquisar', 'Investigar', 'Explorar',
    'Coletar', 'Reunir', 'Compilar', 'Sintetizar', 'Resumir', 'Condensar',
    'Expandir', 'Ampliar', 'Aprofundar', 'Detalhar', 'Especificar', 'Descrever',
    'Explicar', 'Esclarecer', 'Ilustrar', 'Exemplificar', 'Demonstrar',
    'Apresentar', 'Expor', 'Relatar', 'Informar', 'Notificar', 'Alertar',
    'Advertir', 'Recomendar', 'Aconselhar', 'Orientar', 'Guiar', 'Direcionar',
    'Conduzir', 'Facilitar', 'Viabilizar', 'Possibilitar', 'Permitir', 'Autorizar',
    'Aprovar', 'Validar', 'Certificar', 'Atestar', 'Comprovar', 'Evidenciar',
    'Fundamentar', 'Embasar', 'Justificar', 'Argumentar', 'Defender', 'Sustentar'
  ];
  
  let index = 1;
  const seen = new Set();
  
  // Método 1: Buscar frases que começam com verbos no infinitivo
  const verbosRegex = verbosCapacidade.join('|');
  
  // Padrão mais flexível: verbo seguido de texto até ponto, ponto-e-vírgula, ou quebra de linha dupla
  const capPattern = new RegExp(
    `((?:${verbosRegex})(?:\\s+(?:a|o|as|os|de|do|da|dos|das|em|no|na|nos|nas|com|para|por|ao|à|aos|às|um|uma|uns|umas|seu|sua|seus|suas|este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|qual|quais|quanto|quanta|quantos|quantas|todo|toda|todos|todas|outro|outra|outros|outras|mesmo|mesma|mesmos|mesmas|próprio|própria|próprios|próprias|tal|tais|algum|alguma|alguns|algumas|nenhum|nenhuma|nenhuns|nenhumas|muito|muita|muitos|muitas|pouco|pouca|poucos|poucas|tanto|tanta|tantos|tantas|quanto|quanta|quantos|quantas|vário|vária|vários|várias|diverso|diversa|diversos|diversas|certo|certa|certos|certas|determinado|determinada|determinados|determinadas|qualquer|quaisquer|cada|ambos|ambas|mais|menos|demais|bastante|bastantes|suficiente|suficientes|necessário|necessária|necessários|necessárias|possível|possíveis|provável|prováveis|capaz|capazes|apto|apta|aptos|aptas|hábil|hábeis|competente|competentes|eficiente|eficientes|eficaz|eficazes|adequado|adequada|adequados|adequadas|apropriado|apropriada|apropriados|apropriadas|conveniente|convenientes|oportuno|oportuna|oportunos|oportunas|pertinente|pertinentes|relevante|relevantes|significativo|significativa|significativos|significativas|importante|importantes|essencial|essenciais|fundamental|fundamentais|básico|básica|básicos|básicas|principal|principais|primário|primária|primários|primárias|secundário|secundária|secundários|secundárias|terciário|terciária|terciários|terciárias|inicial|iniciais|final|finais|intermediário|intermediária|intermediários|intermediárias|anterior|anteriores|posterior|posteriores|superior|superiores|inferior|inferiores|interno|interna|internos|internas|externo|externa|externos|externas|técnico|técnica|técnicos|técnicas|profissional|profissionais|pessoal|pessoais|social|sociais|econômico|econômica|econômicos|econômicas|político|política|políticos|políticas|cultural|culturais|ambiental|ambientais|natural|naturais|artificial|artificiais|manual|manuais|automático|automática|automáticos|automáticas|mecânico|mecânica|mecânicos|mecânicas|elétrico|elétrica|elétricos|elétricas|eletrônico|eletrônica|eletrônicos|eletrônicas|digital|digitais|analógico|analógica|analógicos|analógicas|físico|física|físicos|físicas|químico|química|químicos|químicas|biológico|biológica|biológicos|biológicas|matemático|matemática|matemáticos|matemáticas|estatístico|estatística|estatísticos|estatísticas|geométrico|geométrica|geométricos|geométricas|gráfico|gráfica|gráficos|gráficas|visual|visuais|auditivo|auditiva|auditivos|auditivas|tátil|táteis|olfativo|olfativa|olfativos|olfativas|gustativo|gustativa|gustativos|gustativas|sensorial|sensoriais|motor|motora|motores|motoras|cognitivo|cognitiva|cognitivos|cognitivas|emocional|emocionais|afetivo|afetiva|afetivos|afetivas|comportamental|comportamentais|atitudinal|atitudinais|procedimental|procedimentais|conceitual|conceituais|factual|factuais|declarativo|declarativa|declarativos|declarativas|condicional|condicionais|estratégico|estratégica|estratégicos|estratégicas|tático|tática|táticos|táticas|operacional|operacionais|gerencial|gerenciais|administrativo|administrativa|administrativos|administrativas|organizacional|organizacionais|institucional|institucionais|empresarial|empresariais|comercial|comerciais|industrial|industriais|agrícola|agrícolas|pecuário|pecuária|pecuários|pecuárias|florestal|florestais|mineral|minerais|energético|energética|energéticos|energéticas|hidráulico|hidráulica|hidráulicos|hidráulicas|pneumático|pneumática|pneumáticos|pneumáticas|térmico|térmica|térmicos|térmicas|acústico|acústica|acústicos|acústicas|óptico|óptica|ópticos|ópticas|magnético|magnética|magnéticos|magnéticas|nuclear|nucleares|atômico|atômica|atômicos|atômicas|molecular|moleculares|celular|celulares|orgânico|orgânica|orgânicos|orgânicas|inorgânico|inorgânica|inorgânicos|inorgânicas|sintético|sintética|sintéticos|sintéticas|natural|naturais|artificial|artificiais|renovável|renováveis|sustentável|sustentáveis|reciclável|recicláveis|biodegradável|biodegradáveis|tóxico|tóxica|tóxicos|tóxicas|inflamável|inflamáveis|explosivo|explosiva|explosivos|explosivas|corrosivo|corrosiva|corrosivos|corrosivas|radioativo|radioativa|radioativos|radioativas|perigoso|perigosa|perigosos|perigosas|seguro|segura|seguros|seguras|confiável|confiáveis|durável|duráveis|resistente|resistentes|flexível|flexíveis|rígido|rígida|rígidos|rígidas|maleável|maleáveis|dúctil|dúcteis|frágil|frágeis|robusto|robusta|robustos|robustas|leve|leves|pesado|pesada|pesados|pesadas|denso|densa|densos|densas|poroso|porosa|porosos|porosas|compacto|compacta|compactos|compactas|sólido|sólida|sólidos|sólidas|líquido|líquida|líquidos|líquidas|gasoso|gasosa|gasosos|gasosas|aquoso|aquosa|aquosos|aquosas|oleoso|oleosa|oleosos|oleosas|viscoso|viscosa|viscosos|viscosas|fluido|fluida|fluidos|fluidas|volátil|voláteis|estável|estáveis|instável|instáveis|reativo|reativa|reativos|reativas|inerte|inertes|neutro|neutra|neutros|neutras|ácido|ácida|ácidos|ácidas|alcalino|alcalina|alcalinos|alcalinas|salino|salina|salinos|salinas|metálico|metálica|metálicos|metálicas|ferroso|ferrosa|ferrosos|ferrosas|não|ferroso|ferrosa|ferrosos|ferrosas|plástico|plástica|plásticos|plásticas|cerâmico|cerâmica|cerâmicos|cerâmicas|vítreo|vítrea|vítreos|vítreas|têxtil|têxteis|papel|papéis|madeira|madeiras|couro|couros|borracha|borrachas|concreto|concretos|cimento|cimentos|argamassa|argamassas|tijolo|tijolos|telha|telhas|vidro|vidros|aço|aços|ferro|ferros|alumínio|alumínios|cobre|cobres|zinco|zincos|chumbo|chumbos|estanho|estanhos|níquel|níqueis|cromo|cromos|titânio|titânios|ouro|ouros|prata|pratas|platina|platinas|bronze|bronzes|latão|latões|liga|ligas|compósito|compósitos|polímero|polímeros|resina|resinas|fibra|fibras|filme|filmes|membrana|membranas|revestimento|revestimentos|pintura|pinturas|verniz|vernizes|esmalte|esmaltes|galvanização|galvanizações|anodização|anodizações|cromagem|cromagens|niquelagem|niquelagens|zincagem|zincagens|estanhagem|estanhagens|soldagem|soldagens|brasagem|brasagens|colagem|colagens|fixação|fixações|montagem|montagens|desmontagem|desmontagens|instalação|instalações|desinstalação|desinstalações|manutenção|manutenções|reparo|reparos|substituição|substituições|troca|trocas|ajuste|ajustes|calibração|calibrações|regulagem|regulagens|lubrificação|lubrificações|limpeza|limpezas|inspeção|inspeções|teste|testes|ensaio|ensaios|análise|análises|medição|medições|controle|controles|monitoramento|monitoramentos|supervisão|supervisões|gerenciamento|gerenciamentos|planejamento|planejamentos|programação|programações|execução|execuções|avaliação|avaliações|verificação|verificações|validação|validações|certificação|certificações|auditoria|auditorias|consultoria|consultorias|assessoria|assessorias|treinamento|treinamentos|capacitação|capacitações|qualificação|qualificações|desenvolvimento|desenvolvimentos|pesquisa|pesquisas|inovação|inovações|projeto|projetos|design|designs|engenharia|engenharias|arquitetura|arquiteturas|construção|construções|fabricação|fabricações|produção|produções|operação|operações|logística|logísticas|transporte|transportes|armazenamento|armazenamentos|distribuição|distribuições|comercialização|comercializações|marketing|marketings|vendas|venda|compras|compra|suprimento|suprimentos|estoque|estoques|inventário|inventários|patrimônio|patrimônios|ativo|ativos|passivo|passivos|receita|receitas|despesa|despesas|custo|custos|lucro|lucros|prejuízo|prejuízos|investimento|investimentos|financiamento|financiamentos|orçamento|orçamentos|fluxo|fluxos|caixa|caixas|banco|bancos|crédito|créditos|débito|débitos|pagamento|pagamentos|recebimento|recebimentos|faturamento|faturamentos|cobrança|cobranças|contabilidade|contabilidades|fiscal|fiscais|tributário|tributária|tributários|tributárias|trabalhista|trabalhistas|previdenciário|previdenciária|previdenciários|previdenciárias|ambiental|ambientais|sanitário|sanitária|sanitários|sanitárias|segurança|seguranças|saúde|saúdes|qualidade|qualidades|produtividade|produtividades|eficiência|eficiências|eficácia|eficácias|efetividade|efetividades|desempenho|desempenhos|resultado|resultados|meta|metas|objetivo|objetivos|indicador|indicadores|parâmetro|parâmetros|critério|critérios|padrão|padrões|norma|normas|procedimento|procedimentos|instrução|instruções|manual|manuais|guia|guias|roteiro|roteiros|checklist|checklists|formulário|formulários|relatório|relatórios|documento|documentos|registro|registros|arquivo|arquivos|banco|bancos|dados|dado|informação|informações|conhecimento|conhecimentos|habilidade|habilidades|competência|competências|atitude|atitudes|comportamento|comportamentos|valor|valores|princípio|princípios|ética|éticas|moral|morais|lei|leis|regulamento|regulamentos|decreto|decretos|portaria|portarias|resolução|resoluções|instrução|instruções|normativa|normativas|técnica|técnicas|especificação|especificações|requisito|requisitos|exigência|exigências|condição|condições|restrição|restrições|limitação|limitações|tolerância|tolerâncias|margem|margens|erro|erros|desvio|desvios|variação|variações|flutuação|flutuações|oscilação|oscilações|tendência|tendências|comportamento|comportamentos|padrão|padrões|modelo|modelos|sistema|sistemas|processo|processos|método|métodos|técnica|técnicas|ferramenta|ferramentas|equipamento|equipamentos|máquina|máquinas|instrumento|instrumentos|dispositivo|dispositivos|aparelho|aparelhos|utensílio|utensílios|acessório|acessórios|componente|componentes|peça|peças|parte|partes|elemento|elementos|item|itens|unidade|unidades|conjunto|conjuntos|módulo|módulos|bloco|blocos|seção|seções|setor|setores|área|áreas|zona|zonas|região|regiões|local|locais|ponto|pontos|posição|posições|lugar|lugares|espaço|espaços|ambiente|ambientes|meio|meios|contexto|contextos|cenário|cenários|situação|situações|circunstância|circunstâncias|condição|condições|estado|estados|fase|fases|etapa|etapas|estágio|estágios|nível|níveis|grau|graus|escala|escalas|dimensão|dimensões|tamanho|tamanhos|proporção|proporções|razão|razões|relação|relações|conexão|conexões|ligação|ligações|vínculo|vínculos|associação|associações|correlação|correlações|dependência|dependências|interdependência|interdependências|interação|interações|integração|integrações|articulação|articulações|coordenação|coordenações|sincronização|sincronizações|harmonização|harmonizações|alinhamento|alinhamentos|compatibilidade|compatibilidades|conformidade|conformidades|adequação|adequações|adaptação|adaptações|ajuste|ajustes|modificação|modificações|alteração|alterações|mudança|mudanças|transformação|transformações|conversão|conversões|transição|transições|evolução|evoluções|desenvolvimento|desenvolvimentos|crescimento|crescimentos|expansão|expansões|ampliação|ampliações|redução|reduções|diminuição|diminuições|contração|contrações|compressão|compressões|dilatação|dilatações|deformação|deformações|ruptura|rupturas|fratura|fraturas|quebra|quebras|falha|falhas|defeito|defeitos|problema|problemas|dificuldade|dificuldades|obstáculo|obstáculos|barreira|barreiras|impedimento|impedimentos|restrição|restrições|limitação|limitações|risco|riscos|perigo|perigos|ameaça|ameaças|vulnerabilidade|vulnerabilidades|fragilidade|fragilidades|fraqueza|fraquezas|ponto|pontos|fraco|fracos|forte|fortes|oportunidade|oportunidades|potencial|potenciais|capacidade|capacidades|recurso|recursos|meio|meios|instrumento|instrumentos|mecanismo|mecanismos|estratégia|estratégias|tática|táticas|ação|ações|medida|medidas|providência|providências|iniciativa|iniciativas|programa|programas|plano|planos|projeto|projetos|proposta|propostas|sugestão|sugestões|recomendação|recomendações|orientação|orientações|diretriz|diretrizes|política|políticas|regra|regras|norma|normas|padrão|padrões|modelo|modelos|referência|referências|base|bases|fundamento|fundamentos|princípio|princípios|conceito|conceitos|teoria|teorias|hipótese|hipóteses|tese|teses|argumento|argumentos|justificativa|justificativas|razão|razões|motivo|motivos|causa|causas|origem|origens|fonte|fontes|raiz|raízes|base|bases|alicerce|alicerces|estrutura|estruturas|esqueleto|esqueletos|arcabouço|arcabouços|framework|frameworks|arquitetura|arquiteturas|design|designs|layout|layouts|configuração|configurações|arranjo|arranjos|disposição|disposições|organização|organizações|ordenação|ordenações|classificação|classificações|categorização|categorizações|tipologia|tipologias|taxonomia|taxonomias|hierarquia|hierarquias|sequência|sequências|ordem|ordens|série|séries|cadeia|cadeias|rede|redes|malha|malhas|teia|teias|trama|tramas|tecido|tecidos|textura|texturas|superfície|superfícies|face|faces|lado|lados|borda|bordas|margem|margens|limite|limites|fronteira|fronteiras|contorno|contornos|perímetro|perímetros|circunferência|circunferências|diâmetro|diâmetros|raio|raios|comprimento|comprimentos|largura|larguras|altura|alturas|profundidade|profundidades|espessura|espessuras|volume|volumes|área|áreas|peso|pesos|massa|massas|densidade|densidades|pressão|pressões|temperatura|temperaturas|calor|calores|frio|frios|umidade|umidades|velocidade|velocidades|aceleração|acelerações|força|forças|energia|energias|potência|potências|trabalho|trabalhos|rendimento|rendimentos|eficiência|eficiências|consumo|consumos|gasto|gastos|economia|economias|poupança|poupanças|investimento|investimentos|retorno|retornos|ganho|ganhos|perda|perdas|lucro|lucros|prejuízo|prejuízos|benefício|benefícios|vantagem|vantagens|desvantagem|desvantagens|prós|pró|contras|contra|favor|favores|contra|contras)\\b)[^.;\\n]{10,500})[.;]`,
    'gi'
  );
  
  while ((match = capPattern.exec(allLeftText)) !== null) {
    let descricao = match[1].trim()
      .replace(/\s+/g, ' ')
      .replace(/^\d+[\.\-\s]+/, '');
    
    if (!descricao.endsWith('.')) {
      descricao += '.';
    }
    
    // Validar tamanho mínimo
    if (descricao.length >= 20 && descricao.length <= 600) {
      const key = descricao.substring(0, 40).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        capacidades.push({
          codigo: `${prefixo}${index}`,
          descricao: descricao
        });
        index++;
      }
    }
  }
  
  // Método 2: Se não encontrou capacidades, tentar padrão mais simples
  if (capacidades.length === 0) {
    // Buscar linhas que começam com verbos
    const lines = allLeftText.split(/[\n\r]+/);
    for (const line of lines) {
      const trimmed = line.trim();
      // Verificar se começa com verbo
      const startsWithVerb = verbosCapacidade.some(v => 
        trimmed.toLowerCase().startsWith(v.toLowerCase())
      );
      
      if (startsWithVerb && trimmed.length >= 20 && trimmed.length <= 600) {
        let descricao = trimmed.replace(/\s+/g, ' ');
        if (!descricao.endsWith('.')) descricao += '.';
        
        const key = descricao.substring(0, 40).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          capacidades.push({
            codigo: `${prefixo}${index}`,
            descricao: descricao
          });
          index++;
        }
      }
    }
  }
  
  console.log(`[PDF] Capacidades extraídas: ${capacidades.length}`);
  return capacidades;
}

/**
 * Extrai conhecimentos das colunas direitas do PDF
 * Os conhecimentos estão marcados com <<COLUNA_DIREITA>> ou são numerados
 */
function extractConhecimentosFromColumns(ucSection) {
  const conhecimentos = [];
  
  // Extrair todo o texto das colunas direitas
  const rightColumnPattern = /<<COLUNA_DIREITA>>([\s\S]*?)<</g;
  let allRightText = '';
  let match;
  
  while ((match = rightColumnPattern.exec(ucSection)) !== null) {
    allRightText += match[1] + '\n';
  }
  
  // Se não encontrou marcadores, tentar extrair do texto completo
  if (!allRightText.trim()) {
    // Procurar seção de Conhecimentos
    const conhecMatch = ucSection.match(/Conhecimentos[\s\S]*?(?=Capacidades\s+Socioemocionais|Ambientes\s+Pedagógicos|<<COLUNA|$)/i);
    if (conhecMatch) {
      allRightText = conhecMatch[0];
    }
  }
  
  // Também extrair conhecimentos numerados da coluna esquerda (quando não há separação clara)
  const leftColumnPattern = /<<COLUNA_ESQUERDA>>([\s\S]*?)<</g;
  while ((match = leftColumnPattern.exec(ucSection)) !== null) {
    // Procurar itens numerados que são conhecimentos
    const leftText = match[1];
    if (/^\d+\s+[A-Z]/.test(leftText.trim())) {
      allRightText += leftText + '\n';
    }
  }
  
  // Extrair itens numerados hierárquicos
  // Padrão: "1 TÍTULO" ou "1.1 Subtítulo" ou "1.1.1 Item"
  const itemPattern = /(?:^|\n)\s*(\d+(?:\.\d+)*)\s+([A-ZÀ-ÿ][^\n]+)/g;
  
  const items = [];
  
  while ((match = itemPattern.exec(allRightText)) !== null) {
    const codigo = match[1].trim();
    let titulo = match[2].trim()
      .replace(/\s+/g, ' ')
      .replace(/Reconhecer.*$/i, '')
      .replace(/Identificar.*$/i, '')
      .replace(/Aplicar.*$/i, '')
      .trim();
    
    // Validar
    if (titulo.length >= 3 && titulo.length <= 300 &&
        !titulo.match(/^(Capacidades|Ambientes|Pedagógicos|Reconhecer|Identificar|Aplicar|Interpretar|Elaborar|Realizar)/i)) {
      items.push({ codigo, titulo });
    }
  }
  
  // Organizar em estrutura hierárquica
  const topicos = {};
  
  for (const item of items) {
    const parts = item.codigo.split('.');
    
    if (parts.length === 1) {
      // Tópico principal (1, 2, 3...)
      topicos[item.codigo] = {
        topico: `${item.codigo} ${item.titulo}`,
        subtopicos: []
      };
    } else {
      // Subtópico (1.1, 1.2, 1.1.1...)
      const parentCode = parts[0];
      if (topicos[parentCode]) {
        topicos[parentCode].subtopicos.push(`${item.codigo} ${item.titulo}`);
      }
    }
  }
  
  return Object.values(topicos);
}

/**
 * Extrai capacidades de uma página do PDF
 */
function extractCapacidadesFromPage(pageText) {
  const capacidades = [];
  
  // Procurar seção de capacidades (Básicas ou Técnicas)
  // O texto geralmente aparece após "Capacidades Básicas" ou "Capacidades Técnicas"
  const capMatch = pageText.match(/Capacidades\s+(Básicas|Técnicas)[:\s]*(.+?)(?:Conhecimentos|\d+\s+[A-Z]|\d+\.\d+|$)/is);
  
  if (capMatch) {
    const tipoCapacidade = capMatch[1].toLowerCase() === 'básicas' ? 'CB' : 'CT';
    const capText = capMatch[2];
    
    // Padrão: texto que começa com verbo (Reconhecer, Identificar, Aplicar, etc.)
    const verbosCapacidade = /(?:^|\n|\.\s*)((?:Reconhecer|Identificar|Aplicar|Utilizar|Interpretar|Analisar|Correlacionar|Compreender|Desenvolver|Elaborar|Realizar|Selecionar|Definir|Planejar|Executar|Avaliar|Verificar|Orientar|Controlar|Coordenar|Subsidiar)[^.]+\.)/gi;
    
    let match;
    let index = 1;
    while ((match = verbosCapacidade.exec(capText)) !== null) {
      const descricao = match[1].trim().replace(/\s+/g, ' ');
      if (descricao.length > 15 && descricao.length < 500) {
        capacidades.push({
          codigo: `${tipoCapacidade}${index}`,
          descricao: descricao
        });
        index++;
      }
    }
  }
  
  // Se não encontrou com padrão de verbos, tentar padrão alternativo
  if (capacidades.length === 0) {
    // Procurar linhas que parecem capacidades (começam com maiúscula, terminam com ponto)
    const lines = pageText.split(/\n/);
    let inCapacidades = false;
    let index = 1;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.match(/Capacidades\s+(Básicas|Técnicas)/i)) {
        inCapacidades = true;
        continue;
      }
      
      if (trimmed.match(/Conhecimentos|Ambientes|CONTEÚDOS/i)) {
        inCapacidades = false;
      }
      
      if (inCapacidades && trimmed.length > 20 && trimmed.match(/^[A-Z]/)) {
        // Parece ser uma capacidade
        const descricao = trimmed.replace(/\s+/g, ' ');
        if (!descricao.match(/^\d/) && descricao.length < 500) {
          capacidades.push({
            codigo: `CT${index}`,
            descricao: descricao
          });
          index++;
        }
      }
    }
  }
  
  return capacidades;
}

/**
 * Extrai conhecimentos hierárquicos de uma página do PDF
 */
function extractConhecimentosFromPage(pageText) {
  const conhecimentos = [];
  
  // Padrão para conhecimentos: "1 TÍTULO" ou "1.1 Subtítulo"
  // Estrutura hierárquica: 1 > 1.1 > 1.1.1
  
  // Primeiro, encontrar todos os itens numerados
  const itemPattern = /(?:^|\s)(\d+(?:\.\d+)*)\s+([A-ZÀ-ÿ][A-Za-zÀ-ÿ\s\-\/\(\),:\d]+?)(?=\s+\d+(?:\.\d+)*\s+[A-ZÀ-ÿ]|\s*$)/gm;
  
  const items = [];
  let match;
  
  while ((match = itemPattern.exec(pageText)) !== null) {
    const codigo = match[1];
    let titulo = match[2].trim().replace(/\s+/g, ' ');
    
    // Limpar título
    titulo = titulo.replace(/Reconhecer.*$/i, '').replace(/Identificar.*$/i, '').trim();
    
    if (titulo.length > 2 && titulo.length < 200 && 
        !titulo.match(/^(Capacidades|Ambientes|Pedagógicos|Reconhecer|Identificar)/i)) {
      items.push({ codigo, titulo });
    }
  }
  
  // Organizar em estrutura hierárquica
  const topicos = {};
  
  for (const item of items) {
    const parts = item.codigo.split('.');
    
    if (parts.length === 1) {
      // Tópico principal (1, 2, 3...)
      topicos[item.codigo] = {
        topico: `${item.codigo} ${item.titulo.toUpperCase()}`,
        subtopicos: []
      };
    } else {
      // Subtópico (1.1, 1.2, 1.1.1...)
      const parentCode = parts[0];
      if (topicos[parentCode]) {
        topicos[parentCode].subtopicos.push(`${item.codigo} ${item.titulo}`);
      }
    }
  }
  
  // Converter para array
  return Object.values(topicos);
}

/**
 * Detecta o módulo de uma UC - Versão 2
 */
function detectModuloV2(text, position) {
  // Procurar módulo antes da posição da UC
  const beforeText = text.substring(Math.max(0, position - 2000), position);
  
  // Padrões de módulo SENAI
  if (beforeText.match(/MÓDULO\s+ESPECÍFICO\s+III/i)) return 'Específico III';
  if (beforeText.match(/MÓDULO\s+ESPECÍFICO\s+II(?!\s*I)/i)) return 'Específico II';
  if (beforeText.match(/MÓDULO\s+ESPECÍFICO\s+I(?!\s*I)/i)) return 'Específico I';
  if (beforeText.match(/MÓDULO\s+INTRODUTÓRIO/i)) return 'Introdutório';
  if (beforeText.match(/MÓDULO\s+BÁSICO/i)) return 'Básico';
  if (beforeText.match(/Básico\s+da\s+Indústria/i)) return 'Básico da Indústria';
  
  return 'Específico I';
}

/**
 * Extrai objetivo da UC - Versão 2
 */
function extractObjetivoV2(section) {
  // Padrão: "Objetivo Geral: texto" ou "Objetivo: texto"
  const objetivoMatch = section.match(/Objetivo\s*(?:Geral)?[:\s]+(.+?)(?=Capacidades|Conteúdos|Conhecimentos|Indicador)/is);
  if (objetivoMatch) {
    return objetivoMatch[1].trim().replace(/\s+/g, ' ').substring(0, 800);
  }
  return '';
}

/**
 * Extrai capacidades técnicas - Versão 2
 */
function extractCapacidadesV2(section) {
  const capacidades = [];
  
  // Encontrar seção de Capacidades Técnicas
  const capTecMatch = section.match(/Capacidades\s+Técnicas[:\s]*(.+?)(?=Capacidades\s+Socioemocionais|Conhecimentos|Ambientes|$)/is);
  
  if (capTecMatch) {
    const capSection = capTecMatch[1];
    
    // Padrão 1: Numerado "1. Descrição" ou "1 - Descrição"
    const numPattern = /(\d+)[.\s\-]+(.+?)(?=\d+[.\s\-]+|$)/g;
    let match;
    let count = 0;
    
    while ((match = numPattern.exec(capSection)) !== null && count < 50) {
      const desc = match[2].trim().replace(/\s+/g, ' ');
      if (desc.length > 10 && desc.length < 500 && !desc.match(/^(Capacidades|Conhecimentos|Ambientes)/i)) {
        capacidades.push({
          codigo: `CT${capacidades.length + 1}`,
          descricao: desc
        });
      }
      count++;
    }
    
    // Padrão 2: Com bullets ou marcadores
    if (capacidades.length === 0) {
      const bulletPattern = /[●•\-]\s*(.+?)(?=[●•\-]|$)/g;
      while ((match = bulletPattern.exec(capSection)) !== null) {
        const desc = match[1].trim().replace(/\s+/g, ' ');
        if (desc.length > 15 && desc.length < 500) {
          capacidades.push({
            codigo: `CT${capacidades.length + 1}`,
            descricao: desc
          });
        }
      }
    }
  }
  
  return capacidades;
}

/**
 * Extrai capacidades socioemocionais
 */
function extractCapacidadesSocioemocionais(section) {
  const capacidades = [];
  
  const capSocioMatch = section.match(/Capacidades\s+Socioemocionais[:\s]*(.+?)(?=Conhecimentos|Ambientes|$)/is);
  
  if (capSocioMatch) {
    const capSection = capSocioMatch[1];
    const pattern = /(\d+)[.\s\-]+(.+?)(?=\d+[.\s\-]+|$)/g;
    let match;
    
    while ((match = pattern.exec(capSection)) !== null) {
      const desc = match[2].trim().replace(/\s+/g, ' ');
      if (desc.length > 5 && desc.length < 300) {
        capacidades.push({
          codigo: `CSE${capacidades.length + 1}`,
          descricao: desc
        });
      }
    }
  }
  
  return capacidades;
}

/**
 * Extrai conhecimentos hierárquicos - Versão 2
 * Estrutura: 1 TÓPICO > 1.1 Subtópico > 1.1.1 Item
 */
function extractConhecimentosV2(section) {
  const conhecimentos = [];
  
  // Encontrar seção de Conhecimentos
  const conhecimentosMatch = section.match(/Conhecimentos[:\s]*(.+?)(?=Capacidades\s*Socioemocionais|Ambientes\s*Pedagógicos|Unidade\s+Curricular|$)/is);
  
  if (!conhecimentosMatch) return conhecimentos;
  
  const conhecimentosText = conhecimentosMatch[1];
  
  // Extrair tópicos principais (1, 2, 3...)
  // Padrão: número seguido de texto em maiúsculas ou título
  const topicoPattern = /(?:^|\s)(\d+)\s+([A-ZÀ-ÿ][A-Za-zÀ-ÿ\s\-\/\(\)]+?)(?=\s+\d+\s+[A-ZÀ-ÿ]|\s+\d+\.\d+|\s*$)/g;
  
  let topicoMatch;
  const topicos = [];
  
  while ((topicoMatch = topicoPattern.exec(conhecimentosText)) !== null) {
    const num = topicoMatch[1];
    const titulo = topicoMatch[2].trim();
    
    if (titulo.length > 2 && titulo.length < 200 && !titulo.match(/^(Capacidades|Ambientes|Pedagógicos)/i)) {
      topicos.push({
        numero: num,
        titulo: titulo,
        startIndex: topicoMatch.index
      });
    }
  }
  
  // Para cada tópico, extrair subtópicos
  for (let i = 0; i < topicos.length; i++) {
    const topico = topicos[i];
    const nextStart = topicos[i + 1]?.startIndex || conhecimentosText.length;
    const topicoSection = conhecimentosText.substring(topico.startIndex, nextStart);
    
    const subtopicos = [];
    
    // Extrair subtópicos (1.1, 1.2, etc.)
    const subPattern = new RegExp(`${topico.numero}\\.(\\d+)\\s+([^\\d][^\\n]+?)(?=${topico.numero}\\.\\d+|\\d+\\s+[A-Z]|$)`, 'g');
    let subMatch;
    
    while ((subMatch = subPattern.exec(topicoSection)) !== null) {
      const subTitulo = subMatch[2].trim().replace(/\s+/g, ' ');
      if (subTitulo.length > 2 && subTitulo.length < 200) {
        subtopicos.push(`${topico.numero}.${subMatch[1]} ${subTitulo}`);
      }
    }
    
    conhecimentos.push({
      topico: `${topico.numero} ${topico.titulo.toUpperCase()}`,
      subtopicos: subtopicos
    });
  }
  
  return conhecimentos;
}

/**
 * Extrai Unidades Curriculares do texto do PDF - Versão Original (fallback)
 * @param {string} text - Texto do PDF
 * @returns {Array} - Lista de UCs
 */
function extractUnidadesCurriculares(text) {
  const ucs = [];
  
  // Padrão para encontrar UCs
  // Formato típico: "UC01 - MÓDULO I: BÁSICO" ou "Unidade Curricular: Nome"
  const ucPattern = /(?:UC\d+|Unidade\s*Curricular)[:\s-]*([A-Za-zÀ-ÿ\s\d]+?)(?:\s*Carga\s*Horária[:\s]*(\d+)\s*h)?/gi;
  
  let match;
  while ((match = ucPattern.exec(text)) !== null) {
    const ucName = match[1].trim();
    const cargaHoraria = match[2] ? parseInt(match[2]) : 0;
    
    if (ucName.length > 3 && !ucName.match(/^(MÓDULO|BÁSICO|ESPECÍFICO)/i)) {
      const uc = {
        nome: ucName,
        modulo: detectModulo(text, match.index),
        cargaHoraria: cargaHoraria,
        objetivo: '',
        capacidadesTecnicas: [],
        conhecimentos: []
      };
      
      // Extrair capacidades e conhecimentos para esta UC
      const ucSection = extractUCSection(text, match.index);
      if (ucSection) {
        uc.capacidadesTecnicas = extractCapacidades(ucSection);
        uc.conhecimentos = extractConhecimentos(ucSection);
        uc.objetivo = extractObjetivo(ucSection);
      }
      
      ucs.push(uc);
    }
  }
  
  return ucs;
}

/**
 * Detecta o módulo de uma UC baseado no contexto
 */
function detectModulo(text, position) {
  const beforeText = text.substring(Math.max(0, position - 500), position);
  
  if (beforeText.match(/MÓDULO\s*(?:III|3|ESPECÍFICO\s*III)/i)) return 'Específico III';
  if (beforeText.match(/MÓDULO\s*(?:II|2|ESPECÍFICO\s*II)/i)) return 'Específico II';
  if (beforeText.match(/MÓDULO\s*(?:I|1|ESPECÍFICO\s*I)/i)) return 'Específico I';
  if (beforeText.match(/INTRODUTÓRIO/i)) return 'Introdutório';
  if (beforeText.match(/BÁSICO/i)) return 'Básico';
  
  return 'Não identificado';
}

/**
 * Extrai a seção de texto de uma UC específica
 */
function extractUCSection(text, startPos) {
  // Encontrar o próximo início de UC ou fim do documento
  const nextUCMatch = text.substring(startPos + 10).match(/(?:UC\d+|Unidade\s*Curricular)[:\s-]/i);
  const endPos = nextUCMatch ? startPos + 10 + nextUCMatch.index : startPos + 5000;
  
  return text.substring(startPos, Math.min(endPos, text.length));
}

/**
 * Extrai capacidades de uma seção de UC
 */
function extractCapacidades(section) {
  const capacidades = [];
  
  // Padrão para capacidades básicas e técnicas
  const capPattern = /(?:CB|CT)(\d+)[:\s.-]*(.+?)(?=(?:CB|CT)\d+|Conhecimentos|Ambientes|$)/gis;
  
  let match;
  let index = 1;
  while ((match = capPattern.exec(section)) !== null) {
    const tipo = section.substring(match.index, match.index + 2).toUpperCase();
    capacidades.push({
      codigo: `${tipo}${index}`,
      descricao: match[2].trim().replace(/\s+/g, ' ').substring(0, 500)
    });
    index++;
  }
  
  // Se não encontrou com padrão CB/CT, tentar com bullets
  if (capacidades.length === 0) {
    const bulletPattern = /[●•]\s*(.+?)(?=[●•]|Conhecimentos|$)/gs;
    let bulletIndex = 1;
    while ((match = bulletPattern.exec(section)) !== null) {
      if (match[1].length > 10 && match[1].length < 500) {
        capacidades.push({
          codigo: `CT${bulletIndex}`,
          descricao: match[1].trim().replace(/\s+/g, ' ')
        });
        bulletIndex++;
      }
    }
  }
  
  return capacidades;
}

/**
 * Extrai conhecimentos de uma seção de UC
 */
function extractConhecimentos(section) {
  const conhecimentos = [];
  
  // Procurar seção de conhecimentos
  const conhecimentosMatch = section.match(/Conhecimentos[:\s]*(.+?)(?:Capacidades\s*Socioemocionais|Ambientes\s*Pedagógicos|$)/is);
  
  if (conhecimentosMatch) {
    const conhecimentosText = conhecimentosMatch[1];
    
    // Padrão para tópicos numerados: "1. Título" ou "1 Título"
    const topicoPattern = /(\d+)[.\s]+([A-Za-zÀ-ÿ\s]+?)(?=\d+[.\s]+[A-Za-zÀ-ÿ]|\d+\.\d+|$)/g;
    
    let match;
    while ((match = topicoPattern.exec(conhecimentosText)) !== null) {
      const topico = {
        topico: `${match[1]} ${match[2].trim().toUpperCase()}`,
        subtopicos: []
      };
      
      // Extrair subtópicos (1.1, 1.2, etc.)
      const subPattern = new RegExp(`${match[1]}\\.(\\d+)[.\\s]*([^\\d]+?)(?=${match[1]}\\.\\d+|\\d+[.\\s]+[A-Z]|$)`, 'g');
      let subMatch;
      while ((subMatch = subPattern.exec(conhecimentosText)) !== null) {
        topico.subtopicos.push(`${match[1]}.${subMatch[1]} ${subMatch[2].trim()}`);
      }
      
      conhecimentos.push(topico);
    }
  }
  
  return conhecimentos;
}

/**
 * Extrai objetivo geral de uma seção de UC
 */
function extractObjetivo(section) {
  const objetivoMatch = section.match(/Objetivo\s*(?:Geral)?[:\s]*(.+?)(?:Conteúdos|Capacidades|Conhecimentos)/is);
  if (objetivoMatch) {
    return objetivoMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
  }
  return '';
}

/**
 * Processa dados da Matriz Curricular do Curso (Excel)
 * 
 * Estrutura típica da planilha "Matriz SC 2024" ou similar:
 * 
 * - Linha 0: Nome do curso (ex: "Técnico em Edificações [Modelo: Presencial]")
 * - Linha 2: Headers (Período, Módulo, Unidades curriculares, Carga Horária Total, etc.)
 * - Linhas 3+: Dados das UCs
 *   - Coluna 0: Ano (1º ANO, 2º ANO)
 *   - Coluna 1: Período (1º Período, 2º Período, etc.)
 *   - Coluna 2: Módulo (Indústria, Introdutório, Específico I/II/III)
 *   - Coluna 4: Número da UC
 *   - Coluna 5: Nome da UC
 *   - Coluna 6: Carga Horária Total
 *   - Coluna 7: Carga Horária Presencial
 *   - Coluna 8: Carga Horária EAD
 * - Linha final: Versão do Itinerário e Carga Horária Total do curso
 * 
 * @param {Object} sheetsData - Dados das planilhas
 * @returns {Object} - Dados estruturados
 */
export function parseMatrizCurricular(sheetsData) {
  const resultado = {
    nomeCurso: '',
    modelo: '',
    versaoItinerario: '',
    cargaHorariaTotal: 0,
    cargaHorariaPresencial: 0,
    cargaHorariaEAD: 0,
    unidadesCurriculares: []
  };
  
  // Helper para converter célula para string segura
  const toStr = (cell) => {
    if (cell === null || cell === undefined) return '';
    return String(cell).trim();
  };
  
  // Helper para extrair número de uma string
  const toNum = (cell) => {
    if (cell === null || cell === undefined) return 0;
    const num = parseInt(String(cell).replace(/[^\d]/g, ''));
    return isNaN(num) ? 0 : num;
  };
  
  // Encontrar a planilha da matriz (pode ter nomes diferentes)
  const matrizSheetName = Object.keys(sheetsData).find(name => 
    /matriz/i.test(name) || /curricular/i.test(name) || /SC\s*\d{4}/i.test(name)
  );
  
  if (!matrizSheetName) {
    // Se não encontrar, usar a primeira planilha que não seja "Equipe"
    const firstSheet = Object.keys(sheetsData).find(name => !/equipe/i.test(name));
    if (firstSheet) {
      console.log('[Matriz] Usando planilha:', firstSheet);
    }
  }
  
  const sheetName = matrizSheetName || Object.keys(sheetsData)[0];
  const rows = sheetsData[sheetName];
  
  if (!rows || !Array.isArray(rows)) {
    console.error('[Matriz] Planilha não encontrada ou vazia');
    return resultado;
  }
  
  console.log('[Matriz] Processando planilha:', sheetName, 'com', rows.length, 'linhas');
  
  let currentAno = '';
  let currentPeriodo = '';
  let currentModulo = '';
  
  rows.forEach((row, rowIndex) => {
    if (!row || !Array.isArray(row)) return;
    const cells = row.map(toStr);
    
    // Linha 0: Nome do curso (geralmente na coluna 4 ou 5)
    if (rowIndex === 0) {
      for (const cell of cells) {
        if (cell && /Técnico\s+em/i.test(cell)) {
          // Extrair nome e modelo
          const match = cell.match(/Técnico\s+em\s+([A-ZÀ-ÿa-zà-ÿ\s]+?)(?:\[|\n|$)/i);
          if (match) {
            resultado.nomeCurso = `Técnico em ${match[1].trim()}`;
          }
          const modeloMatch = cell.match(/\[Modelo:\s*([^\]]+)\]/i);
          if (modeloMatch) {
            resultado.modelo = modeloMatch[1].trim();
          }
          break;
        }
      }
    }
    
    // Pular linha de headers (linha 2)
    if (rowIndex === 2) return;
    
    // Linha com versão do itinerário (geralmente última linha com dados)
    if (cells[0] && /Versão/i.test(cells[0])) {
      const versaoText = cells[1] || '';
      resultado.versaoItinerario = versaoText.replace(/\n/g, ' ').trim();
      return;
    }
    
    // Extrair dados das UCs (linhas 3+)
    if (rowIndex >= 3) {
      // Atualizar ano se presente (coluna 0)
      if (cells[0] && /\d+º\s*ANO/i.test(cells[0])) {
        currentAno = cells[0];
      }
      
      // Atualizar período se presente (coluna 1)
      if (cells[1] && /\d+º\s*Período/i.test(cells[1])) {
        currentPeriodo = cells[1];
      }
      
      // Atualizar módulo se presente (coluna 2)
      if (cells[2] && cells[2].length > 2 && !/^\d+$/.test(cells[2])) {
        currentModulo = cells[2];
      }
      
      // Verificar se é uma linha de UC (coluna 4 tem número, coluna 5 tem nome)
      const ucNumero = cells[4];
      const ucNome = cells[5];
      const cargaTotal = toNum(cells[6]);
      const cargaPresencial = toNum(cells[7]);
      const cargaEAD = toNum(cells[8]);
      
      // Validar se é uma UC válida
      if (ucNumero && /^\d+$/.test(ucNumero) && ucNome && ucNome.length > 3) {
        // Determinar tipo de capacidade baseado no módulo
        const isTecnica = /ESPECÍFICO/i.test(currentModulo);
        const prefixoCodigo = isTecnica ? 'CT' : 'CB';
        
        resultado.unidadesCurriculares.push({
          numero: parseInt(ucNumero),
          nome: ucNome,
          modulo: currentModulo || 'Introdutório',
          periodo: currentPeriodo,
          ano: currentAno,
          cargaHoraria: cargaTotal,
          cargaHorariaPresencial: cargaPresencial,
          cargaHorariaEAD: cargaEAD,
          prefixoCodigo: prefixoCodigo,
          capacidadesTecnicas: [],
          conhecimentos: []
        });
      }
    }
  });
  
  // Calcular carga horária total
  resultado.cargaHorariaTotal = resultado.unidadesCurriculares.reduce(
    (total, uc) => total + (uc.cargaHoraria || 0), 0
  );
  resultado.cargaHorariaPresencial = resultado.unidadesCurriculares.reduce(
    (total, uc) => total + (uc.cargaHorariaPresencial || 0), 0
  );
  resultado.cargaHorariaEAD = resultado.unidadesCurriculares.reduce(
    (total, uc) => total + (uc.cargaHorariaEAD || 0), 0
  );
  
  // Ordenar UCs por número
  resultado.unidadesCurriculares.sort((a, b) => a.numero - b.numero);
  
  console.log('[Matriz] Extração concluída:', {
    curso: resultado.nomeCurso,
    modelo: resultado.modelo,
    versao: resultado.versaoItinerario.substring(0, 40),
    cargaTotal: resultado.cargaHorariaTotal,
    ucs: resultado.unidadesCurriculares.length
  });
  
  return resultado;
}

/**
 * Converte dados da Matriz Curricular para o formato do curso
 * 
 * @param {Object} matrizData - Dados extraídos da Matriz Curricular
 * @returns {Object} - Curso no formato esperado pelo sistema
 */
export function convertMatrizToCurso(matrizData) {
  if (!matrizData || !matrizData.nomeCurso) {
    console.error('[Converter] Dados da matriz inválidos');
    return null;
  }
  
  const curso = {
    id: generateCourseId(matrizData.nomeCurso),
    nome: matrizData.nomeCurso,
    modelo: matrizData.modelo || 'Presencial',
    versaoItinerario: matrizData.versaoItinerario || '',
    cargaHorariaTotal: matrizData.cargaHorariaTotal || 0,
    cargaHorariaPresencial: matrizData.cargaHorariaPresencial || 0,
    cargaHorariaEAD: matrizData.cargaHorariaEAD || 0,
    unidadesCurriculares: matrizData.unidadesCurriculares.map(uc => ({
      numero: uc.numero,
      nome: uc.nome,
      modulo: uc.modulo,
      periodo: uc.periodo,
      ano: uc.ano,
      cargaHoraria: uc.cargaHoraria,
      cargaHorariaPresencial: uc.cargaHorariaPresencial,
      cargaHorariaEAD: uc.cargaHorariaEAD,
      prefixoCodigo: uc.prefixoCodigo,
      capacidadesTecnicas: uc.capacidadesTecnicas || [],
      conhecimentos: uc.conhecimentos || []
    }))
  };
  
  console.log('[Converter] Curso convertido:', {
    id: curso.id,
    nome: curso.nome,
    ucs: curso.unidadesCurriculares.length,
    cargaTotal: curso.cargaHorariaTotal
  });
  
  return curso;
}

/**
 * Mescla dados do PDF (PPC) com dados da Matriz Curricular
 * O PDF complementa a Matriz com: competência geral, capacidades, conhecimentos
 * 
 * @param {Object} matrizData - Dados da Matriz Curricular (estrutura base)
 * @param {Object} pdfData - Dados extraídos do PDF (complementares)
 * @returns {Object} - Curso completo
 */
export function mergePDFWithMatriz(matrizData, pdfData) {
  const curso = { ...matrizData };
  
  if (!pdfData) return curso;
  
  console.log('[Merge] Mesclando dados do PDF com Matriz Curricular...');
  
  // Competência Geral do PDF
  if (pdfData.competenciaGeral && !curso.competenciaGeral) {
    curso.competenciaGeral = pdfData.competenciaGeral;
  }
  
  // CBO do PDF
  if (pdfData.cbo && !curso.cbo) {
    curso.cbo = pdfData.cbo;
  }
  
  // Eixo Tecnológico do PDF
  if (pdfData.eixoTecnologico && !curso.eixoTecnologico) {
    curso.eixoTecnologico = pdfData.eixoTecnologico;
  }
  
  // Área Tecnológica do PDF
  if (pdfData.areaTecnologica && !curso.areaTecnologica) {
    curso.areaTecnologica = pdfData.areaTecnologica;
  }
  
  // Mesclar UCs - buscar capacidades e conhecimentos do PDF para cada UC da Matriz
  if (pdfData.unidadesCurriculares && pdfData.unidadesCurriculares.length > 0) {
    curso.unidadesCurriculares.forEach(matrizUC => {
      // Buscar UC correspondente no PDF por nome similar
      const pdfUC = pdfData.unidadesCurriculares.find(uc => {
        const matrizName = matrizUC.nome.toLowerCase().replace(/\s+/g, ' ').trim();
        const pdfName = uc.nome.toLowerCase().replace(/\s+/g, ' ').trim();
        
        // Comparar por similaridade (primeiros 20 caracteres ou nome completo)
        return matrizName.includes(pdfName.substring(0, 20)) || 
               pdfName.includes(matrizName.substring(0, 20)) ||
               matrizName === pdfName;
      });
      
      if (pdfUC) {
        // Adicionar capacidades do PDF se a Matriz não tem
        if (pdfUC.capacidadesTecnicas?.length > 0 && matrizUC.capacidadesTecnicas.length === 0) {
          matrizUC.capacidadesTecnicas = pdfUC.capacidadesTecnicas;
        }
        
        // Adicionar conhecimentos do PDF se a Matriz não tem
        if (pdfUC.conhecimentos?.length > 0 && matrizUC.conhecimentos.length === 0) {
          matrizUC.conhecimentos = pdfUC.conhecimentos;
        }
        
        // Adicionar objetivo do PDF
        if (pdfUC.objetivo && !matrizUC.objetivo) {
          matrizUC.objetivo = pdfUC.objetivo;
        }
      }
    });
  }
  
  console.log('[Merge] Mesclagem concluída:', {
    competenciaGeral: !!curso.competenciaGeral,
    ucsComCapacidades: curso.unidadesCurriculares.filter(uc => uc.capacidadesTecnicas?.length > 0).length,
    ucsComConhecimentos: curso.unidadesCurriculares.filter(uc => uc.conhecimentos?.length > 0).length
  });
  
  return curso;
}

/**
 * Valida a estrutura do curso extraído
 * @param {Object} curso - Dados do curso
 * @returns {Object} - Resultado da validação
 */
export function validateCourseData(curso) {
  const errors = [];
  const warnings = [];
  
  if (!curso.nome || curso.nome.length < 5) {
    errors.push('Nome do curso não identificado ou muito curto');
  }
  
  if (!curso.id) {
    errors.push('ID do curso não gerado');
  }
  
  if (curso.cargaHorariaTotal === 0) {
    warnings.push('Carga horária total não identificada');
  }
  
  if (!curso.competenciaGeral) {
    warnings.push('Competência geral não identificada');
  }
  
  if (curso.unidadesCurriculares.length === 0) {
    errors.push('Nenhuma Unidade Curricular identificada');
  } else {
    curso.unidadesCurriculares.forEach((uc, index) => {
      if (!uc.nome) {
        errors.push(`UC ${index + 1}: Nome não identificado`);
      }
      if (uc.capacidadesTecnicas.length === 0) {
        warnings.push(`UC "${uc.nome}": Nenhuma capacidade identificada`);
      }
      if (uc.conhecimentos.length === 0) {
        warnings.push(`UC "${uc.nome}": Nenhum conhecimento identificado`);
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
 * Gera ID único para o curso
 * @param {string} nome - Nome do curso
 * @returns {string} - ID gerado
 */
export function generateCourseId(nome) {
  return nome
    .toLowerCase()
    .replace(/técnico\s+em\s+/i, '')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default {
  extractTextFromPDF,
  extractDataFromExcel,
  parseCourseFromPDF,
  parseMatrizCurricular,
  convertMatrizToCurso,
  mergePDFWithMatriz,
  validateCourseData,
  generateCourseId
};
