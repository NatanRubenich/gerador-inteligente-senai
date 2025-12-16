import { RotateCcw, Brain, FileText, Wrench, BookOpen, ClipboardList } from 'lucide-react';
import { useProva, TIPO_AVALIACAO } from '../context/ProvaContext';
import { isApiConfigured } from '../services/llmService';

export default function Header() {
  const { resetProva, tipoAvaliacao } = useProva();
  const apiConfigurada = isApiConfigured();

  return (
    <header className="bg-[#004b8d] text-white shadow-lg no-print">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={resetProva}
              title="Voltar ao início"
            >
              <img 
                src={`${import.meta.env.BASE_URL}senai.png`} 
                alt="SENAI" 
                className="h-10 w-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gerador de Provas</h1>
              <p className="text-blue-200 text-sm flex items-center gap-2">
                <Brain size={14} />
                RAG + IA Integrado
                {tipoAvaliacao && (
                  <>
                    <span className="mx-1">•</span>
                    {tipoAvaliacao === TIPO_AVALIACAO.OBJETIVA && (
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        Objetiva
                      </span>
                    )}
                    {tipoAvaliacao === TIPO_AVALIACAO.PRATICA && (
                      <span className="flex items-center gap-1 text-orange-300">
                        <Wrench size={12} />
                        Prática
                      </span>
                    )}
                    {tipoAvaliacao === TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM && (
                      <span className="flex items-center gap-1 text-green-300">
                        <BookOpen size={12} />
                        Situação de Aprendizagem
                      </span>
                    )}
                    {tipoAvaliacao === TIPO_AVALIACAO.PLANO_ENSINO && (
                      <span className="flex items-center gap-1 text-purple-300">
                        <ClipboardList size={12} />
                        Plano de Ensino
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status da API */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              apiConfigurada ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${apiConfigurada ? 'bg-green-400' : 'bg-amber-400'}`}></span>
              {apiConfigurada ? 'API Conectada' : 'API não configurada'}
            </div>
            
            <button
              onClick={resetProva}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
              title="Nova Prova"
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Nova Prova</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
