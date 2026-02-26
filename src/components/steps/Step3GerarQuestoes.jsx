import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, AlertCircle, Loader2, Check, Edit3, X, Save, Trash2, Plus, Image, Code, Upload, Link, Eye, EyeOff } from 'lucide-react';
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

  const [quantidadeExtra, setQuantidadeExtra] = useState(1);
  const [gerandoExtras, setGerandoExtras] = useState(false);
  const [capacidadesExtras, setCapacidadesExtras] = useState([]);
  const [showGerarMaisModal, setShowGerarMaisModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuestao, setEditingQuestao] = useState(null);
  
  // Estados para criação de nova questão
  const [showNovaQuestao, setShowNovaQuestao] = useState(false);
  const [novaQuestao, setNovaQuestao] = useState(null);
  const [showImagemModal, setShowImagemModal] = useState(false);
  const [imagemUrl, setImagemUrl] = useState('');
  const [showCodigoModal, setShowCodigoModal] = useState(false);
  const [codigoBloco, setCodigoBloco] = useState({ linguagem: 'javascript', codigo: '' });
  const [previewMode, setPreviewMode] = useState(false);
  const [codigoAlternativaModal, setCodigoAlternativaModal] = useState({ show: false, letra: null, linguagem: 'javascript', codigo: '' });
  const fileInputRef = useRef(null);
  
  // Verificar se API está configurada
  const apiConfigurada = isApiConfigured();

  // Formatar data para exibição
  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };


  const handleGerarComIA = async () => {
    if (!apiConfigurada) {
      setError('API não configurada. Configure a variável VITE_GROQ_API_KEY no GitHub Secrets');
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

  // Abrir modal de gerar mais questões
  const handleAbrirGerarMais = () => {
    setCapacidadesExtras([dadosProva.capacidades[0]?.codigo]);
    setQuantidadeExtra(1);
    setShowGerarMaisModal(true);
  };

  // Toggle capacidade extra
  const handleToggleCapacidadeExtra = (codigo) => {
    setCapacidadesExtras(prev => {
      if (prev.includes(codigo)) {
        return prev.filter(c => c !== codigo);
      } else {
        return [...prev, codigo];
      }
    });
  };

  // Verificar se pode gerar (quantidade >= capacidades selecionadas)
  const podeGerarExtras = capacidadesExtras.length > 0 && quantidadeExtra >= capacidadesExtras.length;

  // Gerar questões extras
  const handleGerarMaisQuestoes = async () => {
    if (!apiConfigurada || gerandoExtras || !podeGerarExtras) return;

    setGerandoExtras(true);
    setError(null);

    try {
      const proximoNumero = questoesGeradas?.prova?.questoes?.length + 1 || 1;
      
      // Filtrar capacidades selecionadas
      const capacidadesSelecionadas = dadosProva.capacidades.filter(
        cap => capacidadesExtras.includes(cap.codigo)
      );

      // Distribuir questões entre capacidades
      const questoesPorCapacidade = Math.floor(quantidadeExtra / capacidadesSelecionadas.length);
      const resto = quantidadeExtra % capacidadesSelecionadas.length;
      
      // Criar distribuição (primeiras capacidades recebem o resto)
      const distribuicao = capacidadesSelecionadas.map((cap, idx) => ({
        ...cap,
        quantidade: questoesPorCapacidade + (idx < resto ? 1 : 0)
      }));

      const dadosCompletos = {
        ...dadosProva,
        data: formatarData(dadosProva.data),
        termoCapacidade,
        quantidade: quantidadeExtra,
        capacidades: capacidadesSelecionadas,
        distribuicaoCapacidades: distribuicao,
        numeroInicial: proximoNumero
      };

      const resultado = await gerarQuestoes(dadosCompletos);
      
      if (resultado?.prova?.questoes) {
        // Renumerar as novas questões
        const novasQuestoes = resultado.prova.questoes.map((q, idx) => ({
          ...q,
          numero: proximoNumero + idx
        }));
        
        // Adicionar às questões existentes
        setQuestoesGeradas(prev => ({
          ...prev,
          prova: {
            ...prev.prova,
            questoes: [...prev.prova.questoes, ...novasQuestoes]
          }
        }));
        
        setShowGerarMaisModal(false);
      }
    } catch (err) {
      setError(err.message || 'Erro ao gerar questões extras.');
    } finally {
      setGerandoExtras(false);
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

  // ========== FUNÇÕES PARA NOVA QUESTÃO ==========
  
  // Iniciar criação de nova questão
  const handleNovaQuestao = () => {
    const proximoNumero = questoesGeradas?.prova?.questoes?.length 
      ? questoesGeradas.prova.questoes.length + 1 
      : 1;
    
    setNovaQuestao({
      numero: proximoNumero,
      [termoCapacidade.toLowerCase()]: dadosProva.capacidades[0]?.codigo || '',
      dificuldade: 'Médio',
      contexto: '',
      comando: '',
      alternativas: { 
        a: { texto: '', codigo: null }, 
        b: { texto: '', codigo: null }, 
        c: { texto: '', codigo: null }, 
        d: { texto: '', codigo: null } 
      },
      resposta_correta: 'a',
      imagens: [], // Array de URLs de imagens
      codigos: []  // Array de blocos de código no contexto
    });
    setShowNovaQuestao(true);
    setPreviewMode(false);
  };

  // Atualizar campo da nova questão
  const handleUpdateNovaQuestaoField = (field, value) => {
    setNovaQuestao(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Atualizar texto da alternativa da nova questão
  const handleUpdateNovaAlternativa = (letra, valor) => {
    setNovaQuestao(prev => ({
      ...prev,
      alternativas: {
        ...prev.alternativas,
        [letra]: { ...prev.alternativas[letra], texto: valor }
      }
    }));
  };

  // Atualizar código da alternativa da nova questão
  const handleUpdateNovaAlternativaCodigo = (letra, codigo) => {
    setNovaQuestao(prev => ({
      ...prev,
      alternativas: {
        ...prev.alternativas,
        [letra]: { ...prev.alternativas[letra], codigo }
      }
    }));
  };

  // Adicionar imagem por URL
  const handleAdicionarImagemUrl = () => {
    if (!imagemUrl.trim()) return;
    
    setNovaQuestao(prev => ({
      ...prev,
      imagens: [...(prev.imagens || []), { tipo: 'url', src: imagemUrl.trim(), descricao: '' }]
    }));
    setImagemUrl('');
    setShowImagemModal(false);
  };

  // Adicionar imagem por upload (base64)
  const handleUploadImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNovaQuestao(prev => ({
        ...prev,
        imagens: [...(prev.imagens || []), { 
          tipo: 'base64', 
          src: event.target.result, 
          nome: file.name,
          descricao: '' 
        }]
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Remover imagem
  const handleRemoverImagem = (index) => {
    setNovaQuestao(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index)
    }));
  };

  // Atualizar descrição da imagem
  const handleUpdateImagemDescricao = (index, descricao) => {
    setNovaQuestao(prev => ({
      ...prev,
      imagens: prev.imagens.map((img, i) => 
        i === index ? { ...img, descricao } : img
      )
    }));
  };

  // Adicionar bloco de código
  const handleAdicionarCodigo = () => {
    if (!codigoBloco.codigo.trim()) return;
    
    setNovaQuestao(prev => ({
      ...prev,
      codigos: [...(prev.codigos || []), { ...codigoBloco }]
    }));
    setCodigoBloco({ linguagem: 'javascript', codigo: '' });
    setShowCodigoModal(false);
  };

  // Remover bloco de código
  const handleRemoverCodigo = (index) => {
    setNovaQuestao(prev => ({
      ...prev,
      codigos: prev.codigos.filter((_, i) => i !== index)
    }));
  };

  // Salvar nova questão
  const handleSalvarNovaQuestao = () => {
    // Validação básica
    if (!novaQuestao.contexto.trim() || !novaQuestao.comando.trim()) {
      setError('Preencha o contexto e o comando da questão.');
      return;
    }
    
    const alternativasPreenchidas = Object.values(novaQuestao.alternativas).filter(a => a.texto?.trim() || a.codigo).length;
    if (alternativasPreenchidas < 4) {
      setError('Preencha todas as 4 alternativas (texto ou código).');
      return;
    }

    // Se não existem questões ainda, criar estrutura
    if (!questoesGeradas) {
      const capacidadesJSON = {};
      dadosProva.capacidades.forEach(c => {
        capacidadesJSON[c.codigo] = c.descricao;
      });

      setQuestoesGeradas({
        prova: {
          data: formatarData(dadosProva.data),
          docente: dadosProva.professor,
          curso: dadosProva.curso,
          unidade_curricular: dadosProva.unidadeCurricular,
          turma: dadosProva.turma,
          [`${termoCapacidade.toLowerCase()}s`]: capacidadesJSON,
          questoes: [novaQuestao]
        }
      });
    } else {
      // Adicionar à lista existente
      const novasQuestoes = [...(questoesGeradas.prova.questoes || []), novaQuestao];
      setQuestoesGeradas({
        ...questoesGeradas,
        prova: {
          ...questoesGeradas.prova,
          questoes: novasQuestoes
        }
      });
    }

    setNovaQuestao(null);
    setShowNovaQuestao(false);
    setError(null);
  };

  // Cancelar criação de nova questão
  const handleCancelarNovaQuestao = () => {
    setNovaQuestao(null);
    setShowNovaQuestao(false);
    setPreviewMode(false);
  };

  // Linguagens disponíveis para blocos de código
  const linguagensDisponiveis = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'bash', label: 'Bash/Shell' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'plaintext', label: 'Texto Simples' }
  ];

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
                Gerando questões com IA...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Gerar Questões com IA
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
                VITE_GROQ_API_KEY=sua_chave_aqui
              </pre>
              <p className="text-amber-600 text-xs mt-2">
                Obtenha sua chave gratuita em: console.groq.com/keys
              </p>
            </div>
          )}

          {/* Divisor - Criar Questão Manual */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou crie manualmente</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Botão Nova Questão */}
          <button
            onClick={handleNovaQuestao}
            disabled={showNovaQuestao}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-green-400 rounded-lg font-semibold text-lg transition-all hover:border-green-500 hover:bg-green-50 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={24} />
            Criar Nova Questão Manualmente
          </button>
        </div>

        {/* ========== FORMULÁRIO NOVA QUESTÃO ========== */}
        {showNovaQuestao && novaQuestao && (
          <div className="mt-8 border-2 border-green-400 rounded-xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Plus size={20} />
                Nova Questão #{novaQuestao.numero}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                  {previewMode ? 'Editar' : 'Pré-visualizar'}
                </button>
                <button
                  onClick={handleCancelarNovaQuestao}
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conteúdo do formulário */}
            <div className="p-6 bg-green-50 space-y-6">
              {/* Modo Edição */}
              {!previewMode && (
                <>
                  {/* Capacidade e Dificuldade */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {termoCapacidade} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={novaQuestao[termoCapacidade.toLowerCase()] || ''}
                        onChange={(e) => handleUpdateNovaQuestaoField(termoCapacidade.toLowerCase(), e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        {dadosProva.capacidades.map(cap => (
                          <option key={cap.codigo} value={cap.codigo}>
                            {cap.codigo} - {cap.descricao.substring(0, 50)}...
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dificuldade <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={novaQuestao.dificuldade}
                        onChange={(e) => handleUpdateNovaQuestaoField('dificuldade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
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
                      Contexto <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={novaQuestao.contexto}
                      onChange={(e) => handleUpdateNovaQuestaoField('contexto', e.target.value)}
                      placeholder="Descreva a situação-problema do mundo do trabalho..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>

                  {/* Seção de Imagens */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Image size={16} className="text-blue-600" />
                        Imagens (opcional)
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowImagemModal(true)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Link size={14} />
                          URL
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Upload size={14} />
                          Upload
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImagem}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Lista de imagens adicionadas */}
                    {novaQuestao.imagens?.length > 0 && (
                      <div className="space-y-3">
                        {novaQuestao.imagens.map((img, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <img 
                              src={img.src} 
                              alt={img.descricao || `Imagem ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                value={img.descricao}
                                onChange={(e) => handleUpdateImagemDescricao(idx, e.target.value)}
                                placeholder="Descrição da imagem (alt text)..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {img.tipo === 'url' ? 'URL externa' : img.nome || 'Upload local'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoverImagem(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {novaQuestao.imagens?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Nenhuma imagem adicionada</p>
                    )}
                  </div>

                  {/* Seção de Código */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Code size={16} className="text-purple-600" />
                        Blocos de Código (opcional)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCodigoModal(true)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Plus size={14} />
                        Adicionar Código
                      </button>
                    </div>

                    {/* Lista de blocos de código */}
                    {novaQuestao.codigos?.length > 0 && (
                      <div className="space-y-3">
                        {novaQuestao.codigos.map((cod, idx) => (
                          <div key={idx} className="relative">
                            <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-1.5 rounded-t-lg">
                              <span className="text-xs font-mono">{cod.linguagem}</span>
                              <button
                                onClick={() => handleRemoverCodigo(idx)}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <pre className="bg-gray-900 text-green-400 p-3 rounded-b-lg text-sm font-mono overflow-x-auto max-h-40">
                              <code>{cod.codigo}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {novaQuestao.codigos?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Nenhum bloco de código adicionado</p>
                    )}
                  </div>

                  {/* Comando */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comando <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={novaQuestao.comando}
                      onChange={(e) => handleUpdateNovaQuestaoField('comando', e.target.value)}
                      placeholder="Pergunta relacionada ao contexto..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>

                  {/* Alternativas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternativas <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-gray-500 ml-2">(texto e/ou código)</span>
                    </label>
                    <div className="space-y-3">
                      {['a', 'b', 'c', 'd'].map(letra => (
                        <div key={letra} className={`p-3 rounded-lg border ${
                          novaQuestao.resposta_correta === letra 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="nova-resposta"
                                checked={novaQuestao.resposta_correta === letra}
                                onChange={() => handleUpdateNovaQuestaoField('resposta_correta', letra)}
                                className="text-green-600"
                              />
                              <span className={`font-medium ${novaQuestao.resposta_correta === letra ? 'text-green-700' : 'text-gray-700'}`}>
                                {letra.toUpperCase()})
                              </span>
                            </label>
                            {novaQuestao.resposta_correta === letra && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Correta</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={novaQuestao.alternativas[letra]?.texto || ''}
                            onChange={(e) => handleUpdateNovaAlternativa(letra, e.target.value)}
                            placeholder={`Texto da alternativa ${letra.toUpperCase()}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white mb-2"
                          />
                          {/* Código da alternativa */}
                          {novaQuestao.alternativas[letra]?.codigo ? (
                            <div className="relative">
                              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-1 rounded-t-lg">
                                <span className="text-xs font-mono">{novaQuestao.alternativas[letra].codigo.linguagem}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateNovaAlternativaCodigo(letra, null)}
                                  className="p-1 text-red-400 hover:text-red-300"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <pre className="bg-gray-900 text-green-400 p-2 rounded-b-lg text-xs font-mono overflow-x-auto max-h-24">
                                <code>{novaQuestao.alternativas[letra].codigo.codigo}</code>
                              </pre>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setCodigoAlternativaModal({ show: true, letra, linguagem: 'javascript', codigo: '' })}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded border border-purple-200"
                            >
                              <Code size={12} />
                              Adicionar código
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selecione o radio button para marcar a resposta correta. Cada alternativa pode ter texto e/ou código.
                    </p>
                  </div>
                </>
              )}

              {/* Modo Preview */}
              {previewMode && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-bold text-[#004b8d]">Questão {novaQuestao.numero}</span>
                    <span className="text-sm text-gray-600">{novaQuestao[termoCapacidade.toLowerCase()]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      novaQuestao.dificuldade === 'Fácil' ? 'bg-green-100 text-green-700' :
                      novaQuestao.dificuldade === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {novaQuestao.dificuldade}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-blue-600">Contexto:</span>
                      <p className="text-gray-700 mt-1">{novaQuestao.contexto || <em className="text-gray-400">Não preenchido</em>}</p>
                    </div>

                    {/* Imagens no preview */}
                    {novaQuestao.imagens?.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {novaQuestao.imagens.map((img, idx) => (
                          <img 
                            key={idx}
                            src={img.src} 
                            alt={img.descricao || `Imagem ${idx + 1}`}
                            className="max-w-xs rounded-lg border shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    {/* Códigos no preview */}
                    {novaQuestao.codigos?.length > 0 && (
                      <div className="space-y-3">
                        {novaQuestao.codigos.map((cod, idx) => (
                          <div key={idx}>
                            <div className="bg-gray-800 text-white px-3 py-1 rounded-t-lg text-xs font-mono">
                              {cod.linguagem}
                            </div>
                            <pre className="bg-gray-900 text-green-400 p-3 rounded-b-lg text-sm font-mono overflow-x-auto">
                              <code>{cod.codigo}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-blue-600">Comando:</span>
                      <p className="text-gray-700 mt-1">{novaQuestao.comando || <em className="text-gray-400">Não preenchido</em>}</p>
                    </div>

                    <div>
                      <span className="font-medium text-blue-600">Alternativas:</span>
                      <div className="mt-2 space-y-2">
                        {['a', 'b', 'c', 'd'].map(letra => (
                          <div key={letra} className={`${novaQuestao.resposta_correta === letra ? 'font-medium text-green-700 bg-green-50 px-2 py-1 rounded' : 'text-gray-600'}`}>
                            <span>{letra}) {novaQuestao.alternativas[letra]?.texto || <em className="text-gray-400">Sem texto</em>}</span>
                            {novaQuestao.resposta_correta === letra && ' ✓'}
                            {novaQuestao.alternativas[letra]?.codigo && (
                              <div className="mt-1">
                                <div className="bg-gray-800 text-white px-2 py-0.5 rounded-t text-xs font-mono inline-block">
                                  {novaQuestao.alternativas[letra].codigo.linguagem}
                                </div>
                                <pre className="bg-gray-900 text-green-400 p-2 rounded-b text-xs font-mono overflow-x-auto">
                                  <code>{novaQuestao.alternativas[letra].codigo.codigo}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex justify-end gap-3 pt-4 border-t border-green-200">
                <button
                  onClick={handleCancelarNovaQuestao}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarNovaQuestao}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Save size={16} />
                  Salvar Questão
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para adicionar imagem por URL */}
        {showImagemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Link size={20} className="text-blue-600" />
                Adicionar Imagem por URL
              </h4>
              <input
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
              />
              {imagemUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
                  <img 
                    src={imagemUrl} 
                    alt="Preview" 
                    className="max-h-40 rounded border"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowImagemModal(false); setImagemUrl(''); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdicionarImagemUrl}
                  disabled={!imagemUrl.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para adicionar bloco de código */}
        {showCodigoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Code size={20} className="text-purple-600" />
                Adicionar Bloco de Código
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Linguagem</label>
                <select
                  value={codigoBloco.linguagem}
                  onChange={(e) => setCodigoBloco(prev => ({ ...prev, linguagem: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {linguagensDisponiveis.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <textarea
                  value={codigoBloco.codigo}
                  onChange={(e) => setCodigoBloco(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Digite ou cole o código aqui..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowCodigoModal(false); setCodigoBloco({ linguagem: 'javascript', codigo: '' }); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdicionarCodigo}
                  disabled={!codigoBloco.codigo.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para adicionar código em alternativa */}
        {codigoAlternativaModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Code size={20} className="text-purple-600" />
                Adicionar Código na Alternativa {codigoAlternativaModal.letra?.toUpperCase()}
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Linguagem</label>
                <select
                  value={codigoAlternativaModal.linguagem}
                  onChange={(e) => setCodigoAlternativaModal(prev => ({ ...prev, linguagem: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="sql">SQL</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="typescript">TypeScript</option>
                  <option value="bash">Bash/Shell</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="markdown">Markdown</option>
                  <option value="plaintext">Texto Plano</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <textarea
                  value={codigoAlternativaModal.codigo}
                  onChange={(e) => setCodigoAlternativaModal(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Cole ou digite o código aqui..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCodigoAlternativaModal({ show: false, letra: null, linguagem: 'javascript', codigo: '' })}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (codigoAlternativaModal.codigo.trim()) {
                      handleUpdateNovaAlternativaCodigo(codigoAlternativaModal.letra, {
                        linguagem: codigoAlternativaModal.linguagem,
                        codigo: codigoAlternativaModal.codigo
                      });
                    }
                    setCodigoAlternativaModal({ show: false, letra: null, linguagem: 'javascript', codigo: '' });
                  }}
                  disabled={!codigoAlternativaModal.codigo.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de questões geradas - Editável */}
        {questoesGeradas && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Check className="text-green-500" size={20} />
                Questões Geradas ({questoesGeradas.prova?.questoes?.length || 0})
              </h3>
              <button
                onClick={handleAbrirGerarMais}
                disabled={!apiConfigurada}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${apiConfigurada
                    ? 'bg-gradient-to-r from-[#004b8d] to-blue-600 text-white hover:from-blue-700 hover:to-blue-500 shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles size={16} />
                Gerar mais com AI
              </button>
            </div>

            {/* Modal Gerar Mais Questões */}
            {showGerarMaisModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#004b8d]" />
                    Gerar mais questões com AI
                  </h4>

                  {/* Quantidade */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade de questões
                    </label>
                    <select
                      value={quantidadeExtra}
                      onChange={(e) => setQuantidadeExtra(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} questão{n > 1 ? 'ões' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Capacidades */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {termoCapacidade}s para as questões
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {dadosProva.capacidades.map(cap => (
                        <label 
                          key={cap.codigo} 
                          className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${
                            capacidadesExtras.includes(cap.codigo) ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={capacidadesExtras.includes(cap.codigo)}
                            onChange={() => handleToggleCapacidadeExtra(cap.codigo)}
                            className="mt-1"
                          />
                          <div>
                            <span className="font-medium text-sm">{cap.codigo}</span>
                            <p className="text-xs text-gray-600 line-clamp-2">{cap.descricao}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selecione até {quantidadeExtra} {termoCapacidade.toLowerCase()}{quantidadeExtra > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Aviso de validação */}
                  {!podeGerarExtras && capacidadesExtras.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-amber-700 text-sm">
                        Selecione no máximo {quantidadeExtra} {termoCapacidade.toLowerCase()}{quantidadeExtra > 1 ? 's' : ''}, ou aumente a quantidade de questões.
                      </p>
                    </div>
                  )}

                  {/* Distribuição */}
                  {podeGerarExtras && capacidadesExtras.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-700 text-sm">
                        {capacidadesExtras.length === 1 
                          ? `${quantidadeExtra} questão${quantidadeExtra > 1 ? 'ões' : ''} de ${capacidadesExtras[0]}`
                          : `Distribuição: ${Math.floor(quantidadeExtra / capacidadesExtras.length)} questão${Math.floor(quantidadeExtra / capacidadesExtras.length) > 1 ? 'ões' : ''} por ${termoCapacidade.toLowerCase()}`
                        }
                      </p>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowGerarMaisModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      disabled={gerandoExtras}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGerarMaisQuestoes}
                      disabled={gerandoExtras || !podeGerarExtras}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                        ${podeGerarExtras && !gerandoExtras
                          ? 'bg-gradient-to-r from-[#004b8d] to-blue-600 text-white hover:from-blue-700 hover:to-blue-500' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {gerandoExtras ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Gerar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Aviso de IA - discreto */}
            <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
              <AlertCircle size={12} />
              Conteúdo gerado por IA. Revise antes de usar.
            </p>

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
                          {Object.entries(q.alternativas || {}).map(([letra, alt]) => {
                            // Suportar formato antigo (string) e novo (objeto)
                            const textoAlt = typeof alt === 'string' ? alt : (alt?.texto || '');
                            return (
                              <p key={letra} className={`text-gray-600 ${q.resposta_correta === letra ? 'font-medium text-green-700' : ''}`}>
                                {letra}) {textoAlt} {q.resposta_correta === letra && '✓'}
                              </p>
                            );
                          })}
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
