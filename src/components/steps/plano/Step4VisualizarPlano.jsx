import { useState, useRef } from 'react';
import { ChevronLeft, RotateCcw, Target, FileText, Copy, Check, BookOpen, ClipboardList, Printer, RefreshCw, Sparkles } from 'lucide-react';
import { useProva, TIPO_AVALIACAO } from '../../../context/ProvaContext';
import { gerarPlanoEnsino } from '../../../services/planoEnsinoService';

export default function Step4VisualizarPlano() {
  const { 
    planoEnsinoGerado, 
    setPlanoEnsinoGerado,
    prevStep, 
    resetProva, 
    termoCapacidade, 
    dadosProva,
    selectTipoAvaliacao,
    goToStep,
    setIsLoading,
    isLoading
  } = useProva();
  const [copiedField, setCopiedField] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('campos'); // 'campos', 'blocos'
  const [regenerandoBlocos, setRegenerandoBlocos] = useState(false);
  const printRef = useRef(null);

  if (!planoEnsinoGerado) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Nenhum Plano de Ensino gerado ainda.</p>
          <button
            onClick={prevStep}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Voltar para gerar Plano
          </button>
        </div>
      </div>
    );
  }

  const plano = planoEnsinoGerado;

  // Função para imprimir o plano
  const handlePrint = () => {
    window.print();
  };

  // Função para regenerar apenas os blocos de aula
  const handleRegenerarBlocos = async () => {
    if (regenerandoBlocos) return;
    
    setRegenerandoBlocos(true);
    try {
      const novoPlano = await gerarPlanoEnsino({
        curso: plano.curso,
        unidadeCurricular: plano.unidadeCurricular,
        capacidades: dadosProva.capacidades,
        cargaHoraria: plano.cargaHoraria,
        periodo: plano.periodo,
        competenciaGeral: plano.competenciaGeral,
        ambientesPedagogicos: plano.configAmbientes,
        instrumentosAvaliacao: plano.configInstrumentos,
        ferramentas: plano.configFerramentas,
        termoCapacidade,
        quantidadeBlocos: plano.numBlocos
      });
      
      setPlanoEnsinoGerado(novoPlano);
    } catch (error) {
      console.error('Erro ao regenerar blocos:', error);
      alert('Erro ao regenerar blocos de aula. Tente novamente.');
    } finally {
      setRegenerandoBlocos(false);
    }
  };

  // Função para navegar para gerar Situação de Aprendizagem
  const handleGerarSA = () => {
    // Muda para o tipo SA e vai para o step 3 (geração)
    selectTipoAvaliacao(TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM);
    goToStep(3);
  };

  // Função para copiar texto
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Componente de campo copiável
  const CopyableField = ({ label, value, fieldName, rows = 4 }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <button
          onClick={() => copyToClipboard(value, fieldName)}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
            copiedField === fieldName
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {copiedField === fieldName ? (
            <>
              <Check size={14} />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </button>
      </div>
      <textarea
        readOnly
        value={value || ''}
        rows={rows}
        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-purple-600" />
              Plano de Ensino - SGN
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Copie os campos abaixo para preencher o sistema SGN
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Abas */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAbaAtiva('campos')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === 'campos' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ClipboardList size={14} className="inline mr-1" />
                Campos SGN
              </button>
              <button
                onClick={() => setAbaAtiva('blocos')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === 'blocos' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Target size={14} className="inline mr-1" />
                Blocos de Aula
              </button>
            </div>

            {/* Botões de ação */}
            <button
              onClick={handleGerarSA}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Sparkles size={18} />
              Gerar SA
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer size={18} />
              Imprimir
            </button>

            <button
              onClick={resetProva}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={18} />
              Novo Plano
            </button>
          </div>
        </div>
      </div>

      {/* Aba: Campos SGN */}
      {abaAtiva === 'campos' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Informações da UC */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Curso:</span>
                <span className="ml-2 font-medium">{plano.curso}</span>
              </div>
              <div>
                <span className="text-gray-500">UC:</span>
                <span className="ml-2 font-medium">{plano.unidadeCurricular}</span>
              </div>
              <div>
                <span className="text-gray-500">Carga Horária:</span>
                <span className="ml-2 font-medium">{plano.cargaHoraria}h</span>
              </div>
              <div>
                <span className="text-gray-500">Período:</span>
                <span className="ml-2 font-medium">{plano.periodo}</span>
              </div>
            </div>
          </div>

          {/* Competência Geral */}
          <CopyableField
            label="Competência Geral do Curso"
            value={plano.competenciaGeral}
            fieldName="competenciaGeral"
            rows={3}
          />

          {/* Ambientes Pedagógicos */}
          <CopyableField
            label="Ambientes Pedagógicos"
            value={plano.ambientesPedagogicos}
            fieldName="ambientesPedagogicos"
            rows={5}
          />

          {/* Outros Instrumentos de Avaliação */}
          <CopyableField
            label="Outros Instrumentos de Avaliação"
            value={plano.outrosInstrumentos}
            fieldName="outrosInstrumentos"
            rows={4}
          />

          {/* Referências Básicas */}
          <CopyableField
            label="Referências Bibliográficas - Básicas"
            value={plano.referenciasBasicas}
            fieldName="referenciasBasicas"
            rows={5}
          />

          {/* Referências Complementares */}
          <CopyableField
            label="Referências Bibliográficas - Complementares"
            value={plano.referenciasComplementares}
            fieldName="referenciasComplementares"
            rows={4}
          />

          {/* Observações */}
          <CopyableField
            label="Observações"
            value={plano.observacoes || ''}
            fieldName="observacoes"
            rows={3}
          />

          {/* Capacidades */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Target size={18} />
              {termoCapacidade}s Selecionadas
            </h3>
            <ul className="space-y-2 text-sm">
              {plano.capacidades?.map((cap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium flex-shrink-0">
                    {cap.indice}
                  </span>
                  <span><strong>{cap.codigo}:</strong> {cap.descricao}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      
      {/* Aba: Blocos de Aula */}
      {abaAtiva === 'blocos' && (
        <div className="space-y-6">
          {/* Botão para regenerar blocos */}
          <div className="flex justify-end">
            <button
              onClick={handleRegenerarBlocos}
              disabled={regenerandoBlocos}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                regenerandoBlocos 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <RefreshCw size={18} className={regenerandoBlocos ? 'animate-spin' : ''} />
              {regenerandoBlocos ? 'Regenerando...' : 'Regenerar Blocos de Aula'}
            </button>
          </div>

          {plano.blocosAula?.map((bloco, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden print-block">
              {/* Cabeçalho do Bloco */}
              <div className="bg-purple-600 text-white p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-bold">
                    {bloco.titulo}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500 px-3 py-1 rounded text-sm">
                      {bloco.numAulas} aulas - {bloco.cargaHoraria}h
                    </span>
                    <button
                      onClick={() => copyToClipboard(bloco.titulo, `bloco_titulo_${i}`)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        copiedField === `bloco_titulo_${i}` ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-400'
                      }`}
                    >
                      {copiedField === `bloco_titulo_${i}` ? 'Copiado!' : 'Copiar Título'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Capacidades a serem trabalhadas */}
                {bloco.capacidadesTrabalhadas && bloco.capacidadesTrabalhadas.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-800 text-sm">
                        {termoCapacidade}s a serem trabalhadas:
                      </h4>
                      <button
                        onClick={() => copyToClipboard(
                          bloco.capacidadesTrabalhadas.map(c => `${c.codigo} - ${c.descricao}`).join('\n'), 
                          `bloco_caps_${i}`
                        )}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                          copiedField === `bloco_caps_${i}` ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {copiedField === `bloco_caps_${i}` ? <Check size={12} /> : <Copy size={12} />}
                        {copiedField === `bloco_caps_${i}` ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <ul className="text-sm space-y-1">
                      {bloco.capacidadesTrabalhadas.map((cap, j) => (
                        <li key={j} className="text-purple-700">
                          <strong>{cap.codigo}</strong> - {cap.descricao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conhecimentos Relacionados */}
                <CopyableField
                  label="Conhecimentos Relacionados"
                  value={bloco.conhecimentosRelacionados?.join('\n') || ''}
                  fieldName={`bloco_conhecimentos_${i}`}
                  rows={4}
                />

                {/* Estratégias de Ensino e Descrição das Atividades */}
                <CopyableField
                  label="Estratégias de Ensino e Descrição das Atividades"
                  value={bloco.estrategiasDetalhadas || ''}
                  fieldName={`bloco_estrategias_${i}`}
                  rows={10}
                />

                {/* Recursos e Ambientes Pedagógicos */}
                <CopyableField
                  label="Recursos e Ambientes Pedagógicos"
                  value={bloco.recursosPedagogicos || ''}
                  fieldName={`bloco_recursos_${i}`}
                  rows={3}
                />

                {/* Critérios de Avaliação */}
                <CopyableField
                  label="Critérios de Avaliação (como vou avaliar)"
                  value={bloco.criteriosAvaliacao || ''}
                  fieldName={`bloco_criterios_${i}`}
                  rows={3}
                />

                {/* Instrumentos de Avaliação */}
                <CopyableField
                  label="Instrumentos de Avaliação da Aprendizagem"
                  value={bloco.instrumentosAvaliacao || ''}
                  fieldName={`bloco_instrumentos_${i}`}
                  rows={2}
                />
              </div>
            </div>
          ))}

          {(!plano.blocosAula || plano.blocosAula.length === 0) && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">Nenhum Bloco de Aula gerado.</p>
            </div>
          )}
        </div>
      )}

      {/* Dica de uso */}
      {abaAtiva === 'campos' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 no-print">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            Como usar no SGN
          </h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Acesse o Diário de Classe no SGN</li>
            <li>Vá para a aba "Plano de Ensino"</li>
            <li>Clique em "Copiar" ao lado de cada campo acima</li>
            <li>Cole (Ctrl+V) no campo correspondente do SGN</li>
            <li>Para os Blocos de Aula, use a aba "Blocos de Aula" e adicione cada bloco no SGN</li>
          </ol>
          <p className="text-sm text-blue-600 mt-3 italic">
            💡 Para gerar uma Situação de Aprendizagem, clique no botão "Gerar SA" acima.
          </p>
        </div>
      )}
      
      {/* Dica de uso para Blocos */}
      {abaAtiva === 'blocos' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 no-print">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            Como adicionar Blocos de Aula no SGN
          </h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>No SGN, vá para a seção "Plano de Aulas"</li>
            <li>Digite o título do bloco e clique em "Adicionar Plano de Aula"</li>
            <li>Preencha a C.H. Planejada (cada bloco tem no mínimo 20h)</li>
            <li>Selecione as Capacidades a serem trabalhadas no bloco</li>
            <li>Copie e cole os Conhecimentos Relacionados (da matriz curricular)</li>
            <li>Copie e cole as Estratégias de Ensino (descrição detalhada de cada aula)</li>
            <li>Copie e cole os Recursos e Ambientes Pedagógicos</li>
            <li>Copie e cole os Critérios e Instrumentos de Avaliação</li>
            <li>Repita para cada bloco de aula</li>
          </ol>
          <p className="text-sm text-blue-600 mt-3 italic">
            💡 Se os blocos não ficaram como esperado, clique em "Regenerar Blocos de Aula" para gerar uma nova sugestão.
          </p>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex justify-between mt-6 no-print">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        <button
          onClick={resetProva}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RotateCcw size={20} />
          Criar Novo Plano
        </button>
      </div>
    </div>
  );
}
