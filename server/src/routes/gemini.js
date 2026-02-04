/**
 * Rotas para API Gemini - Extração de dados de cursos
 * A chave da API fica APENAS no backend, nunca exposta no frontend
 */

import { Router } from 'express';

const router = Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Chama a API do Gemini com o prompt e PDF
 */
async function callGeminiAPI(pdfBase64, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no servidor');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Gemini] Erro:', JSON.stringify(data));
    throw new Error(data.error?.message || `Erro na API Gemini: ${response.status}`);
  }

  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === 'SAFETY') {
    throw new Error('Conteúdo bloqueado por políticas de segurança.');
  }
  
  if (finishReason === 'MAX_TOKENS') {
    console.warn('[Gemini] Resposta truncada por MAX_TOKENS');
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    console.error('[Gemini] Resposta sem conteúdo:', JSON.stringify(data));
    throw new Error('Resposta vazia da API Gemini');
  }

  console.log('[Gemini] Resposta recebida:', content.length, 'caracteres, finishReason:', finishReason);

  let jsonStr = content.trim();
  jsonStr = jsonStr.replace(/^```json\s*/i, '');
  jsonStr = jsonStr.replace(/^```\s*/i, '');
  jsonStr = jsonStr.replace(/\s*```$/i, '');

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[Gemini] Erro ao parsear JSON:', e.message);
    console.error('[Gemini] Primeiros 500 chars:', jsonStr.substring(0, 500));
    const recovered = tryRecoverTruncatedJSON(jsonStr);
    if (recovered) return recovered;
    throw new Error('Erro ao processar resposta da IA. Tente novamente.');
  }
}

/**
 * Tenta recuperar um JSON truncado
 */
function tryRecoverTruncatedJSON(jsonStr) {
  try {
    let fixed = jsonStr;
    let braces = 0;
    let brackets = 0;
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < fixed.length; i++) {
      const char = fixed[i];
      if (escape) { escape = false; continue; }
      if (char === '\\') { escape = true; continue; }
      if (char === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
    }
    
    if (inString) fixed += '"';
    while (brackets > 0) { fixed += ']'; brackets--; }
    while (braces > 0) { fixed += '}'; braces--; }
    
    return JSON.parse(fixed);
  } catch (e) {
    return null;
  }
}

// POST /api/gemini/extract-course - Extrair dados gerais do curso
router.post('/extract-course', async (req, res) => {
  try {
    const { pdfBase64, ucsFromExcel } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: 'PDF não fornecido' });
    }

    const ucListText = (ucsFromExcel || []).map((uc, i) => 
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

    const result = await callGeminiAPI(pdfBase64, prompt);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[Gemini] Erro na extração:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/gemini/extract-capacidades - Extrair capacidades das UCs
router.post('/extract-capacidades', async (req, res) => {
  try {
    const { pdfBase64, ucs } = req.body;

    if (!pdfBase64 || !ucs || ucs.length === 0) {
      return res.status(400).json({ success: false, error: 'PDF e UCs são obrigatórios' });
    }

    const prompt = `Analise o documento PDF (PPC/Itinerário Nacional do SENAI) e extraia as CAPACIDADES das seguintes Unidades Curriculares:

${ucs.map((uc, i) => `${i + 1}. "${uc.nome}" (${uc.cargaHoraria}h - Módulo: ${uc.modulo || 'Não identificado'})`).join('\n')}

Para CADA UC acima, extraia:
- Objetivo da UC (texto completo, campo "Objetivo Geral")
- TODAS as Capacidades listadas na seção "CONTEÚDOS FORMATIVOS"

TIPOS DE CAPACIDADES NO SENAI:
1. **Capacidades Básicas** - Encontradas em UCs dos módulos: Básico, Indústria, Introdutório, Inovação
   - Geralmente começam com verbos como: Reconhecer, Identificar, Compreender, Aplicar
   - Exemplo: "Reconhecer os fundamentos da qualidade nos processos industriais"
   
2. **Capacidades Técnicas** - Encontradas em UCs dos módulos: Específico I, II, III, IV
   - Geralmente começam com verbos como: Aplicar, Realizar, Executar, Avaliar, Selecionar
   - Exemplo: "Aplicar técnicas de manutenção conforme o componente do sistema"

3. **Capacidades Socioemocionais** - Podem aparecer em qualquer módulo
   - Relacionadas a comportamento, ética, trabalho em equipe

IMPORTANTE: 
- Extraia TODAS as capacidades de cada UC, sem resumir ou omitir nenhuma
- Use códigos: CB1, CB2... para Básicas | CT1, CT2... para Técnicas | CS1, CS2... para Socioemocionais
- Mantenha a descrição COMPLETA de cada capacidade
- Se a UC tem "Capacidades Básicas", use o array "capacidadesBasicas"
- Se a UC tem "Capacidades Técnicas", use o array "capacidadesTecnicas"

Retorne APENAS JSON válido:
{
  "detalhesUCs": [
    {
      "nome": "Nome exato da UC",
      "objetivo": "Objetivo completo da UC...",
      "capacidadesBasicas": [
        { "codigo": "CB1", "descricao": "Descrição completa da capacidade básica..." }
      ],
      "capacidadesTecnicas": [
        { "codigo": "CT1", "descricao": "Descrição completa da capacidade técnica..." }
      ],
      "capacidadesSocioemocionais": [
        { "codigo": "CS1", "descricao": "Descrição completa da capacidade socioemocional..." }
      ]
    }
  ]
}

NOTA: Inclua apenas os arrays que existem para cada UC. Se uma UC só tem Capacidades Básicas, não inclua o array de Técnicas vazio.`;

    const result = await callGeminiAPI(pdfBase64, prompt);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[Gemini] Erro na extração de capacidades:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/gemini/extract-conhecimentos - Extrair conhecimentos das UCs
router.post('/extract-conhecimentos', async (req, res) => {
  try {
    const { pdfBase64, ucs } = req.body;

    if (!pdfBase64 || !ucs || ucs.length === 0) {
      return res.status(400).json({ success: false, error: 'PDF e UCs são obrigatórios' });
    }

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

    const result = await callGeminiAPI(pdfBase64, prompt);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[Gemini] Erro na extração de conhecimentos:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/gemini/generate - Rota genérica para geração de conteúdo (avaliações, planos, SA)
router.post('/generate', async (req, res) => {
  try {
    const { systemPrompt, userPrompt, maxTokens = 32768 } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ success: false, error: 'systemPrompt e userPrompt são obrigatórios' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY não configurada no servidor' });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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

    if (!response.ok) {
      console.error('[Gemini] Erro:', JSON.stringify(data));
      throw new Error(data.error?.message || `Erro na API Gemini: ${response.status}`);
    }

    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      throw new Error('Conteúdo bloqueado por políticas de segurança. Tente reformular.');
    }
    if (finishReason === 'MAX_TOKENS') {
      throw new Error('Resposta truncada. Tente gerar menos conteúdo.');
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('Resposta vazia da API Gemini');
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error('[Gemini] Erro na geração:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
