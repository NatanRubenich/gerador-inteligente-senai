import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckSquare, Square, Lightbulb } from 'lucide-react';
import { useProva, TIPO_AVALIACAO } from '../../context/ProvaContext';
import { cursos } from '../../data/cursos';
import { getSugestoesTemas } from '../../services/ragService';

export default function Step2Capacidades() {
  const { 
    dadosProva, 
    updateDadosProva, 
    nextStep, 
    prevStep, 
    termoCapacidade,
    tipoAvaliacao
  } = useProva();
  
  const isAvaliacaoPratica = tipoAvaliacao === TIPO_AVALIACAO.PRATICA;
  const isSituacaoAprendizagem = tipoAvaliacao === TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM;
  const isAvaliacaoObjetiva = tipoAvaliacao === TIPO_AVALIACAO.OBJETIVA;

  // Função para calcular distribuição de questões por dificuldade
  const calcularDistribuicao = (quantidade, dificuldades) => {
    if (!dificuldades || dificuldades.length === 0 || !quantidade) return '';
    
    const numDificuldades = dificuldades.length;
    const base = Math.floor(quantidade / numDificuldades);
    const resto = quantidade % numDificuldades;
    
    const distribuicao = dificuldades.map((dif, idx) => {
      const qtd = base + (idx < resto ? 1 : 0);
      return `${qtd} ${dif}`;
    });
    
    return distribuicao.join(', ');
  };
  
  const [errors, setErrors] = useState({});
  const [sugestoes, setSugestoes] = useState([]);

  // Obter capacidades da unidade curricular selecionada
  const cursoSelecionado = cursos.find(c => c.id === dadosProva.cursoId);
  const ucSelecionada = cursoSelecionado?.unidadesCurriculares.find(
    uc => uc.nome === dadosProva.unidadeCurricular
  );
  const capacidadesDisponiveis = ucSelecionada?.capacidades || [];

  // Buscar sugestões de temas do RAG baseado na UC
  useEffect(() => {
    if (dadosProva.unidadeCurricular) {
      const sugestoesRAG = getSugestoesTemas(dadosProva.unidadeCurricular);
      setSugestoes(sugestoesRAG);
    }
  }, [dadosProva.unidadeCurricular]);

  const toggleCapacidade = (capacidade) => {
    const isSelected = dadosProva.capacidades.some(c => c.codigo === capacidade.codigo);
    
    if (isSelected) {
      updateDadosProva({
        capacidades: dadosProva.capacidades.filter(c => c.codigo !== capacidade.codigo)
      });
    } else {
      updateDadosProva({
        capacidades: [...dadosProva.capacidades, capacidade]
      });
    }
  };

  const selectAll = () => {
    updateDadosProva({ capacidades: [...capacidadesDisponiveis] });
  };

  const deselectAll = () => {
    updateDadosProva({ capacidades: [] });
  };

  const validate = () => {
    const newErrors = {};
    
    if (dadosProva.capacidades.length === 0) {
      newErrors.capacidades = `Selecione pelo menos uma ${termoCapacidade.toLowerCase()}`;
    }
    
    // Assunto é obrigatório apenas para avaliação objetiva
    if (isAvaliacaoObjetiva && !dadosProva.assunto.trim()) {
      newErrors.assunto = 'Informe o assunto da prova';
    }
    
    // Quantidade de questões só é obrigatória para avaliação objetiva
    if (isAvaliacaoObjetiva && (!dadosProva.quantidade || dadosProva.quantidade < 1)) {
      newErrors.quantidade = 'Informe a quantidade de questões';
    }
    
    // Pelo menos uma dificuldade deve ser selecionada (apenas para objetiva)
    if (isAvaliacaoObjetiva && (!dadosProva.dificuldades || dadosProva.dificuldades.length === 0)) {
      newErrors.dificuldades = 'Selecione pelo menos um nível de dificuldade';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <CheckSquare className="text-[#004b8d]" />
          Selecionar {termoCapacidade}s
        </h2>

        <div className="space-y-6">
          {/* Lista de Capacidades */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                {termoCapacidade}s da Unidade Curricular <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Selecionar todas
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpar seleção
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto border rounded-lg p-4">
              {capacidadesDisponiveis.map((cap) => {
                const isSelected = dadosProva.capacidades.some(c => c.codigo === cap.codigo);
                return (
                  <button
                    key={cap.codigo}
                    onClick={() => toggleCapacidade(cap)}
                    className={`
                      w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all
                      ${isSelected 
                        ? 'bg-blue-50 border-2 border-[#004b8d]' 
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                      }
                    `}
                  >
                    {isSelected ? (
                      <CheckSquare className="text-[#004b8d] flex-shrink-0 mt-0.5" size={20} />
                    ) : (
                      <Square className="text-gray-400 flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <div>
                      <span className={`font-semibold ${isSelected ? 'text-[#004b8d]' : 'text-gray-700'}`}>
                        {cap.codigo}:
                      </span>
                      <span className={`ml-2 ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                        {cap.descricao}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {errors.capacidades && (
              <p className="mt-2 text-sm text-red-500">{errors.capacidades}</p>
            )}
            
            <p className="mt-2 text-sm text-gray-500">
              {dadosProva.capacidades.length} de {capacidadesDisponiveis.length} selecionada(s)
            </p>
          </div>

          {/* Campos específicos para Avaliação Objetiva */}
          {isAvaliacaoObjetiva && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantidade de Questões */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantidade de Questões <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={dadosProva.quantidade}
                    onChange={(e) => updateDadosProva({ quantidade: parseInt(e.target.value) || 0 })}
                    className={`
                      w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                      ${errors.quantidade ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {errors.quantidade && <p className="mt-1 text-sm text-red-500">{errors.quantidade}</p>}
                </div>

                {/* Níveis de Dificuldade - Checkboxes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Níveis de Dificuldade <span className="text-red-500">*</span>
                  </label>
                  <div className={`
                    p-4 border rounded-lg space-y-3
                    ${errors.dificuldades ? 'border-red-500' : 'border-gray-300'}
                  `}>
                    {['Fácil', 'Médio', 'Difícil'].map((nivel) => {
                      const isChecked = dadosProva.dificuldades?.includes(nivel);
                      return (
                        <label 
                          key={nivel} 
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newDificuldades = e.target.checked
                                ? [...(dadosProva.dificuldades || []), nivel]
                                : (dadosProva.dificuldades || []).filter(d => d !== nivel);
                              updateDadosProva({ dificuldades: newDificuldades });
                            }}
                            className="w-5 h-5 text-[#004b8d] border-gray-300 rounded focus:ring-[#004b8d]"
                          />
                          <span className={`font-medium ${isChecked ? 'text-[#004b8d]' : 'text-gray-700'}`}>
                            {nivel}
                          </span>
                          <span className="text-xs text-gray-500">
                            {nivel === 'Fácil' && '(conceitos básicos)'}
                            {nivel === 'Médio' && '(aplicação prática)'}
                            {nivel === 'Difícil' && '(análise e síntese)'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.dificuldades && <p className="mt-1 text-sm text-red-500">{errors.dificuldades}</p>}
                  {dadosProva.dificuldades?.length > 0 && dadosProva.quantidade > 0 && (
                    <p className="mt-2 text-sm text-blue-600">
                      Distribuição: {calcularDistribuicao(dadosProva.quantidade, dadosProva.dificuldades)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Assunto - Obrigatório apenas para Objetiva */}
          {isAvaliacaoObjetiva && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assunto / Conteúdo da Prova <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={dadosProva.assunto}
                  onChange={(e) => updateDadosProva({ assunto: e.target.value })}
                  placeholder="Descreva os assuntos que serão abordados na prova..."
                  rows={3}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none
                    ${errors.assunto ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.assunto && <p className="mt-1 text-sm text-red-500">{errors.assunto}</p>}
              </div>

              {/* Sugestões de Temas do RAG */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                    <Lightbulb size={18} />
                    Sugestões de Temas (RAG SENAI)
                  </h3>
                  <span className="text-xs text-amber-600">Clique para adicionar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sugestoes.map((sugestao, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const novoAssunto = dadosProva.assunto 
                          ? `${dadosProva.assunto}, ${sugestao}`
                          : sugestao;
                        updateDadosProva({ assunto: novoAssunto });
                      }}
                      className="px-3 py-1 bg-white border border-amber-300 rounded-full text-sm text-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      + {sugestao}
                    </button>
                  ))}
                </div>
                {sugestoes.length === 0 && (
                  <p className="text-sm text-amber-600 italic">
                    Selecione uma unidade curricular para ver sugestões de temas.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Info para Avaliação Prática */}
          {isAvaliacaoPratica && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Avaliação Prática:</strong> O contexto específico e tempo de execução serão definidos na próxima etapa.
              </p>
            </div>
          )}

          {/* Info para Situação de Aprendizagem */}
          {isSituacaoAprendizagem && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Situação de Aprendizagem:</strong> O tema, carga horária e contexto adicional serão definidos na próxima etapa.
              </p>
            </div>
          )}
        </div>

        {/* Botões de Navegação */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {isAvaliacaoObjetiva && 'Próximo: Gerar Questões'}
            {isAvaliacaoPratica && 'Próximo: Configurar Avaliação'}
            {isSituacaoAprendizagem && 'Próximo: Configurar SA'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
