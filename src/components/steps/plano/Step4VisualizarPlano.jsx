import { useState } from 'react';
import { ChevronLeft, RotateCcw, Target, FileText, Copy, Check, Building2, BookOpen, ClipboardList } from 'lucide-react';
import { useProva } from '../../../context/ProvaContext';

export default function Step4VisualizarPlano() {
  const { planoEnsinoGerado, prevStep, resetProva, termoCapacidade, dadosProva } = useProva();
  const [copiedField, setCopiedField] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('campos'); // 'campos', 'sas'

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

          <div className="flex items-center gap-3">
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
                onClick={() => setAbaAtiva('sas')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === 'sas' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Target size={14} className="inline mr-1" />
                Situações de Aprendizagem
              </button>
            </div>

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

      {/* Aba: Situações de Aprendizagem */}
      {abaAtiva === 'sas' && (
        <div className="space-y-6">
          {plano.situacoesAprendizagem?.map((sa, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Cabeçalho da SA */}
              <div className="bg-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    SA {i + 1}: {sa.titulo}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500 px-3 py-1 rounded text-sm">
                      {sa.cargaHoraria}h
                    </span>
                    <button
                      onClick={() => copyToClipboard(sa.titulo, `sa_titulo_${i}`)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        copiedField === `sa_titulo_${i}` ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-400'
                      }`}
                    >
                      {copiedField === `sa_titulo_${i}` ? 'Copiado!' : 'Copiar Título'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Contextualização */}
                <CopyableField
                  label="Contextualização"
                  value={sa.contextualizacao}
                  fieldName={`sa_contexto_${i}`}
                  rows={4}
                />

                {/* Desafio */}
                <CopyableField
                  label="Desafio"
                  value={sa.desafio}
                  fieldName={`sa_desafio_${i}`}
                  rows={3}
                />

                {/* Resultados Esperados */}
                <CopyableField
                  label="Resultados Esperados (Entregas)"
                  value={sa.resultadosEsperados}
                  fieldName={`sa_resultados_${i}`}
                  rows={3}
                />

                {/* Critérios de Avaliação */}
                <CopyableField
                  label="Critérios de Avaliação"
                  value={sa.criteriosAvaliacao?.join(';\n') || ''}
                  fieldName={`sa_criterios_${i}`}
                  rows={4}
                />

                {/* Capacidades Trabalhadas */}
                {sa.capacidadesTrabalhadas && sa.capacidadesTrabalhadas.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm mb-2">
                      {termoCapacidade}s Trabalhadas:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {sa.capacidadesTrabalhadas.map((cap, j) => (
                        <li key={j} className="text-purple-700">• {cap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {(!plano.situacoesAprendizagem || plano.situacoesAprendizagem.length === 0) && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">Nenhuma Situação de Aprendizagem gerada.</p>
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
            <li>Para as SAs, use a aba "Situações de Aprendizagem" e adicione cada uma no SGN</li>
          </ol>
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
