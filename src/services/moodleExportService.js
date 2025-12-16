/**
 * Serviço de exportação de questões para o formato Moodle XML
 */

/**
 * Escapa caracteres especiais para XML
 */
const escapeXml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Gera HTML para imagens da questão
 */
const gerarImagensHtml = (imagens) => {
  if (!imagens || imagens.length === 0) return '';
  
  return `<div style="margin: 20px 0; display: flex; flex-wrap: wrap; gap: 15px;">
${imagens.map((img, idx) => `
<figure style="margin: 0; max-width: 400px;">
  <img src="${escapeXml(img.src)}" alt="${escapeXml(img.descricao || `Imagem ${idx + 1}`)}" style="max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  ${img.descricao ? `<figcaption style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center; font-style: italic;">${escapeXml(img.descricao)}</figcaption>` : ''}
</figure>
`).join('')}
</div>`;
};

/**
 * Gera HTML para blocos de código da questão
 */
const gerarCodigosHtml = (codigos) => {
  if (!codigos || codigos.length === 0) return '';
  
  return `<div style="margin: 20px 0;">
${codigos.map(cod => `
<div style="border-radius: 8px; overflow: hidden; margin-bottom: 15px; border: 1px solid #374151;">
  <div style="background: #1f2937; color: #f9fafb; padding: 8px 15px; font-size: 12px; font-family: monospace;">
    ${escapeXml(cod.linguagem)}
  </div>
  <pre style="background: #111827; color: #4ade80; padding: 15px; margin: 0; font-size: 14px; font-family: 'Courier New', monospace; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeXml(cod.codigo)}</code></pre>
</div>
`).join('')}
</div>`;
};

/**
 * Gera o HTML formatado para o questiontext (contexto + comando)
 */
const gerarQuestionTextHtml = (questao, termoCapacidade) => {
  const capacidade = questao[termoCapacidade?.toLowerCase()] || questao.capacidade || questao.habilidade || '';
  const dificuldade = questao.dificuldade || 'Médio';
  
  // Cores baseadas na dificuldade
  const corDificuldade = {
    'Fácil': { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
    'Médio': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    'Difícil': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
  }[dificuldade] || { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };

  // Gerar HTML para imagens e códigos
  const imagensHtml = gerarImagensHtml(questao.imagens);
  const codigosHtml = gerarCodigosHtml(questao.codigos);

  return `<div style="max-width: 900px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); overflow: hidden;">
<!-- Cabeçalho -->
<div style="background: linear-gradient(135deg, #004b8d 0%, #0066cc 100%); padding: 25px; border-bottom: 4px solid #60a5fa;">
<p style="color: #bfdbfe; margin: 0; font-size: 14px;">
<span style="background: ${corDificuldade.bg}; color: ${corDificuldade.text}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">${dificuldade}</span>
</p>
<p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 13px;"><strong>${termoCapacidade || 'Capacidade'}:</strong> ${escapeXml(capacidade)}</p>
</div>
<!-- Conteúdo -->
<div style="padding: 30px;">
<!-- Contexto -->
<div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
<h3 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px;">📋 Contexto</h3>
<p style="margin: 0; color: #0c4a6e; line-height: 1.7; font-size: 15px; text-align: justify;">${escapeXml(questao.contexto)}</p>
</div>
${imagensHtml}
${codigosHtml}
<!-- Comando -->
<div style="background: ${corDificuldade.bg}; border-left: 4px solid ${corDificuldade.border}; padding: 20px; border-radius: 8px;">
<h3 style="margin: 0 0 12px 0; color: ${corDificuldade.text}; font-size: 16px;">🎯 Comando</h3>
<p style="margin: 0; color: ${corDificuldade.text}; line-height: 1.7; font-size: 15px;">${escapeXml(questao.comando)}</p>
</div>
</div>
</div>`;
};

/**
 * Gera o HTML formatado para uma alternativa
 */
const gerarAlternativaHtml = (texto) => {
  return `<div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6c757d; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto;">
<p style="color: #2d3748; font-size: 15px; line-height: 1.6; margin: 0;">${escapeXml(texto)}</p>
</div>`;
};

/**
 * Gera o XML de uma questão no formato Moodle
 */
const gerarQuestaoXml = (questao, index, termoCapacidade) => {
  const nome = `Questão ${questao.numero || index + 1} - ${questao[termoCapacidade?.toLowerCase()] || questao.capacidade || 'CT'}`;
  const questionText = gerarQuestionTextHtml(questao, termoCapacidade);
  
  // Gerar alternativas
  const alternativas = Object.entries(questao.alternativas || {}).map(([letra, texto]) => {
    const isCorreta = questao.resposta_correta === letra;
    const fraction = isCorreta ? '100' : '0';
    const alternativaHtml = gerarAlternativaHtml(texto);
    
    return `    <answer fraction="${fraction}" format="html">
      <text><![CDATA[${alternativaHtml}]]></text>
      <feedback format="html">
        <text></text>
      </feedback>
    </answer>`;
  }).join('\n');

  return `
<!-- question: ${index + 1} -->
  <question type="multichoice">
    <name>
      <text>${escapeXml(nome)}</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[${questionText}]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text></text>
    </generalfeedback>
    <defaultgrade>1.0000000</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <idnumber></idnumber>
    <single>true</single>
    <shuffleanswers>true</shuffleanswers>
    <answernumbering>abc</answernumbering>
    <showstandardinstruction>0</showstandardinstruction>
    <correctfeedback format="html">
      <text><![CDATA[<p>Sua resposta está correta.</p>]]></text>
    </correctfeedback>
    <partiallycorrectfeedback format="html">
      <text><![CDATA[<p>Sua resposta está parcialmente correta.</p>]]></text>
    </partiallycorrectfeedback>
    <incorrectfeedback format="html">
      <text><![CDATA[<p>Sua resposta está incorreta.</p>]]></text>
    </incorrectfeedback>
    <shownumcorrect/>
${alternativas}
  </question>`;
};

/**
 * Exporta as questões para o formato Moodle XML
 * @param {Object} prova - Objeto da prova com questões
 * @param {string} termoCapacidade - "Capacidade" ou "Habilidade"
 * @returns {string} - Conteúdo XML
 */
export const exportarParaMoodle = (prova, termoCapacidade = 'Capacidade') => {
  const categoria = `${prova.curso || 'Curso'} - ${prova.unidade_curricular || 'UC'}`;
  
  const questoesXml = prova.questoes
    ?.map((q, i) => gerarQuestaoXml(q, i, termoCapacidade))
    .join('\n') || '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
<!-- Categoria -->
  <question type="category">
    <category>
      <text>$course$/top/${escapeXml(categoria)}</text>
    </category>
    <info format="html">
      <text></text>
    </info>
    <idnumber></idnumber>
  </question>
${questoesXml}
</quiz>`;

  return xml;
};

/**
 * Faz o download do arquivo XML
 * @param {Object} prova - Objeto da prova
 * @param {string} termoCapacidade - "Capacidade" ou "Habilidade"
 */
export const downloadMoodleXml = (prova, termoCapacidade = 'Capacidade') => {
  const xml = exportarParaMoodle(prova, termoCapacidade);
  
  // Criar blob e link para download
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Nome do arquivo
  const dataAtual = new Date().toISOString().slice(0, 10);
  const nomeArquivo = `questoes-${prova.unidade_curricular || 'prova'}-${dataAtual}.xml`;
  
  // Criar link e clicar
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL
  URL.revokeObjectURL(url);
};
