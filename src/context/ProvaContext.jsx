import { createContext, useContext, useState, useCallback } from 'react';
import { TIPO_ENSINO, getTermoCapacidade } from '../data/cursos';
import { isApiConfigured } from '../services/llmService';

const ProvaContext = createContext(null);

// Tipos de avaliação
export const TIPO_AVALIACAO = {
  OBJETIVA: 'objetiva',
  PRATICA: 'pratica',
  SITUACAO_APRENDIZAGEM: 'situacao_aprendizagem',
  PLANO_ENSINO: 'plano_ensino'
};

export function ProvaProvider({ children }) {
  // Verificar se API está configurada
  const apiConfigured = isApiConfigured();

  // Tipo de avaliação selecionado (null = não selecionado ainda)
  const [tipoAvaliacao, setTipoAvaliacao] = useState(null);

  // Estado dos dados da prova
  const [dadosProva, setDadosProva] = useState({
    turma: '',
    professor: '',
    unidadeCurricular: '',
    data: '',
    curso: '',
    cursoId: '',
    tipoEnsino: TIPO_ENSINO.TECNICO,
    dificuldades: ['Médio'], // Array de dificuldades selecionadas
    capacidades: [],
    quantidade: 10,
    assunto: ''
  });

  // Estado das questões geradas (avaliação objetiva)
  const [questoesGeradas, setQuestoesGeradas] = useState(null);

  // Estado da avaliação prática gerada
  const [avaliacaoPraticaGerada, setAvaliacaoPraticaGerada] = useState(null);

  // Estado da situação de aprendizagem gerada
  const [situacaoAprendizagemGerada, setSituacaoAprendizagemGerada] = useState(null);

  // Estado do plano de ensino gerado
  const [planoEnsinoGerado, setPlanoEnsinoGerado] = useState(null);

  // Estado de loading
  const [isLoading, setIsLoading] = useState(false);

  // Estado de erro
  const [error, setError] = useState(null);

  // Estado do passo atual do wizard
  const [currentStep, setCurrentStep] = useState(1);

  // Atualizar dados da prova
  const updateDadosProva = useCallback((newData) => {
    setDadosProva(prev => ({ ...prev, ...newData }));
  }, []);

  // Obter termo correto (Capacidade ou Habilidade)
  const termoCapacidade = getTermoCapacidade(dadosProva.tipoEnsino);

  // Resetar prova
  const resetProva = useCallback(() => {
    setDadosProva({
      turma: '',
      professor: '',
      unidadeCurricular: '',
      data: '',
      curso: '',
      cursoId: '',
      tipoEnsino: TIPO_ENSINO.TECNICO,
      dificuldades: ['Médio'],
      capacidades: [],
      quantidade: 10,
      assunto: ''
    });
    setQuestoesGeradas(null);
    setAvaliacaoPraticaGerada(null);
    setSituacaoAprendizagemGerada(null);
    setPlanoEnsinoGerado(null);
    setTipoAvaliacao(null);
    setCurrentStep(1);
    setError(null);
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
