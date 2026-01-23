import { useState, useEffect } from 'react';
import { ChevronRight, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { useProva, TIPO_AVALIACAO } from '../../context/ProvaContext';
import { getCursos, getUnidadesByCurso, TIPO_ENSINO, getTermoCapacidade } from '../../services/apiService';

export default function Step1DadosBasicos() {
  const { dadosProva, updateDadosProva, nextStep, tipoAvaliacao } = useProva();
  const [errors, setErrors] = useState({});
  const [cursos, setCursos] = useState([]);
  const [unidadesCurriculares, setUnidadesCurriculares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUCs, setLoadingUCs] = useState(false);

  // Carregar cursos do banco de dados
  useEffect(() => {
    async function loadCursos() {
      try {
        setLoading(true);
        const data = await getCursos();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCursos();
  }, []);

  // Carregar UCs quando curso mudar
  useEffect(() => {
    async function loadUCs() {
      if (!dadosProva.cursoId) {
        setUnidadesCurriculares([]);
        return;
      }
      try {
        setLoadingUCs(true);
        const data = await getUnidadesByCurso(dadosProva.cursoId);
        setUnidadesCurriculares(data);
      } catch (error) {
        console.error('Erro ao carregar UCs:', error);
        setUnidadesCurriculares([]);
      } finally {
        setLoadingUCs(false);
      }
    }
    loadUCs();
  }, [dadosProva.cursoId]);

  // Filtrar cursos por tipo de ensino
  const cursosFiltrados = cursos.filter(c => c.tipoEnsino === dadosProva.tipoEnsino);

  // Atualizar curso quando mudar tipo de ensino
  useEffect(() => {
    if (dadosProva.cursoId && cursos.length > 0) {
      const cursoAtual = cursos.find(c => c.id === dadosProva.cursoId);
      if (cursoAtual && cursoAtual.tipoEnsino !== dadosProva.tipoEnsino) {
        updateDadosProva({ cursoId: '', curso: '', unidadeCurricular: '', unidadeCurricularId: '', capacidades: [] });
      }
    }
  }, [dadosProva.tipoEnsino, cursos]);

  const handleCursoChange = (cursoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    updateDadosProva({
      cursoId,
      curso: curso?.nome || '',
      unidadeCurricular: '',
      unidadeCurricularId: '',
      capacidades: []
    });
  };

  const handleUnidadeCurricularChange = (ucId) => {
    const uc = unidadesCurriculares.find(u => u.id === ucId);
    updateDadosProva({
      unidadeCurricular: uc?.nome || '',
      unidadeCurricularId: ucId,
      capacidades: []
    });
  };

  // Verificar se precisa dos campos de turma/data/professor
  const precisaDadosProva = tipoAvaliacao !== TIPO_AVALIACAO.PLANO_ENSINO;

  const validate = () => {
    const newErrors = {};
    
    // Campos obrigatórios apenas para provas e avaliações (não para Plano de Ensino)
    if (precisaDadosProva) {
      if (!dadosProva.turma.trim()) newErrors.turma = 'Campo obrigatório';
      if (!dadosProva.professor.trim()) newErrors.professor = 'Campo obrigatório';
      if (!dadosProva.data) newErrors.data = 'Campo obrigatório';
    }
    
    // Sempre obrigatórios
    if (!dadosProva.cursoId) newErrors.curso = 'Selecione um curso';
    if (!dadosProva.unidadeCurricular) newErrors.unidadeCurricular = 'Selecione uma unidade curricular';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const termoCapacidade = getTermoCapacidade(dadosProva.tipoEnsino);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <BookOpen className="text-[#004b8d]" />
          {tipoAvaliacao === TIPO_AVALIACAO.PLANO_ENSINO 
            ? 'Dados do Plano de Ensino' 
            : tipoAvaliacao === TIPO_AVALIACAO.SITUACAO_APRENDIZAGEM
              ? 'Dados da Situação de Aprendizagem'
              : 'Dados Básicos da Prova'}
        </h2>

        <div className="space-y-6">
          {/* Tipo de Ensino */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Ensino
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateDadosProva({ tipoEnsino: TIPO_ENSINO.TECNICO })}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${dadosProva.tipoEnsino === TIPO_ENSINO.TECNICO
                    ? 'border-[#004b8d] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={dadosProva.tipoEnsino === TIPO_ENSINO.TECNICO ? 'text-[#004b8d]' : 'text-gray-400'} />
                  <div>
                    <p className="font-semibold">Ensino Técnico</p>
                    <p className="text-sm text-gray-500">Usa "Capacidade"</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => updateDadosProva({ tipoEnsino: TIPO_ENSINO.INTEGRADO })}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${dadosProva.tipoEnsino === TIPO_ENSINO.INTEGRADO
                    ? 'border-[#004b8d] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={dadosProva.tipoEnsino === TIPO_ENSINO.INTEGRADO ? 'text-[#004b8d]' : 'text-gray-400'} />
                  <div>
                    <p className="font-semibold">Ensino Médio Integrado</p>
                    <p className="text-sm text-gray-500">Usa "Habilidade"</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Curso */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Curso Técnico em <span className="text-red-500">*</span>
            </label>
            <select
              value={dadosProva.cursoId}
              onChange={(e) => handleCursoChange(e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                ${errors.curso ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">{loading ? 'Carregando cursos...' : 'Selecione o curso...'}</option>
              {cursosFiltrados.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
            {loading && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            )}
            {errors.curso && <p className="mt-1 text-sm text-red-500">{errors.curso}</p>}
          </div>

          {/* Unidade Curricular */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unidade Curricular <span className="text-red-500">*</span>
            </label>
            <select
              value={dadosProva.unidadeCurricularId || ''}
              onChange={(e) => handleUnidadeCurricularChange(e.target.value)}
              disabled={!dadosProva.cursoId || loadingUCs}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                ${errors.unidadeCurricular ? 'border-red-500' : 'border-gray-300'}
                ${!dadosProva.cursoId ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            >
              <option value="">{loadingUCs ? 'Carregando...' : 'Selecione a unidade curricular...'}</option>
              {unidadesCurriculares.map(uc => (
                <option key={uc.id} value={uc.id}>
                  {uc.nome} ({uc.cargaHoraria}h)
                </option>
              ))}
            </select>
            {loadingUCs && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            )}
            {errors.unidadeCurricular && <p className="mt-1 text-sm text-red-500">{errors.unidadeCurricular}</p>}
          </div>

          {/* Campos de Turma, Data e Professor - apenas para provas/avaliações */}
          {precisaDadosProva && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Turma */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Turma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dadosProva.turma}
                    onChange={(e) => updateDadosProva({ turma: e.target.value })}
                    placeholder="Ex: T DESI 2024/1 M"
                    className={`
                      w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                      ${errors.turma ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {errors.turma && <p className="mt-1 text-sm text-red-500">{errors.turma}</p>}
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dadosProva.data}
                    onChange={(e) => updateDadosProva({ data: e.target.value })}
                    className={`
                      w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                      ${errors.data ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {errors.data && <p className="mt-1 text-sm text-red-500">{errors.data}</p>}
                </div>
              </div>

              {/* Professor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Professor(a) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dadosProva.professor}
                  onChange={(e) => updateDadosProva({ professor: e.target.value })}
                  placeholder="Nome completo do professor"
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                    ${errors.professor ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.professor && <p className="mt-1 text-sm text-red-500">{errors.professor}</p>}
              </div>
            </>
          )}

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Termo utilizado:</strong> {termoCapacidade}
              <br />
              <span className="text-blue-600">
                {dadosProva.tipoEnsino === TIPO_ENSINO.INTEGRADO 
                  ? 'O Ensino Médio Integrado ao Técnico (SESI/SENAI) utiliza o termo "Habilidade".'
                  : 'O Ensino Técnico utiliza o termo "Capacidade Técnica".'}
              </span>
            </p>
          </div>
        </div>

        {/* Botão Próximo */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#004b8d] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Próximo: Selecionar {termoCapacidade}s
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
