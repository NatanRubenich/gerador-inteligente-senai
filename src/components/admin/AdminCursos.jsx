import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Table, CheckCircle, AlertCircle, Loader2, Plus, Trash2, Eye, Save, X, ChevronDown, ChevronRight, ArrowLeft, Settings, Edit3, BookOpen } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'preview', 'saved', 'manage-ucs'
  const [expandedUCs, setExpandedUCs] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Estados para gerenciamento de UCs e Cursos
  const [selectedCursoForUC, setSelectedCursoForUC] = useState(null);
  const [ucsDosCurso, setUcsDosCurso] = useState([]);
  const [loadingUCs, setLoadingUCs] = useState(false);
  const [editingUC, setEditingUC] = useState(null);
  const [ucEditData, setUcEditData] = useState(null);
  const [savingUC, setSavingUC] = useState(false);
  const [showAddUCModal, setShowAddUCModal] = useState(false);
  const [newUCData, setNewUCData] = useState({
    nome: '',
    cargaHoraria: 40,
    modulo: 'Específico I',
    objetivo: '',
    capacidades: [],
    conhecimentos: []
  });
  
  // Estados para edição do curso
  const [editingCurso, setEditingCurso] = useState(false);
  const [cursoEditData, setCursoEditData] = useState(null);
  const [savingCurso, setSavingCurso] = useState(false);

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

  // ========== FUNÇÕES PARA GERENCIAMENTO DE UCs ==========
  
  // Carregar UCs de um curso específico
  const loadUCsFromCurso = async (cursoId) => {
    setLoadingUCs(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/cursos/${cursoId}/unidades`);
      if (response.ok) {
        const result = await response.json();
        setUcsDosCurso(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar UCs:', error);
      setUcsDosCurso([]);
    } finally {
      setLoadingUCs(false);
    }
  };

  // Selecionar curso para gerenciar UCs
  const handleSelectCursoForUC = (curso) => {
    setSelectedCursoForUC(curso);
    loadUCsFromCurso(curso.id);
    setEditingUC(null);
    setUcEditData(null);
  };

  // Iniciar edição de UC
  const handleStartEditUC = (uc) => {
    setEditingUC(uc.id);
    setUcEditData({
      ...uc,
      capacidades: uc.capacidades || uc.capacidadesTecnicas || [],
      conhecimentos: uc.conhecimentos || []
    });
  };

  // Cancelar edição de UC
  const handleCancelEditUC = () => {
    setEditingUC(null);
    setUcEditData(null);
  };

  // Salvar UC editada
  const handleSaveUC = async () => {
    if (!ucEditData) return;
    
    setSavingUC(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/unidades/${ucEditData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ucEditData)
      });

      if (response.ok) {
        // Recarregar UCs
        await loadUCsFromCurso(selectedCursoForUC.id);
        clearCache();
        setEditingUC(null);
        setUcEditData(null);
        alert('UC atualizada com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao salvar: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar UC:', error);
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSavingUC(false);
    }
  };

  // Deletar UC
  const handleDeleteUC = async (ucId) => {
    if (!confirm('Tem certeza que deseja excluir esta Unidade Curricular? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/unidades/${ucId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadUCsFromCurso(selectedCursoForUC.id);
        clearCache();
        alert('UC excluída com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao excluir: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao excluir UC:', error);
      alert(`Erro ao excluir: ${error.message}`);
    }
  };

  // Adicionar nova UC
  const handleAddNewUC = async () => {
    if (!newUCData.nome.trim()) {
      alert('O nome da UC é obrigatório');
      return;
    }

    setSavingUC(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/unidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUCData,
          cursoId: selectedCursoForUC.id,
          cursoNome: selectedCursoForUC.nome
        })
      });

      if (response.ok) {
        await loadUCsFromCurso(selectedCursoForUC.id);
        clearCache();
        setShowAddUCModal(false);
        setNewUCData({
          nome: '',
          cargaHoraria: 40,
          modulo: 'Específico I',
          objetivo: '',
          capacidades: [],
          conhecimentos: []
        });
        alert('UC criada com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao criar: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao criar UC:', error);
      alert(`Erro ao criar: ${error.message}`);
    } finally {
      setSavingUC(false);
    }
  };

  // ===== FUNÇÕES PARA GERENCIAR O CURSO =====
  
  // Iniciar edição do curso
  const handleStartEditCurso = () => {
    setCursoEditData({
      nome: selectedCursoForUC.nome || '',
      cbo: selectedCursoForUC.cbo || '',
      cargaHorariaTotal: selectedCursoForUC.cargaHorariaTotal || 0,
      eixoTecnologico: selectedCursoForUC.eixoTecnologico || '',
      areaTecnologica: selectedCursoForUC.areaTecnologica || '',
      competenciaGeral: selectedCursoForUC.competenciaGeral || '',
      tipoEnsino: selectedCursoForUC.tipoEnsino || 'tecnico'
    });
    setEditingCurso(true);
  };

  // Cancelar edição do curso
  const handleCancelEditCurso = () => {
    setEditingCurso(false);
    setCursoEditData(null);
  };

  // Salvar edição do curso
  const handleSaveCursoEdit = async () => {
    setSavingCurso(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/cursos/${selectedCursoForUC.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoEditData)
      });

      if (response.ok) {
        // Atualizar curso na lista local
        const updatedCurso = { ...selectedCursoForUC, ...cursoEditData };
        setSavedCourses(prev => prev.map(c => c.id === selectedCursoForUC.id ? updatedCurso : c));
        setSelectedCursoForUC(updatedCurso);
        setEditingCurso(false);
        setCursoEditData(null);
        clearCache();
        alert('Curso atualizado com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao atualizar: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert(`Erro ao atualizar: ${error.message}`);
    } finally {
      setSavingCurso(false);
    }
  };

  // Excluir curso inteiro
  const handleDeleteCurso = async () => {
    if (!confirm(`ATENÇÃO: Tem certeza que deseja excluir o curso "${selectedCursoForUC.nome}" e TODAS as suas UCs?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/cursos/${selectedCursoForUC.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSavedCourses(prev => prev.filter(c => c.id !== selectedCursoForUC.id));
        setSelectedCursoForUC(null);
        setUcsDosCurso([]);
        clearCache();
        alert('Curso excluído com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao excluir: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert(`Erro ao excluir: ${error.message}`);
    }
  };

  // Atualizar campo da UC em edição
  const handleUCFieldChange = (field, value) => {
    setUcEditData(prev => ({ ...prev, [field]: value }));
  };

  // Adicionar capacidade à UC em edição
  const handleAddCapacidadeToUC = () => {
    setUcEditData(prev => ({
      ...prev,
      capacidades: [
        ...prev.capacidades,
        { codigo: `CT${prev.capacidades.length + 1}`, descricao: '' }
      ]
    }));
  };

  // Editar capacidade da UC
  const handleEditUCCapacidade = (index, field, value) => {
    setUcEditData(prev => {
      const newCaps = [...prev.capacidades];
      newCaps[index] = { ...newCaps[index], [field]: value };
      return { ...prev, capacidades: newCaps };
    });
  };

  // Remover capacidade da UC
  const handleRemoveUCCapacidade = (index) => {
    setUcEditData(prev => ({
      ...prev,
      capacidades: prev.capacidades.filter((_, i) => i !== index)
    }));
  };

  // Adicionar conhecimento à UC em edição
  const handleAddConhecimentoToUC = () => {
    setUcEditData(prev => ({
      ...prev,
      conhecimentos: [
        ...(prev.conhecimentos || []),
        { topico: '', subtopicos: [] }
      ]
    }));
  };

  // Editar conhecimento da UC
  const handleEditUCConhecimento = (index, field, value) => {
    setUcEditData(prev => {
      const newCons = [...(prev.conhecimentos || [])];
      if (field === 'subtopicos') {
        // Converter string para array
        newCons[index] = { ...newCons[index], subtopicos: value.split('\n').filter(s => s.trim()) };
      } else {
        newCons[index] = { ...newCons[index], [field]: value };
      }
      return { ...prev, conhecimentos: newCons };
    });
  };

  // Remover conhecimento da UC
  const handleRemoveUCConhecimento = (index) => {
    setUcEditData(prev => ({
      ...prev,
      conhecimentos: (prev.conhecimentos || []).filter((_, i) => i !== index)
    }));
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
              onClick={() => setActiveTab('manage-ucs')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'manage-ucs'
                  ? 'text-[#004b8d] border-b-2 border-[#004b8d]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="inline-block w-4 h-4 mr-2" />
              Gerenciar Cursos ({savedCourses.length})
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

                  {/* Upload Matriz Curricular (OBRIGATÓRIO) */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#004b8d] transition-colors">
                    <Table className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Matriz Curricular (Excel) *
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Contém as UCs e cargas horárias
                      <br />
                      <span className="text-xs text-red-500 font-medium">
                        OBRIGATÓRIO - Define quais UCs serão extraídas
                      </span>
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
                      className="inline-flex items-center px-4 py-2 bg-[#004b8d] text-white rounded-lg cursor-pointer hover:bg-[#003a6d] transition-colors"
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
                    disabled={!pdfFile || !matrizFile || isProcessing}
                    className={`px-8 py-3 rounded-lg font-medium text-white ${
                      !pdfFile || !matrizFile || isProcessing
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


            {/* Tab: Gerenciar Cursos */}
            {activeTab === 'manage-ucs' && (
              <div className="space-y-6">
                {/* Seleção de Curso */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selecione o Curso para Gerenciar
                  </label>
                  <select
                    value={selectedCursoForUC?.id || ''}
                    onChange={(e) => {
                      const curso = savedCourses.find(c => c.id === e.target.value);
                      if (curso) {
                        handleSelectCursoForUC(curso);
                        setEditingCurso(false);
                        setCursoEditData(null);
                      } else {
                        setSelectedCursoForUC(null);
                        setUcsDosCurso([]);
                      }
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione um curso...</option>
                    {savedCourses.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nome} ({curso.unidadesCurriculares?.length || 0} UCs)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dados do Curso Selecionado */}
                {selectedCursoForUC && (
                  <div className="space-y-6">
                    {/* Card de Informações do Curso */}
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="bg-[#004b8d] text-white px-4 py-3 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Dados do Curso</h3>
                        <div className="flex gap-2">
                          {editingCurso ? (
                            <>
                              <button
                                onClick={handleSaveCursoEdit}
                                disabled={savingCurso}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                              >
                                {savingCurso ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelEditCurso}
                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleStartEditCurso}
                                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 flex items-center gap-1"
                              >
                                <Edit3 className="w-4 h-4" />
                                Editar Curso
                              </button>
                              <button
                                onClick={handleDeleteCurso}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir Curso
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Formulário de Edição do Curso */}
                      {editingCurso ? (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso *</label>
                            <input
                              type="text"
                              value={cursoEditData?.nome || ''}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, nome: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Nome completo do curso"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CBO</label>
                            <input
                              type="text"
                              value={cursoEditData?.cbo || ''}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, cbo: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Ex: 3121-05"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária Total</label>
                            <input
                              type="number"
                              value={cursoEditData?.cargaHorariaTotal || 0}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, cargaHorariaTotal: parseInt(e.target.value) || 0 }))}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eixo Tecnológico</label>
                            <input
                              type="text"
                              value={cursoEditData?.eixoTecnologico || ''}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, eixoTecnologico: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Ex: Informação e Comunicação"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Área Tecnológica</label>
                            <input
                              type="text"
                              value={cursoEditData?.areaTecnologica || ''}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, areaTecnologica: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Ex: TI - Desenvolvimento de Sistemas"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ensino</label>
                            <select
                              value={cursoEditData?.tipoEnsino || 'tecnico'}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, tipoEnsino: e.target.value }))}
                              className="w-full p-2 border rounded"
                            >
                              <option value="tecnico">Técnico</option>
                              <option value="aprendizagem">Aprendizagem Industrial</option>
                              <option value="qualificacao">Qualificação Profissional</option>
                              <option value="aperfeicoamento">Aperfeiçoamento</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Competência Geral</label>
                            <textarea
                              value={cursoEditData?.competenciaGeral || ''}
                              onChange={(e) => setCursoEditData(prev => ({ ...prev, competenciaGeral: e.target.value }))}
                              className="w-full p-2 border rounded h-24"
                              placeholder="Competência geral do curso..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Nome:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.nome}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">ID:</span>
                            <span className="ml-2 text-gray-800 font-mono text-xs">{selectedCursoForUC.id}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">CBO:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.cbo || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Carga Horária:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.cargaHorariaTotal || 0}h</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Eixo:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.eixoTecnologico || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Área:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.areaTecnologica || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Tipo:</span>
                            <span className="ml-2 text-gray-800">{selectedCursoForUC.tipoEnsino || 'técnico'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">UCs:</span>
                            <span className="ml-2 text-gray-800">{ucsDosCurso.length} unidades curriculares</span>
                          </div>
                          {selectedCursoForUC.competenciaGeral && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-600">Competência Geral:</span>
                              <p className="mt-1 text-gray-700 text-xs bg-gray-50 p-2 rounded">{selectedCursoForUC.competenciaGeral}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Seção de Unidades Curriculares */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-[#004b8d]">
                        Unidades Curriculares ({ucsDosCurso.length})
                      </h3>
                      <button
                        onClick={() => setShowAddUCModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar UC
                      </button>
                    </div>

                    {loadingUCs ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-[#004b8d] mr-2" size={24} />
                        <span className="text-gray-600">Carregando UCs...</span>
                      </div>
                    ) : ucsDosCurso.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma UC encontrada para este curso.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ucsDosCurso.map((uc) => (
                          <div key={uc.id} className="bg-white border rounded-lg overflow-hidden">
                            {/* Header da UC */}
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{uc.nome}</h4>
                                <p className="text-sm text-gray-500">
                                  {uc.cargaHoraria}h | {uc.modulo || 'Módulo não definido'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {editingUC === uc.id ? (
                                  <>
                                    <button
                                      onClick={handleSaveUC}
                                      disabled={savingUC}
                                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                    >
                                      {savingUC ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={handleCancelEditUC}
                                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleStartEditUC(uc)}
                                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUC(uc.id)}
                                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Formulário de Edição */}
                            {editingUC === uc.id && ucEditData && (
                              <div className="p-4 border-t space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                      type="text"
                                      value={ucEditData.nome}
                                      onChange={(e) => handleUCFieldChange('nome', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária</label>
                                    <input
                                      type="number"
                                      value={ucEditData.cargaHoraria}
                                      onChange={(e) => handleUCFieldChange('cargaHoraria', parseInt(e.target.value))}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                                    <select
                                      value={ucEditData.modulo || ''}
                                      onChange={(e) => handleUCFieldChange('modulo', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="Básico">Básico</option>
                                      <option value="Básico da Indústria">Básico da Indústria</option>
                                      <option value="Introdutório">Introdutório</option>
                                      <option value="Específico I">Específico I</option>
                                      <option value="Específico II">Específico II</option>
                                      <option value="Específico III">Específico III</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                                    <select
                                      value={ucEditData.periodo || ''}
                                      onChange={(e) => handleUCFieldChange('periodo', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="1º Período">1º Período</option>
                                      <option value="2º Período">2º Período</option>
                                      <option value="3º Período">3º Período</option>
                                      <option value="4º Período">4º Período</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                                  <textarea
                                    value={ucEditData.objetivo || ''}
                                    onChange={(e) => handleUCFieldChange('objetivo', e.target.value)}
                                    className="w-full p-2 border rounded h-20"
                                    placeholder="Objetivo da unidade curricular..."
                                  />
                                </div>

                                {/* Capacidades */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Capacidades ({ucEditData.capacidades?.length || 0})</label>
                                    <button
                                      onClick={handleAddCapacidadeToUC}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                    >
                                      <Plus className="w-3 h-3 inline mr-1" />
                                      Adicionar
                                    </button>
                                  </div>
                                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                                    {ucEditData.capacidades?.length === 0 && (
                                      <p className="text-xs text-gray-400 text-center py-2">Nenhuma capacidade cadastrada</p>
                                    )}
                                    {ucEditData.capacidades?.map((cap, idx) => (
                                      <div key={idx} className="flex gap-2 items-start bg-white p-1 rounded">
                                        <input
                                          type="text"
                                          value={cap.codigo}
                                          onChange={(e) => handleEditUCCapacidade(idx, 'codigo', e.target.value)}
                                          className="w-20 p-1 border rounded text-xs"
                                          placeholder="Código"
                                        />
                                        <input
                                          type="text"
                                          value={cap.descricao}
                                          onChange={(e) => handleEditUCCapacidade(idx, 'descricao', e.target.value)}
                                          className="flex-1 p-1 border rounded text-xs"
                                          placeholder="Descrição da capacidade"
                                        />
                                        <button
                                          onClick={() => handleRemoveUCCapacidade(idx)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Conhecimentos */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Conhecimentos ({ucEditData.conhecimentos?.length || 0})</label>
                                    <button
                                      onClick={handleAddConhecimentoToUC}
                                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                                    >
                                      <Plus className="w-3 h-3 inline mr-1" />
                                      Adicionar Tópico
                                    </button>
                                  </div>
                                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                                    {(!ucEditData.conhecimentos || ucEditData.conhecimentos.length === 0) && (
                                      <p className="text-xs text-gray-400 text-center py-2">Nenhum conhecimento cadastrado</p>
                                    )}
                                    {ucEditData.conhecimentos?.map((con, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border space-y-2">
                                        <div className="flex gap-2 items-start">
                                          <input
                                            type="text"
                                            value={con.topico}
                                            onChange={(e) => handleEditUCConhecimento(idx, 'topico', e.target.value)}
                                            className="flex-1 p-1 border rounded text-xs font-medium"
                                            placeholder="Tópico principal (ex: 1 FUNDAMENTOS)"
                                          />
                                          <button
                                            onClick={() => handleRemoveUCConhecimento(idx)}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                        <textarea
                                          value={(con.subtopicos || []).join('\n')}
                                          onChange={(e) => handleEditUCConhecimento(idx, 'subtopicos', e.target.value)}
                                          className="w-full p-1 border rounded text-xs h-16"
                                          placeholder="Subtópicos (um por linha):&#10;1.1 Subtópico A&#10;1.2 Subtópico B"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Visualização das Capacidades e Conhecimentos (quando não está editando) */}
                            {editingUC !== uc.id && (
                              <div className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Capacidades */}
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                    Capacidades: {(uc.capacidades || uc.capacidadesTecnicas || []).length}
                                  </p>
                                  {(uc.capacidades || uc.capacidadesTecnicas || []).length > 0 ? (
                                    <div className="text-xs text-gray-600 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded">
                                      {(uc.capacidades || uc.capacidadesTecnicas || []).slice(0, 3).map((cap, idx) => (
                                        <div key={idx} className="truncate">
                                          <span className="font-medium text-[#004b8d]">{cap.codigo}:</span> {cap.descricao}
                                        </div>
                                      ))}
                                      {(uc.capacidades || uc.capacidadesTecnicas || []).length > 3 && (
                                        <p className="text-gray-400 mt-1">
                                          ... e mais {(uc.capacidades || uc.capacidadesTecnicas || []).length - 3}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">Nenhuma capacidade</p>
                                  )}
                                </div>
                                {/* Conhecimentos */}
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                    Conhecimentos: {(uc.conhecimentos || []).length}
                                  </p>
                                  {(uc.conhecimentos || []).length > 0 ? (
                                    <div className="text-xs text-gray-600 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded">
                                      {(uc.conhecimentos || []).slice(0, 3).map((con, idx) => (
                                        <div key={idx} className="truncate">
                                          <span className="font-medium text-green-700">{con.topico}</span>
                                        </div>
                                      ))}
                                      {(uc.conhecimentos || []).length > 3 && (
                                        <p className="text-gray-400 mt-1">
                                          ... e mais {(uc.conhecimentos || []).length - 3} tópicos
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-red-400 italic">Nenhum conhecimento cadastrado</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Modal para Adicionar Nova UC */}
                {showAddUCModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#004b8d]">Adicionar Nova UC</h3>
                        <button onClick={() => setShowAddUCModal(false)} className="text-gray-500 hover:text-gray-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                          <input
                            type="text"
                            value={newUCData.nome}
                            onChange={(e) => setNewUCData(prev => ({ ...prev, nome: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Nome da Unidade Curricular"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária</label>
                            <input
                              type="number"
                              value={newUCData.cargaHoraria}
                              onChange={(e) => setNewUCData(prev => ({ ...prev, cargaHoraria: parseInt(e.target.value) }))}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                            <select
                              value={newUCData.modulo}
                              onChange={(e) => setNewUCData(prev => ({ ...prev, modulo: e.target.value }))}
                              className="w-full p-2 border rounded"
                            >
                              <option value="Básico">Básico</option>
                              <option value="Básico da Indústria">Básico da Indústria</option>
                              <option value="Introdutório">Introdutório</option>
                              <option value="Específico I">Específico I</option>
                              <option value="Específico II">Específico II</option>
                              <option value="Específico III">Específico III</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                          <textarea
                            value={newUCData.objetivo}
                            onChange={(e) => setNewUCData(prev => ({ ...prev, objetivo: e.target.value }))}
                            className="w-full p-2 border rounded h-20"
                            placeholder="Objetivo da unidade curricular..."
                          />
                        </div>
                      </div>
                      <div className="p-4 border-t flex justify-end gap-3">
                        <button
                          onClick={() => setShowAddUCModal(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleAddNewUC}
                          disabled={savingUC}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {savingUC ? 'Salvando...' : 'Criar UC'}
                        </button>
                      </div>
                    </div>
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
            <li>A <strong>Matriz Curricular (Excel)</strong> é <span className="text-red-600 font-medium">OBRIGATÓRIA</span> - define quais UCs serão extraídas do PPC.</li>
            <li>O <strong>PPC do Curso (PDF)</strong> é <span className="text-red-600 font-medium">OBRIGATÓRIO</span> - contém capacidades e conhecimentos de cada UC.</li>
            <li>Após o processamento, revise os dados extraídos e faça ajustes se necessário.</li>
            <li>Use a aba <strong>"Gerenciar UCs"</strong> para editar nome, carga horária, objetivo e capacidades das UCs já cadastradas.</li>
            <li>Os cursos salvos ficarão disponíveis em todas as funcionalidades do sistema.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
