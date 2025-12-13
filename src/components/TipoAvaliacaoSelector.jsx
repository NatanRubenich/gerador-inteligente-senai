import { FileText, Wrench, BookOpen, ClipboardList, ChevronRight } from 'lucide-react';

export default function TipoAvaliacaoSelector({ onSelect }) {
  const opcoes = [
    {
      id: 'objetiva',
      titulo: 'Avaliação Objetiva',
      descricao: 'Questões de múltipla escolha no padrão SAEP',
      icon: FileText,
      bgIcon: 'bg-blue-50',
      textIcon: 'text-blue-600',
      hoverBg: 'hover:border-blue-500 hover:bg-blue-50',
      hoverIconBg: 'group-hover:bg-blue-600',
      hoverText: 'group-hover:text-blue-600'
    },
    {
      id: 'pratica',
      titulo: 'Avaliação Prática',
      descricao: 'Desafios práticos com critérios de avaliação',
      icon: Wrench,
      bgIcon: 'bg-orange-50',
      textIcon: 'text-orange-600',
      hoverBg: 'hover:border-orange-500 hover:bg-orange-50',
      hoverIconBg: 'group-hover:bg-orange-600',
      hoverText: 'group-hover:text-orange-600'
    },
    {
      id: 'situacao_aprendizagem',
      titulo: 'Situação de Aprendizagem',
      descricao: 'SA com contexto, desafio e rubrica',
      icon: BookOpen,
      bgIcon: 'bg-green-50',
      textIcon: 'text-green-600',
      hoverBg: 'hover:border-green-500 hover:bg-green-50',
      hoverIconBg: 'group-hover:bg-green-600',
      hoverText: 'group-hover:text-green-600'
    },
    {
      id: 'plano_ensino',
      titulo: 'Plano de Ensino',
      descricao: 'Planejamento completo da Unidade Curricular',
      icon: ClipboardList,
      bgIcon: 'bg-purple-50',
      textIcon: 'text-purple-600',
      hoverBg: 'hover:border-purple-500 hover:bg-purple-50',
      hoverIconBg: 'group-hover:bg-purple-600',
      hoverText: 'group-hover:text-purple-600'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          O que você deseja criar?
        </h2>
        <p className="text-gray-500">
          Selecione uma opção para começar
        </p>
      </div>

      <div className="space-y-4">
        {opcoes.map((opcao) => {
          const Icon = opcao.icon;
          return (
            <button
              key={opcao.id}
              onClick={() => onSelect(opcao.id)}
              className={`w-full group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent p-5 flex items-center gap-5 ${opcao.hoverBg}`}
            >
              <div className={`w-14 h-14 ${opcao.bgIcon} rounded-xl flex items-center justify-center ${opcao.hoverIconBg} transition-colors flex-shrink-0`}>
                <Icon className={`w-7 h-7 ${opcao.textIcon} group-hover:text-white transition-colors`} />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className={`text-lg font-semibold text-gray-800 ${opcao.hoverText} transition-colors`}>
                  {opcao.titulo}
                </h3>
                <p className="text-sm text-gray-500">
                  {opcao.descricao}
                </p>
              </div>

              <ChevronRight className={`w-5 h-5 text-gray-400 ${opcao.hoverText} group-hover:translate-x-1 transition-all`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
