import { useState } from 'react';
import { useProva } from '../../../context/ProvaContext';
import { Sparkles, Loader2, AlertCircle, CheckCircle, PenLine, Plus, Trash2 } from 'lucide-react';
import { gerarAvaliacaoPratica } from '../../../services/llmService';

export default function Step3GerarPratica() {
  const { 
    dadosProva, 
    termoCapacidade,
    setAvaliacaoPraticaGerada,
    nextStep, 
    prevStep,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useProva();

  const [nivelCognitivo, setNivelCognitivo] = useState('Aplicar');
  const [tempoExecucao, setTempoExecucao] = useState(120);
  const [contextoAdicional, setContextoAdicional] = useState('');
  const [modoManual, setModoManual] = useState(false);
  
  // Estado para criação manual
  const [avaliacaoManual, setAvaliacaoManual] = useState({
    contextualizacao: '',
    desafio: '',
    atividades: [{ nome: '', tempo: 30, entregas: '', criterios: [{ descricao: '', peso: 1 }] }]
  });

  const handleGerarAvaliacao = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dados = {
        ...dadosProva,
        termoCapacidade: termoCapacidade || 'Capacidade',
        nivelCognitivo,
        tempoExecucao,
        contextoAdicional
      };

      const resultado = await gerarAvaliacaoPratica(dados);
      setAvaliacaoPraticaGerada(resultado);
      nextStep();
    } catch (err) {
      setError(err.message || 'Erro ao gerar avaliação prática');
    } finally {
      setIsLoading(false);
    }
  };

  const níveisCognitivos = [
    { value: 'Lembrar', desc: 'Recordar informações, fatos e conceitos' },
    { value: 'Entender', desc: 'Compreender e interpretar significados' },
    { value: 'Aplicar', desc: 'Usar conhecimento em situações novas' },
    { value: 'Analisar', desc: 'Dividir em partes e identificar relações' },
    { value: 'Avaliar', desc: 'Julgar com base em critérios e padrões' },
    { value: 'Criar', desc: 'Produzir algo novo ou reorganizar elementos' }
  ];

  // Funções para criação manual
  const handleSalvarManual = () => {
    if (!avaliacaoManual.contextualizacao.trim() || !avaliacaoManual.desafio.trim()) {
      setError('Preencha a contextualização e o desafio.');
      return;
    }

    const listaVerificacao = avaliacaoManual.atividades.map((ativ, idx) => ({
      atividade: ativ.nome || `Atividade ${idx + 1}`,
      tempo_estimado: `${ativ.tempo} minutos`,
      criterios: ativ.criterios.map(c => ({
        descricao: c.descricao,
        peso: c.peso,
        capacidade: dadosProva.capacidades[0]?.codigo || 'C1'
      }))
    }));

    const avaliacaoCompleta = {
      curso: dadosProva.curso,
      unidade_curricular: dadosProva.unidadeCurricular,
      turma: dadosProva.turma,
      docente: dadosProva.professor,
      data: dadosProva.data,
      capacidades: dadosProva.capacidades.map(c => c.codigo || c),
      contextualizacao: avaliacaoManual.contextualizacao,
      desafio: avaliacaoManual.desafio,
      resultados_entregas: avaliacaoManual.atividades.map(a => ({
        atividade: a.nome,
        tempo: `${a.tempo} minutos`,
        entregas: a.entregas
      })),
      lista_verificacao: listaVerificacao
    };

    setAvaliacaoPraticaGerada(avaliacaoCompleta);
    nextStep();
  };

  const adicionarAtividade = () => {
    setAvaliacaoManual(prev => ({
      ...prev,
      atividades: [...prev.atividades, { nome: '', tempo: 30, entregas: '', criterios: [{ descricao: '', peso: 1 }] }]
    }));
  };

  const removerAtividade = (idx) => {
    if (avaliacaoManual.atividades.length > 1) {
      setAvaliacaoManual(prev => ({
        ...prev,
        atividades: prev.atividades.filter((_, i) => i !== idx)
      }));
    }
  };

  const atualizarAtividade = (idx, campo, valor) => {
    setAvaliacaoManual(prev => ({
      ...prev,
      atividades: prev.atividades.map((a, i) => i === idx ? { ...a, [campo]: valor } : a)
    }));
  };

  const adicionarCriterio = (atividadeIdx) => {
    setAvaliacaoManual(prev => ({
      ...prev,
      atividades: prev.atividades.map((a, i) => 
        i === atividadeIdx 
          ? { ...a, criterios: [...a.criterios, { descricao: '', peso: 1 }] }
          : a
      )
    }));
  };

  const removerCriterio = (atividadeIdx, criterioIdx) => {
    setAvaliacaoManual(prev => ({
      ...prev,
      atividades: prev.atividades.map((a, i) => 
        i === atividadeIdx && a.criterios.length > 1
          ? { ...a, criterios: a.criterios.filter((_, ci) => ci !== criterioIdx) }
          : a
      )
    }));
  };

  const atualizarCriterio = (atividadeIdx, criterioIdx, campo, valor) => {
    setAvaliacaoManual(prev => ({
      ...prev,
      atividades: prev.atividades.map((a, i) => 
        i === atividadeIdx 
          ? { ...a, criterios: a.criterios.map((c, ci) => ci === criterioIdx ? { ...c, [campo]: valor } : c) }
          : a
      )
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gerar Avaliação Prática</h2>
          <p className="text-gray-500 text-sm">Configure os parâmetros e gere a avaliação</p>
        </div>
      </div>

      {/* Toggle IA / Manual */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setModoManual(false)}
          className={`flex-1 px-4 py-2 rounded-md text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
            !modoManual ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Sparkles size={18} />
          Gerar com IA
        </button>
        <button
          onClick={() => setModoManual(true)}
          className={`flex-1 px-4 py-2 rounded-md text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
            modoManual ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <PenLine size={18} />
          Criar Manualmente
        </button>
      </div>

      {/* Resumo dos dados */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Resumo da Avaliação</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Curso:</span>
            <span className="ml-2 font-medium">{dadosProva.curso}</span>
          </div>
          <div>
            <span className="text-gray-500">UC:</span>
            <span className="ml-2 font-medium">{dadosProva.unidadeCurricular}</span>
          </div>
          <div>
            <span className="text-gray-500">Turma:</span>
            <span className="ml-2 font-medium">{dadosProva.turma}</span>
          </div>
          <div>
            <span className="text-gray-500">Professor:</span>
            <span className="ml-2 font-medium">{dadosProva.professor}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-gray-500 text-sm">Capacidades selecionadas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {dadosProva.capacidades.map((cap, idx) => (
              <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                {cap.codigo || cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modo IA */}
      {!modoManual && (
        <>
          {/* Configurações da avaliação prática */}
          <div className="space-y-6">
            {/* Nível Cognitivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível Cognitivo (Taxonomia de Bloom)
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {níveisCognitivos.map((nivel) => (
                  <button
                    key={nivel.value}
                    onClick={() => setNivelCognitivo(nivel.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      nivelCognitivo === nivel.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{nivel.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{nivel.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo de Execução */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de Execução (minutos)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="30"
                  max="240"
                  step="15"
                  value={tempoExecucao}
                  onChange={(e) => setTempoExecucao(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="w-20 text-center font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                  {tempoExecucao} min
                </span>
              </div>
            </div>

            {/* Contexto Adicional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Adicional / Assunto Específico (opcional)
              </label>
              <textarea
                value={contextoAdicional}
                onChange={(e) => setContextoAdicional(e.target.value)}
                placeholder="Ex: Desenvolvimento de um sistema de cadastro de clientes usando React e Node.js..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Descreva o contexto específico ou tema que deseja abordar na avaliação prática
              </p>
            </div>
          </div>

          {/* Info sobre estrutura */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-2">A avaliação prática será gerada com:</p>
                <ul className="space-y-1 text-orange-700">
                  <li>• <strong>Capacidades:</strong> Lista das capacidades avaliadas</li>
                  <li>• <strong>Contextualização:</strong> Situação-problema do mundo do trabalho</li>
                  <li>• <strong>Desafio:</strong> Descrição das atividades a serem realizadas</li>
                  <li>• <strong>Resultados e Entregas:</strong> Evidências esperadas com tempo estimado</li>
                  <li>• <strong>Lista de Verificação:</strong> Critérios de avaliação por atividade</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modo Manual */}
      {modoManual && (
        <div className="space-y-6">
          {/* Contextualização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contextualização *
            </label>
            <textarea
              value={avaliacaoManual.contextualizacao}
              onChange={(e) => setAvaliacaoManual(prev => ({ ...prev, contextualizacao: e.target.value }))}
              placeholder="Descreva a situação-problema do mundo do trabalho..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
            />
          </div>

          {/* Desafio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desafio *
            </label>
            <textarea
              value={avaliacaoManual.desafio}
              onChange={(e) => setAvaliacaoManual(prev => ({ ...prev, desafio: e.target.value }))}
              placeholder="Descreva as atividades a serem realizadas pelo estudante..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
            />
          </div>

          {/* Atividades */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Atividades e Critérios
              </label>
              <button
                onClick={adicionarAtividade}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
              >
                <Plus size={16} />
                Adicionar Atividade
              </button>
            </div>

            {avaliacaoManual.atividades.map((atividade, atividadeIdx) => (
              <div key={atividadeIdx} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Atividade {atividadeIdx + 1}</h4>
                  {avaliacaoManual.atividades.length > 1 && (
                    <button
                      onClick={() => removerAtividade(atividadeIdx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nome da Atividade</label>
                    <input
                      type="text"
                      value={atividade.nome}
                      onChange={(e) => atualizarAtividade(atividadeIdx, 'nome', e.target.value)}
                      placeholder="Ex: Configuração do ambiente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tempo (min)</label>
                    <input
                      type="number"
                      value={atividade.tempo}
                      onChange={(e) => atualizarAtividade(atividadeIdx, 'tempo', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1">Entregas Esperadas</label>
                  <input
                    type="text"
                    value={atividade.entregas}
                    onChange={(e) => atualizarAtividade(atividadeIdx, 'entregas', e.target.value)}
                    placeholder="Ex: Ambiente configurado e funcionando"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Critérios */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-600">Critérios de Avaliação</label>
                    <button
                      onClick={() => adicionarCriterio(atividadeIdx)}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      + Critério
                    </button>
                  </div>
                  {atividade.criterios.map((criterio, criterioIdx) => (
                    <div key={criterioIdx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={criterio.descricao}
                        onChange={(e) => atualizarCriterio(atividadeIdx, criterioIdx, 'descricao', e.target.value)}
                        placeholder="Descrição do critério"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        value={criterio.peso}
                        onChange={(e) => atualizarCriterio(atividadeIdx, criterioIdx, 'peso', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                        min="1"
                        max="5"
                      />
                      {atividade.criterios.length > 1 && (
                        <button
                          onClick={() => removerCriterio(atividadeIdx, criterioIdx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Erro</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Voltar
        </button>
        
        {!modoManual ? (
          <button
            onClick={handleGerarAvaliacao}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando Avaliação...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Avaliação Prática
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleSalvarManual}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <PenLine className="w-5 h-5" />
            Salvar Avaliação
          </button>
        )}
      </div>
    </div>
  );
}
