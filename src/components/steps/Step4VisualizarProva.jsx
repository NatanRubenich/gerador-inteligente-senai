import { useState } from 'react';
import { ChevronLeft, Printer, FileText, RotateCcw, Eye, EyeOff, Download } from 'lucide-react';
import { useProva } from '../../context/ProvaContext';
import { downloadMoodleXml } from '../../services/moodleExportService';

export default function Step4VisualizarProva() {
  const { questoesGeradas, prevStep, resetProva, termoCapacidade } = useProva();
  const [showGabarito, setShowGabarito] = useState(false);
  const [viewMode, setViewMode] = useState('prova'); // 'prova' ou 'gabarito'

  if (!questoesGeradas?.prova) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Nenhuma prova gerada ainda.</p>
          <button
            onClick={prevStep}
            className="mt-4 px-4 py-2 bg-[#004b8d] text-white rounded-lg"
          >
            Voltar para gerar questões
          </button>
        </div>
      </div>
    );
  }

  const prova = questoesGeradas.prova;
  
  // Detectar qual campo usar para capacidade/habilidade
  const getCapacidadeQuestao = (questao) => {
    return questao[termoCapacidade.toLowerCase()] || questao.habilidade || questao.capacidade || '';
  };

  // Obter capacidades/habilidades do objeto prova
  const getCapacidadesProva = () => {
    return prova[`${termoCapacidade.toLowerCase()}s`] || prova.capacidades || prova.habilidades || {};
  };

  const handlePrint = () => {
    setViewMode('prova');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintGabarito = () => {
    setViewMode('gabarito');
    setTimeout(() => {
      window.print();
      setViewMode('prova');
    }, 100);
  };

  const handleExportMoodle = () => {
    downloadMoodleXml(prova, termoCapacidade);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controles - não aparecem na impressão */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print">
        {/* Linha 1: Visualização */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-600">Visualizar:</span>
          <button
            onClick={() => setViewMode('prova')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'prova' 
                ? 'bg-[#004b8d] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={18} />
            Prova
          </button>
          <button
            onClick={() => setViewMode('gabarito')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'gabarito' 
                ? 'bg-[#004b8d] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye size={18} />
            Gabarito
          </button>
          <button
            onClick={() => setShowGabarito(!showGabarito)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
          >
            {showGabarito ? <EyeOff size={18} /> : <Eye size={18} />}
            {showGabarito ? 'Ocultar Respostas' : 'Mostrar Respostas'}
          </button>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Linha 2: Ações */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Ações:</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer size={18} />
            Imprimir Prova
          </button>

          <button
            onClick={handlePrintGabarito}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Printer size={18} />
            Imprimir Gabarito
          </button>

          <button
            onClick={handleExportMoodle}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            title="Exportar para importação no Moodle"
          >
            <Download size={18} />
            Exportar Moodle
          </button>
        </div>
      </div>

      {/* Visualização da Prova */}
      {viewMode === 'prova' && (
        <div className="bg-white rounded-xl shadow-lg prova-container" id="prova-print">
          {/* Cabeçalho da Prova - Compacto */}
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              <tr>
                <td rowSpan="7" className="border border-black p-2 w-36 text-center align-middle">
                  <img 
                    src={`${import.meta.env.BASE_URL}senai.png`} 
                    alt="SENAI" 
                    className="w-full max-w-[100px] mx-auto mb-1"
                  />
                  <p className="font-bold text-xs">Serviço Nacional de</p>
                  <p className="font-bold text-xs">Aprendizagem Industrial</p>
                  <p className="text-xs">Santa Catarina</p>
                </td>
                <td className="border border-black p-2 text-center font-bold text-base">
                  AVALIAÇÃO OBJETIVA
                </td>
                <td rowSpan="7" className="border border-black p-2 w-24 text-center font-bold align-middle text-sm">
                  Desempenho
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Data:</strong>{' '}
                  <span className="text-blue-600 italic">{prova.data}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Docente:</strong>{' '}
                  <span className="text-blue-600 italic">{prova.docente}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Curso Técnico em:</strong>{' '}
                  <span className="text-blue-600 font-bold italic">{prova.curso}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Unidade Curricular:</strong>{' '}
                  <span className="text-blue-600 font-bold italic">{prova.unidade_curricular}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Turma:</strong>{' '}
                  <span className="text-blue-600 font-bold italic">{prova.turma}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Estudante:</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Capacidades/Habilidades */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-1 px-2 uppercase text-xs">
              {termoCapacidade}S
            </div>
            <div className="border border-black border-t-0 p-2">
              {Object.entries(getCapacidadesProva()).map(([codigo, descricao]) => (
                <p key={codigo} className="mb-1 text-xs">
                  <strong>{codigo}:</strong> {descricao}
                </p>
              ))}
            </div>
          </div>

          {/* Questões */}
          <div className="mt-6 space-y-4">
            {prova.questoes?.map((questao, index) => (
              <div key={index} className="border border-black">
                <div className="bg-[#004b8d] text-white font-bold p-2 text-sm flex items-center justify-between">
                  <span>ITEM {questao.numero}</span>
                  {questao.dificuldade && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      questao.dificuldade === 'Fácil' ? 'bg-green-500' :
                      questao.dificuldade === 'Médio' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {questao.dificuldade}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="mb-2 text-sm">
                    <strong className="text-blue-600 italic">{termoCapacidade.toUpperCase()}:</strong>{' '}
                    {getCapacidadeQuestao(questao)}
                  </p>
                  <p className="mb-2 text-sm">
                    <strong className="text-blue-600 italic">Contexto:</strong>{' '}
                    {questao.contexto}
                  </p>
                  <p className="mb-3 text-sm">
                    <strong className="text-blue-600 italic">Comando:</strong>{' '}
                    {questao.comando}
                  </p>
                  <div className="italic text-sm">
                    <p className="font-bold text-blue-600 mb-2">Alternativas:</p>
                    {Object.entries(questao.alternativas || {}).map(([letra, texto]) => (
                      <p 
                        key={letra} 
                        className={`mb-1 ${
                          showGabarito && questao.resposta_correta === letra 
                            ? 'bg-green-100 font-bold text-green-800 px-2 py-1 rounded' 
                            : ''
                        }`}
                      >
                        {letra}) {texto}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualização do Gabarito */}
      {viewMode === 'gabarito' && (
        <div className="bg-white rounded-xl shadow-lg prova-container" id="gabarito-print">
          {/* Cabeçalho no mesmo padrão das outras avaliações */}
          <table className="w-full border-collapse border border-black">
            <tbody>
              <tr>
                <td rowSpan="5" className="border border-black p-4 w-48 text-center align-middle">
                  <img 
                    src={`${import.meta.env.BASE_URL}senai.png`} 
                    alt="SENAI" 
                    className="w-full max-w-[150px] mx-auto mb-2"
                  />
                  <p className="font-bold text-sm">Serviço Nacional de</p>
                  <p className="font-bold text-sm">Aprendizagem Industrial</p>
                  <p className="text-sm">Santa Catarina</p>
                </td>
                <td className="border border-black p-3 text-center font-bold text-lg bg-[#004b8d] text-white">
                  GABARITO - AVALIAÇÃO OBJETIVA
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Curso Técnico em:</strong> <span className="text-blue-700">{prova.curso}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Unidade Curricular:</strong> <span className="text-blue-700">{prova.unidade_curricular}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Turma:</strong> <span className="text-blue-700">{prova.turma}</span> | <strong>Data:</strong> <span className="text-blue-700">{prova.data}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Docente:</strong> <span className="text-blue-700">{prova.docente}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tabela de Respostas */}
          <div className="mt-4 border border-black">
            <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
              RESPOSTAS CORRETAS
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-center">Questão</th>
                  <th className="border border-gray-300 p-3 text-center">{termoCapacidade}</th>
                  <th className="border border-gray-300 p-3 text-center">Dificuldade</th>
                  <th className="border border-gray-300 p-3 text-center">Resposta Correta</th>
                </tr>
              </thead>
              <tbody>
                {prova.questoes?.map((questao, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 text-center font-bold">
                      {questao.numero}
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-sm">
                      {getCapacidadeQuestao(questao)}
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        questao.dificuldade === 'Fácil' ? 'bg-green-100 text-green-800' :
                        questao.dificuldade === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {questao.dificuldade || '-'}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-center font-bold text-lg text-green-700">
                      {questao.resposta_correta?.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé */}
          <div className="mt-6 p-4 text-center text-xs text-gray-500 border-t">
            <p>Gabarito gerado pelo Sistema Gerador de Provas SENAI - Metodologia SENAI de Educação Profissional (MSEP)</p>
          </div>
        </div>
      )}

      {/* Botões de Navegação - não aparecem na impressão */}
      <div className="mt-8 flex justify-between no-print">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
        
        <button
          onClick={resetProva}
          className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <RotateCcw size={20} />
          Nova Prova
        </button>
      </div>
    </div>
  );
}
