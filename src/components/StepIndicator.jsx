import { Check } from 'lucide-react';
import { useProva, TIPO_AVALIACAO } from '../context/ProvaContext';

const stepsObjetiva = [
  { id: 1, name: 'Dados Básicos' },
  { id: 2, name: 'Capacidades' },
  { id: 3, name: 'Gerar Questões' },
  { id: 4, name: 'Visualizar Prova' }
];

const stepsPratica = [
  { id: 1, name: 'Dados Básicos' },
  { id: 2, name: 'Capacidades' },
  { id: 3, name: 'Configurar Avaliação' },
  { id: 4, name: 'Visualizar Prática' }
];

const stepsSA = [
  { id: 1, name: 'Dados Básicos' },
  { id: 2, name: 'Capacidades' },
  { id: 3, name: 'Gerar SA' },
  { id: 4, name: 'Visualizar SA' }
];

const stepsPlano = [
  { id: 1, name: 'Dados Básicos' },
  { id: 2, name: 'Capacidades' },
  { id: 3, name: 'Configurar Plano' },
  { id: 4, name: 'Visualizar Plano' }
];

export default function StepIndicator() {
  const { currentStep, goToStep, questoesGeradas, avaliacaoPraticaGerada, situacaoAprendizagemGerada, planoEnsinoGerado, tipoAvaliacao } = useProva();
  
  const getSteps = () => {
    if (tipoAvaliacao === TIPO_AVALIACAO.PRATICA) return stepsPratica;
    if (tipoAvaliacao === TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM) return stepsSA;
    if (tipoAvaliacao === TIPO_AVALIACAO.PLANO_ENSINO) return stepsPlano;
    return stepsObjetiva;
  };

  const getHasResult = () => {
    if (tipoAvaliacao === TIPO_AVALIACAO.PRATICA) return avaliacaoPraticaGerada;
    if (tipoAvaliacao === TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM) return situacaoAprendizagemGerada;
    if (tipoAvaliacao === TIPO_AVALIACAO.PLANO_ENSINO) return planoEnsinoGerado;
    return questoesGeradas;
  };

  const steps = getSteps();
  const hasResult = getHasResult();

  const canNavigateTo = (stepId) => {
    // Pode voltar para qualquer passo anterior
    if (stepId < currentStep) return true;
    // Só pode ir para o passo 4 se tiver resultado gerado
    if (stepId === 4 && !hasResult) return false;
    // Pode ir para o próximo passo
    if (stepId === currentStep + 1) return true;
    return false;
  };

  return (
    <div className="w-full py-6 no-print">
      <div className="flex items-center justify-center max-w-4xl mx-auto px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle + Label */}
            <div className="flex items-center">
              <button
                onClick={() => canNavigateTo(step.id) && goToStep(step.id)}
                disabled={!canNavigateTo(step.id)}
                className={`
                  flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full 
                  font-semibold text-sm transition-all duration-300 flex-shrink-0
                  ${currentStep === step.id 
                    ? 'bg-[#004b8d] text-white ring-4 ring-blue-200' 
                    : currentStep > step.id 
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${canNavigateTo(step.id) && currentStep !== step.id ? 'cursor-pointer' : ''}
                `}
              >
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  step.id
                )}
              </button>
              
              {/* Step Label */}
              <span 
                className={`
                  ml-2 text-sm font-medium hidden sm:block whitespace-nowrap
                  ${currentStep === step.id 
                    ? 'text-[#004b8d]' 
                    : currentStep > step.id 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }
                `}
              >
                {step.name}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-8 md:w-12 h-1 mx-2 rounded flex-shrink-0
                  ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
