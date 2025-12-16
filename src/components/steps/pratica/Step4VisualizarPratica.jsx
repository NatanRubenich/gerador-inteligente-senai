import { useState, useRef } from 'react';
import { useProva } from '../../../context/ProvaContext';
import { 
  Printer, 
  Eye, 
  ClipboardList,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function Step4VisualizarPratica() {
  const { dadosProva, avaliacaoPraticaGerada, prevStep, resetProva } = useProva();
  const [viewMode, setViewMode] = useState('prova'); // 'prova' ou 'checklist'
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  if (!avaliacaoPraticaGerada) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">Nenhuma avaliação prática gerada ainda.</p>
        <button
          onClick={prevStep}
          className="mt-4 px-6 py-2 bg-[#004b8d] text-white rounded-lg hover:bg-blue-800"
        >
          Voltar
        </button>
      </div>
    );
  }

  const prova = avaliacaoPraticaGerada;

  return (
    <div className="space-y-6">
      {/* Aviso de IA */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 no-print">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-amber-800 font-medium">⚠️ Conteúdo gerado por Inteligência Artificial</p>
            <p className="text-amber-700 text-sm mt-1">
              A avaliação prática abaixo foi gerada por IA e pode conter erros, imprecisões ou informações desatualizadas. 
              <strong className="block mt-1">É fundamental revisar todo o conteúdo cuidadosamente antes de utilizá-lo em avaliações.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-lg p-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('prova')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === 'prova'
                  ? 'bg-[#004b8d] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye size={18} />
              Prova
            </button>
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === 'checklist'
                  ? 'bg-[#004b8d] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ClipboardList size={18} />
              Lista de Verificação
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Printer size={18} />
              Imprimir
            </button>
            <button
              onClick={resetProva}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Nova Avaliação
            </button>
          </div>
        </div>
      </div>

      {/* Visualização da Prova Prática! */}
      {viewMode === 'prova' && (
        <div className="bg-white rounded-xl shadow-lg prova-container" id="prova-print" ref={printRef}>
          {/* Cabeçalho */}
          <table className="w-full border-collapse border border-black">
            <tbody>
              <tr>
                <td rowSpan="6" className="border border-black p-4 w-48 text-center align-middle">
                  <img 
                    src={`${import.meta.env.BASE_URL}senai.png`} 
                    alt="SENAI" 
                    className="w-full max-w-[150px] mx-auto mb-2"
                  />
                  <p className="font-bold text-sm">Serviço Nacional de</p>
                  <p className="font-bold text-sm">Aprendizagem Industrial</p>
                  <p className="text-sm">Santa Catarina</p>
                </td>
                <td className="border border-black p-3 text-center font-bold text-lg">
                  AVALIAÇÃO PRÁTICA
                </td>
                <td rowSpan="6" className="border border-black p-4 w-32 text-center align-middle">
                  <p className="font-bold text-sm">Desempenho</p>
                  <div className="mt-2 h-16 border border-gray-300 rounded"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Data:</strong> <span className="text-blue-700">{prova.data || dadosProva.data}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Docente:</strong> <span className="text-blue-700">{prova.docente || dadosProva.professor}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Curso Técnico em:</strong> <span className="text-blue-700">{prova.curso || dadosProva.curso}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Unidade Curricular:</strong> <span className="text-blue-700">{prova.unidade_curricular || dadosProva.unidadeCurricular}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Turma:</strong> <span className="text-blue-700">{prova.turma || dadosProva.turma}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Estudante */}
          <div className="border border-black border-t-0 p-3">
            <strong>Estudante:</strong> _______________________________________________
          </div>

          {/* Capacidades */}
          <div className="mt-4 border border-black">
            <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
              CAPACIDADES AVALIADAS
            </div>
            <div className="p-4 space-y-2">
              {prova.capacidades && Object.entries(prova.capacidades).map(([codigo, descricao]) => (
                <p key={codigo} className="text-sm">
                  <strong>{codigo}:</strong> {descricao}
                </p>
              ))}
            </div>
          </div>

          {/* Contextualização */}
          <div className="mt-4 border border-black">
            <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
              CONTEXTUALIZAÇÃO
            </div>
            <div className="p-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {prova.contextualizacao}
              </p>
            </div>
          </div>

          {/* Desafio */}
          <div className="mt-4 border border-black">
            <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
              DESAFIO
            </div>
            <div className="p-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {prova.desafio}
              </p>
            </div>
          </div>

          {/* Resultados e Entregas */}
          <div className="mt-4 border border-black">
            <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
              RESULTADOS E ENTREGAS
            </div>
            <div className="p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Atividade</th>
                    <th className="border border-gray-300 p-2 text-left">Evidência/Entrega</th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      Tempo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prova.resultados_entregas && prova.resultados_entregas.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2">{item.atividade}</td>
                      <td className="border border-gray-300 p-2">{item.evidencia}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.tempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Anexos (se houver) */}
          {prova.anexos && prova.anexos.length > 0 && (
            <div className="mt-4 border border-black">
              <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
                LISTA DE ANEXOS
              </div>
              <div className="p-4">
                <ul className="list-disc list-inside space-y-1">
                  {prova.anexos.map((anexo, idx) => (
                    <li key={idx} className="text-gray-700">{anexo}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Observações */}
          {prova.observacoes && (
            <div className="mt-4 border border-black">
              <div className="bg-[#004b8d] text-white p-3 font-bold uppercase text-sm">
                OBSERVAÇÕES
              </div>
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-line">{prova.observacoes}</p>
              </div>
            </div>
          )}

          {/* Rodapé */}
          <div className="mt-6 p-4 text-center text-xs text-gray-500 border-t">
            <p>Avaliação gerada pelo Sistema Gerador de Provas SENAI - Metodologia SENAI de Educação Profissional (MSEP)</p>
          </div>
        </div>
      )}

      {/* Lista de Verificação (Checklist do Professor) */}
      {viewMode === 'checklist' && (
        <div className="bg-white rounded-xl shadow-lg p-8 prova-container" id="checklist-print">
          <div className="text-center mb-6">
            <img 
              src={`${import.meta.env.BASE_URL}senai.png`} 
              alt="SENAI" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#004b8d]">LISTA DE VERIFICAÇÃO - AVALIAÇÃO PRÁTICA</h1>
            <p className="text-gray-500 mt-2">Instrumento de avaliação do docente</p>
          </div>

          {/* Info da prova */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b pb-4">
            <div>
              <p><strong>Curso:</strong> {prova.curso || dadosProva.curso}</p>
              <p><strong>Unidade Curricular:</strong> {prova.unidade_curricular || dadosProva.unidadeCurricular}</p>
            </div>
            <div>
              <p><strong>Turma:</strong> {prova.turma || dadosProva.turma}</p>
              <p><strong>Data:</strong> {prova.data || dadosProva.data}</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <strong>Estudante:</strong> _______________________________________________
          </div>

          {/* Lista de verificação por atividade */}
          {prova.lista_verificacao && prova.lista_verificacao.map((atividade, idx) => (
            <div key={idx} className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-[#004b8d] text-white p-3 font-bold text-sm">
                ATIVIDADE {idx + 1}: {atividade.titulo}
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b border-gray-300 p-2 text-left">Critério de Avaliação</th>
                    <th className="border-b border-gray-300 p-2 text-center w-20">Capacidade</th>
                    <th className="border-b border-gray-300 p-2 text-center w-16">SIM</th>
                    <th className="border-b border-gray-300 p-2 text-center w-16">NÃO</th>
                    <th className="border-b border-gray-300 p-2 text-left w-48">Justificativa</th>
                  </tr>
                </thead>
                <tbody>
                  {atividade.criterios && atividade.criterios.map((criterio, cidx) => (
                    <tr key={cidx} className="border-b border-gray-200">
                      <td className="p-2 text-sm">{criterio.descricao}</td>
                      <td className="p-2 text-center text-sm font-medium text-[#004b8d]">
                        {criterio.capacidade}
                      </td>
                      <td className="p-2 text-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto"></div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto"></div>
                      </td>
                      <td className="p-2">
                        <div className="h-6 border-b border-gray-300"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Observações do avaliador */}
          <div className="mt-6 border border-gray-300 rounded-lg p-4">
            <h3 className="font-bold text-gray-700 mb-3">Observações do Avaliador:</h3>
            <div className="space-y-4">
              <div className="h-8 border-b border-gray-300"></div>
              <div className="h-8 border-b border-gray-300"></div>
              <div className="h-8 border-b border-gray-300"></div>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-black pt-2 mt-12">
                <p className="font-medium">Assinatura do Docente</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2 mt-12">
                <p className="font-medium">Assinatura do Estudante</p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-8 p-4 text-center text-xs text-gray-500 border-t">
            <p>Lista de Verificação gerada pelo Sistema Gerador de Provas SENAI - MSEP</p>
          </div>
        </div>
      )}

      {/* Botão voltar (mobile) */}
      <div className="no-print md:hidden">
        <button
          onClick={prevStep}
          className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Voltar para Configurações
        </button>
      </div>
    </div>
  );
}
