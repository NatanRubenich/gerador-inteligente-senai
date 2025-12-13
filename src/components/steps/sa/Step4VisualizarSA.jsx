import { useState, useRef } from 'react';
import { ChevronLeft, Printer, RotateCcw, Clock, Target, CheckSquare, BookOpen, Wrench, Brain, FileText, AlertTriangle, Award } from 'lucide-react';
import { useProva } from '../../../context/ProvaContext';

export default function Step4VisualizarSA() {
  const { situacaoAprendizagemGerada, prevStep, resetProva, termoCapacidade, dadosProva } = useProva();
  const printRef = useRef();
  const [abaAtiva, setAbaAtiva] = useState('sa'); // 'sa' ou 'rubrica'

  if (!situacaoAprendizagemGerada) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Nenhuma Situação de Aprendizagem gerada ainda.</p>
          <button
            onClick={prevStep}
            className="mt-4 px-4 py-2 bg-[#004b8d] text-white rounded-lg"
          >
            Voltar para gerar SA
          </button>
        </div>
      </div>
    );
  }

  const sa = situacaoAprendizagemGerada;

  const handlePrint = () => {
    window.print();
  };

  // Formatar data
  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Obter nome do nível de dificuldade
  const getNivelNome = (id) => {
    const niveis = { facil: 'Fácil', intermediario: 'Intermediário', dificil: 'Difícil' };
    return niveis[id] || id;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controles - não aparecem na impressão */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-[#004b8d]" />
            Situação de Aprendizagem
          </h2>

          <div className="flex items-center gap-3">
            {/* Abas */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAbaAtiva('sa')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === 'sa' ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText size={16} className="inline mr-1" />
                SA
              </button>
              <button
                onClick={() => setAbaAtiva('rubrica')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === 'rubrica' ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CheckSquare size={16} className="inline mr-1" />
                Rubrica
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors"
            >
              <Printer size={18} />
              Imprimir
            </button>

            <button
              onClick={resetProva}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={18} />
              Nova SA
            </button>
          </div>
        </div>
      </div>

      {/* Documento da SA */}
      {abaAtiva === 'sa' && (
        <div ref={printRef} className="bg-white rounded-xl shadow-lg prova-container" id="sa-print">
          {/* Cabeçalho */}
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              <tr>
                <td rowSpan="4" className="border border-black p-2 w-32 text-center align-middle">
                  <img src="/senai.png" alt="SENAI" className="w-full max-w-[80px] mx-auto mb-1" />
                  <p className="font-bold text-xs">SENAI</p>
                  <p className="text-xs">Santa Catarina</p>
                </td>
                <td colSpan="3" className="border border-black p-2 text-center font-bold text-base bg-[#004b8d] text-white">
                  SITUAÇÃO DE APRENDIZAGEM
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Curso:</strong> <span className="text-blue-600 italic">{sa.curso}</span>
                </td>
                <td className="border border-black py-1 px-2">
                  <strong>UC:</strong> <span className="text-blue-600 italic">{sa.unidadeCurricular}</span>
                </td>
                <td className="border border-black py-1 px-2">
                  <strong>CH:</strong> <span className="text-blue-600 italic">{sa.cargaHoraria}h</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-2">
                  <strong>Docente:</strong> <span className="text-blue-600 italic">{sa.docente || dadosProva.professor}</span>
                </td>
                <td className="border border-black py-1 px-2">
                  <strong>Turma:</strong> <span className="text-blue-600 italic">{sa.turma || dadosProva.turma}</span>
                </td>
                <td className="border border-black py-1 px-2">
                  <strong>Nível:</strong> <span className="text-blue-600 italic">{getNivelNome(sa.nivelDificuldade)}</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="border border-black py-1 px-2">
                  <strong>Estratégia:</strong> <span className="text-blue-600 italic">{sa.estrategiaPedagogica}</span>
                </td>
                <td className="border border-black py-1 px-2">
                  <strong>Data:</strong> <span className="text-blue-600 italic">{formatarData(sa.data || dadosProva.data)}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Título da SA */}
          <div className="mt-4 bg-[#004b8d] text-white p-3 text-center">
            <h1 className="text-lg font-bold">{sa.titulo}</h1>
          </div>

          {/* Capacidades a Desenvolver */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <Target size={16} />
              {termoCapacidade.toUpperCase()}S A DESENVOLVER
            </div>
            <div className="border border-black border-t-0 p-3">
              {sa.capacidades && Object.entries(sa.capacidades).map(([codigo, cap]) => (
                <p key={codigo} className="mb-1 text-sm">
                  <span className="bg-[#004b8d] text-white text-xs px-1.5 py-0.5 rounded mr-2">{codigo}</span>
                  <strong>{cap.codigo}:</strong> {cap.descricao}
                </p>
              ))}
            </div>
          </div>

          {/* CONTEXTO */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <BookOpen size={16} />
              CONTEXTO
            </div>
            <div className="border border-black border-t-0 p-3">
              <p className="text-sm text-gray-700 text-justify leading-relaxed">
                {sa.contexto || sa.contextualizacao}
              </p>
            </div>
          </div>

          {/* DESAFIO */}
          <div className="mt-4">
            <div className="bg-amber-500 text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              DESAFIO
            </div>
            <div className="border border-black border-t-0 p-3 bg-amber-50">
              <p className="text-sm text-gray-800 text-justify leading-relaxed font-medium">
                {sa.desafio}
              </p>
            </div>
          </div>

          {/* RESULTADO (Entrega Final) */}
          <div className="mt-4">
            <div className="bg-green-600 text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <Award size={16} />
              RESULTADO (ENTREGA FINAL)
            </div>
            <div className="border border-black border-t-0 p-3 bg-green-50">
              <p className="text-sm text-gray-800 font-medium">
                {sa.resultado}
              </p>
            </div>
          </div>

          {/* Atividades */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <Wrench size={16} />
              ATIVIDADES
            </div>
            <div className="border border-black border-t-0">
              {sa.atividades?.map((atividade, index) => (
                <div key={index} className={`p-3 ${index > 0 ? 'border-t border-gray-300' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#004b8d] text-sm">
                      Atividade {atividade.numero || index + 1}: {atividade.titulo}
                    </h4>
                    <div className="flex items-center gap-2">
                      {atividade.capacidadesRelacionadas && (
                        <span className="text-xs text-gray-500">
                          {atividade.capacidadesRelacionadas.join(', ')}
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-[#004b8d] px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={12} />
                        {atividade.duracao}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{atividade.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recursos Necessários */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <Wrench size={16} />
              RECURSOS NECESSÁRIOS
            </div>
            <div className="border border-black border-t-0 p-3">
              <ul className="grid grid-cols-2 gap-1">
                {sa.recursosNecessarios?.map((recurso, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#004b8d] rounded-full"></span>
                    {recurso}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conhecimentos Mobilizados */}
          <div className="mt-4 mb-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center gap-2">
              <Brain size={16} />
              CONHECIMENTOS MOBILIZADOS
            </div>
            <div className="border border-black border-t-0 p-3">
              <ul className="grid grid-cols-2 gap-1">
                {sa.conhecimentosMobilizados?.map((conhecimento, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#004b8d] rounded-full"></span>
                    {conhecimento}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rubrica de Avaliação */}
      {abaAtiva === 'rubrica' && (
        <div className="bg-white rounded-xl shadow-lg prova-container" id="rubrica-print">
          {/* Cabeçalho da Rubrica */}
          <div className="bg-[#004b8d] text-white p-4 rounded-t-xl">
            <h1 className="text-lg font-bold text-center">FICHA DE AVALIAÇÃO - {sa.tipoRubrica === 'gradual' ? 'RUBRICA GRADUAL' : 'RUBRICA DICOTÔMICA'}</h1>
            <p className="text-center text-blue-200 text-sm mt-1">{sa.titulo}</p>
          </div>

          {/* Info da SA */}
          <div className="p-4 bg-gray-50 border-b text-sm grid grid-cols-3 gap-4">
            <div><strong>Curso:</strong> {sa.curso}</div>
            <div><strong>UC:</strong> {sa.unidadeCurricular}</div>
            <div><strong>Carga Horária:</strong> {sa.cargaHoraria}h</div>
          </div>

          {/* Espaço para nome do aluno */}
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <div className="flex-1">
                <strong className="text-sm">Nome do Estudante:</strong>
                <div className="border-b-2 border-gray-400 mt-2 h-6"></div>
              </div>
              <div className="w-32">
                <strong className="text-sm">Data:</strong>
                <div className="border-b-2 border-gray-400 mt-2 h-6"></div>
              </div>
            </div>
          </div>

          {/* Tabela da Rubrica */}
          <div className="p-4">
            {sa.rubrica?.tipo === 'gradual' ? (
              /* Rubrica Gradual */
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#004b8d] text-white">
                    <th className="border border-gray-300 p-2 text-left w-1/3">Critério (Peso)</th>
                    <th className="border border-gray-300 p-2 text-center w-16">{termoCapacidade.substring(0,3)}</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Abaixo do Básico<br/>(1-2)</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Básico<br/>(3-5)</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Adequado<br/>(6-7)</th>
                    <th className="border border-gray-300 p-1 text-center text-xs">Avançado<br/>(8-10)</th>
                    <th className="border border-gray-300 p-2 text-center w-16">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {sa.rubrica?.criterios?.map((crit, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-2 font-medium">
                        {crit.criterio}
                        <span className="text-xs text-gray-500 ml-1">(Peso: {crit.peso})</span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-[#004b8d]">
                        {crit.capacidadeAssociada}
                      </td>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600">
                        {crit.descritores?.abaixoDoBasico}
                      </td>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600">
                        {crit.descritores?.basico}
                      </td>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600">
                        {crit.descritores?.adequado}
                      </td>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600">
                        {crit.descritores?.avancado}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="w-full h-6 border border-gray-400 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Rubrica Dicotômica */
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#004b8d] text-white">
                    <th className="border border-gray-300 p-2 text-left">Critério (Peso)</th>
                    <th className="border border-gray-300 p-2 text-center w-20">{termoCapacidade.substring(0,3)}</th>
                    <th className="border border-gray-300 p-2 text-left">Descritor</th>
                    <th className="border border-gray-300 p-2 text-center w-24">Atende</th>
                    <th className="border border-gray-300 p-2 text-center w-24">Não Atende</th>
                  </tr>
                </thead>
                <tbody>
                  {sa.rubrica?.criterios?.map((crit, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-2 font-medium">
                        {crit.criterio}
                        <span className="text-xs text-gray-500 ml-1">(Peso: {crit.peso})</span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-[#004b8d]">
                        {crit.capacidadeAssociada}
                      </td>
                      <td className="border border-gray-300 p-2 text-xs text-gray-600">
                        {crit.descritores?.atende}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto"></div>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pontuação e Feedback */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border border-gray-300 rounded p-3">
                <strong className="text-sm">Pontuação Final (0-10):</strong>
                <div className="border-b-2 border-gray-400 mt-2 h-8 flex items-end justify-center text-2xl font-bold text-[#004b8d]"></div>
              </div>
              <div className="border border-gray-300 rounded p-3">
                <strong className="text-sm">Feedback do Docente:</strong>
                <div className="border border-gray-300 mt-2 h-20 rounded"></div>
              </div>
            </div>

            {/* Assinatura */}
            <div className="mt-6 flex justify-between">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 w-48 pt-1">
                  <span className="text-xs text-gray-600">Assinatura do Docente</span>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 w-48 pt-1">
                  <span className="text-xs text-gray-600">Assinatura do Estudante</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botões de navegação - não aparecem na impressão */}
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
          className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors"
        >
          <RotateCcw size={20} />
          Criar Nova SA
        </button>
      </div>
    </div>
  );
}
