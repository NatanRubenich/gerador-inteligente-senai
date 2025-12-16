import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Loader2, AlertCircle, Clock, FileText, Target, BookOpen, ClipboardList, PenLine, Plus, Trash2 } from 'lucide-react';
import { useProva } from '../../../context/ProvaContext';
import { 
  gerarSituacaoAprendizagem, 
  ESTRATEGIAS_PEDAGOGICAS, 
  NIVEIS_DIFICULDADE, 
  TIPOS_RUBRICA 
} from '../../../services/saService';

export default function Step3GerarSA() {
  const { 
    dadosProva, 
    prevStep, 
    nextStep, 
    termoCapacidade,
    setSituacaoAprendizagemGerada,
    situacaoAprendizagemGerada,
    apiConfigured
  } = useProva();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cargaHoraria, setCargaHoraria] = useState(20);
  const [tema, setTema] = useState(dadosProva.assunto || '');
  const [contextoAdicional, setContextoAdicional] = useState('');
  const [estrategiaPedagogica, setEstrategiaPedagogica] = useState('Projeto');
  const [nivelDificuldade, setNivelDificuldade] = useState('intermediario');
  const [tipoRubrica, setTipoRubrica] = useState('gradual');
  const [modoManual, setModoManual] = useState(false);
  
  // Estado para criação manual
  const [saManual, setSaManual] = useState({
    titulo: '',
    contextualizacao: '',
    desafio: '',
    resultados_esperados: '',
    etapas: [{ nome: '', descricao: '', duracao: '' }],
    criterios_rubrica: [{ descricao: '', peso: 1 }]
  });

  // Preparar capacidades para exibição
  const capacidadesSelecionadas = dadosProva.capacidades.map(cap => ({
    codigo: cap.codigo,
    descricao: cap.descricao
  }));

  const handleGerarSA = async () => {
    if (!tema.trim()) {
      setError('Por favor, informe o tema/assunto da Situação de Aprendizagem.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sa = await gerarSituacaoAprendizagem({
        curso: dadosProva.curso,
        unidadeCurricular: dadosProva.unidadeCurricular,
        capacidades: capacidadesSelecionadas,
        cargaHoraria,
        tema,
        contextoAdicional,
        termoCapacidade,
        estrategiaPedagogica,
        nivelDificuldade,
        tipoRubrica
      });

      setSituacaoAprendizagemGerada({
        ...sa,
        docente: dadosProva.professor,
        turma: dadosProva.turma,
        data: dadosProva.data
      });

    } catch (err) {
      console.error('Erro ao gerar SA:', err);
      setError(err.message || 'Erro ao gerar Situação de Aprendizagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProximo = () => {
    if (situacaoAprendizagemGerada) {
      nextStep();
    }
  };

  // Funções para criação manual
  const handleSalvarManual = () => {
    if (!saManual.titulo.trim() || !saManual.contextualizacao.trim() || !saManual.desafio.trim()) {
      setError('Preencha o título, contextualização e desafio.');
      return;
    }

    const saCompleta = {
      titulo: saManual.titulo,
      curso: dadosProva.curso,
      unidadeCurricular: dadosProva.unidadeCurricular,
      docente: dadosProva.professor,
      turma: dadosProva.turma,
      data: dadosProva.data,
      cargaHoraria,
      estrategiaPedagogica,
      capacidades: capacidadesSelecionadas,
      contextualizacao: saManual.contextualizacao,
      desafio: saManual.desafio,
      resultados_esperados: saManual.resultados_esperados,
      etapas: saManual.etapas.filter(e => e.nome.trim()),
      rubrica: {
        criterios: saManual.criterios_rubrica.filter(c => c.descricao.trim()).map(c => ({
          ...c,
          capacidade: capacidadesSelecionadas[0]?.codigo || 'C1'
        }))
      }
    };

    setSituacaoAprendizagemGerada(saCompleta);
    nextStep();
  };

  const adicionarEtapa = () => {
    setSaManual(prev => ({
      ...prev,
      etapas: [...prev.etapas, { nome: '', descricao: '', duracao: '' }]
    }));
  };

  const removerEtapa = (idx) => {
    if (saManual.etapas.length > 1) {
      setSaManual(prev => ({
        ...prev,
        etapas: prev.etapas.filter((_, i) => i !== idx)
      }));
    }
  };

  const atualizarEtapa = (idx, campo, valor) => {
    setSaManual(prev => ({
      ...prev,
      etapas: prev.etapas.map((e, i) => i === idx ? { ...e, [campo]: valor } : e)
    }));
  };

  const adicionarCriterio = () => {
    setSaManual(prev => ({
      ...prev,
      criterios_rubrica: [...prev.criterios_rubrica, { descricao: '', peso: 1 }]
    }));
  };

  const removerCriterio = (idx) => {
    if (saManual.criterios_rubrica.length > 1) {
      setSaManual(prev => ({
        ...prev,
        criterios_rubrica: prev.criterios_rubrica.filter((_, i) => i !== idx)
      }));
    }
  };

  const atualizarCriterio = (idx, campo, valor) => {
    setSaManual(prev => ({
      ...prev,
      criterios_rubrica: prev.criterios_rubrica.map((c, i) => i === idx ? { ...c, [campo]: valor } : c)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FileText className="text-[#004b8d]" />
          Configurar Situação de Aprendizagem
        </h2>

        {/* Resumo dos dados */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Dados da SA</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Curso:</span>
              <span className="ml-2 font-medium">{dadosProva.curso}</span>
            </div>
            <div>
              <span className="text-gray-500">Unidade Curricular:</span>
              <span className="ml-2 font-medium">{dadosProva.unidadeCurricular}</span>
            </div>
            <div>
              <span className="text-gray-500">Docente:</span>
              <span className="ml-2 font-medium">{dadosProva.professor}</span>
            </div>
            <div>
              <span className="text-gray-500">Turma:</span>
              <span className="ml-2 font-medium">{dadosProva.turma}</span>
            </div>
          </div>
        </div>

        {/* Capacidades selecionadas */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-[#004b8d] mb-3 flex items-center gap-2">
            <Target size={18} />
            {termoCapacidade}s a Desenvolver ({capacidadesSelecionadas.length})
          </h3>
          <ul className="space-y-2 text-sm">
            {capacidadesSelecionadas.map((cap, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-[#004b8d] text-white text-xs px-2 py-0.5 rounded font-medium">
                  C{index + 1}
                </span>
                <span className="text-gray-700">
                  <strong>{cap.codigo}:</strong> {cap.descricao}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle IA / Manual */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setModoManual(false)}
            className={`flex-1 px-4 py-2 rounded-md text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
              !modoManual ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sparkles size={18} />
            Gerar com IA
          </button>
          <button
            onClick={() => setModoManual(true)}
            className={`flex-1 px-4 py-2 rounded-md text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
              modoManual ? 'bg-white text-[#004b8d] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <PenLine size={18} />
            Criar Manualmente
          </button>
        </div>

        {/* Configurações da SA - Modo IA */}
        {!modoManual && (
        <div className="space-y-5 mb-6">
          {/* Linha 1: Tema e Carga Horária */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen size={16} className="inline mr-1" />
                Tema/Assunto Principal *
              </label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Desenvolvimento de API RESTful, Instalação elétrica residencial..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Carga Horária (h)
              </label>
              <input
                type="number"
                min="4"
                max="200"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(parseInt(e.target.value) || 20)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>
          </div>

          {/* Linha 2: Estratégia, Nível e Tipo de Rubrica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estratégia Pedagógica
              </label>
              <select
                value={estrategiaPedagogica}
                onChange={(e) => setEstrategiaPedagogica(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              >
                {ESTRATEGIAS_PEDAGOGICAS.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Dificuldade
              </label>
              <select
                value={nivelDificuldade}
                onChange={(e) => setNivelDificuldade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              >
                {NIVEIS_DIFICULDADE.map(nivel => (
                  <option key={nivel.id} value={nivel.id}>{nivel.nome}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {NIVEIS_DIFICULDADE.find(n => n.id === nivelDificuldade)?.descricao}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClipboardList size={16} className="inline mr-1" />
                Tipo de Rubrica
              </label>
              <select
                value={tipoRubrica}
                onChange={(e) => setTipoRubrica(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              >
                {TIPOS_RUBRICA.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {TIPOS_RUBRICA.find(t => t.id === tipoRubrica)?.descricao}
              </p>
            </div>
          </div>

          {/* Contexto Adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientações Adicionais (opcional)
            </label>
            <textarea
              value={contextoAdicional}
              onChange={(e) => setContextoAdicional(e.target.value)}
              placeholder="Informações adicionais: recursos disponíveis, nível da turma, projetos anteriores, requisitos específicos..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
            />
          </div>
        </div>
        )}

        {/* Modo Manual */}
        {modoManual && (
          <div className="space-y-5 mb-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título da SA *</label>
              <input
                type="text"
                value={saManual.titulo}
                onChange={(e) => setSaManual(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Desenvolvimento de Sistema Web para Gestão de Estoque"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>

            {/* Contextualização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contextualização *</label>
              <textarea
                value={saManual.contextualizacao}
                onChange={(e) => setSaManual(prev => ({ ...prev, contextualizacao: e.target.value }))}
                placeholder="Descreva a situação-problema do mundo do trabalho..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>

            {/* Desafio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desafio *</label>
              <textarea
                value={saManual.desafio}
                onChange={(e) => setSaManual(prev => ({ ...prev, desafio: e.target.value }))}
                placeholder="Descreva o desafio proposto aos estudantes..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>

            {/* Resultados Esperados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resultados Esperados</label>
              <textarea
                value={saManual.resultados_esperados}
                onChange={(e) => setSaManual(prev => ({ ...prev, resultados_esperados: e.target.value }))}
                placeholder="Descreva os resultados e entregas esperados..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b8d] focus:border-[#004b8d]"
              />
            </div>

            {/* Etapas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Etapas</label>
                <button onClick={adicionarEtapa} className="text-sm text-[#004b8d] hover:text-blue-700 flex items-center gap-1">
                  <Plus size={14} /> Adicionar Etapa
                </button>
              </div>
              {saManual.etapas.map((etapa, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Etapa {idx + 1}</span>
                    {saManual.etapas.length > 1 && (
                      <button onClick={() => removerEtapa(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={etapa.nome}
                      onChange={(e) => atualizarEtapa(idx, 'nome', e.target.value)}
                      placeholder="Nome da etapa"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={etapa.duracao}
                      onChange={(e) => atualizarEtapa(idx, 'duracao', e.target.value)}
                      placeholder="Duração (ex: 4h)"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={etapa.descricao}
                      onChange={(e) => atualizarEtapa(idx, 'descricao', e.target.value)}
                      placeholder="Descrição"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Critérios da Rubrica */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Critérios da Rubrica</label>
                <button onClick={adicionarCriterio} className="text-sm text-[#004b8d] hover:text-blue-700 flex items-center gap-1">
                  <Plus size={14} /> Adicionar Critério
                </button>
              </div>
              {saManual.criterios_rubrica.map((criterio, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={criterio.descricao}
                    onChange={(e) => atualizarCriterio(idx, 'descricao', e.target.value)}
                    placeholder="Descrição do critério"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={criterio.peso}
                    onChange={(e) => atualizarCriterio(idx, 'peso', Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    min="1"
                    max="5"
                  />
                  {saManual.criterios_rubrica.length > 1 && (
                    <button onClick={() => removerCriterio(idx)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Erro ao gerar SA</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Aviso se API não configurada */}
        {!apiConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Atenção:</strong> A API Groq não está configurada. 
              Configure a variável VITE_GROQ_API_KEY no GitHub Secrets para usar a geração com IA.
            </p>
          </div>
        )}

        {/* Preview da SA gerada */}
        {situacaoAprendizagemGerada && (
          <>
            {/* Aviso de IA */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-800 font-medium">⚠️ Conteúdo gerado por Inteligência Artificial</p>
                  <p className="text-amber-700 text-sm mt-1">
                    A Situação de Aprendizagem abaixo foi gerada por IA e pode conter erros, imprecisões ou informações desatualizadas. 
                    <strong className="block mt-1">É fundamental revisar todo o conteúdo cuidadosamente antes de utilizá-lo.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">
                ✓ Situação de Aprendizagem Gerada
              </h3>
            <p className="text-green-700 font-medium text-lg">{situacaoAprendizagemGerada.titulo}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Atividades:</span>
                <span className="ml-1 font-medium">{situacaoAprendizagemGerada.atividades?.length || 0}</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Carga:</span>
                <span className="ml-1 font-medium">{situacaoAprendizagemGerada.cargaHoraria}h</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Critérios:</span>
                <span className="ml-1 font-medium">{situacaoAprendizagemGerada.rubrica?.criterios?.length || 0}</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Rubrica:</span>
                <span className="ml-1 font-medium capitalize">{situacaoAprendizagemGerada.tipoRubrica}</span>
              </div>
            </div>
          </div>
          </>
        )}

        {/* Botões */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
            Voltar
          </button>

          <div className="flex gap-3">
            {!modoManual ? (
              <button
                onClick={handleGerarSA}
                disabled={isLoading || !apiConfigured}
                className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Gerando SA...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {situacaoAprendizagemGerada ? 'Gerar Novamente' : 'Gerar com IA'}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSalvarManual}
                className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors"
              >
                <PenLine size={20} />
                Salvar SA
              </button>
            )}

            {situacaoAprendizagemGerada && !modoManual && (
              <button
                onClick={handleProximo}
                className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors"
              >
                Visualizar SA
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
