import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Table, CheckCircle, AlertCircle, Loader2, Plus, Trash2, Eye, Save, X, ChevronDown, ChevronRight, ArrowLeft, Settings } from 'lucide-react';
import { clearCache } from '../../services/apiService';

/**
 * Página de Administração de Cursos
 * Permite upload do PPC (PDF) e Matriz Curricular (Excel) para alimentar o sistema
 * Acesso secreto: Ctrl+Shift+A
 */
export default function AdminCursos({ onClose }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [matrizFile, setMatrizFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'preview', 'saved'
  const [expandedUCs, setExpandedUCs] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');

  // Carregar cursos salvos do MongoDB e localStorage
  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Carregar do MongoDB com UCs incluídas
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/cursos?includeUCs=true`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            console.log('[Admin] Cursos carregados do MongoDB:', result.data.length);
            setSavedCourses(result.data);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar do MongoDB:', error);
      }

      // Fallback: carregar do localStorage
      const saved = localStorage.getItem('cursos_adicionados');
      if (saved) {
        try {
          setSavedCourses(JSON.parse(saved));
        } catch (e) {
          console.error('Erro ao carregar cursos salvos:', e);
        }
      }
    };

    loadCourses();
  }, []);

  const handlePdfUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
    }
  }, []);

  const handleMatrizUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setMatrizFile(file);
    } else {
      alert('Por favor, selecione um arquivo Excel válido (.xls ou .xlsx).');
    }
  }, []);

  const processFiles = async () => {
    if (!pdfFile) {
      alert('Por favor, selecione o PPC do Curso (PDF). É obrigatório para extrair as informações.');
      return;
    }

    setIsProcessing(true);
    setExtractedData(null);
    setValidationResult(null);

    try {
      // Importar serviço de extração com IA
      setProcessingStatus('Carregando serviço de IA...');
      const aiService = await import('../../services/cursoAIExtractionService');
      
      // Processar com Gemini AI
      console.log('[Admin] Iniciando extração com Gemini AI...');
      const courseData = await aiService.extractCourseWithAI(
        matrizFile, 
        pdfFile, 
        (status) => setProcessingStatus(status)
      );
      
      console.log('[Admin] Curso extraído:', courseData);

      if (!courseData || !courseData.nome) {
        throw new Error('Não foi possível extrair dados do curso. Verifique se o PDF é um PPC válido.');
      }

      // Validar dados
      setProcessingStatus('Validando dados extraídos...');
      const validation = aiService.validateCourseData(courseData);

      setExtractedData(courseData);
      setEditedData(JSON.parse(JSON.stringify(courseData)));
      setValidationResult(validation);
      setProcessingStatus('');
      setActiveTab('preview');

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setProcessingStatus('');
      alert(`Erro ao processar arquivo: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleUC = (index) => {
    setExpandedUCs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSaveCourse = async () => {
    const dataToSave = editMode ? editedData : extractedData;
    
    if (!dataToSave || !dataToSave.nome) {
      alert('Dados do curso inválidos.');
      return;
    }

    setSaveStatus('saving');

    try {
      // Salvar no MongoDB via API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/cursos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar no banco de dados');
      }

      console.log('[Admin] Curso salvo no MongoDB:', result);

      // Limpar cache do apiService para forçar recarregamento dos cursos
      clearCache();
      console.log('[Admin] Cache do apiService limpo');

      // Também salvar no localStorage como backup
      const existingCourses = JSON.parse(localStorage.getItem('cursos_adicionados') || '[]');
      const existingIndex = existingCourses.findIndex(c => c.id === dataToSave.id);
      
      if (existingIndex >= 0) {
        existingCourses[existingIndex] = dataToSave;
      } else {
        existingCourses.push(dataToSave);
      }
      
      localStorage.setItem('cursos_adicionados', JSON.stringify(existingCourses));
      
      // Atualizar RAG knowledge base
      await updateRAGKnowledgeBase(dataToSave);
      
      // Recarregar cursos do MongoDB para atualizar a lista
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const refreshResponse = await fetch(`${API_URL}/api/cursos?includeUCs=true`);
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success && refreshResult.data) {
            setSavedCourses(refreshResult.data);
          }
        }
      } catch (e) {
        console.warn('Erro ao recarregar cursos:', e);
        setSavedCourses(existingCourses);
      }
      
      setSaveStatus('success');
      
      setTimeout(() => {
        setSaveStatus(null);
        setActiveTab('saved');
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert(`Erro ao salvar: ${error.message}`);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const updateRAGKnowledgeBase = async (courseData) => {
    // Atualizar o arquivo de conhecimento RAG
    // Como estamos no frontend, salvamos no localStorage
    // O ragService irá ler esses dados ao inicializar
    
    const ragCourses = JSON.parse(localStorage.getItem('rag_cursos') || '[]');
    const existingIndex = ragCourses.findIndex(c => c.id === courseData.id);
    
    const ragFormat = {
      id: courseData.id,
      nome: courseData.nome,
      cbo: courseData.cbo,
      cargaHorariaTotal: courseData.cargaHorariaTotal,
      perfilProfissional: courseData.perfilProfissional,
      competenciaGeral: courseData.competenciaGeral,
      unidadesCurriculares: courseData.unidadesCurriculares.map(uc => ({
        nome: uc.nome,
        modulo: uc.modulo,
        cargaHoraria: uc.cargaHoraria,
        objetivo: uc.objetivo,
        capacidadesTecnicas: uc.capacidadesTecnicas,
        conhecimentos: uc.conhecimentos
      }))
    };
    
    if (existingIndex >= 0) {
      ragCourses[existingIndex] = ragFormat;
    } else {
      ragCourses.push(ragFormat);
    }
    
    localStorage.setItem('rag_cursos', JSON.stringify(ragCourses));
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    
    try {
      // Deletar do MongoDB via API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/cursos/${courseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao deletar do banco de dados');
      }

      console.log('[Admin] Curso deletado do MongoDB:', courseId);
    } catch (error) {
      console.error('Erro ao deletar do MongoDB:', error);
      // Continuar mesmo se falhar no MongoDB (pode não existir lá)
    }
    
    // Deletar do localStorage
    const updatedCourses = savedCourses.filter(c => c.id !== courseId);
    localStorage.setItem('cursos_adicionados', JSON.stringify(updatedCourses));
    
    // Remover do RAG também
    const ragCourses = JSON.parse(localStorage.getItem('rag_cursos') || '[]');
    const updatedRag = ragCourses.filter(c => c.id !== courseId);
    localStorage.setItem('rag_cursos', JSON.stringify(updatedRag));
    
    setSavedCourses(updatedCourses);
  };

  const handleEditField = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditUC = (ucIndex, field, value) => {
    setEditedData(prev => {
      const newUCs = [...prev.unidadesCurriculares];
      newUCs[ucIndex] = {
        ...newUCs[ucIndex],
        [field]: value
      };
      return {
        ...prev,
        unidadesCurriculares: newUCs
      };
    });
  };

  const handleAddUC = () => {
    setEditedData(prev => ({
      ...prev,
      unidadesCurriculares: [
        ...prev.unidadesCurriculares,
        {
          nome: 'Nova Unidade Curricular',
          modulo: 'Específico I',
          cargaHoraria: 40,
          objetivo: '',
          capacidadesTecnicas: [],
          conhecimentos: []
        }
      ]
    }));
  };

  const handleRemoveUC = (index) => {
    setEditedData(prev => ({
      ...prev,
      unidadesCurriculares: prev.unidadesCurriculares.filter((_, i) => i !== index)
    }));
  };

  const handleAddCapacidade = (ucIndex) => {
    setEditedData(prev => {
      const newUCs = [...prev.unidadesCurriculares];
      const capCount = newUCs[ucIndex].capacidadesTecnicas.length + 1;
      newUCs[ucIndex].capacidadesTecnicas.push({
        codigo: `CT${capCount}`,
        descricao: ''
      });
      return { ...prev, unidadesCurriculares: newUCs };
    });
  };

  const handleEditCapacidade = (ucIndex, capIndex, field, value) => {
    setEditedData(prev => {
      const newUCs = [...prev.unidadesCurriculares];
      newUCs[ucIndex].capacidadesTecnicas[capIndex][field] = value;
      return { ...prev, unidadesCurriculares: newUCs };
    });
  };

  const handleRemoveCapacidade = (ucIndex, capIndex) => {
    setEditedData(prev => {
      const newUCs = [...prev.unidadesCurriculares];
      newUCs[ucIndex].capacidadesTecnicas = newUCs[ucIndex].capacidadesTecnicas.filter((_, i) => i !== capIndex);
      return { ...prev, unidadesCurriculares: newUCs };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Azul */}
      <header className="bg-[#004b8d] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Administração de Cursos
                </h1>
                <p className="text-blue-100 text-sm">
                  Adicione novos cursos ao sistema através do upload de documentos oficiais
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Sistema
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'upload'
                  ? 'text-[#004b8d] border-b-2 border-[#004b8d]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="inline-block w-4 h-4 mr-2" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              disabled={!extractedData}
              className={`px-6 py-3 font-medium ${
                activeTab === 'preview'
                  ? 'text-[#004b8d] border-b-2 border-[#004b8d]'
                  : 'text-gray-500 hover:text-gray-700'
              } ${!extractedData ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Eye className="inline-block w-4 h-4 mr-2" />
              Pré-visualização
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'saved'
                  ? 'text-[#004b8d] border-b-2 border-[#004b8d]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="inline-block w-4 h-4 mr-2" />
              Cursos Salvos ({savedCourses.length})
            </button>
          </div>

          <div className="p-6">
            {/* Tab: Upload */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload PPC (Obrigatório) */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#004b8d] transition-colors">
                    <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      PPC do Curso (PDF) *
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Projeto Pedagógico do Curso
                      <br />
                      <span className="text-xs text-gray-400">
                        Capacidades e conhecimentos de cada UC
                      </span>
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="inline-flex items-center px-4 py-2 bg-[#004b8d] text-white rounded-lg cursor-pointer hover:bg-[#003a6d] transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar PDF
                    </label>
                    {pdfFile && (
                      <div className="mt-4 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm truncate max-w-[200px]">{pdfFile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Matriz Curricular (Opcional) */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#004b8d] transition-colors">
                    <Table className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Matriz Curricular (Excel)
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Opcional - Complementa dados do PPC
                    </p>
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleMatrizUpload}
                      className="hidden"
                      id="matriz-upload"
                    />
                    <label
                      htmlFor="matriz-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Excel
                    </label>
                    {matrizFile && (
                      <div className="mt-4 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm truncate max-w-[200px]">{matrizFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão Processar */}
                <div className="flex justify-center">
                  <button
                    onClick={processFiles}
                    disabled={!pdfFile || isProcessing}
                    className={`px-8 py-3 rounded-lg font-medium text-white ${
                      !pdfFile || isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#e5173f] hover:bg-[#c41535]'
                    } transition-colors`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                        {processingStatus || 'Processando...'}
                      </>
                    ) : (
                      <>
                        <Plus className="inline-block w-5 h-5 mr-2" />
                        Processar e Extrair Dados
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Preview */}
            {activeTab === 'preview' && extractedData && (
              <div className="space-y-6">
                {/* Validação */}
                {validationResult && (
                  <div className={`p-4 rounded-lg ${
                    validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {validationResult.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      )}
                      <span className="font-medium">
                        {validationResult.isValid ? 'Dados válidos' : 'Atenção: Verifique os dados'}
                      </span>
                    </div>
                    {validationResult.errors.length > 0 && (
                      <ul className="list-disc list-inside text-red-600 text-sm">
                        {validationResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                    {validationResult.warnings.length > 0 && (
                      <ul className="list-disc list-inside text-yellow-700 text-sm mt-2">
                        {validationResult.warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Toggle Edit Mode */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-lg ${
                      editMode
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {editMode ? 'Modo Edição Ativo' : 'Ativar Edição'}
                  </button>
                </div>

                {/* Dados do Curso */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#004b8d] mb-4">Dados do Curso</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editedData.nome}
                          onChange={(e) => handleEditField('nome', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-900">{extractedData.nome || 'Não identificado'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editedData.id}
                          onChange={(e) => handleEditField('id', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-900">{extractedData.id || 'Não gerado'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                      <p className="text-gray-900">{extractedData.modelo || 'Presencial'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária Total</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={editedData.cargaHorariaTotal}
                          onChange={(e) => handleEditField('cargaHorariaTotal', parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-900">{extractedData.cargaHorariaTotal || 0}h</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Competência Geral</label>
                    {editMode ? (
                      <textarea
                        value={editedData.competenciaGeral}
                        onChange={(e) => handleEditField('competenciaGeral', e.target.value)}
                        className="w-full p-2 border rounded h-24"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{extractedData.competenciaGeral || 'Não identificada'}</p>
                    )}
                  </div>
                </div>

                {/* Unidades Curriculares */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#004b8d]">
                      Unidades Curriculares ({(editMode ? editedData : extractedData).unidadesCurriculares.length})
                    </h3>
                    {editMode && (
                      <button
                        onClick={handleAddUC}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <Plus className="inline-block w-4 h-4 mr-1" />
                        Adicionar UC
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(editMode ? editedData : extractedData).unidadesCurriculares.map((uc, index) => (
                      <div key={index} className="bg-white rounded-lg border">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleUC(index)}
                        >
                          <div className="flex items-center">
                            {expandedUCs[index] ? (
                              <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                            )}
                            <span className="font-medium">{uc.nome}</span>
                            <span className="ml-3 text-sm text-gray-500">
                              {uc.cargaHoraria}h | {uc.modulo}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {uc.capacidadesTecnicas?.length || 0} capacidades
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {uc.conhecimentos?.length || 0} conhecimentos
                            </span>
                            {editMode && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveUC(index); }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {expandedUCs[index] && (
                          <div className="border-t p-4 bg-gray-50">
                            {editMode ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
                                    <input
                                      type="text"
                                      value={uc.nome}
                                      onChange={(e) => handleEditUC(index, 'nome', e.target.value)}
                                      className="w-full p-2 border rounded text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Módulo</label>
                                    <select
                                      value={uc.modulo}
                                      onChange={(e) => handleEditUC(index, 'modulo', e.target.value)}
                                      className="w-full p-2 border rounded text-sm"
                                    >
                                      <option value="Básico">Básico</option>
                                      <option value="Básico da Indústria">Básico da Indústria</option>
                                      <option value="Introdutório">Introdutório</option>
                                      <option value="Específico I">Específico I</option>
                                      <option value="Específico II">Específico II</option>
                                      <option value="Específico III">Específico III</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Carga Horária</label>
                                    <input
                                      type="number"
                                      value={uc.cargaHoraria}
                                      onChange={(e) => handleEditUC(index, 'cargaHoraria', parseInt(e.target.value))}
                                      className="w-full p-2 border rounded text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Objetivo</label>
                                  <textarea
                                    value={uc.objetivo || ''}
                                    onChange={(e) => handleEditUC(index, 'objetivo', e.target.value)}
                                    className="w-full p-2 border rounded text-sm h-20"
                                  />
                                </div>

                                {/* Capacidades */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-medium text-gray-600">Capacidades</label>
                                    <button
                                      onClick={() => handleAddCapacidade(index)}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      + Adicionar
                                    </button>
                                  </div>
                                  {uc.capacidadesTecnicas?.map((cap, capIndex) => (
                                    <div key={capIndex} className="flex items-start space-x-2 mb-2">
                                      <input
                                        type="text"
                                        value={cap.codigo}
                                        onChange={(e) => handleEditCapacidade(index, capIndex, 'codigo', e.target.value)}
                                        className="w-20 p-1 border rounded text-xs"
                                        placeholder="Código"
                                      />
                                      <input
                                        type="text"
                                        value={cap.descricao}
                                        onChange={(e) => handleEditCapacidade(index, capIndex, 'descricao', e.target.value)}
                                        className="flex-1 p-1 border rounded text-xs"
                                        placeholder="Descrição"
                                      />
                                      <button
                                        onClick={() => handleRemoveCapacidade(index, capIndex)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {uc.objetivo && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-600 mb-1">Objetivo</h5>
                                    <p className="text-sm text-gray-700">{uc.objetivo}</p>
                                  </div>
                                )}
                                {uc.capacidadesTecnicas?.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-600 mb-1">Capacidades</h5>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                      {uc.capacidadesTecnicas.map((cap, i) => (
                                        <li key={i}>
                                          <span className="font-medium text-[#004b8d]">{cap.codigo}:</span> {cap.descricao}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {uc.conhecimentos?.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-600 mb-1">Conhecimentos</h5>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                      {uc.conhecimentos.map((con, i) => (
                                        <li key={i}>
                                          <span className="font-medium">{con.topico}</span>
                                          {con.subtopicos?.length > 0 && (
                                            <ul className="ml-4 text-xs text-gray-600">
                                              {con.subtopicos.map((sub, j) => (
                                                <li key={j}>• {sub}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setExtractedData(null);
                      setEditedData(null);
                      setPdfFile(null);
                      setXlsFile(null);
                      setActiveTab('upload');
                    }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <X className="inline-block w-5 h-5 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCourse}
                    disabled={saveStatus === 'saving'}
                    className={`px-8 py-3 rounded-lg font-medium text-white ${
                      saveStatus === 'saving'
                        ? 'bg-gray-400'
                        : saveStatus === 'success'
                        ? 'bg-green-600'
                        : saveStatus === 'error'
                        ? 'bg-red-600'
                        : 'bg-[#e5173f] hover:bg-[#c41535]'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircle className="inline-block w-5 h-5 mr-2" />
                        Salvo com Sucesso!
                      </>
                    ) : saveStatus === 'error' ? (
                      <>
                        <AlertCircle className="inline-block w-5 h-5 mr-2" />
                        Erro ao Salvar
                      </>
                    ) : (
                      <>
                        <Save className="inline-block w-5 h-5 mr-2" />
                        Salvar Curso no Sistema
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Saved Courses */}
            {activeTab === 'saved' && (
              <div>
                {savedCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Table className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum curso adicionado ainda.</p>
                    <p className="text-sm">Use a aba "Upload" para adicionar novos cursos.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCourses.map((curso) => (
                      <div key={curso.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-[#004b8d]">{curso.nome}</h4>
                            <p className="text-sm text-gray-600">
                              ID: {curso.id} | CBO: {curso.cbo || 'N/A'} | {curso.cargaHorariaTotal}h
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {curso.unidadesCurriculares?.length || 0} Unidades Curriculares
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteCourse(curso.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <h4 className="font-semibold text-[#004b8d] mb-2">Instruções</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>O <strong>PPC do Curso (PDF)</strong> é obrigatório e deve conter as informações completas do curso.</li>
            <li>A <strong>Matriz Curricular (Excel)</strong> é opcional e pode complementar os dados extraídos.</li>
            <li>Após o processamento, revise os dados extraídos e faça ajustes se necessário.</li>
            <li>Os cursos salvos ficarão disponíveis em todas as funcionalidades do sistema.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
