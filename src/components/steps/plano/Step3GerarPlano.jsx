import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Loader2, AlertCircle, Calendar, FileText, Target, Building2, CheckSquare, Wrench, Plus, X } from 'lucide-react';
import { useProva } from '../../../context/ProvaContext';
import { 
  gerarPlanoEnsino, 
  AMBIENTES_PEDAGOGICOS, 
  INSTRUMENTOS_AVALIACAO,
  FERRAMENTAS_COMUNS,
  ESTRATEGIAS_ENSINO
} from '../../../services/planoEnsinoService';
import { getCursoById, getUnidadeById } from '../../../services/apiService';

export default function Step3GerarPlano() {
  const { 
    dadosProva, 
    prevStep, 
    nextStep, 
    termoCapacidade,
    setPlanoEnsinoGerado,
    planoEnsinoGerado,
    apiConfigured
  } = useProva();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [ucSelecionada, setUcSelecionada] = useState(null);
  
  // Campos do SGN
  const [cargaHoraria, setCargaHoraria] = useState(80);
  const [periodo, setPeriodo] = useState('2025/1');
  const [competenciaGeral, setCompetenciaGeral] = useState('');
  
  // Carregar dados do curso e UC do banco de dados
  useEffect(() => {
    async function loadCursoData() {
      if (dadosProva.cursoId) {
        try {
          const curso = await getCursoById(dadosProva.cursoId);
          setCursoSelecionado(curso);
          if (curso?.competenciaGeral) {
            setCompetenciaGeral(curso.competenciaGeral);
          }
        } catch (error) {
          console.error('Erro ao carregar curso:', error);
        }
      }
    }
    loadCursoData();
  }, [dadosProva.cursoId]);
  
  // Carregar dados da UC
  useEffect(() => {
    async function loadUCData() {
      if (dadosProva.unidadeCurricularId) {
        try {
          const uc = await getUnidadeById(dadosProva.unidadeCurricularId);
          setUcSelecionada(uc);
          if (uc?.cargaHoraria) {
            setCargaHoraria(uc.cargaHoraria);
          }
        } catch (error) {
          console.error('Erro ao carregar UC:', error);
        }
      }
    }
    loadUCData();
  }, [dadosProva.unidadeCurricularId]);
  const [ambientesSelecionados, setAmbientesSelecionados] = useState(['Sala de Aula', 'Laboratório de informática']);
  const [ambienteCustom, setAmbienteCustom] = useState('');
  const [instrumentosSelecionados, setInstrumentosSelecionados] = useState(['Exercícios teóricos e práticos', 'Avaliações objetivas', 'Avaliações práticas']);
  const [ferramentasSelecionadas, setFerramentasSelecionadas] = useState([]);
  const [ferramentaCustom, setFerramentaCustom] = useState('');
  const [quantidadeBlocos, setQuantidadeBlocos] = useState(null); // null = automático baseado na CH
  const [contextoAdicional, setContextoAdicional] = useState('');

  // Preparar capacidades para exibição
  const capacidadesSelecionadas = dadosProva.capacidades.map(cap => ({
    codigo: cap.codigo,
    descricao: cap.descricao
  }));

  // Toggle funções
  const toggleAmbiente = (ambiente) => {
    setAmbientesSelecionados(prev => 
      prev.includes(ambiente) ? prev.filter(a => a !== ambiente) : [...prev, ambiente]
    );
  };

  const addAmbienteCustom = () => {
    if (ambienteCustom.trim() && !ambientesSelecionados.includes(ambienteCustom.trim())) {
      setAmbientesSelecionados(prev => [...prev, ambienteCustom.trim()]);
      setAmbienteCustom('');
    }
  };

  const toggleInstrumento = (instrumento) => {
    setInstrumentosSelecionados(prev => 
      prev.includes(instrumento) ? prev.filter(i => i !== instrumento) : [...prev, instrumento]
    );
  };

  const toggleFerramenta = (ferramenta) => {
    setFerramentasSelecionadas(prev => 
      prev.includes(ferramenta) ? prev.filter(f => f !== ferramenta) : [...prev, ferramenta]
    );
  };

  const addFerramentaCustom = () => {
    if (ferramentaCustom.trim() && !ferramentasSelecionadas.includes(ferramentaCustom.trim())) {
      setFerramentasSelecionadas(prev => [...prev, ferramentaCustom.trim()]);
      setFerramentaCustom('');
    }
  };

  const removeItem = (list, setList, item) => {
    setList(prev => prev.filter(i => i !== item));
  };

  // Todas as ferramentas disponíveis (prioritárias primeiro)
  const todasFerramentas = [
    ...FERRAMENTAS_COMUNS.prioritarias,
    ...FERRAMENTAS_COMUNS.informatica,
    ...FERRAMENTAS_COMUNS.programacao,
    ...FERRAMENTAS_COMUNS.redes,
    ...FERRAMENTAS_COMUNS.geral
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicatas

  const handleGerarPlano = async () => {
    // Validações
    if (!competenciaGeral.trim()) {
      setError('Informe a competência geral do curso.');
      return;
    }
    if (ambientesSelecionados.length === 0) {
      setError('Selecione pelo menos um ambiente pedagógico.');
      return;
    }
    if (instrumentosSelecionados.length === 0) {
      setError('Selecione pelo menos um instrumento de avaliação.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Buscar conhecimentos da UC selecionada
      const conhecimentosUC = ucSelecionada?.conhecimentos || [];
      
      const plano = await gerarPlanoEnsino({
        curso: dadosProva.curso,
        unidadeCurricular: dadosProva.unidadeCurricular,
        capacidades: capacidadesSelecionadas,
        cargaHoraria,
        periodo,
        competenciaGeral,
        ambientesPedagogicos: ambientesSelecionados,
        instrumentosAvaliacao: instrumentosSelecionados,
        ferramentas: ferramentasSelecionadas,
        contextoAdicional,
        termoCapacidade,
        quantidadeBlocos,
        conhecimentosUC
      });

      setPlanoEnsinoGerado({
        ...plano,
        docente: dadosProva.professor,
        turma: dadosProva.turma
      });

    } catch (err) {
      console.error('Erro ao gerar Plano de Ensino:', err);
      setError(err.message || 'Erro ao gerar Plano de Ensino. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProximo = () => {
    if (planoEnsinoGerado) {
      nextStep();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FileText className="text-purple-600" />
          Configurar Plano de Ensino (SGN)
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Preencha os campos abaixo para gerar o Plano de Ensino compatível com o sistema SGN do SENAI.
        </p>

        {/* Resumo dos dados */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Dados da Turma</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Curso:</span>
              <span className="ml-2 font-medium">{dadosProva.curso}</span>
            </div>
            <div>
              <span className="text-gray-500">UC:</span>
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
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Target size={18} />
            {termoCapacidade}s a Desenvolver ({capacidadesSelecionadas.length})
          </h3>
          <ul className="space-y-2 text-sm max-h-32 overflow-y-auto">
            {capacidadesSelecionadas.map((cap, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-purple-900">
                  <strong>{cap.codigo}:</strong> {cap.descricao}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Campos do SGN */}
        <div className="space-y-5 mb-6">
          
          {/* Competência Geral do Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competência Geral do Curso *
              <span className="text-xs text-gray-400 ml-2">(Campo obrigatório no SGN)</span>
            </label>
            <textarea
              value={competenciaGeral}
              onChange={(e) => setCompetenciaGeral(e.target.value)}
              placeholder="Ex: Desenvolver e programar sistemas computacionais, atendendo normas e padrão de qualidade, usabilidade, integridade e segurança da informação."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Linha: Carga Horária, Período e Qtd SAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Carga Horária Total (h)
              </label>
              <input
                type="number"
                min="20"
                max="400"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(parseInt(e.target.value) || 80)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período/Semestre
              </label>
              <input
                type="text"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ex: 2025/1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de Blocos de Aula
              </label>
              <select
                value={quantidadeBlocos || ''}
                onChange={(e) => setQuantidadeBlocos(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Automático (mínimo 20h por bloco)</option>
                <option value={2}>2 Blocos</option>
                <option value={3}>3 Blocos</option>
                <option value={4}>4 Blocos</option>
                <option value={5}>5 Blocos</option>
                <option value={6}>6 Blocos</option>
                <option value={8}>8 Blocos</option>
                <option value={10}>10 Blocos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Cada bloco tem no mínimo 20h de aula. Automático: {Math.max(1, Math.floor(cargaHoraria / 20))} blocos para {cargaHoraria}h
              </p>
            </div>
          </div>

          {/* Ambientes Pedagógicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 size={16} className="inline mr-1" />
              Ambientes Pedagógicos *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {AMBIENTES_PEDAGOGICOS.map(ambiente => (
                <button
                  key={ambiente}
                  type="button"
                  onClick={() => toggleAmbiente(ambiente)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    ambientesSelecionados.includes(ambiente)
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {ambiente}
                </button>
              ))}
            </div>
            {/* Adicionar ambiente customizado */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={ambienteCustom}
                onChange={(e) => setAmbienteCustom(e.target.value)}
                placeholder="Adicionar outro ambiente..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addAmbienteCustom()}
              />
              <button
                type="button"
                onClick={addAmbienteCustom}
                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Ambientes selecionados */}
            {ambientesSelecionados.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Selecionados ({ambientesSelecionados.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {ambientesSelecionados.map(amb => (
                    <span key={amb} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                      {amb}
                      <button onClick={() => removeItem(ambientesSelecionados, setAmbientesSelecionados, amb)} className="hover:text-purple-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ferramentas/Softwares */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Wrench size={16} className="inline mr-1" />
              Ferramentas e Softwares
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {todasFerramentas.map(ferramenta => (
                <button
                  key={ferramenta}
                  type="button"
                  onClick={() => toggleFerramenta(ferramenta)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    ferramentasSelecionadas.includes(ferramenta)
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {ferramenta}
                </button>
              ))}
            </div>
            {/* Adicionar ferramenta customizada */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={ferramentaCustom}
                onChange={(e) => setFerramentaCustom(e.target.value)}
                placeholder="Adicionar outra ferramenta..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addFerramentaCustom()}
              />
              <button
                type="button"
                onClick={addFerramentaCustom}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Ferramentas selecionadas */}
            {ferramentasSelecionadas.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Selecionadas ({ferramentasSelecionadas.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {ferramentasSelecionadas.map(fer => (
                    <span key={fer} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                      {fer}
                      <button onClick={() => removeItem(ferramentasSelecionadas, setFerramentasSelecionadas, fer)} className="hover:text-blue-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instrumentos de Avaliação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CheckSquare size={16} className="inline mr-1" />
              Outros Instrumentos de Avaliação *
            </label>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTOS_AVALIACAO.map(instrumento => (
                <button
                  key={instrumento}
                  type="button"
                  onClick={() => toggleInstrumento(instrumento)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    instrumentosSelecionados.includes(instrumento)
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-green-300'
                  }`}
                >
                  {instrumento}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {instrumentosSelecionados.length} instrumento(s) selecionado(s)
            </p>
          </div>

          {/* Contexto Adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientações Adicionais (opcional)
            </label>
            <textarea
              value={contextoAdicional}
              onChange={(e) => setContextoAdicional(e.target.value)}
              placeholder="Informações adicionais: perfil da turma, projetos integradores, parcerias com empresas, contexto específico..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Erro ao gerar Plano</p>
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

        {/* Preview do Plano gerado */}
        {planoEnsinoGerado && (
          <>
            {/* Aviso de IA */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-800 font-medium">⚠️ Conteúdo gerado por Inteligência Artificial</p>
                  <p className="text-amber-700 text-sm mt-1">
                    O Plano de Ensino abaixo foi gerado por IA e pode conter erros, imprecisões ou informações desatualizadas. 
                    <strong className="block mt-1">É fundamental revisar todo o conteúdo cuidadosamente antes de utilizá-lo.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">
                ✓ Plano de Ensino Gerado para o SGN
              </h3>
            <p className="text-green-700 font-medium">
              {planoEnsinoGerado.unidadeCurricular}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Blocos de Aula:</span>
                <span className="ml-1 font-medium">{planoEnsinoGerado.blocosAula?.length || 0}</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">Carga Horária:</span>
                <span className="ml-1 font-medium">{planoEnsinoGerado.cargaHoraria}h</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">{termoCapacidade}s:</span>
                <span className="ml-1 font-medium">{planoEnsinoGerado.capacidades?.length || 0}</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-gray-500">SA:</span>
                <span className="ml-1 font-medium">{planoEnsinoGerado.situacaoAprendizagem ? '✓' : '—'}</span>
              </div>
            </div>
            {planoEnsinoGerado.situacaoAprendizagem && (
              <div className="mt-2 p-2 bg-white rounded">
                <span className="text-gray-500 text-xs">Situação de Aprendizagem:</span>
                <p className="text-green-800 font-medium text-sm">{planoEnsinoGerado.situacaoAprendizagem.titulo}</p>
              </div>
            )}
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
            <button
              onClick={handleGerarPlano}
              disabled={isLoading || !apiConfigured}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Gerando Plano...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {planoEnsinoGerado ? 'Gerar Novamente' : 'Gerar com IA'}
                </>
              )}
            </button>

            {planoEnsinoGerado && (
              <button
                onClick={handleProximo}
                className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-[#003a6d] transition-colors"
              >
                Visualizar Plano
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
