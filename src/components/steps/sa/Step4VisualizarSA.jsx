import { useState, useRef } from 'react';
import { ChevronLeft, Printer, RotateCcw, Clock, Target, CheckSquare, BookOpen, Wrench, Brain, FileText, AlertTriangle, Award, Edit3, Save, X, Copy, Check } from 'lucide-react';
import { useProva } from '../../../context/ProvaContext';

export default function Step4VisualizarSA() {
  const { situacaoAprendizagemGerada, setSituacaoAprendizagemGerada, prevStep, resetProva, termoCapacidade, dadosProva } = useProva();
  const printRef = useRef();
  const [abaAtiva, setAbaAtiva] = useState('sa'); // 'sa' ou 'rubrica'
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  // Funções de edição
  const handleStartEdit = () => {
    // Deep clone para edição
    setEditData(JSON.parse(JSON.stringify(situacaoAprendizagemGerada)));
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    setSituacaoAprendizagemGerada(editData);
    setEditMode(false);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(null);
  };

  const updateField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path, value) => {
    setEditData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    setEditData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData[arrayName]) newData[arrayName] = [];
      if (!newData[arrayName][index]) newData[arrayName][index] = {};
      newData[arrayName][index][field] = value;
      return newData;
    });
  };

  const updateRubricaCriterio = (index, field, value) => {
    setEditData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData.rubrica) newData.rubrica = { criterios: [] };
      if (!newData.rubrica.criterios) newData.rubrica.criterios = [];
      if (!newData.rubrica.criterios[index]) newData.rubrica.criterios[index] = {};
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!newData.rubrica.criterios[index][parent]) newData.rubrica.criterios[index][parent] = {};
        newData.rubrica.criterios[index][parent][child] = value;
      } else {
        newData.rubrica.criterios[index][field] = value;
      }
      return newData;
    });
  };

  // Função para copiar seção
  const copySection = async (sectionName, content) => {
    try {
      let textToCopy = '';
      
      switch (sectionName) {
        case 'titulo':
          textToCopy = situacaoAprendizagemGerada.titulo;
          break;
        case 'capacidades':
          textToCopy = Object.entries(situacaoAprendizagemGerada.capacidades || {})
            .map(([cod, cap]) => `${cod} - ${cap.codigo}: ${cap.descricao}`)
            .join('\n');
          break;
        case 'contexto':
          textToCopy = situacaoAprendizagemGerada.contexto || situacaoAprendizagemGerada.contextualizacao;
          break;
        case 'desafio':
          textToCopy = situacaoAprendizagemGerada.desafio;
          break;
        case 'resultado':
          textToCopy = situacaoAprendizagemGerada.resultado;
          break;
        case 'atividades':
          textToCopy = situacaoAprendizagemGerada.atividades
            ?.map((a, i) => `Atividade ${a.numero || i + 1}: ${a.titulo}\n${a.descricao}\nDuração: ${a.duracao}`)
            .join('\n\n');
          break;
        case 'recursos':
          textToCopy = situacaoAprendizagemGerada.recursosNecessarios?.join('\n');
          break;
        case 'conhecimentos':
          textToCopy = situacaoAprendizagemGerada.conhecimentosMobilizados?.join('\n');
          break;
        case 'rubrica':
          textToCopy = situacaoAprendizagemGerada.rubrica?.criterios
            ?.map(c => `${c.criterio} (Peso: ${c.peso}) - ${c.capacidadeAssociada}`)
            .join('\n');
          break;
        default:
          textToCopy = content || '';
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Componente de botão copiar
  const CopyButton = ({ section, className = '' }) => (
    <button
      onClick={() => copySection(section)}
      className={`p-1 rounded hover:bg-white/20 transition-colors ${className}`}
      title="Copiar seção"
    >
      {copiedSection === section ? (
        <Check size={14} className="text-green-300" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );

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
                className={`px-4 py-2 rounded-md text-base font-semibold transition-colors ${
                  abaAtiva === 'sa' ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText size={18} className="inline mr-1" />
                SA
              </button>
              <button
                onClick={() => setAbaAtiva('rubrica')}
                className={`px-4 py-2 rounded-md text-base font-semibold transition-colors ${
                  abaAtiva === 'rubrica' ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CheckSquare size={18} className="inline mr-1" />
                Rubrica
              </button>
            </div>

            {!editMode ? (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 size={18} />
                Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </>
            )}

            <button
              onClick={handlePrint}
              disabled={editMode}
              className="flex items-center gap-2 px-4 py-2 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors disabled:opacity-50"
            >
              <Printer size={18} />
              Imprimir
            </button>

            <button
              onClick={resetProva}
              disabled={editMode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={18} />
              Nova SA
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {editMode && editData && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print max-h-[70vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-0 bg-white pb-2 border-b">
            <Edit3 size={20} className="text-blue-600" />
            Editar {abaAtiva === 'sa' ? 'Situação de Aprendizagem' : 'Rubrica de Avaliação'}
          </h3>
          
          {abaAtiva === 'sa' ? (
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={editData.titulo || ''}
                  onChange={(e) => updateField('titulo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contexto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contexto</label>
                <textarea
                  value={editData.contexto || editData.contextualizacao || ''}
                  onChange={(e) => {
                    updateField('contexto', e.target.value);
                    updateField('contextualizacao', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>

              {/* Desafio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desafio</label>
                <textarea
                  value={editData.desafio || ''}
                  onChange={(e) => updateField('desafio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>

              {/* Resultado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado (Entrega Final)</label>
                <textarea
                  value={editData.resultado || ''}
                  onChange={(e) => updateField('resultado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              {/* Atividades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Atividades</label>
                <div className="space-y-3">
                  {editData.atividades?.map((atividade, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={atividade.titulo || ''}
                          onChange={(e) => updateArrayItem('atividades', index, 'titulo', e.target.value)}
                          placeholder="Título da atividade"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={atividade.duracao || ''}
                          onChange={(e) => updateArrayItem('atividades', index, 'duracao', e.target.value)}
                          placeholder="Duração"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <textarea
                        value={atividade.descricao || ''}
                        onChange={(e) => updateArrayItem('atividades', index, 'descricao', e.target.value)}
                        placeholder="Descrição da atividade"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recursos Necessários */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recursos Necessários (um por linha)</label>
                <textarea
                  value={editData.recursosNecessarios?.join('\n') || ''}
                  onChange={(e) => updateField('recursosNecessarios', e.target.value.split('\n').filter(r => r.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>

              {/* Conhecimentos Mobilizados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conhecimentos Mobilizados (um por linha)</label>
                <textarea
                  value={editData.conhecimentosMobilizados?.join('\n') || ''}
                  onChange={(e) => updateField('conhecimentosMobilizados', e.target.value.split('\n').filter(c => c.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
            </div>
          ) : (
            /* Edição da Rubrica */
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Edite os critérios da rubrica abaixo. Cada critério está associado a uma capacidade.
              </p>
              
              {editData.rubrica?.criterios?.map((criterio, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#004b8d] text-white text-xs px-2 py-1 rounded">
                      {criterio.capacidadeAssociada}
                    </span>
                    <span className="text-sm text-gray-500">Peso: {criterio.peso}</span>
                  </div>
                  
                  {/* Critério */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Critério</label>
                    <input
                      type="text"
                      value={criterio.criterio || ''}
                      onChange={(e) => updateRubricaCriterio(index, 'criterio', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Descritores - Rubrica Gradual */}
                  {editData.rubrica?.tipo === 'gradual' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Abaixo do Básico</label>
                        <textarea
                          value={criterio.descritores?.abaixoDoBasico || ''}
                          onChange={(e) => updateRubricaCriterio(index, 'descritores.abaixoDoBasico', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Básico</label>
                        <textarea
                          value={criterio.descritores?.basico || ''}
                          onChange={(e) => updateRubricaCriterio(index, 'descritores.basico', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Adequado</label>
                        <textarea
                          value={criterio.descritores?.adequado || ''}
                          onChange={(e) => updateRubricaCriterio(index, 'descritores.adequado', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Avançado</label>
                        <textarea
                          value={criterio.descritores?.avancado || ''}
                          onChange={(e) => updateRubricaCriterio(index, 'descritores.avancado', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Descritores - Rubrica Dicotômica */}
                  {editData.rubrica?.tipo === 'dicotomica' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Descritor (Atende)</label>
                      <textarea
                        value={criterio.descritores?.atende || ''}
                        onChange={(e) => updateRubricaCriterio(index, 'descritores.atende', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documento da SA */}
      {abaAtiva === 'sa' && !editMode && (
        <div ref={printRef} className="bg-white rounded-xl shadow-lg prova-container" id="sa-print">
          {/* Cabeçalho */}
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              <tr>
                <td rowSpan="4" className="border border-black p-2 w-32 text-center align-middle">
                  <img src={`${import.meta.env.BASE_URL}senai.png`} alt="SENAI" className="w-full max-w-[80px] mx-auto mb-1" />
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
          <div className="mt-4 bg-[#004b8d] text-white p-3 text-center relative">
            <h1 className="text-lg font-bold">{sa.titulo}</h1>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 no-print">
              <CopyButton section="titulo" />
            </div>
          </div>

          {/* Capacidades a Desenvolver */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={16} />
                {termoCapacidade.toUpperCase()}S A DESENVOLVER
              </div>
              <div className="no-print">
                <CopyButton section="capacidades" />
              </div>
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
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                CONTEXTO
              </div>
              <div className="no-print">
                <CopyButton section="contexto" />
              </div>
            </div>
            <div className="border border-black border-t-0 p-3">
              <p className="text-sm text-gray-700 text-justify leading-relaxed">
                {sa.contexto || sa.contextualizacao}
              </p>
            </div>
          </div>

          {/* DESAFIO */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} />
                DESAFIO
              </div>
              <div className="no-print">
                <CopyButton section="desafio" />
              </div>
            </div>
            <div className="border border-black border-t-0 p-3">
              <p className="text-sm text-gray-700 text-justify leading-relaxed">
                {sa.desafio}
              </p>
            </div>
          </div>

          {/* RESULTADO (Entrega Final) */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={16} />
                RESULTADO (ENTREGA FINAL)
              </div>
              <div className="no-print">
                <CopyButton section="resultado" />
              </div>
            </div>
            <div className="border border-black border-t-0 p-3">
              <p className="text-sm text-gray-700 text-justify leading-relaxed">
                {sa.resultado}
              </p>
            </div>
          </div>

          {/* Atividades */}
          <div className="mt-4">
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench size={16} />
                ATIVIDADES
              </div>
              <div className="no-print">
                <CopyButton section="atividades" />
              </div>
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
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench size={16} />
                RECURSOS NECESSÁRIOS
              </div>
              <div className="no-print">
                <CopyButton section="recursos" />
              </div>
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
            <div className="bg-[#004b8d] text-white font-bold py-2 px-3 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={16} />
                CONHECIMENTOS MOBILIZADOS
              </div>
              <div className="no-print">
                <CopyButton section="conhecimentos" />
              </div>
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
      {abaAtiva === 'rubrica' && !editMode && (
        <div className="bg-white rounded-xl shadow-lg prova-container" id="rubrica-print">
          {/* Cabeçalho da Rubrica */}
          <div className="bg-[#004b8d] text-white p-4 rounded-t-xl relative">
            <h1 className="text-lg font-bold text-center">FICHA DE AVALIAÇÃO - {sa.tipoRubrica === 'gradual' ? 'RUBRICA GRADUAL' : 'RUBRICA DICOTÔMICA'}</h1>
            <p className="text-center text-blue-200 text-sm mt-1">{sa.titulo}</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 no-print">
              <CopyButton section="rubrica" />
            </div>
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
            <div className="mt-16 flex justify-between px-8">
              <div className="text-center">
                <div className="border-t-2 border-gray-700 w-64 pt-2">
                  <span className="text-sm text-gray-700 font-medium">Assinatura do Docente</span>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-700 w-64 pt-2">
                  <span className="text-sm text-gray-700 font-medium">Assinatura do Estudante</span>
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
