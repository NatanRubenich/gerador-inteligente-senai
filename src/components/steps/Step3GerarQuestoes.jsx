import { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, AlertCircle, Loader2, Copy, Check, Edit3, X, Save, Trash2, Plus } from 'lucide-react';
import { useProva } from '../../context/ProvaContext';
import { gerarQuestoes, isApiConfigured } from '../../services/llmService';

export default function Step3GerarQuestoes() {
  const { 
    dadosProva, 
    nextStep, 
    prevStep, 
    termoCapacidade,
    questoesGeradas,
    setQuestoesGeradas,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useProva();

  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualJson, setManualJson] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuestao, setEditingQuestao] = useState(null);
  
  // Verificar se API está configurada
  const apiConfigurada = isApiConfigured();

  // Formatar data para exibição
  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Gerar prompt para copiar manualmente (fallback)
  const gerarPromptTexto = () => {
    const capacidadesFormatadas = dadosProva.capacidades
      .map(c => `${c.codigo} - ${c.descricao}`)
      .join('\n');

    return `Turma: ${dadosProva.turma}
Professor: ${dadosProva.professor}
Unidade curricular: ${dadosProva.unidadeCurricular}
Data: ${formatarData(dadosProva.data)}
Curso Técnico em: ${dadosProva.curso}
Dificuldade das questões: ${dadosProva.dificuldades?.join(', ') || 'Médio'}
${termoCapacidade}s:
${capacidadesFormatadas}
Quantidade de questões: ${dadosProva.quantidade}
Assuntos: ${dadosProva.assunto}

As questões geradas devem seguir o padrão de provas SAEP do SENAI com contexto, comando e alternativas.
Não pode ter pegadinhas nas alternativas (termos ou comandos que não existem, etc) e também não pode ter alternativas que chamem a atenção, pois devem ter tamanhos parecidos.
No comando da questão não pode ter frases subjetivas como 'qual a alternativa melhor responde' ou 'qual a melhor opção', etc.
A alternativa correta não pode ser maior (quantidade de caracteres) que as outras. Disfarce as alternativas.
Nas alternativas usar somente do assunto da prova.
O comando da questão está associado ao contexto, de forma que o aluno não deve conseguir responder lendo apenas o comando da questão.
Distribua as respostas corretas entre as letras a, b, c, d de forma equilibrada.

Gere as questões no formato JSON.`;
  };

  const handleGerarComIA = async () => {
    if (!apiConfigurada) {
      setError('API não configurada. Configure a variável VITE_GEMINI_API_KEY no GitHub Secrets');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dadosCompletos = {
        ...dadosProva,
        data: formatarData(dadosProva.data),
        termoCapacidade
      };

      // O RAG é integrado automaticamente no serviço
      const resultado = await gerarQuestoes(dadosCompletos);
      setQuestoesGeradas(resultado);
    } catch (err) {
      setError(err.message || 'Erro ao gerar questões. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopiarPrompt = async () => {
    try {
      await navigator.clipboard.writeText(gerarPromptTexto());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleImportarJson = () => {
    try {
      const dados = JSON.parse(manualJson);
      if (!dados.prova) {
        throw new Error('JSON inválido: deve conter o objeto "prova"');
      }
      setQuestoesGeradas(dados);
      setShowManualInput(false);
      setManualJson('');
    } catch (err) {
      setError('JSON inválido. Verifique o formato e tente novamente.');
    }
  };

  const handleNext = () => {
    if (questoesGeradas) {
      nextStep();
    }
  };

  // Funções de edição de questões
  const handleEditQuestao = (index) => {
    const questao = questoesGeradas.prova.questoes[index];
    setEditingIndex(index);
    setEditingQuestao({ ...questao });
  };

  const handleSaveQuestao = () => {
    if (editingIndex === null || !editingQuestao) return;
    
    const novasQuestoes = [...questoesGeradas.prova.questoes];
    novasQuestoes[editingIndex] = editingQuestao;
    
    setQuestoesGeradas({
      ...questoesGeradas,
      prova: {
        ...questoesGeradas.prova,
        questoes: novasQuestoes
      }
    });
    
    setEditingIndex(null);
    setEditingQuestao(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingQuestao(null);
  };

  const handleDeleteQuestao = (index) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return;
    
    const novasQuestoes = questoesGeradas.prova.questoes.filter((_, i) => i !== index);
    // Renumerar questões
    novasQuestoes.forEach((q, i) => q.numero = i + 1);
    
    setQuestoesGeradas({
      ...questoesGeradas,
      prova: {
        ...questoesGeradas.prova,
        questoes: novasQuestoes
      }
    });
  };

  const handleUpdateEditingField = (field, value) => {
    setEditingQuestao(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateAlternativa = (letra, valor) => {
    setEditingQuestao(prev => ({
      ...prev,
      alternativas: {
        ...prev.alternativas,
        [letra]: valor
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Sparkles className="text-[#004b8d]" />
          Gerar Questões
        </h2>

        {/* Resumo dos dados */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Resumo da Prova</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Curso:</span>
              <p className="font-medium">{dadosProva.curso}</p>
            </div>
            <div>
              <span className="text-gray-500">Unidade Curricular:</span>
              <p className="font-medium">{dadosProva.unidadeCurricular}</p>
            </div>
            <div>
              <span className="text-gray-500">Turma:</span>
              <p className="font-medium">{dadosProva.turma}</p>
            </div>
            <div>
              <span className="text-gray-500">{termoCapacidade}s:</span>
              <p className="font-medium">{dadosProva.capacidades.length} selecionada(s)</p>
            </div>
            <div>
              <span className="text-gray-500">Questões:</span>
              <p className="font-medium">{dadosProva.quantidade}</p>
            </div>
            <div>
              <span className="text-gray-500">Dificuldade:</span>
              <p className="font-medium">{dadosProva.dificuldades?.join(', ') || 'Médio'}</p>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Erro</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Opções de geração */}
        <div className="space-y-4">
          {/* Botão principal - Gerar com IA */}
          <button
            onClick={handleGerarComIA}
            disabled={isLoading || !apiConfigurada}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-lg transition-all
              ${apiConfigurada 
                ? 'bg-gradient-to-r from-[#004b8d] to-blue-600 text-white hover:from-blue-700 hover:to-blue-500' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
              ${isLoading ? 'opacity-75' : ''}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Gerando questões com RAG + IA...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Gerar Questões com RAG + IA
              </>
            )}
          </button>

          {!apiConfigurada && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium mb-2">API não configurada</p>
              <p className="text-amber-700 text-sm">
                Para usar a geração automática, crie um arquivo <code className="bg-amber-100 px-1 rounded">.env</code> na raiz do projeto com:
              </p>
              <pre className="mt-2 bg-amber-100 p-2 rounded text-xs text-amber-900">
                VITE_GEMINI_API_KEY=sua_chave_aqui
              </pre>
              <p className="text-amber-600 text-xs mt-2">
                Obtenha sua chave gratuita em: aistudio.google.com/app/apikey
              </p>
            </div>
          )}

          {/* Divisor */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Opções manuais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Copiar prompt */}
            <button
              onClick={handleCopiarPrompt}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              {copied ? (
                <>
                  <Check className="text-green-500" size={20} />
                  <span className="text-green-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={20} className="text-gray-500" />
                  <span className="text-gray-700">Copiar Prompt</span>
                </>
              )}
            </button>

            {/* Importar JSON */}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Edit3 size={20} className="text-gray-500" />
              <span className="text-gray-700">Importar JSON Manualmente</span>
            </button>
          </div>

          {/* Input manual de JSON */}
          {showManualInput && (
            <div className="mt-4 space-y-3">
              <textarea
                value={manualJson}
                onChange={(e) => setManualJson(e.target.value)}
                placeholder="Cole aqui o JSON gerado pela IA..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
              <button
                onClick={handleImportarJson}
                disabled={!manualJson.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Importar JSON
              </button>
            </div>
          )}
        </div>

        {/* Lista de questões geradas - Editável */}
        {questoesGeradas && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Check className="text-green-500" />
                Questões Geradas ({questoesGeradas.prova?.questoes?.length || 0})
              </h3>
              <span className="text-sm text-gray-500">
                Clique em uma questão para editar
              </span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                ✓ {questoesGeradas.prova?.questoes?.length || 0} questões foram geradas. Revise e edite se necessário antes de prosseguir.
              </p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {questoesGeradas.prova?.questoes?.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Cabeçalho da questão */}
                  <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#004b8d]">Questão {q.numero}</span>
                      <span className="text-sm text-gray-600">
                        {q[termoCapacidade.toLowerCase()] || q.habilidade || q.capacidade}
                      </span>
                      {q.dificuldade && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          q.dificuldade === 'Fácil' ? 'bg-green-100 text-green-700' :
                          q.dificuldade === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.dificuldade}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditQuestao(index)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar questão"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestao(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir questão"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Conteúdo da questão (modo visualização) */}
                  {editingIndex !== index && (
                    <div className="p-4 text-sm space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Contexto:</span>
                        <p className="text-gray-600 mt-1">{q.contexto}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Comando:</span>
                        <p className="text-gray-600 mt-1">{q.comando}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Alternativas:</span>
                        <div className="mt-1 space-y-1">
                          {Object.entries(q.alternativas || {}).map(([letra, texto]) => (
                            <p key={letra} className={`text-gray-600 ${q.resposta_correta === letra ? 'font-medium text-green-700' : ''}`}>
                              {letra}) {texto} {q.resposta_correta === letra && '✓'}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Conteúdo da questão (modo edição) */}
                  {editingIndex === index && editingQuestao && (
                    <div className="p-4 space-y-4 bg-blue-50">
                      {/* Capacidade e Dificuldade */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {termoCapacidade}
                          </label>
                          <select
                            value={editingQuestao[termoCapacidade.toLowerCase()] || editingQuestao.capacidade || editingQuestao.habilidade || ''}
                            onChange={(e) => handleUpdateEditingField(termoCapacidade.toLowerCase(), e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {dadosProva.capacidades.map(cap => (
                              <option key={cap.codigo} value={cap.codigo}>{cap.codigo}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dificuldade
                          </label>
                          <select
                            value={editingQuestao.dificuldade || 'Médio'}
                            onChange={(e) => handleUpdateEditingField('dificuldade', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="Fácil">Fácil</option>
                            <option value="Médio">Médio</option>
                            <option value="Difícil">Difícil</option>
                          </select>
                        </div>
                      </div>

                      {/* Contexto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contexto
                        </label>
                        <textarea
                          value={editingQuestao.contexto || ''}
                          onChange={(e) => handleUpdateEditingField('contexto', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      {/* Comando */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comando
                        </label>
                        <textarea
                          value={editingQuestao.comando || ''}
                          onChange={(e) => handleUpdateEditingField('comando', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      {/* Alternativas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alternativas
                        </label>
                        <div className="space-y-2">
                          {['a', 'b', 'c', 'd'].map(letra => (
                            <div key={letra} className="flex items-center gap-2">
                              <label className="flex items-center gap-2 min-w-[80px]">
                                <input
                                  type="radio"
                                  name={`resposta-${index}`}
                                  checked={editingQuestao.resposta_correta === letra}
                                  onChange={() => handleUpdateEditingField('resposta_correta', letra)}
                                  className="text-green-600"
                                />
                                <span className={`font-medium ${editingQuestao.resposta_correta === letra ? 'text-green-700' : 'text-gray-700'}`}>
                                  {letra.toUpperCase()})
                                </span>
                              </label>
                              <input
                                type="text"
                                value={editingQuestao.alternativas?.[letra] || ''}
                                onChange={(e) => handleUpdateAlternativa(letra, e.target.value)}
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                                  editingQuestao.resposta_correta === letra 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-300'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Selecione o radio button para marcar a resposta correta
                        </p>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveQuestao}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
            disabled={!questoesGeradas}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors
              ${questoesGeradas 
                ? 'bg-[#004b8d] text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Próximo: Visualizar Prova
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
