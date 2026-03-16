import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { TIPO_ENSINO, getTermoCapacidade } from '../services/apiService';
import { isApiConfigured } from '../services/llmService';

const ProvaContext = createContext(null);

// Tipos de avaliação
export const TIPO_AVALIACAO = {
  OBJETIVA: 'objetiva',
  PRATICA: 'pratica',
  SITUACAO_APRENDIZAGEM: 'situacao_aprendizagem',
  PLANO_ENSINO: 'plano_ensino'
};

const STORAGE_KEY = 'gerador-inteligente-rascunho';

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

const defaultDadosProva = {
  turma: '',
  professor: '',
  unidadeCurricular: '',
  unidadeCurricularId: '',
  data: '',
  curso: '',
  cursoId: '',
  tipoEnsino: TIPO_ENSINO.TECNICO,
  dificuldades: ['Médio'],
  capacidades: [],
  quantidade: 10,
  assunto: ''
};

export function ProvaProvider({ children }) {
  // Verificar se API está configurada
  const apiConfigured = isApiConfigured();

  // Carregar rascunho do localStorage
  const draft = useRef(loadDraft()).current;

  // Tipo de avaliação selecionado (null = não selecionado ainda)
  const [tipoAvaliacao, setTipoAvaliacao] = useState(draft?.tipoAvaliacao || null);

  // Estado dos dados da prova
  const [dadosProva, setDadosProva] = useState(draft?.dadosProva || defaultDadosProva);

  // Estado das questões geradas (avaliação objetiva)
  const [questoesGeradas, setQuestoesGeradas] = useState(draft?.questoesGeradas || null);

  // Estado da avaliação prática gerada
  const [avaliacaoPraticaGerada, setAvaliacaoPraticaGerada] = useState(draft?.avaliacaoPraticaGerada || null);

  // Estado da situação de aprendizagem gerada
  const [situacaoAprendizagemGerada, setSituacaoAprendizagemGerada] = useState(draft?.situacaoAprendizagemGerada || null);

  // Estado do plano de ensino gerado
  const [planoEnsinoGerado, setPlanoEnsinoGerado] = useState(draft?.planoEnsinoGerado || null);

  // Estado de loading
  const [isLoading, setIsLoading] = useState(false);

  // Estado de erro
  const [error, setError] = useState(null);

  // Estado do passo atual do wizard
  const [currentStep, setCurrentStep] = useState(draft?.currentStep || 1);

  // Salvar rascunho no localStorage sempre que o estado mudar
  useEffect(() => {
    if (!tipoAvaliacao && currentStep === 1) return;
    saveDraft({
      tipoAvaliacao,
      dadosProva,
      questoesGeradas,
      avaliacaoPraticaGerada,
      situacaoAprendizagemGerada,
      planoEnsinoGerado,
      currentStep
    });
  }, [tipoAvaliacao, dadosProva, questoesGeradas, avaliacaoPraticaGerada, situacaoAprendizagemGerada, planoEnsinoGerado, currentStep]);

  // Atualizar dados da prova
  const updateDadosProva = useCallback((newData) => {
    setDadosProva(prev => ({ ...prev, ...newData }));
  }, []);

  // Obter termo correto (Capacidade ou Habilidade)
  const termoCapacidade = getTermoCapacidade(dadosProva.tipoEnsino);

  // Resetar prova
  const resetProva = useCallback(() => {
    setDadosProva(defaultDadosProva);
    setQuestoesGeradas(null);
    setAvaliacaoPraticaGerada(null);
    setSituacaoAprendizagemGerada(null);
    setPlanoEnsinoGerado(null);
    setTipoAvaliacao(null);
    setCurrentStep(1);
    setError(null);
    clearDraft();
  }, []);

  // Selecionar tipo de avaliação
  const selectTipoAvaliacao = useCallback((tipo) => {
    setTipoAvaliacao(tipo);
  }, []);

  // Navegar entre passos
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const value = {
    // API configurada
    apiConfigured,

    // Tipo de avaliação
    tipoAvaliacao,
    selectTipoAvaliacao,
    
    // Dados da prova
    dadosProva,
    updateDadosProva,
    termoCapacidade,
    
    // Questões (avaliação objetiva)
    questoesGeradas,
    setQuestoesGeradas,

    // Avaliação prática
    avaliacaoPraticaGerada,
    setAvaliacaoPraticaGerada,

    // Situação de Aprendizagem
    situacaoAprendizagemGerada,
    setSituacaoAprendizagemGerada,

    // Plano de Ensino
    planoEnsinoGerado,
    setPlanoEnsinoGerado,
    
    // Loading e erro
    isLoading,
    setIsLoading,
    error,
    setError,
    
    // Navegação
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    
    // Reset
    resetProva
  };

  return (
    <ProvaContext.Provider value={value}>
      {children}
    </ProvaContext.Provider>
  );
}

export function useProva() {
  const context = useContext(ProvaContext);
  if (!context) {
    throw new Error('useProva deve ser usado dentro de um ProvaProvider');
  }
  return context;
}

export default ProvaContext;
