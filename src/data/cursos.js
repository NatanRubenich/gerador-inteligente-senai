// Dados dos cursos SENAI com suas unidades curriculares e capacidades/habilidades
// Baseado nas matrizes curriculares SC 2024

export const TIPO_ENSINO = {
  TECNICO: 'tecnico', // Usa "Capacidade"
  INTEGRADO: 'integrado' // Usa "Habilidade" (Ensino Médio Integrado ao Técnico - SESI/SENAI)
};

export const cursos = [
  {
    id: 'desi',
    nome: 'Técnico em Desenvolvimento de Sistemas',
    tipoEnsino: TIPO_ENSINO.TECNICO,
    competenciaGeral: 'Desenvolver e programar sistemas computacionais, atendendo normas e padrão de qualidade, usabilidade, integridade e segurança da informação.',
    unidadesCurriculares: [
      // 1º Período - Módulo Introdutório (340h)
      {
        id: 'uc1',
        nome: 'Introdução a Tecnologia da Informação e Comunicação',
        cargaHoraria: 40,
        modulo: 'Básico da Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Empregar os princípios, padrões e normas técnicas que estabelecem as condições e requisitos para uma comunicação oral e escrita clara, assertiva e eficaz, condizente com o ambiente de trabalho' },
          { codigo: 'CB2', descricao: 'Interpretar dados, informações técnicas e terminologias de textos técnicos relacionados aos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer características e aplicabilidade de hardware e software de sistemas informatizados utilizados na indústria' },
          { codigo: 'CB4', descricao: 'Utilizar recursos e funcionalidades da web nos processos de comunicação no trabalho, de busca, armazenamento e compartilhamento de informação' },
          { codigo: 'CB5', descricao: 'Aplicar os recursos e procedimentos de segurança da informação' }
        ]
      },
      {
        id: 'uc2',
        nome: 'Lógica de Programação',
        cargaHoraria: 220,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Aplicar lógica de programação para resolução dos problemas' },
          { codigo: 'CB2', descricao: 'Utilizar técnicas de abstração para resolução de problemas' },
          { codigo: 'CB3', descricao: 'Interpretar a simbologia das representações gráficas para definição do fluxo do algoritmo' },
          { codigo: 'CB4', descricao: 'Identificar estruturas de dados para construção do algoritmo' },
          { codigo: 'CB5', descricao: 'Utilizar expressões aritméticas, relacionais e lógicos para codificação do algoritmo' },
          { codigo: 'CB6', descricao: 'Codificar algoritmos na resolução de problemas' },
          { codigo: 'CB7', descricao: 'Aplicar técnica de ordenação e busca de dados para construção de algoritmo' },
          { codigo: 'CB8', descricao: 'Identificar padrão de nomenclatura de comentários para documentação do código fonte' },
          { codigo: 'CB9', descricao: 'Utilizar as estruturas de controle e repetição adequadas à lógica dos algoritmos' },
          { codigo: 'CB10', descricao: 'Utilizar padrões de nomenclatura e convenções de linguagem na codificação de algoritmos' }
        ]
      },
      {
        id: 'uc3',
        nome: 'Fundamentos de Eletroeletrônica Aplicada',
        cargaHoraria: 80,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Identificar os fenômenos físicos envolvidos nos diferentes tipos de meios de transmissão' },
          { codigo: 'CB2', descricao: 'Utilizar instrumentos de medição de temperatura e umidade' },
          { codigo: 'CB3', descricao: 'Interpretar medidas de grandezas elétricas' },
          { codigo: 'CB4', descricao: 'Interpretar resultados das medições das grandezas elétricas' },
          { codigo: 'CB5', descricao: 'Utilizar instrumentos para medir as grandezas elétricas' },
          { codigo: 'CB6', descricao: 'Identificar a aplicabilidade dos fundamentos de eletrônica analógica relativos aos sistemas automatizados' },
          { codigo: 'CB7', descricao: 'Identificar a aplicabilidade dos fundamentos de eletrônica digital relativos aos sistemas automatizados' },
          { codigo: 'CB8', descricao: 'Analisar o funcionamento de dispositivos sensores aplicáveis em sistemas automatizados' }
        ]
      },
      // 2º Período - Módulo Específico I e II (332h)
      {
        id: 'uc4',
        nome: 'Introdução ao Desenvolvimento de Projetos',
        cargaHoraria: 12,
        modulo: 'Básico da Indústria',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer as diferentes fases pertinentes à elaboração de um projeto' },
          { codigo: 'CB2', descricao: 'Reconhecer diferentes métodos aplicados ao desenvolvimento do projeto' },
          { codigo: 'CB3', descricao: 'Reconhecer os padrões de estrutura estabelecidos para a elaboração de projetos' }
        ]
      },
      {
        id: 'uc5',
        nome: 'Modelagem de Sistemas',
        cargaHoraria: 100,
        modulo: 'Específico II',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Definir tecnologias de acordo com os requisitos não funcionais' },
          { codigo: 'CT2', descricao: 'Integrar sistemas orientados para a conectividade e interoperabilidade' },
          { codigo: 'CT3', descricao: 'Reconhecer sistemas de interface para usuários (UX)' },
          { codigo: 'CT4', descricao: 'Interpretar requisitos levantados para desenvolvimento de sistemas' },
          { codigo: 'CT5', descricao: 'Aplicar linguagem de programação para modelagem dos requisitos do sistema' },
          { codigo: 'CT6', descricao: 'Reconhecer requisitos de qualidade, integridade, usabilidade e segurança da informação' },
          { codigo: 'CT7', descricao: 'Identificar documentação técnica aplicada ao escopo do projeto' },
          { codigo: 'CT8', descricao: 'Identificar requisitos funcional e não-funcional para desenvolvimento de sistemas' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Modelagem de Negócios', subitens: [
            { codigo: '1.1', titulo: 'Canvas' }
          ]},
          { codigo: '2', titulo: 'Organização de dados', subitens: [
            { codigo: '2.1', titulo: 'Roteiro de trabalho (check list)' },
            { codigo: '2.2', titulo: 'Organização de dados para análise' },
            { codigo: '2.3', titulo: 'Métodos e Técnicas de Trabalho' },
            { codigo: '2.4', titulo: 'Análise de informações e dados' },
            { codigo: '2.5', titulo: 'Ciclo de PDCA' }
          ]},
          { codigo: '3', titulo: 'Autonomia', subitens: [
            { codigo: '3.1', titulo: 'Consequências favoráveis e desfavoráveis' }
          ]},
          { codigo: '4', titulo: 'Iniciativa', subitens: [
            { codigo: '4.1', titulo: 'Formas de demonstrar iniciativa' },
            { codigo: '4.2', titulo: 'Resultado' }
          ]},
          { codigo: '5', titulo: 'Fundamentos de User Experience (UX)', subitens: [
            { codigo: '5.1', titulo: 'Conceito' },
            { codigo: '5.2', titulo: 'Aplicabilidade' },
            { codigo: '5.3', titulo: 'Ferramentas' }
          ]},
          { codigo: '6', titulo: 'Engenharia de Requisitos', subitens: [
            { codigo: '6.1', titulo: 'Definição' },
            { codigo: '6.2', titulo: 'Requisitos funcionais' },
            { codigo: '6.3', titulo: 'Requisitos não funcionais' },
            { codigo: '6.4', titulo: 'Técnicas de levantamento de requisitos' },
            { codigo: '6.5', titulo: 'Documentação de requisitos' }
          ]},
          { codigo: '7', titulo: 'Modelagem de Sistemas', subitens: [
            { codigo: '7.1', titulo: 'Definição' },
            { codigo: '7.2', titulo: 'UML (Unified Modeling Language)', subitens: [
              { codigo: '7.2.1', titulo: 'Diagrama de casos de uso' },
              { codigo: '7.2.2', titulo: 'Diagrama de classes' },
              { codigo: '7.2.3', titulo: 'Diagrama de sequência' },
              { codigo: '7.2.4', titulo: 'Diagrama de atividades' }
            ]},
            { codigo: '7.3', titulo: 'Ferramentas de modelagem' }
          ]},
          { codigo: '8', titulo: 'Prototipação', subitens: [
            { codigo: '8.1', titulo: 'Definição' },
            { codigo: '8.2', titulo: 'Tipos de protótipos' },
            { codigo: '8.3', titulo: 'Ferramentas de prototipação' }
          ]},
          { codigo: '9', titulo: 'Qualidade de Software', subitens: [
            { codigo: '9.1', titulo: 'Conceitos' },
            { codigo: '9.2', titulo: 'Normas e padrões' },
            { codigo: '9.3', titulo: 'Métricas de qualidade' }
          ]}
        ]
      },
      {
        id: 'uc6',
        nome: 'Banco de Dados',
        cargaHoraria: 120,
        modulo: 'Específico I',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar conceito, tipos, características e armazenamento do banco de dados do sistema computacionais' },
          { codigo: 'CT2', descricao: 'Distinguir arquitetura de banco de dados de acordo com aplicação' },
          { codigo: 'CT3', descricao: 'Identificar métodos de normalização de banco de dados' },
          { codigo: 'CT4', descricao: 'Identificar sistemas de gerenciamento de banco de dados' },
          { codigo: 'CT5', descricao: 'Instalar sistema de gerenciamento de banco de dados (SGBD) conforme especificações para funcionamento do banco de dados' },
          { codigo: 'CT6', descricao: 'Identificar características de modelagem de dados para organização e estrutura de armazenamento de dados' },
          { codigo: 'CT7', descricao: 'Aplicar técnicas para modelagem do banco de dados, de acordo com sua estrutura' },
          { codigo: 'CT8', descricao: 'Aplicar procedimentos de segurança e backup no SGBD' },
          { codigo: 'CT9', descricao: 'Identificar linguagem de banco dados relacionais e não-relacionais para consulta, manipulação, controle e definição' },
          { codigo: 'CT10', descricao: 'Identificar ferramentas de manipulação de banco de dados' },
          { codigo: 'CT11', descricao: 'Aplicar linguagem para consulta, manipulação e controle do banco de dados' },
          { codigo: 'CT12', descricao: 'Empregar comentários para documentação do código fonte' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Big Data', subitens: [
            { codigo: '1.1', titulo: 'Extração de dados estruturados' },
            { codigo: '1.2', titulo: 'Fundamentos de PL/SQL' },
            { codigo: '1.3', titulo: 'Banco de dados não relacional' }
          ]},
          { codigo: '2', titulo: 'Metodologia de Segurança de Dados', subitens: [
            { codigo: '2.1', titulo: 'Métodos' },
            { codigo: '2.2', titulo: 'Rastreabilidade', subitens: [
              { codigo: '2.2.1', titulo: 'Ferramenta da qualidade' }
            ]}
          ]},
          { codigo: '3', titulo: 'Gerenciamento do Banco de Dados', subitens: [
            { codigo: '3.1', titulo: 'Sistemas de gerenciamento de banco de dados', subitens: [
              { codigo: '3.1.1', titulo: 'Definições' },
              { codigo: '3.1.2', titulo: 'Tipos' },
              { codigo: '3.1.3', titulo: 'Características' },
              { codigo: '3.1.4', titulo: 'Aplicações' },
              { codigo: '3.1.5', titulo: 'Instalação: configuração e requisitos mínimos' },
              { codigo: '3.1.6', titulo: 'Segurança' },
              { codigo: '3.1.7', titulo: 'Backup' },
              { codigo: '3.1.8', titulo: 'Manipulação de banco de dados' },
              { codigo: '3.1.9', titulo: 'Ferramentas' },
              { codigo: '3.1.10', titulo: 'DDL, DML e DCL' },
              { codigo: '3.1.11', titulo: 'Triggers' },
              { codigo: '3.1.12', titulo: 'Stored procedures' },
              { codigo: '3.1.13', titulo: 'Views' }
            ]}
          ]},
          { codigo: '4', titulo: 'Modelagem de Dados', subitens: [
            { codigo: '4.1', titulo: 'Definição' },
            { codigo: '4.2', titulo: 'Modelo conceitual', subitens: [
              { codigo: '4.2.1', titulo: 'Definições' },
              { codigo: '4.2.2', titulo: 'Arquitetura' },
              { codigo: '4.2.3', titulo: 'Modelagem de dados usando o modelo entidade/relacionamento' }
            ]},
            { codigo: '4.3', titulo: 'Modelo lógico e físico', subitens: [
              { codigo: '4.3.1', titulo: 'Definições' },
              { codigo: '4.3.2', titulo: 'Restrições' },
              { codigo: '4.3.3', titulo: 'Design' },
              { codigo: '4.3.4', titulo: 'Dependência funcional' }
            ]},
            { codigo: '4.4', titulo: 'Normalização' }
          ]},
          { codigo: '5', titulo: 'Banco de Dados', subitens: [
            { codigo: '5.1', titulo: 'Definição', subitens: [
              { codigo: '5.1.1', titulo: 'Sistema de banco de dados' }
            ]},
            { codigo: '5.2', titulo: 'Características' },
            { codigo: '5.3', titulo: 'Armazenamento' },
            { codigo: '5.4', titulo: 'Arquitetura', subitens: [
              { codigo: '5.4.1', titulo: 'Relacional' },
              { codigo: '5.4.2', titulo: 'Não-relacional' }
            ]}
          ]},
          { codigo: '6', titulo: 'Diretrizes empresariais', subitens: [
            { codigo: '6.1', titulo: 'Missão' },
            { codigo: '6.2', titulo: 'Visão' },
            { codigo: '6.3', titulo: 'Política da Qualidade' }
          ]},
          { codigo: '7', titulo: 'Ética', subitens: [
            { codigo: '7.1', titulo: 'Ética nos relacionamentos profissionais' },
            { codigo: '7.2', titulo: 'Respeito às individualidades' },
            { codigo: '7.3', titulo: 'Ética no desenvolvimento das atividades profissionais' }
          ]},
          { codigo: '8', titulo: 'Organização de dados', subitens: [
            { codigo: '8.1', titulo: 'Estruturação e organização de dados' },
            { codigo: '8.2', titulo: 'Coleta de dados' },
            { codigo: '8.3', titulo: 'Formas de apresentação' },
            { codigo: '8.4', titulo: 'Sistematização e tratamento de dados' }
          ]}
        ]
      },
      {
        id: 'uc7',
        nome: 'Programação de Aplicativos',
        cargaHoraria: 100,
        modulo: 'Específico I',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer ferramentas para o desenvolvimento de atividades (repositório, controle de versão)' },
          { codigo: 'CT2', descricao: 'Instalar ferramentas de acordo com requisitos de hardware, software e parâmetro de configuração' },
          { codigo: 'CT3', descricao: 'Reconhecer especificações técnicas e paradigmas de linguagem de programação' },
          { codigo: 'CT4', descricao: 'Aplicar linguagem de programação por meio do ambiente integrado de desenvolvimento (IDE)' },
          { codigo: 'CT5', descricao: 'Integrar banco de dados por meio da linguagem de programação' },
          { codigo: 'CT6', descricao: 'Aplicar métodos e técnicas de programação' },
          { codigo: 'CT7', descricao: 'Empregar comentários para documentação do código fonte' },
          { codigo: 'CT8', descricao: 'Utilizar o ambiente de desenvolvimento (IDE) para rastreabilidade do código' },
          { codigo: 'CT9', descricao: 'Identificar erros de acordo com o requisito do programa' },
          { codigo: 'CT10', descricao: 'Utilizar o ambiente de desenvolvimento (IDE) para aplicação de teste unitário' }
        ]
      },
      // 3º Período - Módulo Específico II (284h)
      {
        id: 'uc8',
        nome: 'Sustentabilidade nos Processos Industriais',
        cargaHoraria: 8,
        modulo: 'Básico da Indústria',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer alternativas de prevenção da poluição decorrentes dos processos industriais' },
          { codigo: 'CB2', descricao: 'Reconhecer as fases do ciclo de vida de um produto nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer os fundamentos da logística reversa aplicados ao ciclo de vida do produto' },
          { codigo: 'CB4', descricao: 'Reconhecer os programas de sustentabilidade aplicados aos processos industriais' },
          { codigo: 'CB5', descricao: 'Reconhecer os princípios da economia circular nos processos industriais' },
          { codigo: 'CB6', descricao: 'Reconhecer a destinação dos resíduos dos processos industriais em função de sua caracterização' }
        ]
      },
      {
        id: 'uc9',
        nome: 'Introdução a Qualidade e Produtividade',
        cargaHoraria: 16,
        modulo: 'Básico da Indústria',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os fundamentos da qualidade nos processos industriais' },
          { codigo: 'CB2', descricao: 'Identificar as ferramentas da qualidade aplicadas nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer as etapas da filosofia Lean para otimização de custos e redução do tempo e dos desperdícios de uma empresa' }
        ]
      },
      {
        id: 'uc10',
        nome: 'Desenvolvimento de Sistemas',
        cargaHoraria: 200,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer requisitos de qualidade, integridade, usabilidade e segurança da informação' },
          { codigo: 'CT2', descricao: 'Definir tecnologias de acordo com os requisitos não funcionais' },
          { codigo: 'CT3', descricao: 'Reconhecer tipos de linguagem de acordo com as multiplataformas' },
          { codigo: 'CT4', descricao: 'Selecionar linguagem programação de acordo com os requisitos' },
          { codigo: 'CT5', descricao: 'Integrar sistemas multiplataformas por meio da linguagem de programação' },
          { codigo: 'CT6', descricao: 'Aplicar linguagem de programação por meio de APIs, bibliotecas, frameworks na construção de rotinas de software' },
          { codigo: 'CT7', descricao: 'Identificar metodologia de desenvolvimento de sistemas' },
          { codigo: 'CT8', descricao: 'Definir cronograma de atividades, de acordo com a metodologia' },
          { codigo: 'CT9', descricao: 'Aplicar metodologia de desenvolvimento de acordo com o escopo do projeto' },
          { codigo: 'CT10', descricao: 'Selecionar ferramentas de gerenciamento na aplicação da metodologia' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Visão Sistêmica', subitens: [
            { codigo: '1.1', titulo: 'Conceito' },
            { codigo: '1.2', titulo: 'Microcosmo e macrocosmo' },
            { codigo: '1.3', titulo: 'Pensamento sistêmico' }
          ]},
          { codigo: '2', titulo: 'Planejamento Estratégico', subitens: [
            { codigo: '2.1', titulo: 'Conceitos' }
          ]},
          { codigo: '3', titulo: 'Organização do trabalho', subitens: [
            { codigo: '3.1', titulo: 'Estruturas hierárquicas' },
            { codigo: '3.2', titulo: 'Sistemas administrativos' },
            { codigo: '3.3', titulo: 'Controle de atividades' }
          ]},
          { codigo: '4', titulo: 'Princípios da comunicação profissional e postura', subitens: [
            { codigo: '4.1', titulo: 'Comportamento e Trabalho em Equipe' },
            { codigo: '4.2', titulo: 'Situações de conflito' },
            { codigo: '4.3', titulo: 'Normas de convivência' },
            { codigo: '4.4', titulo: 'Fatores de satisfação' }
          ]},
          { codigo: '5', titulo: 'Utilização em plataformas de desenvolvimento em nuvem' },
          { codigo: '6', titulo: 'Design de interface para interação de subsistemas' },
          { codigo: '7', titulo: 'Integração de sistemas', subitens: [
            { codigo: '7.1', titulo: 'Padrões de projetos (Design Patterns)' },
            { codigo: '7.2', titulo: 'Gerência de configuração' },
            { codigo: '7.3', titulo: 'Ferramentas' },
            { codigo: '7.4', titulo: 'Controle de versão' },
            { codigo: '7.5', titulo: 'Rastreabilidade' },
            { codigo: '7.6', titulo: 'Documentação' }
          ]},
          { codigo: '8', titulo: 'Linguagem de programação', subitens: [
            { codigo: '8.1', titulo: 'Tipos' },
            { codigo: '8.2', titulo: 'Ferramentas' },
            { codigo: '8.3', titulo: 'Boas práticas' },
            { codigo: '8.4', titulo: 'Bibliotecas e APIs' },
            { codigo: '8.5', titulo: 'Frameworks' },
            { codigo: '8.6', titulo: 'Multiplataformas' }
          ]},
          { codigo: '9', titulo: 'Técnicas de definição de prazos', subitens: [
            { codigo: '9.1', titulo: 'Ferramentas de tarefas' }
          ]},
          { codigo: '10', titulo: 'Metodologia de desenvolvimento de sistemas', subitens: [
            { codigo: '10.1', titulo: 'Tipos' },
            { codigo: '10.2', titulo: 'Características' },
            { codigo: '10.3', titulo: 'Ferramentas' },
            { codigo: '10.4', titulo: 'Aplicabilidade' }
          ]}
        ]
      },
      {
        id: 'uc11',
        nome: 'Teste de Sistemas',
        cargaHoraria: 60,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Avaliar resultado obtido no teste' },
          { codigo: 'CT2', descricao: 'Identificar possível solução para correção de falhas de acordo metodologia de teste' },
          { codigo: 'CT3', descricao: 'Empregar ferramenta de documentação de teste para registro do resultado obtido' },
          { codigo: 'CT4', descricao: 'Analisar documentação de teste para planejamento da rotina' },
          { codigo: 'CT5', descricao: 'Identificar tipos, função, ferramentas e plano de teste de acordo com a programação de sistemas' },
          { codigo: 'CT6', descricao: 'Reconhecer normas, métodos e técnicas de testes para correção de falhas de sistema' },
          { codigo: 'CT7', descricao: 'Organizar o ambiente para o desenvolvimento das rotinas de testes' },
          { codigo: 'CT8', descricao: 'Definir roteiro de teste para execução, conforme recomendações técnicas' },
          { codigo: 'CT9', descricao: 'Identificar problemas de sistemas por meio de aplicação de teste' }
        ]
      },
      // 4º Período - Módulo Específico I e II (244h)
      {
        id: 'uc12',
        nome: 'Introdução a Indústria 4.0',
        cargaHoraria: 24,
        modulo: 'Básico da Indústria',
        periodo: '4º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os marcos que alavancaram as revoluções industriais e seus impactos nas atividades de produção e no desenvolvimento do indivíduo' },
          { codigo: 'CB2', descricao: 'Reconhecer as tecnologias habilitadoras para indústria 4.0' },
          { codigo: 'CB3', descricao: 'Correlacionar cada tecnologia habilitadora com impacto gerado em sua aplicação, em um contexto real ou simulado' },
          { codigo: 'CB4', descricao: 'Compreender a inovação como ferramenta de melhoria nos processos de trabalho e resolução de problemas' }
        ]
      },
      {
        id: 'uc13',
        nome: 'Saúde e Segurança no Trabalho',
        cargaHoraria: 12,
        modulo: 'Básico da Indústria',
        periodo: '4º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os princípios, normas, legislação e procedimentos de saúde, segurança nos processos industriais' },
          { codigo: 'CB2', descricao: 'Reconhecer os tipos de riscos inerentes às atividades laborais nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer os conceitos, classificação e impactos de acidentes e doenças ocupacionais na indústria' },
          { codigo: 'CB4', descricao: 'Reconhecer o papel do trabalhador no cumprimento das normas de saúde e segurança' },
          { codigo: 'CB5', descricao: 'Reconhecer as medidas preventivas e corretivas nas atividades laborais' }
        ]
      },
      {
        id: 'uc14',
        nome: 'Internet das Coisas',
        cargaHoraria: 128,
        modulo: 'Específico I',
        periodo: '4º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer especificações técnicas e paradigmas do conceito de internet das coisas' },
          { codigo: 'CT2', descricao: 'Integrar dispositivos para coleta automática de dados em sistemas industriais' },
          { codigo: 'CT3', descricao: 'Integrar dispositivos de comunicação de dados' },
          { codigo: 'CT4', descricao: 'Reconhecer especificações técnicas de sensoriamento e parametrização de robôs' },
          { codigo: 'CT5', descricao: 'Integrar projetos orientados ao sensoriamento e controle' }
        ]
      },
      {
        id: 'uc15',
        nome: 'Implantação de Sistemas',
        cargaHoraria: 40,
        modulo: 'Específico II',
        periodo: '4º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar métodos para implantação do sistema' },
          { codigo: 'CT2', descricao: 'Definir cronograma de implantação do sistema' },
          { codigo: 'CT3', descricao: 'Identificar infraestrutura computacional necessária para implantação do sistema' },
          { codigo: 'CT4', descricao: 'Identificar procedimento de validação do ambiente de produção' },
          { codigo: 'CT5', descricao: 'Aplicar procedimento de validação para avaliação do ambiente de produção (base de dados)' },
          { codigo: 'CT6', descricao: 'Identificar necessidade treinamento conforme estrutura do ambiente' },
          { codigo: 'CT7', descricao: 'Elaborar manual do usuário de acordo com as especificações do sistema' },
          { codigo: 'CT8', descricao: 'Identificar procedimento padrão para registro de implantação' },
          { codigo: 'CT9', descricao: 'Aplicar procedimento de documentação de implantação conforme especificações técnicas' },
          { codigo: 'CT10', descricao: 'Aplicar configurações dos serviços e segurança para instalação de sistema de acordo com os requisitos' },
          { codigo: 'CT11', descricao: 'Avaliar necessidade de migração de dados entre sistema' },
          { codigo: 'CT12', descricao: 'Instalar sistema computacional desenvolvido de acordo com o procedimento estabelecido' },
          { codigo: 'CT13', descricao: 'Validar a infraestrutura computacional para implantação' },
          { codigo: 'CT14', descricao: 'Identificar parâmetros a serem configurados de acordo com o sistema' },
          { codigo: 'CT15', descricao: 'Aplicar configurações no sistema de acordo com os requisitos' },
          { codigo: 'CT16', descricao: 'Aplicar procedimento parametrização sistema para funcionamento do sistema de acordo com os requisitos' }
        ]
      },
      {
        id: 'uc16',
        nome: 'Manutenção de Sistemas',
        cargaHoraria: 40,
        modulo: 'Específico II',
        periodo: '4º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer serviços de chamados para atendimento de suporte' },
          { codigo: 'CT2', descricao: 'Aplicar normas e procedimento no atendimento ao usuário (netiqueta)' },
          { codigo: 'CT3', descricao: 'Registrar o atendimento de serviços para finalização do suporte' },
          { codigo: 'CT4', descricao: 'Identificar tipo, procedimento e plano de manutenção de sistemas' },
          { codigo: 'CT5', descricao: 'Identificar procedimento de registro de serviços de manutenção' },
          { codigo: 'CT6', descricao: 'Interpretar demanda de manutenção conforme suporte' },
          { codigo: 'CT7', descricao: 'Identificar métodos de correção e atualização do sistema' },
          { codigo: 'CT8', descricao: 'Definir método adequado para correção das falhas e atualização' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Modelagem de Negócios - Canvas', subitens: [
            { codigo: '1.1', titulo: 'Indicadores de desempenho' },
            { codigo: '1.2', titulo: 'Análise de indicadores' },
            { codigo: '1.3', titulo: 'Processo de melhorias' }
          ]},
          { codigo: '2', titulo: 'Organização do trabalho', subitens: [
            { codigo: '2.1', titulo: 'Roteiro de trabalho (check list)' },
            { codigo: '2.2', titulo: 'Organização de atividades' },
            { codigo: '2.3', titulo: 'Organização do ambiente', subitens: [
              { codigo: '2.3.1', titulo: 'Higiene' },
              { codigo: '2.3.2', titulo: 'Saúde' },
              { codigo: '2.3.3', titulo: 'Segurança' }
            ]},
            { codigo: '2.4', titulo: 'Ferramentas de gerenciamento' },
            { codigo: '2.5', titulo: 'Ciclo de PDCA' }
          ]},
          { codigo: '3', titulo: 'Trabalho em grupo', subitens: [
            { codigo: '3.1', titulo: 'Relacionamento com os colegas de equipe' },
            { codigo: '3.2', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '3.3', titulo: 'Cooperação' },
            { codigo: '3.4', titulo: 'Divisão de papéis e responsabilidades' }
          ]},
          { codigo: '4', titulo: 'Manutenção de Sistemas', subitens: [
            { codigo: '4.1', titulo: 'Definição' },
            { codigo: '4.2', titulo: 'Tipos' },
            { codigo: '4.3', titulo: 'Procedimentos' },
            { codigo: '4.4', titulo: 'Plano de manutenção' },
            { codigo: '4.5', titulo: 'Documentação' }
          ]},
          { codigo: '5', titulo: 'Suporte e chamados de serviços de manutenção', subitens: [
            { codigo: '5.1', titulo: 'Ferramentas de gestão de suporte de chamados', subitens: [
              { codigo: '5.1.1', titulo: 'Ferramentas de suporte remoto' },
              { codigo: '5.1.2', titulo: 'Tipos de suporte de chamados' }
            ]},
            { codigo: '5.2', titulo: 'Gerenciamento de suporte e chamados de serviços', subitens: [
              { codigo: '5.2.1', titulo: 'Finalização de chamadas' }
            ]}
          ]}
        ]
      }
    ]
  },
  {
    id: 'info-internet',
    nome: 'Técnico em Informática para Internet',
    tipoEnsino: TIPO_ENSINO.TECNICO,
    competenciaGeral: 'Desenvolver e administrar sistemas e aplicações para internet, seguindo as especificações e paradigmas da lógica de programação e das linguagens de programação, utilizando ferramentas de desenvolvimento, modelagem, banco de dados e servidores.',
    unidadesCurriculares: [
      // 1º Período
      {
        id: 'uc1',
        nome: 'Introdução à Tecnologia da Informação e Comunicação',
        cargaHoraria: 40,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar os fundamentos de tecnologia da informação e comunicação' },
          { codigo: 'CT2', descricao: 'Reconhecer os componentes de sistemas computacionais' }
        ]
      },
      {
        id: 'uc2',
        nome: 'Introdução ao Desenvolvimento de Projetos',
        cargaHoraria: 12,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar metodologias de desenvolvimento de projetos' },
          { codigo: 'CT2', descricao: 'Aplicar técnicas de planejamento e organização de projetos' }
        ]
      },
      {
        id: 'uc3',
        nome: 'Introdução a Indústria 4.0',
        cargaHoraria: 24,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar os conceitos e tecnologias da Indústria 4.0' },
          { codigo: 'CT2', descricao: 'Reconhecer aplicações de IoT, Big Data e IA na indústria' }
        ]
      },
      {
        id: 'uc4',
        nome: 'Arquitetura de Hardware e Software',
        cargaHoraria: 24,
        modulo: 'Introdutório',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar componentes de hardware e arquitetura de computadores' },
          { codigo: 'CT2', descricao: 'Reconhecer tipos de software e suas aplicações' },
          { codigo: 'CT3', descricao: 'Aplicar conceitos de sistemas operacionais' }
        ]
      },
      {
        id: 'uc5',
        nome: 'Versionamento e Colaboração',
        cargaHoraria: 20,
        modulo: 'Introdutório',
        capacidades: [
          { codigo: 'CT1', descricao: 'Aplicar técnicas de versionamento de código com Git' },
          { codigo: 'CT2', descricao: 'Utilizar plataformas de colaboração (GitHub, GitLab)' },
          { codigo: 'CT3', descricao: 'Aplicar boas práticas de trabalho em equipe' }
        ]
      },
      {
        id: 'uc6',
        nome: 'Lógica de Programação',
        cargaHoraria: 128,
        modulo: 'Introdutório',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar os princípios da lógica de programação' },
          { codigo: 'CT2', descricao: 'Aplicar técnicas de algoritmos para resolução de problemas' },
          { codigo: 'CT3', descricao: 'Utilizar estruturas de controle de fluxo (sequência, seleção e repetição)' },
          { codigo: 'CT4', descricao: 'Aplicar estruturas de dados (vetores, matrizes)' },
          { codigo: 'CT5', descricao: 'Desenvolver algoritmos utilizando funções e procedimentos' }
        ]
      },
      {
        id: 'uc7',
        nome: 'Fundamentos de UI / UX',
        cargaHoraria: 76,
        modulo: 'Introdutório',
        capacidades: [
          { codigo: 'CT1', descricao: 'Aplicar princípios de design de interfaces (UI)' },
          { codigo: 'CT2', descricao: 'Aplicar conceitos de experiência do usuário (UX)' },
          { codigo: 'CT3', descricao: 'Desenvolver wireframes e protótipos' },
          { codigo: 'CT4', descricao: 'Utilizar ferramentas de design (Figma)' }
        ]
      },
      // 2º Período
      {
        id: 'uc8',
        nome: 'Codificação para Front-End',
        cargaHoraria: 100,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Aplicar HTML5 para estruturação semântica de páginas web' },
          { codigo: 'CT2', descricao: 'Aplicar CSS3 para estilização e layout de páginas web' },
          { codigo: 'CT3', descricao: 'Desenvolver interfaces responsivas' },
          { codigo: 'CT4', descricao: 'Aplicar JavaScript para interatividade client-side' },
          { codigo: 'CT5', descricao: 'Utilizar frameworks e bibliotecas front-end' }
        ]
      },
      {
        id: 'uc9',
        nome: 'Interação com APIs',
        cargaHoraria: 40,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Consumir APIs RESTful' },
          { codigo: 'CT2', descricao: 'Aplicar requisições HTTP (GET, POST, PUT, DELETE)' },
          { codigo: 'CT3', descricao: 'Manipular dados em formato JSON' },
          { codigo: 'CT4', descricao: 'Implementar tratamento de erros em requisições' }
        ]
      },
      {
        id: 'uc10',
        nome: 'Testes de Front-End',
        cargaHoraria: 40,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar tipos de testes para front-end' },
          { codigo: 'CT2', descricao: 'Aplicar testes unitários em componentes' },
          { codigo: 'CT3', descricao: 'Utilizar ferramentas de teste (Jest, Testing Library)' }
        ]
      },
      {
        id: 'uc11',
        nome: 'Projeto de Front-End',
        cargaHoraria: 90,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Desenvolver projeto completo de front-end' },
          { codigo: 'CT2', descricao: 'Aplicar metodologias ágeis no desenvolvimento' },
          { codigo: 'CT3', descricao: 'Integrar componentes e funcionalidades' },
          { codigo: 'CT4', descricao: 'Realizar deploy de aplicação front-end' }
        ]
      },
      {
        id: 'uc12',
        nome: 'Sustentabilidade nos Processos Industriais',
        cargaHoraria: 8,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar práticas sustentáveis nos processos industriais' }
        ]
      },
      {
        id: 'uc13',
        nome: 'Introdução a Qualidade e Produtividade',
        cargaHoraria: 16,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar conceitos de qualidade e produtividade' },
          { codigo: 'CT2', descricao: 'Aplicar ferramentas de gestão da qualidade' }
        ]
      },
      // 3º Período
      {
        id: 'uc14',
        nome: 'Codificação para Back-End',
        cargaHoraria: 100,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Aplicar linguagens de programação server-side' },
          { codigo: 'CT2', descricao: 'Desenvolver aplicações com Node.js ou PHP' },
          { codigo: 'CT3', descricao: 'Implementar padrão MVC' },
          { codigo: 'CT4', descricao: 'Aplicar conceitos de segurança em aplicações web' }
        ]
      },
      {
        id: 'uc15',
        nome: 'Desenvolvimento de APIs',
        cargaHoraria: 60,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Desenvolver APIs RESTful' },
          { codigo: 'CT2', descricao: 'Implementar autenticação e autorização (JWT)' },
          { codigo: 'CT3', descricao: 'Documentar APIs' },
          { codigo: 'CT4', descricao: 'Aplicar boas práticas de desenvolvimento de APIs' }
        ]
      },
      {
        id: 'uc16',
        nome: 'Banco de Dados',
        cargaHoraria: 80,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Modelar banco de dados relacional' },
          { codigo: 'CT2', descricao: 'Aplicar SQL para manipulação de dados (CRUD)' },
          { codigo: 'CT3', descricao: 'Utilizar banco de dados NoSQL' },
          { codigo: 'CT4', descricao: 'Integrar aplicações com banco de dados' }
        ]
      },
      {
        id: 'uc17',
        nome: 'Testes de Back-End',
        cargaHoraria: 40,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar tipos de testes para back-end' },
          { codigo: 'CT2', descricao: 'Aplicar testes unitários e de integração' },
          { codigo: 'CT3', descricao: 'Utilizar ferramentas de teste de API' }
        ]
      },
      {
        id: 'uc18',
        nome: 'Projeto de Back-End',
        cargaHoraria: 90,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Desenvolver projeto completo de back-end' },
          { codigo: 'CT2', descricao: 'Integrar front-end com back-end' },
          { codigo: 'CT3', descricao: 'Realizar deploy de aplicação completa' },
          { codigo: 'CT4', descricao: 'Aplicar CI/CD no projeto' }
        ]
      },
      {
        id: 'uc19',
        nome: 'Saúde e Segurança no Trabalho',
        cargaHoraria: 12,
        modulo: 'Indústria',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar normas de saúde e segurança no trabalho' },
          { codigo: 'CT2', descricao: 'Aplicar práticas de prevenção de acidentes' }
        ]
      }
    ]
  },
  {
    id: 'multimidia',
    nome: 'Técnico em Multimídia',
    tipoEnsino: TIPO_ENSINO.TECNICO,
    competenciaGeral: 'Coordenar e Executar projetos para mídias digitais, seguindo padrões e normas técnicas, referentes à propriedade intelectual, acessibilidade, usabilidade e sustentabilidade.',
    unidadesCurriculares: [
      // Módulo BÁSICO (160h)
      {
        id: 'uc1',
        nome: 'Fundamentos de Teoria da Cor',
        cargaHoraria: 40,
        modulo: 'Básico',
        capacidades: [
          { codigo: 'CB1', descricao: 'Aplicar os princípios e normas da linguagem na comunicação oral e escrita na elaboração de diferentes tipos de textos técnicos' },
          { codigo: 'CB2', descricao: 'Reconhecer fundamentos de teoria da cor' },
          { codigo: 'CB3', descricao: 'Identificar princípios e ferramentas utilizados nos processos criativos' },
          { codigo: 'CB4', descricao: 'Reconhecer as diferentes mídias para desenvolvimento das atividades' },
          { codigo: 'CB5', descricao: 'Analisar as referências das pesquisas para o desenvolvimento das atividades' },
          { codigo: 'CB6', descricao: 'Aplicar os princípios de informática na utilização de ferramentas para o auxílio nas suas atividades' },
          { codigo: 'CB7', descricao: 'Aplicar fundamentos de teoria da cor' },
          { codigo: 'CB8', descricao: 'Aplicar fundamentos de matemática aplicada' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Administração do Tempo', subitens: [
            { codigo: '1.1', titulo: 'Ferramentas para uma gestão eficaz do tempo' }
          ]},
          { codigo: '2', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '2.1', titulo: 'Empatia' },
            { codigo: '2.2', titulo: 'Respeito' },
            { codigo: '2.3', titulo: 'Imparcialidade' },
            { codigo: '2.4', titulo: 'Honestidade' },
            { codigo: '2.5', titulo: 'Responsabilidade' },
            { codigo: '2.6', titulo: 'Direitos Humanos Universais' },
            { codigo: '2.7', titulo: 'Cidadania' },
            { codigo: '2.8', titulo: 'Ética moral' }
          ]},
          { codigo: '3', titulo: 'Organização do Local de Trabalho', subitens: [
            { codigo: '3.1', titulo: 'Tempo' },
            { codigo: '3.2', titulo: 'Materiais' },
            { codigo: '3.3', titulo: 'Atividades' },
            { codigo: '3.4', titulo: 'Espaço' }
          ]},
          { codigo: '4', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '4.1', titulo: 'Produtividade' },
            { codigo: '4.2', titulo: 'Criatividade' },
            { codigo: '4.3', titulo: 'Iniciativa' },
            { codigo: '4.4', titulo: 'Cooperação' },
            { codigo: '4.5', titulo: 'Disciplina' }
          ]},
          { codigo: '5', titulo: 'Formação da Cor', subitens: [
            { codigo: '5.1', titulo: 'Cor aplicada ao projeto gráfico', subitens: [
              { codigo: '5.1.1', titulo: 'Pixel – mídia digital' },
              { codigo: '5.1.2', titulo: 'Retícula – mídia impressa' }
            ]},
            { codigo: '5.2', titulo: 'Reprodução da cor' },
            { codigo: '5.3', titulo: 'Harmonia e percepção cromática', subitens: [
              { codigo: '5.3.1', titulo: 'Psicologia e psicodinâmica das cores' }
            ]},
            { codigo: '5.4', titulo: 'Características das cores', subitens: [
              { codigo: '5.4.1', titulo: 'Tonalidade' },
              { codigo: '5.4.2', titulo: 'Saturação' },
              { codigo: '5.4.3', titulo: 'Luminosidade' }
            ]},
            { codigo: '5.5', titulo: 'Contraste de cores' },
            { codigo: '5.6', titulo: 'Escalas de cores' },
            { codigo: '5.7', titulo: 'Espaços de cor', subitens: [
              { codigo: '5.7.1', titulo: 'Cores complementares' },
              { codigo: '5.7.2', titulo: 'Cores frias' },
              { codigo: '5.7.3', titulo: 'Cores quentes' },
              { codigo: '5.7.4', titulo: 'Terciárias' },
              { codigo: '5.7.5', titulo: 'Secundárias' },
              { codigo: '5.7.6', titulo: 'Primárias' },
              { codigo: '5.7.7', titulo: 'Classificação das cores' },
              { codigo: '5.7.8', titulo: 'Síntese subtrativa' },
              { codigo: '5.7.9', titulo: 'Síntese aditiva' }
            ]}
          ]},
          { codigo: '6', titulo: 'Cores', subitens: [
            { codigo: '6.1', titulo: 'Fisiologia e percepção das cores', subitens: [
              { codigo: '6.1.1', titulo: 'Metamerismo' },
              { codigo: '6.1.2', titulo: 'Memória de cor' },
              { codigo: '6.1.3', titulo: 'Cores de fundo e ao redor' },
              { codigo: '6.1.4', titulo: 'Iluminantes' },
              { codigo: '6.1.5', titulo: 'Daltonismo' },
              { codigo: '6.1.6', titulo: 'Fadiga visual' },
              { codigo: '6.1.7', titulo: 'Anatomia do olho humano' }
            ]}
          ]}
        ]
      },
      {
        id: 'uc2',
        nome: 'História do Design Gráfico',
        cargaHoraria: 40,
        modulo: 'Básico',
        capacidades: [
          { codigo: 'CB1', descricao: 'Identificar princípios e ferramentas utilizados nos processos criativos' },
          { codigo: 'CB2', descricao: 'Analisar as referências das pesquisas para o desenvolvimento das atividades' },
          { codigo: 'CB3', descricao: 'Aplicar os princípios de informática na utilização de ferramentas para o auxílio nas suas atividades' },
          { codigo: 'CB4', descricao: 'Aplicar fundamentos de história do design gráfico' },
          { codigo: 'CB5', descricao: 'Aplicar os princípios e normas da linguagem na comunicação oral e escrita na elaboração de diferentes tipos de textos técnicos' },
          { codigo: 'CB6', descricao: 'Identificar as estruturas de pesquisa no desenvolvimento das atividades' },
          { codigo: 'CB7', descricao: 'Reconhecer fundamentos de história do design gráfico' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Administração do Tempo', subitens: [
            { codigo: '1.1', titulo: 'Ferramentas para uma gestão eficaz do tempo' }
          ]},
          { codigo: '2', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '2.1', titulo: 'Empatia' },
            { codigo: '2.2', titulo: 'Respeito' },
            { codigo: '2.3', titulo: 'Imparcialidade' },
            { codigo: '2.4', titulo: 'Honestidade' },
            { codigo: '2.5', titulo: 'Responsabilidade' },
            { codigo: '2.6', titulo: 'Direitos Humanos Universais' },
            { codigo: '2.7', titulo: 'Cidadania' },
            { codigo: '2.8', titulo: 'Ética moral' }
          ]},
          { codigo: '3', titulo: 'Organização do Local de Trabalho', subitens: [
            { codigo: '3.1', titulo: 'Tempo' },
            { codigo: '3.2', titulo: 'Materiais' },
            { codigo: '3.3', titulo: 'Atividades' },
            { codigo: '3.4', titulo: 'Espaço' }
          ]},
          { codigo: '4', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '4.1', titulo: 'Produtividade' },
            { codigo: '4.2', titulo: 'Criatividade' },
            { codigo: '4.3', titulo: 'Iniciativa' },
            { codigo: '4.4', titulo: 'Cooperação' },
            { codigo: '4.5', titulo: 'Disciplina' }
          ]},
          { codigo: '5', titulo: 'O Design de Hoje', subitens: [
            { codigo: '5.1', titulo: 'Globalização' },
            { codigo: '5.2', titulo: 'Sustentabilidade' },
            { codigo: '5.3', titulo: 'A era da informação' }
          ]},
          { codigo: '6', titulo: 'História do Design Gráfico', subitens: [
            { codigo: '6.1', titulo: 'Cinema', subitens: [
              { codigo: '6.1.1', titulo: 'Brasileiro' },
              { codigo: '6.1.2', titulo: 'Americano' },
              { codigo: '6.1.3', titulo: 'Japonês' },
              { codigo: '6.1.4', titulo: 'Italiano' },
              { codigo: '6.1.5', titulo: 'Alemão' },
              { codigo: '6.1.6', titulo: 'Francês' },
              { codigo: '6.1.7', titulo: 'História' }
            ]},
            { codigo: '6.2', titulo: 'Design gráfico não canônico', subitens: [
              { codigo: '6.2.1', titulo: 'Pós-modernidade' },
              { codigo: '6.2.2', titulo: 'Modernidade' }
            ]},
            { codigo: '6.3', titulo: 'Design gráfico canônico', subitens: [
              { codigo: '6.3.1', titulo: 'Estilo internacional suíço' },
              { codigo: '6.3.2', titulo: 'Escola norte-americana' }
            ]},
            { codigo: '6.4', titulo: 'Modernismo' },
            { codigo: '6.5', titulo: 'Pop art' },
            { codigo: '6.6', titulo: 'Art déco' },
            { codigo: '6.7', titulo: 'Futurismo' },
            { codigo: '6.8', titulo: 'Bauhaus' },
            { codigo: '6.9', titulo: 'Dadaísmo' },
            { codigo: '6.10', titulo: 'De Stijl' },
            { codigo: '6.11', titulo: 'Construtivismo' },
            { codigo: '6.12', titulo: 'Art nouveau' },
            { codigo: '6.13', titulo: 'Arts & crafts' }
          ]},
          { codigo: '7', titulo: 'História da Arte', subitens: [
            { codigo: '7.1', titulo: 'Modernismo' },
            { codigo: '7.2', titulo: 'Realismo' },
            { codigo: '7.3', titulo: 'Cubismo' },
            { codigo: '7.4', titulo: 'Expressionismo' },
            { codigo: '7.5', titulo: 'Impressionismo' },
            { codigo: '7.6', titulo: 'Romantismo' },
            { codigo: '7.7', titulo: 'Arte barroca / rococó' },
            { codigo: '7.8', titulo: 'Arte renascentista' },
            { codigo: '7.9', titulo: 'Arte gótica' },
            { codigo: '7.10', titulo: 'Arte greco romana' },
            { codigo: '7.11', titulo: 'Arte rupestre' }
          ]}
        ]
      },
      {
        id: 'uc3',
        nome: 'Fundamentos de Desenho e Percepção Visual',
        cargaHoraria: 40,
        modulo: 'Básico',
        capacidades: [
          { codigo: 'CB1', descricao: 'Identificar princípios e ferramentas utilizados nos processos criativos' },
          { codigo: 'CB2', descricao: 'Reconhecer as diferentes mídias para desenvolvimento das atividades' },
          { codigo: 'CB3', descricao: 'Analisar as referências das pesquisas para o desenvolvimento das atividades' },
          { codigo: 'CB4', descricao: 'Aplicar os princípios de informática na utilização de ferramentas para o auxílio nas suas atividades' },
          { codigo: 'CB5', descricao: 'Aplicar fundamentos de matemática aplicada' },
          { codigo: 'CB6', descricao: 'Aplicar fundamentos de desenho e percepção visual' },
          { codigo: 'CB7', descricao: 'Aplicar os princípios e normas da linguagem na comunicação oral e escrita na elaboração de diferentes tipos de textos técnicos' },
          { codigo: 'CB8', descricao: 'Reconhecer fundamentos de desenho e percepção visual' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Desenho como Meio de Comunicação', subitens: [
            { codigo: '1.1', titulo: 'Síntese e simbolização', subitens: [
              { codigo: '1.1.1', titulo: 'Holística' },
              { codigo: '1.1.2', titulo: 'Concreta' },
              { codigo: '1.1.3', titulo: 'Sensorial' },
              { codigo: '1.1.4', titulo: 'Sequencial' },
              { codigo: '1.1.5', titulo: 'Simbólica' },
              { codigo: '1.1.6', titulo: 'Verbal' },
              { codigo: '1.1.7', titulo: 'Modalidades cognitivas' }
            ]}
          ]},
          { codigo: '2', titulo: 'Desenho de Observação' },
          { codigo: '3', titulo: 'Desenho de Perspectiva' },
          { codigo: '4', titulo: 'Modalidades do Desenho', subitens: [
            { codigo: '4.1', titulo: 'Croqui' },
            { codigo: '4.2', titulo: 'Projetivo' },
            { codigo: '4.3', titulo: 'Geométrico' },
            { codigo: '4.4', titulo: 'Noções de proporção' },
            { codigo: '4.5', titulo: 'Ilustração' }
          ]},
          { codigo: '5', titulo: 'Técnicas de Desenho', subitens: [
            { codigo: '5.1', titulo: 'Pastel' },
            { codigo: '5.2', titulo: 'Tinta' },
            { codigo: '5.3', titulo: 'Pena' },
            { codigo: '5.4', titulo: 'Carvão' },
            { codigo: '5.5', titulo: 'Lápis' },
            { codigo: '5.6', titulo: 'Grafite' }
          ]},
          { codigo: '6', titulo: 'Representação', subitens: [
            { codigo: '6.1', titulo: 'Textura' },
            { codigo: '6.2', titulo: 'Volume' },
            { codigo: '6.3', titulo: 'Superfície' },
            { codigo: '6.4', titulo: 'Linha' },
            { codigo: '6.5', titulo: 'Ponto' }
          ]},
          { codigo: '7', titulo: 'Princípios da Gestalt', subitens: [
            { codigo: '7.1', titulo: 'Unidade' },
            { codigo: '7.2', titulo: 'Unificação' },
            { codigo: '7.3', titulo: 'Segregação' },
            { codigo: '7.4', titulo: 'Semelhança' },
            { codigo: '7.5', titulo: 'Proximidade' },
            { codigo: '7.6', titulo: 'Continuidade' },
            { codigo: '7.7', titulo: 'Fechamento' },
            { codigo: '7.8', titulo: 'Pregnância' }
          ]},
          { codigo: '8', titulo: 'Composição Visual', subitens: [
            { codigo: '8.1', titulo: 'Harmonia' },
            { codigo: '8.2', titulo: 'Ordem' },
            { codigo: '8.3', titulo: 'Contraste' },
            { codigo: '8.4', titulo: 'Equilíbrio' },
            { codigo: '8.5', titulo: 'Estabilidade e instabilidade' },
            { codigo: '8.6', titulo: 'Alinhamento' },
            { codigo: '8.7', titulo: 'Peso' },
            { codigo: '8.8', titulo: 'Direção' },
            { codigo: '8.9', titulo: 'Proporção e escala' },
            { codigo: '8.10', titulo: 'Série de Fibonacci' },
            { codigo: '8.11', titulo: 'Princípio de Vetrúvio' },
            { codigo: '8.12', titulo: 'Retângulo áureo' },
            { codigo: '8.13', titulo: 'Retângulos estáticos' },
            { codigo: '8.14', titulo: 'Retângulos dinâmicos' },
            { codigo: '8.15', titulo: 'Composições dinâmicas' },
            { codigo: '8.16', titulo: 'Ritmo' },
            { codigo: '8.17', titulo: 'Regularidade e irregularidade' },
            { codigo: '8.18', titulo: 'Simetria e assimetria' },
            { codigo: '8.19', titulo: 'Movimento' },
            { codigo: '8.20', titulo: 'Proximidade' },
            { codigo: '8.21', titulo: 'Repetição' },
            { codigo: '8.22', titulo: 'Dinamismo' }
          ]},
          { codigo: '9', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '9.1', titulo: 'Ética moral' },
            { codigo: '9.2', titulo: 'Empatia' },
            { codigo: '9.3', titulo: 'Respeito' },
            { codigo: '9.4', titulo: 'Imparcialidade' },
            { codigo: '9.5', titulo: 'Honestidade' },
            { codigo: '9.6', titulo: 'Responsabilidade' },
            { codigo: '9.7', titulo: 'Direitos Humanos Universais' },
            { codigo: '9.8', titulo: 'Cidadania' }
          ]},
          { codigo: '10', titulo: 'Administração do Tempo', subitens: [
            { codigo: '10.1', titulo: 'Ferramentas para uma gestão eficaz do tempo' }
          ]}
        ]
      },
      {
        id: 'uc4',
        nome: 'Fundamentos de Fotografia Digital e de Semiótica',
        cargaHoraria: 40,
        modulo: 'Básico',
        capacidades: [
          { codigo: 'CB1', descricao: 'Identificar princípios e ferramentas utilizados nos processos criativos' },
          { codigo: 'CB2', descricao: 'Reconhecer as diferentes mídias para desenvolvimento das atividades' },
          { codigo: 'CB3', descricao: 'Analisar as referências das pesquisas para o desenvolvimento das atividades' },
          { codigo: 'CB4', descricao: 'Aplicar os princípios de informática na utilização de ferramentas para o auxílio nas suas atividades' },
          { codigo: 'CB5', descricao: 'Aplicar fundamentos de matemática aplicada' },
          { codigo: 'CB6', descricao: 'Aplicar fundamentos de análise e construção da imagem' },
          { codigo: 'CB7', descricao: 'Aplicar os princípios e normas da linguagem na comunicação oral e escrita na elaboração de diferentes tipos de textos técnicos' },
          { codigo: 'CB8', descricao: 'Aplicar princípios de fotografia' },
          { codigo: 'CB9', descricao: 'Reconhecer fundamentos de análise e construção da imagem' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'História da Fotografia', subitens: [
            { codigo: '1.1', titulo: 'Digital' },
            { codigo: '1.2', titulo: 'Analógico' },
            { codigo: '1.3', titulo: 'Evolução da imagem' }
          ]},
          { codigo: '2', titulo: 'Formação da Imagem Digital', subitens: [
            { codigo: '2.1', titulo: 'Leitura e Análise de Imagens', subitens: [
              { codigo: '2.1.1', titulo: 'Formatos de arquivos' },
              { codigo: '2.1.2', titulo: 'Memória' },
              { codigo: '2.1.3', titulo: 'Sensor de imagem' },
              { codigo: '2.1.4', titulo: 'Resolução' },
              { codigo: '2.1.5', titulo: 'Profundidade de cor' }
            ]},
            { codigo: '2.2', titulo: 'Linguagem visual verbal' }
          ]},
          { codigo: '3', titulo: 'Semiótica', subitens: [
            { codigo: '3.1', titulo: 'Signo', subitens: [
              { codigo: '3.1.1', titulo: 'Rema, Dicente e Argumento' },
              { codigo: '3.1.2', titulo: 'Interpretante' },
              { codigo: '3.1.3', titulo: 'Ícones, Símbolos e Índices' },
              { codigo: '3.1.4', titulo: 'Objeto' },
              { codigo: '3.1.5', titulo: 'Quali-signos, Sin-signos e Legi-signos' },
              { codigo: '3.1.6', titulo: 'Primeiridade, Secundidade e Terceiridade' },
              { codigo: '3.1.7', titulo: 'Signo em si' }
            ]}
          ]},
          { codigo: '4', titulo: 'Câmera Fotográfica Digital', subitens: [
            { codigo: '4.1', titulo: 'Produção de imagens e intervenção gráfica', subitens: [
              { codigo: '4.1.1', titulo: 'Efeitos e recursos de iluminação' },
              { codigo: '4.1.2', titulo: 'Composição' },
              { codigo: '4.1.3', titulo: 'Luz e Exposição' },
              { codigo: '4.1.4', titulo: 'Movimento' },
              { codigo: '4.1.5', titulo: 'Ponto de vista da câmera' },
              { codigo: '4.1.6', titulo: 'Motivo/tema' },
              { codigo: '4.1.7', titulo: 'Linhas' },
              { codigo: '4.1.8', titulo: 'Regras de composição' },
              { codigo: '4.1.9', titulo: 'Composição do quadro' }
            ]},
            { codigo: '4.2', titulo: 'Linguagem fotográfica' },
            { codigo: '4.3', titulo: 'Acessórios' },
            { codigo: '4.4', titulo: 'Partes' },
            { codigo: '4.5', titulo: 'Manuseio' },
            { codigo: '4.6', titulo: 'Tipos' }
          ]},
          { codigo: '5', titulo: 'Ambiente', subitens: [
            { codigo: '5.1', titulo: 'Luz natural e artificial' }
          ]},
          { codigo: '6', titulo: 'Aplicações Gráficas', subitens: [
            { codigo: '6.1', titulo: 'Fotografia, cinema, publicidade e design gráfico' }
          ]},
          { codigo: '7', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '7.1', titulo: 'Produtividade' },
            { codigo: '7.2', titulo: 'Criatividade' },
            { codigo: '7.3', titulo: 'Iniciativa' },
            { codigo: '7.4', titulo: 'Cooperação' },
            { codigo: '7.5', titulo: 'Disciplina' }
          ]},
          { codigo: '8', titulo: 'Organização do Local de Trabalho', subitens: [
            { codigo: '8.1', titulo: 'Materiais' },
            { codigo: '8.2', titulo: 'Atividades' },
            { codigo: '8.3', titulo: 'Espaço' },
            { codigo: '8.4', titulo: 'Tempo' }
          ]},
          { codigo: '9', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '9.1', titulo: 'Empatia' },
            { codigo: '9.2', titulo: 'Respeito' },
            { codigo: '9.3', titulo: 'Imparcialidade' },
            { codigo: '9.4', titulo: 'Honestidade' },
            { codigo: '9.5', titulo: 'Responsabilidade' },
            { codigo: '9.6', titulo: 'Direitos Humanos Universais' },
            { codigo: '9.7', titulo: 'Cidadania' },
            { codigo: '9.8', titulo: 'Ética moral' }
          ]},
          { codigo: '10', titulo: 'Administração do Tempo', subitens: [
            { codigo: '10.1', titulo: 'Ferramentas para uma gestão eficaz do tempo' }
          ]}
        ]
      },
      // Módulo ESPECÍFICO I (240h)
      {
        id: 'uc5',
        nome: 'Tipografia',
        cargaHoraria: 60,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Analisar pesquisa de propriedade intelectual para a escolha, modificação ou criação da tipografia do projeto' },
          { codigo: 'CT2', descricao: 'Identificar normas e procedimentos para a escolha, modificação ou criação da tipografia do projeto' },
          { codigo: 'CT3', descricao: 'Identificar soluções de acessibilidade e sustentabilidade para o projeto de mídias digitais' },
          { codigo: 'CT4', descricao: 'Analisar a influência das diferentes referências para a escolha, modificação ou criação da tipografia do projeto' },
          { codigo: 'CT5', descricao: 'Selecionar padrões cromáticos adequados a escolha, modificação ou criação da tipografia do projeto' },
          { codigo: 'CT6', descricao: 'Identificar a persona a quem se destina o projeto' },
          { codigo: 'CT7', descricao: 'Selecionar softwares, aplicativos e plugins necessários para a criação do projeto' },
          { codigo: 'CT8', descricao: 'Identificar a estrutura de tipometria necessária' },
          { codigo: 'CT9', descricao: 'Aplicar conceitos de design thinking para o desenvolvimento do processo criativo da tipografia' },
          { codigo: 'CT10', descricao: 'Selecionar as diferentes referências para a escolha, modificação ou criação da tipografia do projeto' },
          { codigo: 'CT11', descricao: 'Selecionar metodologias para a escolha, edição ou criação de tipografia da identidade visual do projeto' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Administração do Tempo', subitens: [
            { codigo: '1.1', titulo: 'Ferramentas para gestão eficaz do tempo' }
          ]},
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' }
          ]},
          { codigo: '10', titulo: 'Associação Psicológica do Tipo' },
          { codigo: '11', titulo: 'Análise e Aplicação', subitens: [
            { codigo: '11.1', titulo: 'Mídia digital' },
            { codigo: '11.2', titulo: 'Mídia impressa' }
          ]},
          { codigo: '12', titulo: 'Acessibilidade' },
          { codigo: '13', titulo: 'Caracteres Especiais e Ligaduras' },
          { codigo: '14', titulo: 'Tipometria', subitens: [
            { codigo: '14.1', titulo: 'Espaço "eme"' },
            { codigo: '14.2', titulo: 'Espaço quadratim' },
            { codigo: '14.3', titulo: 'Entrelinhas' },
            { codigo: '14.4', titulo: 'Espaçamento entre letras' },
            { codigo: '14.5', titulo: 'Corpo' },
            { codigo: '14.6', titulo: 'Sistema de pontos' },
            { codigo: '14.7', titulo: 'Unidade de medidas' },
            { codigo: '14.8', titulo: 'Sistema métrico' }
          ]},
          { codigo: '15', titulo: 'Fontes', subitens: [
            { codigo: '15.1', titulo: 'Estética' },
            { codigo: '15.2', titulo: 'Legibilidade' },
            { codigo: '15.3', titulo: 'Morfologia' },
            { codigo: '15.4', titulo: 'Estilos' }
          ]},
          { codigo: '16', titulo: 'Classificação', subitens: [
            { codigo: '16.1', titulo: 'Fantasia' },
            { codigo: '16.2', titulo: 'Gótica' },
            { codigo: '16.3', titulo: 'Com serifa' },
            { codigo: '16.4', titulo: 'Sem serifa' },
            { codigo: '16.5', titulo: 'Cursiva' }
          ]},
          { codigo: '17', titulo: 'Famílias Tipográficas', subitens: [
            { codigo: '17.1', titulo: 'Expandido' },
            { codigo: '17.2', titulo: 'Condensado' },
            { codigo: '17.3', titulo: 'Demi' },
            { codigo: '17.4', titulo: 'Bold' },
            { codigo: '17.5', titulo: 'Light' },
            { codigo: '17.6', titulo: 'Regular' },
            { codigo: '17.7', titulo: 'Itálico' }
          ]},
          { codigo: '18', titulo: 'Elementos do Tipo', subitens: [
            { codigo: '18.1', titulo: 'Flexão' },
            { codigo: '18.2', titulo: 'Serifa' },
            { codigo: '18.3', titulo: 'Barra' },
            { codigo: '18.4', titulo: 'Haste' }
          ]},
          { codigo: '19', titulo: 'Manipulação por Software de Edição', subitens: [
            { codigo: '19.1', titulo: 'Ferramentas de pintura' },
            { codigo: '19.2', titulo: 'Automatização de tarefas' },
            { codigo: '19.3', titulo: 'Ajustes de resolução' },
            { codigo: '19.4', titulo: 'Recortes' },
            { codigo: '19.5', titulo: 'Camadas' },
            { codigo: '19.6', titulo: 'Seleção' },
            { codigo: '19.7', titulo: 'Bitmaps' }
          ]},
          { codigo: '20', titulo: 'Tipografia', subitens: [
            { codigo: '20.1', titulo: 'Expressão' },
            { codigo: '20.2', titulo: 'Plasticidade' },
            { codigo: '20.3', titulo: 'Legibilidade' },
            { codigo: '20.4', titulo: 'Objetividade' },
            { codigo: '20.5', titulo: 'Linearidade' },
            { codigo: '20.6', titulo: 'Função dos tipos' }
          ]}
        ]
      },
      {
        id: 'uc6',
        nome: 'Projeto de Mídias Digitais',
        cargaHoraria: 80,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar normas e procedimentos para elaboração do projeto de mídias digitais' },
          { codigo: 'CT2', descricao: 'Identificar soluções de usabilidade do produto com base nos padrões de mercado' },
          { codigo: 'CT3', descricao: 'Identificar pesquisa de propriedade intelectual para criação do projeto de mídias digitais' },
          { codigo: 'CT4', descricao: 'Analisar a eficiência e eficácia da metodologia utilizada na elaboração do projeto' },
          { codigo: 'CT5', descricao: 'Aplicar metodologia de design para elaboração do projeto' },
          { codigo: 'CT6', descricao: 'Definir diferentes referências para a criação da identidade visual do projeto de mídias digitais' },
          { codigo: 'CT7', descricao: 'Avaliar a influência das diferentes referências para a criação da identidade visual do projeto' },
          { codigo: 'CT8', descricao: 'Definir padrões cromáticos adequados ao projeto' },
          { codigo: 'CT9', descricao: 'Definir padrões tipográficos adequados ao projeto' },
          { codigo: 'CT10', descricao: 'Aplicar conceitos básicos de design thinking para o desenvolvimento do processo criativo no projeto' },
          { codigo: 'CT11', descricao: 'Selecionar metodologia de design a ser utilizada na elaboração da comunicação visual' },
          { codigo: 'CT12', descricao: 'Identificar os equipamentos e softwares necessários para criação do projeto' },
          { codigo: 'CT13', descricao: 'Reconhecer o workflow para elaboração da estratégia de trabalho' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' }
          ]},
          { codigo: '10', titulo: 'Imagem Digital', subitens: [
            { codigo: '10.1', titulo: 'Manipulação por software de edição', subitens: [
              { codigo: '10.1.1', titulo: 'Ferramentas de pintura' },
              { codigo: '10.1.2', titulo: 'Automatização de tarefas' },
              { codigo: '10.1.3', titulo: 'Ajustes de resolução' },
              { codigo: '10.1.4', titulo: 'Recortes' },
              { codigo: '10.1.5', titulo: 'Camadas' },
              { codigo: '10.1.6', titulo: 'Seleção' },
              { codigo: '10.1.7', titulo: 'Bitmaps' }
            ]},
            { codigo: '10.2', titulo: 'Formatos de arquivos' },
            { codigo: '10.3', titulo: 'Resolução' },
            { codigo: '10.4', titulo: 'Profundidade de cor' }
          ]},
          { codigo: '11', titulo: 'Imagem Vetorial', subitens: [
            { codigo: '11.1', titulo: 'Manipulação por software de edição', subitens: [
              { codigo: '11.1.1', titulo: 'Ferramentas de pintura' },
              { codigo: '11.1.2', titulo: 'Automatização de tarefas' },
              { codigo: '11.1.3', titulo: 'Ajustes de resolução' },
              { codigo: '11.1.4', titulo: 'Recortes' },
              { codigo: '11.1.5', titulo: 'Camadas' },
              { codigo: '11.1.6', titulo: 'Seleção' },
              { codigo: '11.1.7', titulo: 'Vetores' }
            ]},
            { codigo: '11.2', titulo: 'Formatos de arquivos' },
            { codigo: '11.3', titulo: 'Resolução' }
          ]},
          { codigo: '12', titulo: 'Diagramação', subitens: [
            { codigo: '12.1', titulo: 'Manipulação por software de edição', subitens: [
              { codigo: '12.1.1', titulo: 'Automatização de tarefas' },
              { codigo: '12.1.2', titulo: 'Camadas' },
              { codigo: '12.1.3', titulo: 'Páginas mestras' },
              { codigo: '12.1.4', titulo: 'Estilos de caractere' },
              { codigo: '12.1.5', titulo: 'Estilos de parágrafo' }
            ]},
            { codigo: '12.2', titulo: 'Formatos de arquivos' },
            { codigo: '12.3', titulo: 'Resolução' }
          ]}
        ]
      },
      {
        id: 'uc7',
        nome: 'Imagem Digital',
        cargaHoraria: 100,
        modulo: 'Específico I',
        capacidades: [
          { codigo: 'CT1', descricao: 'Analisar soluções de usabilidade do produto com base nos padrões de mercado' },
          { codigo: 'CT2', descricao: 'Analisar pesquisa de propriedade intelectual para criação do projeto de mídias digitais' },
          { codigo: 'CT3', descricao: 'Identificar estilo de animações que serão utilizadas no projeto de motion design' },
          { codigo: 'CT4', descricao: 'Identificar tipos e formatos de imagens que serão utilizadas nas diferentes etapas do projeto' },
          { codigo: 'CT5', descricao: 'Identificar os formatos de sons que serão utilizados no projeto' },
          { codigo: 'CT6', descricao: 'Identificar os formatos de vídeos que serão utilizados nas plataformas do projeto' },
          { codigo: 'CT7', descricao: 'Identificar softwares para a produção de roteiros, imagens, sons, animações e vídeos' },
          { codigo: 'CT8', descricao: 'Identificar roteiros necessários para o desenvolvimento dos diferentes projetos' },
          { codigo: 'CT9', descricao: 'Aplicar técnicas de brainstorm para desenvolvimento da ideia do projeto' },
          { codigo: 'CT10', descricao: 'Aplicar conceitos de design thinking para o desenvolvimento do processo criativo do projeto' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' }
          ]},
          { codigo: '10', titulo: 'Imagem Digital', subitens: [
            { codigo: '10.1', titulo: 'Manipulação por software de edição', subitens: [
              { codigo: '10.1.1', titulo: 'Ferramentas de pintura' },
              { codigo: '10.1.2', titulo: 'Automatização de tarefas' },
              { codigo: '10.1.3', titulo: 'Ajustes de resolução' },
              { codigo: '10.1.4', titulo: 'Recortes' },
              { codigo: '10.1.5', titulo: 'Camadas' },
              { codigo: '10.1.6', titulo: 'Seleção' },
              { codigo: '10.1.7', titulo: 'Bitmaps' }
            ]},
            { codigo: '10.2', titulo: 'Formatos de arquivos' },
            { codigo: '10.3', titulo: 'Resolução' },
            { codigo: '10.4', titulo: 'Profundidade de cor' }
          ]},
          { codigo: '11', titulo: 'Imagem Vetorial', subitens: [
            { codigo: '11.1', titulo: 'Manipulação por software de edição', subitens: [
              { codigo: '11.1.1', titulo: 'Ferramentas de pintura' },
              { codigo: '11.1.2', titulo: 'Automatização de tarefas' },
              { codigo: '11.1.3', titulo: 'Ajustes de resolução' },
              { codigo: '11.1.4', titulo: 'Recortes' },
              { codigo: '11.1.5', titulo: 'Camadas' },
              { codigo: '11.1.6', titulo: 'Seleção' },
              { codigo: '11.1.7', titulo: 'Vetores' }
            ]},
            { codigo: '11.2', titulo: 'Formatos de arquivos' },
            { codigo: '11.3', titulo: 'Resolução' }
          ]},
          { codigo: '12', titulo: 'Formatos de Áudio', subitens: [
            { codigo: '12.1', titulo: 'Extensões' },
            { codigo: '12.2', titulo: 'Aplicações' },
            { codigo: '12.3', titulo: 'Resoluções' }
          ]},
          { codigo: '13', titulo: 'Formatos de Vídeo', subitens: [
            { codigo: '13.1', titulo: 'Extensões' },
            { codigo: '13.2', titulo: 'Aplicações' },
            { codigo: '13.3', titulo: 'Resoluções' }
          ]}
        ]
      },
      // Módulo ESPECÍFICO II (400h)
      {
        id: 'uc8',
        nome: 'Projeto de Identidade Visual',
        cargaHoraria: 100,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar padrões, normas e procedimentos para elaboração do projeto de mídias digitais, referentes a propriedade intelectual, acessibilidade, usabilidade e sustentabilidade' },
          { codigo: 'CT2', descricao: 'Aplicar variações de padrões cromáticos adequados à utilização da identidade visual' },
          { codigo: 'CT3', descricao: 'Aplicar variações de padrões tipográficos adequados à utilização da identidade visual' },
          { codigo: 'CT4', descricao: 'Aplicar software e aplicativos necessários para desenvolvimento do projeto de identidade visual' },
          { codigo: 'CT5', descricao: 'Aplicar metodologias para a criação da identidade visual do projeto' },
          { codigo: 'CT6', descricao: 'Aplicar o processo de descobertas e invenções para criação da identidade visual' },
          { codigo: 'CT7', descricao: 'Aplicar os elementos criativos e formatos para a elaboração do projeto de identidade visual' },
          { codigo: 'CT8', descricao: 'Aplicar procedimentos técnicos de diagramação, proximidade e alinhamento' },
          { codigo: 'CT9', descricao: 'Aplicar as referências na criação da identidade visual do projeto de mídias digitais' },
          { codigo: 'CT10', descricao: 'Identificar a influência das informações do briefing no conceito da identidade visual' },
          { codigo: 'CT11', descricao: 'Aplicar conceitos básicos de design thinking para o desenvolvimento do processo criativo adequados ao manual de identidade visual' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentações Corporativas Aplicada', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' },
            { codigo: '9.5', titulo: 'Elementos gráficos' },
            { codigo: '9.6', titulo: 'Projeto visual' },
            { codigo: '9.7', titulo: 'Roteiro' },
            { codigo: '9.8', titulo: 'Briefing' }
          ]},
          { codigo: '10', titulo: 'Manual de Identidade', subitens: [
            { codigo: '10.1', titulo: 'Fechamento de arquivo digital' },
            { codigo: '10.2', titulo: 'Aplicações', subitens: [
              { codigo: '10.2.1', titulo: 'Frota' },
              { codigo: '10.2.2', titulo: 'Sinalização' },
              { codigo: '10.2.3', titulo: 'Uniformes' },
              { codigo: '10.2.4', titulo: 'Formulários' },
              { codigo: '10.2.5', titulo: 'Papelaria básica' }
            ]},
            { codigo: '10.3', titulo: 'Folha síntese' },
            { codigo: '10.4', titulo: 'Proibições' },
            { codigo: '10.5', titulo: 'Endereços' },
            { codigo: '10.6', titulo: 'Assinaturas' },
            { codigo: '10.7', titulo: 'Aplicação em fundo escuro ou colorido' },
            { codigo: '10.8', titulo: 'Versão em negativo' },
            { codigo: '10.9', titulo: 'Versão monocromática' },
            { codigo: '10.10', titulo: 'Área de proteção' },
            { codigo: '10.11', titulo: 'Tamanho mínimo de aplicação' },
            { codigo: '10.12', titulo: 'Cores institucionais' },
            { codigo: '10.13', titulo: 'Tipografia padrão' },
            { codigo: '10.14', titulo: 'Grade de construção / modulação' },
            { codigo: '10.15', titulo: 'Definição' }
          ]},
          { codigo: '11', titulo: 'Identidade Visual', subitens: [
            { codigo: '11.1', titulo: 'Etapas de construção', subitens: [
              { codigo: '11.1.1', titulo: 'Leiaute' },
              { codigo: '11.1.2', titulo: 'Rafes' },
              { codigo: '11.1.3', titulo: 'Cronograma' },
              { codigo: '11.1.4', titulo: 'Orçamentos' },
              { codigo: '11.1.5', titulo: 'Conceituação' },
              { codigo: '11.1.6', titulo: 'Ideação' },
              { codigo: '11.1.7', titulo: 'Pesquisa' },
              { codigo: '11.1.8', titulo: 'Briefing' }
            ]},
            { codigo: '11.2', titulo: 'Cor' },
            { codigo: '11.3', titulo: 'Composição' },
            { codigo: '11.4', titulo: 'Síntese da forma' },
            { codigo: '11.5', titulo: 'Símbolos figurativos', subitens: [
              { codigo: '11.5.1', titulo: 'Baseado em ideogramas' },
              { codigo: '11.5.2', titulo: 'Baseado em fonogramas' },
              { codigo: '11.5.3', titulo: 'Baseado em ícones' }
            ]},
            { codigo: '11.6', titulo: 'Símbolos abstratos' },
            { codigo: '11.7', titulo: 'Logotipo', subitens: [
              { codigo: '11.7.1', titulo: 'Tipografia existente modificada' },
              { codigo: '11.7.2', titulo: 'Tipografia existente' },
              { codigo: '11.7.3', titulo: 'Tipografia desenhada' },
              { codigo: '11.7.4', titulo: 'Fonético' }
            ]},
            { codigo: '11.8', titulo: 'Elementos' },
            { codigo: '11.9', titulo: 'Definição' },
            { codigo: '11.10', titulo: 'Histórico' }
          ]},
          { codigo: '12', titulo: 'Marca', subitens: [
            { codigo: '12.1', titulo: 'Apresentação', subitens: [
              { codigo: '12.1.1', titulo: 'Propriedade intelectual' },
              { codigo: '12.1.2', titulo: 'Legislação de registro de marca' },
              { codigo: '12.1.3', titulo: 'Tridimensionais' },
              { codigo: '12.1.4', titulo: 'Mistas' },
              { codigo: '12.1.5', titulo: 'Nominativas' },
              { codigo: '12.1.6', titulo: 'Figurativas' }
            ]},
            { codigo: '12.2', titulo: 'Aplicação', subitens: [
              { codigo: '12.2.1', titulo: 'Coletivas' },
              { codigo: '12.2.2', titulo: 'Certificação' },
              { codigo: '12.2.3', titulo: 'Produtos e serviços' }
            ]},
            { codigo: '12.3', titulo: 'Características' },
            { codigo: '12.4', titulo: 'Definição' }
          ]}
        ]
      },
      {
        id: 'uc9',
        nome: 'Design Web',
        cargaHoraria: 100,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Aplicar procedimentos técnicos de diagramação, proximidade e alinhamento' },
          { codigo: 'CT2', descricao: 'Identificar padrões, normas e procedimentos para elaboração do projeto de mídias digitais, referentes a propriedade intelectual, acessibilidade, usabilidade e sustentabilidade' },
          { codigo: 'CT3', descricao: 'Identificar estrutura técnica para desenvolvimento de wireframes de interfaces gráficas design web, interfaces e redes sociais' },
          { codigo: 'CT4', descricao: 'Aplicar testes de usabilidade e funcionalidade dos projetos' },
          { codigo: 'CT5', descricao: 'Identificar possibilidades de atualizações e melhorias de projetos web' },
          { codigo: 'CT6', descricao: 'Aplicar linguagem HTML (HyperText Markup Language) para desenvolvimento de design web' },
          { codigo: 'CT7', descricao: 'Aplicar a publicação de website para visualização online de projeto de web' },
          { codigo: 'CT8', descricao: 'Aplicar conceitos de design de experiência e interação do usuário' },
          { codigo: 'CT9', descricao: 'Aplicar desenvolvimento de protótipos de interfaces gráficas para design web' },
          { codigo: 'CT10', descricao: 'Aplicar estilos CSS (Cascading Style Sheets) para desenvolvimento de design web' },
          { codigo: 'CT11', descricao: 'Selecionar software, aplicativos e plugins necessários para a criação dos projetos de design web' },
          { codigo: 'CT12', descricao: 'Analisar usabilidade e navegabilidade do projeto' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação Aplicada' },
          { codigo: '10', titulo: 'Desenvolvimento para Mídias Sociais', subitens: [
            { codigo: '10.1', titulo: 'Customização', subitens: [
              { codigo: '10.1.1', titulo: 'Edição de áudio e vídeo' },
              { codigo: '10.1.2', titulo: 'Edição de imagens' },
              { codigo: '10.1.3', titulo: 'Edição de textos' }
            ]},
            { codigo: '10.2', titulo: 'Características', subitens: [
              { codigo: '10.2.1', titulo: 'Resoluções' },
              { codigo: '10.2.2', titulo: 'Dimensões' }
            ]},
            { codigo: '10.3', titulo: 'Tipos' }
          ]},
          { codigo: '11', titulo: 'Desenvolvimento do Projeto', subitens: [
            { codigo: '11.1', titulo: 'Testes de validação' },
            { codigo: '11.2', titulo: 'Ferramentas de análise (google analytics)' },
            { codigo: '11.3', titulo: 'Publicação' },
            { codigo: '11.4', titulo: 'Implementação' },
            { codigo: '11.5', titulo: 'Templates' },
            { codigo: '11.6', titulo: 'Prototipação do leiaute das telas' },
            { codigo: '11.7', titulo: 'Responsividade' },
            { codigo: '11.8', titulo: 'Leiaute' },
            { codigo: '11.9', titulo: 'Equilíbrio visual' },
            { codigo: '11.10', titulo: 'Wireframes' },
            { codigo: '11.11', titulo: 'Rafes' },
            { codigo: '11.12', titulo: 'Conceituação' },
            { codigo: '11.13', titulo: 'Ideação' },
            { codigo: '11.14', titulo: 'Tendência' },
            { codigo: '11.15', titulo: 'Pesquisa' },
            { codigo: '11.16', titulo: 'Briefing' }
          ]},
          { codigo: '12', titulo: 'Plataformas de Desenvolvimento', subitens: [
            { codigo: '12.1', titulo: 'Fundamentos', subitens: [
              { codigo: '12.1.1', titulo: 'Dispositivos' },
              { codigo: '12.1.2', titulo: 'Plataformas de desenvolvimento' },
              { codigo: '12.1.3', titulo: 'Categorias' },
              { codigo: '12.1.4', titulo: 'Definição' }
            ]}
          ]},
          { codigo: '13', titulo: 'Interfaces Web e App', subitens: [
            { codigo: '13.1', titulo: 'Wireframes responsivos' },
            { codigo: '13.2', titulo: 'Estrutura de navegação' },
            { codigo: '13.3', titulo: 'Arquitetura de informação' },
            { codigo: '13.4', titulo: 'Planejamento' },
            { codigo: '13.5', titulo: 'Design responsivo' },
            { codigo: '13.6', titulo: 'Acessibilidade' },
            { codigo: '13.7', titulo: 'Experiência do usuário' },
            { codigo: '13.8', titulo: 'User Interface' }
          ]},
          { codigo: '14', titulo: 'Criação de Código de Texto', subitens: [
            { codigo: '14.1', titulo: 'Introdução ao Javascript' },
            { codigo: '14.2', titulo: 'Navegadores' },
            { codigo: '14.3', titulo: 'Editores' },
            { codigo: '14.4', titulo: 'Responsividade' },
            { codigo: '14.5', titulo: 'Folha de estilos em cascata' },
            { codigo: '14.6', titulo: 'Elementos' },
            { codigo: '14.7', titulo: 'Links' },
            { codigo: '14.8', titulo: 'Tags' },
            { codigo: '14.9', titulo: 'Estrutura do documento' }
          ]},
          { codigo: '15', titulo: 'Internet', subitens: [
            { codigo: '15.1', titulo: 'Segurança' },
            { codigo: '15.2', titulo: 'Provedores' },
            { codigo: '15.3', titulo: 'Hospedagem' },
            { codigo: '15.4', titulo: 'Domínios' },
            { codigo: '15.5', titulo: 'História' }
          ]}
        ]
      },
      {
        id: 'uc10',
        nome: 'Design de Interfaces',
        cargaHoraria: 100,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Selecionar elementos audiovisuais como: formas, imagens, grafismos, pictogramas, áudio, animações vídeos, textos para o desenvolvimento do projeto' },
          { codigo: 'CT2', descricao: 'Aplicar os padrões de experiência de usuários nos projetos de interface' },
          { codigo: 'CT3', descricao: 'Aplicar procedimentos técnicos de automatização, diagramação, proximidade e alinhamento para projetos de interfaces' },
          { codigo: 'CT4', descricao: 'Identificar estrutura técnica para desenvolvimento de layout com características de responsividade para projetos de interfaces' },
          { codigo: 'CT5', descricao: 'Analisar usabilidade e navegabilidade do projeto de mídias digitais' },
          { codigo: 'CT6', descricao: 'Identificar aspectos técnicos, funcionais, de custos, tipos de materiais e condições de produção digital para a criação do projeto' },
          { codigo: 'CT7', descricao: 'Identificar estrutura técnica para desenvolvimento de wireframes de interfaces gráficas design web, interfaces e redes sociais para elaboração de projetos digitais' },
          { codigo: 'CT8', descricao: 'Selecionar softwares, aplicativos e plugins necessários para a elaboração do layout para projetos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' }
          ]},
          { codigo: '10', titulo: 'Prototipação do Leiaute das Telas', subitens: [
            { codigo: '10.1', titulo: 'Websites', subitens: [
              { codigo: '10.1.1', titulo: 'Segurança' },
              { codigo: '10.1.2', titulo: 'Provedores' },
              { codigo: '10.1.3', titulo: 'Hospedagem' },
              { codigo: '10.1.4', titulo: 'Domínios' },
              { codigo: '10.1.5', titulo: 'História' },
              { codigo: '10.1.6', titulo: 'Internet' }
            ]},
            { codigo: '10.2', titulo: 'Hipertexto', subitens: [
              { codigo: '10.2.1', titulo: 'Navegadores' },
              { codigo: '10.2.2', titulo: 'Editores' },
              { codigo: '10.2.3', titulo: 'Responsividade' },
              { codigo: '10.2.4', titulo: 'Folha de estilos em cascata' },
              { codigo: '10.2.5', titulo: 'Elementos' },
              { codigo: '10.2.6', titulo: 'Links' },
              { codigo: '10.2.7', titulo: 'Tags' },
              { codigo: '10.2.8', titulo: 'Estrutura do documento' }
            ]}
          ]},
          { codigo: '11', titulo: 'Interfaces para Mídias Sociais', subitens: [
            { codigo: '11.1', titulo: 'Tendências' },
            { codigo: '11.2', titulo: 'Customização', subitens: [
              { codigo: '11.2.1', titulo: 'Edição de áudio e vídeo' },
              { codigo: '11.2.2', titulo: 'Edição de imagens' },
              { codigo: '11.2.3', titulo: 'Edição de textos' }
            ]},
            { codigo: '11.3', titulo: 'Características', subitens: [
              { codigo: '11.3.1', titulo: 'Resoluções' },
              { codigo: '11.3.2', titulo: 'Dimensões' }
            ]},
            { codigo: '11.4', titulo: 'Tipos' }
          ]},
          { codigo: '12', titulo: 'Desenvolvimento de Interfaces Web e App', subitens: [
            { codigo: '12.1', titulo: 'Testes de validação' },
            { codigo: '12.2', titulo: 'Publicação' },
            { codigo: '12.3', titulo: 'Implementação' },
            { codigo: '12.4', titulo: 'Templates' },
            { codigo: '12.5', titulo: 'Prototipação' },
            { codigo: '12.6', titulo: 'Diagramação para páginas', subitens: [
              { codigo: '12.6.1', titulo: 'Estilos de interação' },
              { codigo: '12.6.2', titulo: 'Formulários' }
            ]},
            { codigo: '12.7', titulo: 'Comprimento da página' },
            { codigo: '12.8', titulo: 'Dimensões da página' },
            { codigo: '12.9', titulo: 'Leiaute', subitens: [
              { codigo: '12.9.1', titulo: 'Coerência' },
              { codigo: '12.9.2', titulo: 'Elementos básicos de tela' },
              { codigo: '12.9.3', titulo: 'Estilos de navegação' },
              { codigo: '12.9.4', titulo: 'Navegação' },
              { codigo: '12.9.5', titulo: 'Processos e técnicas de projeto' },
              { codigo: '12.9.6', titulo: 'Design de tela' }
            ]},
            { codigo: '12.10', titulo: 'Rafes', subitens: [
              { codigo: '12.10.1', titulo: 'Interfaces gráficas' },
              { codigo: '12.10.2', titulo: 'Grades' },
              { codigo: '12.10.3', titulo: 'Estrutura' },
              { codigo: '12.10.4', titulo: 'Escopo' },
              { codigo: '12.10.5', titulo: 'Estratégia' },
              { codigo: '12.10.6', titulo: 'Planos de ação' },
              { codigo: '12.10.7', titulo: 'Resoluções e manchas gráficas' },
              { codigo: '12.10.8', titulo: 'Quadros e tabelas' },
              { codigo: '12.10.9', titulo: 'Hierarquia visual' },
              { codigo: '12.10.10', titulo: 'Mapas de fluxo' },
              { codigo: '12.10.11', titulo: 'Wireframes' },
              { codigo: '12.10.12', titulo: 'Paletas e escalas de cores' }
            ]},
            { codigo: '12.11', titulo: 'Conceituação' },
            { codigo: '12.12', titulo: 'Geração de ideias' },
            { codigo: '12.13', titulo: 'Pesquisa' },
            { codigo: '12.14', titulo: 'Dispositivos' },
            { codigo: '12.15', titulo: 'Plataformas de desenvolvimento' },
            { codigo: '12.16', titulo: 'Categorias' },
            { codigo: '12.17', titulo: 'Definição' },
            { codigo: '12.18', titulo: 'Fundamentos' }
          ]},
          { codigo: '13', titulo: 'Planejamento de Interfaces', subitens: [
            { codigo: '13.1', titulo: 'Wireframes responsivos' },
            { codigo: '13.2', titulo: 'Estrutura de navegação' },
            { codigo: '13.3', titulo: 'Arquitetura de informação' }
          ]},
          { codigo: '14', titulo: 'Fundamentos de Design Digital', subitens: [
            { codigo: '14.1', titulo: 'Design de interfaces' },
            { codigo: '14.2', titulo: 'Experiência do usuário' },
            { codigo: '14.3', titulo: 'Usabilidade' }
          ]}
        ]
      },
      {
        id: 'uc11',
        nome: 'Produção Audiovisual',
        cargaHoraria: 100,
        modulo: 'Específico II',
        capacidades: [
          { codigo: 'CT1', descricao: 'Definir estrutura de pré-produção, produção e pós-produção de projetos audiovisuais' },
          { codigo: 'CT2', descricao: 'Identificar procedimentos técnicos para a produção de curtas-metragem, comerciais e documentários' },
          { codigo: 'CT3', descricao: 'Identificar padrões, normas e procedimentos para elaboração do projeto de mídias digitais, referentes a propriedade intelectual, acessibilidade, usabilidade e sustentabilidade' },
          { codigo: 'CT4', descricao: 'Identificar a estrutura técnica do roteiro e storyboard para desenvolvimento de projeto audiovisual' },
          { codigo: 'CT5', descricao: 'Identificar tipos e características de plataformas utilizados no processo de criação de elementos gráficos para imagens, animações, áudio e vídeo' },
          { codigo: 'CT6', descricao: 'Identificar a complexidade, aplicação e o estilo da produção do vídeo' },
          { codigo: 'CT7', descricao: 'Aplicar conceitos de fotografia e filmagem para o desenvolvimento audiovisual' },
          { codigo: 'CT8', descricao: 'Selecionar elementos audiovisuais como: formas, imagens, grafismos, pictogramas, áudio, animações, vídeos, textos para o desenvolvimento de animações gráficas' },
          { codigo: 'CT9', descricao: 'Identificar o processo de buffering para o processamento de dados no projeto' },
          { codigo: 'CT10', descricao: 'Aplicar ajustes de cor, chroma key, efeitos visuais e sonoros' },
          { codigo: 'CT11', descricao: 'Aplicar blocagem de animações, imagens, textos, legendas, vídeos e áudio para desenvolvimento de projeto' },
          { codigo: 'CT12', descricao: 'Aplicar edição de áudio, vídeo, texto e imagem para compor um produto audiovisual' },
          { codigo: 'CT13', descricao: 'Aplicar procedimentos de proximidade e alinhamento para desenvolver projetos audiovisuais' },
          { codigo: 'CT14', descricao: 'Aplicar render da produção audiovisual para diferentes plataformas' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação' },
          { codigo: '10', titulo: 'Propriedade Intelectual', subitens: [
            { codigo: '10.1', titulo: 'Direito de uso de imagem' }
          ]},
          { codigo: '11', titulo: 'Composição e Render', subitens: [
            { codigo: '11.1', titulo: 'Bibliotecas' },
            { codigo: '11.2', titulo: 'Render' },
            { codigo: '11.3', titulo: 'Exportação e formatos' },
            { codigo: '11.4', titulo: 'Aplicação de efeitos e transições' },
            { codigo: '11.5', titulo: 'Blocagem' },
            { codigo: '11.6', titulo: 'Decupagem' },
            { codigo: '11.7', titulo: 'Importação' }
          ]},
          { codigo: '12', titulo: 'Edição de Vídeos e Sons', subitens: [
            { codigo: '12.1', titulo: 'Técnicas', subitens: [
              { codigo: '12.1.1', titulo: 'Keyframe' },
              { codigo: '12.1.2', titulo: 'Máscaras' },
              { codigo: '12.1.3', titulo: 'Chroma key' },
              { codigo: '12.1.4', titulo: 'Buffering' },
              { codigo: '12.1.5', titulo: 'Tratamento' },
              { codigo: '12.1.6', titulo: 'Manipulação' },
              { codigo: '12.1.7', titulo: 'Criação de elementos gráficos' },
              { codigo: '12.1.8', titulo: 'Efeitos e tratamento de vídeo' },
              { codigo: '12.1.9', titulo: 'Composição com sequência de imagem' },
              { codigo: '12.1.10', titulo: 'Corte, transição e efeitos' },
              { codigo: '12.1.11', titulo: 'Edição de vídeo Não-linear' }
            ]},
            { codigo: '12.2', titulo: 'Aplicativos' }
          ]},
          { codigo: '13', titulo: 'Captura de Vídeos e Sons', subitens: [
            { codigo: '13.1', titulo: 'Equipamentos' },
            { codigo: '13.2', titulo: 'Enquadramento' },
            { codigo: '13.3', titulo: 'Cenários' },
            { codigo: '13.4', titulo: 'Acústica' },
            { codigo: '13.5', titulo: 'Iluminação' }
          ]},
          { codigo: '14', titulo: 'Storyboards e Roteiros', subitens: [
            { codigo: '14.1', titulo: 'Aplicação' },
            { codigo: '14.2', titulo: 'Características' }
          ]},
          { codigo: '15', titulo: 'Formatos de Vídeo', subitens: [
            { codigo: '15.1', titulo: 'Codecs e formatos de saída' },
            { codigo: '15.2', titulo: 'Aplicações' },
            { codigo: '15.3', titulo: 'Resoluções' },
            { codigo: '15.4', titulo: 'Extensões' }
          ]},
          { codigo: '16', titulo: 'Linguagem Audiovisual', subitens: [
            { codigo: '16.1', titulo: 'Plataformas e dispositivos de veiculação', subitens: [
              { codigo: '16.1.1', titulo: 'Internet' },
              { codigo: '16.1.2', titulo: 'TV' },
              { codigo: '16.1.3', titulo: 'Cinema' }
            ]},
            { codigo: '16.2', titulo: 'Fundamento estético do filme', subitens: [
              { codigo: '16.2.1', titulo: 'Enquadramentos' },
              { codigo: '16.2.2', titulo: 'Planos' },
              { codigo: '16.2.3', titulo: 'Montagem' }
            ]},
            { codigo: '16.3', titulo: 'Fundamentos de imagem e vídeo digital', subitens: [
              { codigo: '16.3.1', titulo: 'Canal de internet' },
              { codigo: '16.3.2', titulo: 'Curta metragem' },
              { codigo: '16.3.3', titulo: 'Longa metragem' }
            ]}
          ]}
        ]
      },
      // Módulo ESPECÍFICO III (400h)
      {
        id: 'uc12',
        nome: 'Design de Animação 3D',
        cargaHoraria: 140,
        modulo: 'Específico III',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar padrões, normas e procedimentos para elaboração do projeto de mídias digitais, referentes a propriedade intelectual, acessibilidade, usabilidade e sustentabilidade' },
          { codigo: 'CT2', descricao: 'Identificar a aplicação, complexidade e o estilo dos modelos hard surface e animação 3D' },
          { codigo: 'CT3', descricao: 'Selecionar software, aplicativos e plugins necessários para desenvolvimento da modelagem hard surface e animação 3D' },
          { codigo: 'CT4', descricao: 'Identificar estrutura técnica para desenvolvimento de roteiro desenvolvimento da animação 3D' },
          { codigo: 'CT5', descricao: 'Aplicar conceitos de animação com keyframes e curvas para desenvolvimento da animação 3D' },
          { codigo: 'CT6', descricao: 'Aplicar princípios de animação para desenvolver projetos de animação 3D' },
          { codigo: 'CT7', descricao: 'Aplicar textura no modelo 3D hard surface criado para desenvolvimento da animação 3D' },
          { codigo: 'CT8', descricao: 'Considerar aspectos técnicos, funcionais, de custos e estrutura para a criação do projeto' },
          { codigo: 'CT9', descricao: 'Identificar as características dos modelos 3D para criação do projeto' },
          { codigo: 'CT10', descricao: 'Aplicar técnicas de concept art dos modelos 3D para o desenvolvimento do projeto' },
          { codigo: 'CT11', descricao: 'Aplicar a render de modelos e animações 3D' },
          { codigo: 'CT12', descricao: 'Aplicar técnicas de modelagem 3D hard surface de elementos para desenvolvimento de animação 3D' },
          { codigo: 'CT13', descricao: 'Identificar estruturas de frames e cadência de frames para animação 3D' },
          { codigo: 'CT14', descricao: 'Identificar padrões cromáticos para desenvolvimento de texturas para projetos de animação 3D' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Render', subitens: [
            { codigo: '9.1', titulo: 'Renderização' },
            { codigo: '9.2', titulo: 'Formatos de saída' },
            { codigo: '9.3', titulo: 'Resolução' }
          ]},
          { codigo: '10', titulo: 'Animação 3D', subitens: [
            { codigo: '10.1', titulo: 'Aplicação dos princípios de animação' },
            { codigo: '10.2', titulo: 'Teste de movimento' },
            { codigo: '10.3', titulo: 'Skinning e relações de influência' },
            { codigo: '10.4', titulo: 'Relação de parentesco' },
            { codigo: '10.5', titulo: 'Criação de bones' },
            { codigo: '10.6', titulo: 'Ajustes de cenas' },
            { codigo: '10.7', titulo: 'Configuração de câmeras' },
            { codigo: '10.8', titulo: 'Animação por curvas' },
            { codigo: '10.9', titulo: 'Animação quadro a quadro' }
          ]},
          { codigo: '11', titulo: 'Modelagem 3D', subitens: [
            { codigo: '11.1', titulo: 'Criação de texturas', subitens: [
              { codigo: '11.1.1', titulo: 'Aplicação e ajustes' },
              { codigo: '11.1.2', titulo: 'Importação de textura' },
              { codigo: '11.1.3', titulo: 'Edição de textura' },
              { codigo: '11.1.4', titulo: 'Exportação de planificação' },
              { codigo: '11.1.5', titulo: 'Abertura de malha' },
              { codigo: '11.1.6', titulo: 'Mapeamento UV' }
            ]},
            { codigo: '11.2', titulo: 'Modelagem de personagens 3D', subitens: [
              { codigo: '11.2.1', titulo: 'Retopologia' }
            ]},
            { codigo: '11.3', titulo: 'Modelagem hardsurface' },
            { codigo: '11.4', titulo: 'Criação de model sheet' },
            { codigo: '11.5', titulo: 'Concept Art' },
            { codigo: '11.6', titulo: 'Anatomia ilusória' },
            { codigo: '11.7', titulo: 'Anatomia animal' },
            { codigo: '11.8', titulo: 'Anatomia humana' }
          ]},
          { codigo: '12', titulo: 'Estruturas de Modelos 3D', subitens: [
            { codigo: '12.1', titulo: 'Efeitos' },
            { codigo: '12.2', titulo: 'Bones' },
            { codigo: '12.3', titulo: 'Partículas' },
            { codigo: '12.4', titulo: 'Iluminação' },
            { codigo: '12.5', titulo: 'Composição de cena' },
            { codigo: '12.6', titulo: 'Retopologia' },
            { codigo: '12.7', titulo: 'Vértices, linhas e faces' },
            { codigo: '12.8', titulo: 'Modelagem e malha' }
          ]},
          { codigo: '13', titulo: 'Desenvolvimento de Animação', subitens: [
            { codigo: '13.1', titulo: 'Esboços' },
            { codigo: '13.2', titulo: 'Conceituação' },
            { codigo: '13.3', titulo: 'Ideação' },
            { codigo: '13.4', titulo: 'Plataformas de desenvolvimento' },
            { codigo: '13.5', titulo: 'Pesquisa' },
            { codigo: '13.6', titulo: 'Análise de roteiro ou Briefing' },
            { codigo: '13.7', titulo: 'Definição de estilos' }
          ]},
          { codigo: '14', titulo: 'Composição de Cenário', subitens: [
            { codigo: '14.1', titulo: 'Chroma Key' },
            { codigo: '14.2', titulo: 'Quadros-chave' },
            { codigo: '14.3', titulo: 'Planos' },
            { codigo: '14.4', titulo: 'Câmeras' },
            { codigo: '14.5', titulo: 'Entradas e saídas' }
          ]},
          { codigo: '15', titulo: 'Princípios da Animação' },
          { codigo: '16', titulo: 'Diferença entre 2D e 3D' },
          { codigo: '17', titulo: 'Tipos de Animação', subitens: [
            { codigo: '17.1', titulo: 'Captura de movimento' },
            { codigo: '17.2', titulo: 'Rotoscopia' },
            { codigo: '17.3', titulo: 'Stop Motion' },
            { codigo: '17.4', titulo: 'Animação clássica' }
          ]},
          { codigo: '18', titulo: 'Storyboards e Roteiros Aplicado', subitens: [
            { codigo: '18.1', titulo: 'Aplicação' },
            { codigo: '18.2', titulo: 'Características' }
          ]},
          { codigo: '19', titulo: 'Plataformas e Dispositivos Audiovisuais Aplicado', subitens: [
            { codigo: '19.1', titulo: 'Computadores' },
            { codigo: '19.2', titulo: 'Mobile' },
            { codigo: '19.3', titulo: 'TV' }
          ]},
          { codigo: '20', titulo: 'Formatos de Vídeo Aplicado', subitens: [
            { codigo: '20.1', titulo: 'Clipe de filmes' },
            { codigo: '20.2', titulo: 'Aplicações' },
            { codigo: '20.3', titulo: 'Resoluções' },
            { codigo: '20.4', titulo: 'Extensões' }
          ]}
        ]
      },
      {
        id: 'uc13',
        nome: 'Projeto de Mídias Integradas',
        cargaHoraria: 140,
        modulo: 'Específico III',
        capacidades: [
          { codigo: 'CT1', descricao: 'Considerar aspectos técnicos, funcionais, de custos, tipos de materiais e condições de produção gráfica para a criação do projeto' },
          { codigo: 'CT2', descricao: 'Identificar os pilares tecnológicos para integração dos sistemas verticais e horizontais dos projetos de design' },
          { codigo: 'CT3', descricao: 'Identificar estrutura técnica para desenvolvimento de protótipos e/ou mockups na integração de mídias digitais' },
          { codigo: 'CT4', descricao: 'Identificar os impulsores das novas tecnologias para integração dos processos' },
          { codigo: 'CT5', descricao: 'Interpretar dados, tendo em vista a análise de viabilidade técnica, financeira e ambiental dos projetos de melhoria' },
          { codigo: 'CT6', descricao: 'Selecionar softwares, aplicativos e plugins necessários a integração dos projetos de design' },
          { codigo: 'CT7', descricao: 'Selecionar plataformas onde os projetos de mídias digitais serão aplicados' },
          { codigo: 'CT8', descricao: 'Identificar mídias com possibilidade de implementação de diferentes projetos de multimídia' },
          { codigo: 'CT9', descricao: 'Definir os produtos que serão aplicados em diferentes mídias' },
          { codigo: 'CT10', descricao: 'Definir estratégias e planos de ação para aplicação e exibição dos projetos em diferentes mídias' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação' },
          { codigo: '10', titulo: 'Execução de Protótipos', subitens: [
            { codigo: '10.1', titulo: 'Ajustes e Melhorias' },
            { codigo: '10.2', titulo: 'Simulações' },
            { codigo: '10.3', titulo: 'Testes' },
            { codigo: '10.4', titulo: 'Sistematização de resultados' },
            { codigo: '10.5', titulo: 'Construção de produtos' },
            { codigo: '10.6', titulo: 'Construção de protótipos' }
          ]},
          { codigo: '11', titulo: 'Documentação Técnica', subitens: [
            { codigo: '11.1', titulo: 'Relatório técnico' },
            { codigo: '11.2', titulo: 'Elaboração de documentação' }
          ]},
          { codigo: '12', titulo: 'Gestão de Atividades', subitens: [
            { codigo: '12.1', titulo: 'PMBOK (Project Management Body of Knowledge) x modelos ágeis' }
          ]},
          { codigo: '13', titulo: 'Plataformas e Mídias de Implantação', subitens: [
            { codigo: '13.1', titulo: 'Acessibilidade' },
            { codigo: '13.2', titulo: 'Sustentabilidade' },
            { codigo: '13.3', titulo: 'Segurança da informação' },
            { codigo: '13.4', titulo: 'Manutenção' },
            { codigo: '13.5', titulo: 'Processos de fabricação' },
            { codigo: '13.6', titulo: 'Normas e padrões' },
            { codigo: '13.7', titulo: 'Inovação e melhorias' },
            { codigo: '13.8', titulo: 'Pesquisa referencial' },
            { codigo: '13.9', titulo: 'Novas tecnologias' },
            { codigo: '13.10', titulo: 'Identificação de plataformas de difusão' },
            { codigo: '13.11', titulo: 'Identificação de mídias de difusão' },
            { codigo: '13.12', titulo: 'Internet e novas mídias' }
          ]},
          { codigo: '14', titulo: 'Viabilidade Técnica e Financeira', subitens: [
            { codigo: '14.1', titulo: 'Produtividade' },
            { codigo: '14.2', titulo: 'Cronograma' },
            { codigo: '14.3', titulo: 'Orçamentos' },
            { codigo: '14.4', titulo: 'Materiais' },
            { codigo: '14.5', titulo: 'Recursos técnicos ou tecnológicos' },
            { codigo: '14.6', titulo: 'Softwares necessários' },
            { codigo: '14.7', titulo: 'Equipamentos' }
          ]},
          { codigo: '15', titulo: 'Análise e Interpretação do Briefing', subitens: [
            { codigo: '15.1', titulo: 'Benchmarking e Indicadores de Desempenho' },
            { codigo: '15.2', titulo: 'Pesquisa e coleta de dados' },
            { codigo: '15.3', titulo: 'Descrição do projeto' },
            { codigo: '15.4', titulo: 'Possíveis soluções' },
            { codigo: '15.5', titulo: 'Oportunidades de melhorias' },
            { codigo: '15.6', titulo: 'Identificação de problemas' }
          ]},
          { codigo: '16', titulo: 'Planejamento do Projeto', subitens: [
            { codigo: '16.1', titulo: 'Tipos', subitens: [
              { codigo: '16.1.1', titulo: 'Design de Animação 3D' },
              { codigo: '16.1.2', titulo: 'Motion Design' },
              { codigo: '16.1.3', titulo: 'Design de Interfaces' },
              { codigo: '16.1.4', titulo: 'Produção Audiovisual' },
              { codigo: '16.1.5', titulo: 'Design Web' }
            ]},
            { codigo: '16.2', titulo: 'Definição' }
          ]}
        ]
      },
      {
        id: 'uc14',
        nome: 'Motion Design',
        cargaHoraria: 120,
        modulo: 'Específico III',
        capacidades: [
          { codigo: 'CT1', descricao: 'Identificar aspectos técnicos, funcionais, de custos, tipos de materiais e condições de produção gráfica para a criação do projeto' },
          { codigo: 'CT2', descricao: 'Identificar estilo de animações que serão utilizadas no projeto de motion design' },
          { codigo: 'CT3', descricao: 'Identificar estrutura técnica para desenvolvimento de animações digitais bidimensionais publicitárias, cinema e web' },
          { codigo: 'CT4', descricao: 'Identificar padrões, normas e procedimentos para elaboração do projeto de mídias digitais, referentes a propriedade intelectual, acessibilidade, usabilidade e sustentabilidade' },
          { codigo: 'CT5', descricao: 'Identificar soluções de usabilidade do produto com base nos padrões de mercado' },
          { codigo: 'CT6', descricao: 'Aplicar soluções de acessibilidade e sustentabilidade para o projeto' },
          { codigo: 'CT7', descricao: 'Aplicar softwares, aplicativos e plugins necessários para a elaboração da animação para projetos de motion design' },
          { codigo: 'CT8', descricao: 'Aplicar conceitos de animação com keyframes e curvas para desenvolvimento da animação 2D para mídias digitais' },
          { codigo: 'CT9', descricao: 'Aplicar conceitos de fotografia e filmagem para o desenvolvimento audiovisual' },
          { codigo: 'CT10', descricao: 'Aplicar edição para blocar animações, imagens, textos, vídeos e áudio para desenvolvimento de projeto' },
          { codigo: 'CT11', descricao: 'Aplicar os elementos criativos e formatos para o desenvolvimento do projeto de mídias digitais audiovisuais' },
          { codigo: 'CT12', descricao: 'Aplicar princípios de animação, proximidade e alinhamento para desenvolver projetos de mídias digitais' },
          { codigo: 'CT13', descricao: 'Definir storyboard e roteiro para elaborar elementos de motion design' },
          { codigo: 'CT14', descricao: 'Selecionar elementos audiovisuais como: formas, imagens, grafismos, pictogramas, áudio, animações vídeos, textos para o desenvolvimento de animações gráficas' },
          { codigo: 'CT15', descricao: 'Identificar o processo de buffering para o processamento de dados no projeto' },
          { codigo: 'CT16', descricao: 'Aplicar ajustes de cor, chroma key, efeitos visuais e sonoros' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Ferramentas para Gestão Eficaz do Tempo' },
          { codigo: '2', titulo: 'Inovação', subitens: [
            { codigo: '2.1', titulo: 'Visão inovadora' },
            { codigo: '2.2', titulo: 'Inovação x melhoria' },
            { codigo: '2.3', titulo: 'Conceito' }
          ]},
          { codigo: '3', titulo: 'Pesquisa', subitens: [
            { codigo: '3.1', titulo: 'Propriedade intelectual' },
            { codigo: '3.2', titulo: 'Fontes' },
            { codigo: '3.3', titulo: 'Métodos' },
            { codigo: '3.4', titulo: 'Tipos' }
          ]},
          { codigo: '4', titulo: 'Ética Pessoal e Profissional', subitens: [
            { codigo: '4.1', titulo: 'Empatia' },
            { codigo: '4.2', titulo: 'Respeito' },
            { codigo: '4.3', titulo: 'Imparcialidade' },
            { codigo: '4.4', titulo: 'Honestidade' },
            { codigo: '4.5', titulo: 'Responsabilidade' }
          ]},
          { codigo: '5', titulo: 'Coordenação de Equipe', subitens: [
            { codigo: '5.1', titulo: 'Tomada de decisão' },
            { codigo: '5.2', titulo: 'Gestão da Rotina' },
            { codigo: '5.3', titulo: 'Definição da organização do trabalho e dos níveis de autonomia' }
          ]},
          { codigo: '6', titulo: 'Controle Emocional no Trabalho', subitens: [
            { codigo: '6.1', titulo: 'Administração de conflitos' },
            { codigo: '6.2', titulo: 'Inteligência emocional' },
            { codigo: '6.3', titulo: 'Autoconsciência' },
            { codigo: '6.4', titulo: 'Fatores internos e externos' }
          ]},
          { codigo: '7', titulo: 'Trabalho em Equipe', subitens: [
            { codigo: '7.1', titulo: 'Relações com o líder' },
            { codigo: '7.2', titulo: 'Compromisso com objetivos e metas' },
            { codigo: '7.3', titulo: 'Divisão de papéis e responsabilidades' },
            { codigo: '7.4', titulo: 'Responsabilidades individuais e coletivas' },
            { codigo: '7.5', titulo: 'Trabalho em grupo' }
          ]},
          { codigo: '8', titulo: 'Posturas Profissionais', subitens: [
            { codigo: '8.1', titulo: 'Produtividade' },
            { codigo: '8.2', titulo: 'Criatividade' },
            { codigo: '8.3', titulo: 'Iniciativa' },
            { codigo: '8.4', titulo: 'Cooperação' },
            { codigo: '8.5', titulo: 'Disciplina' }
          ]},
          { codigo: '9', titulo: 'Apresentação', subitens: [
            { codigo: '9.1', titulo: 'Recursos' },
            { codigo: '9.2', titulo: 'Simulação' },
            { codigo: '9.3', titulo: 'Domínio emocional' },
            { codigo: '9.4', titulo: 'Planejamento' }
          ]},
          { codigo: '10', titulo: 'Propriedade Intelectual', subitens: [
            { codigo: '10.1', titulo: 'Direito de uso de imagem' }
          ]},
          { codigo: '11', titulo: 'Edição de Vídeos e Sons Aplicado', subitens: [
            { codigo: '11.1', titulo: 'Bibliotecas' },
            { codigo: '11.2', titulo: 'Técnicas', subitens: [
              { codigo: '11.2.1', titulo: 'Acessibilidade' },
              { codigo: '11.2.2', titulo: 'Formatos de exportação e publicação' },
              { codigo: '11.2.3', titulo: 'Aplicação de efeitos e transições' },
              { codigo: '11.2.4', titulo: 'Decupagem' },
              { codigo: '11.2.5', titulo: 'Importação' },
              { codigo: '11.2.6', titulo: 'Adição de som e vídeo' }
            ]},
            { codigo: '11.3', titulo: 'Aplicativos' }
          ]},
          { codigo: '12', titulo: 'Captura de Vídeos e Sons Aplicado', subitens: [
            { codigo: '12.1', titulo: 'Chroma Key' },
            { codigo: '12.2', titulo: 'Equipamentos' },
            { codigo: '12.3', titulo: 'Enquadramento' },
            { codigo: '12.4', titulo: 'Cenários' },
            { codigo: '12.5', titulo: 'Acústica' },
            { codigo: '12.6', titulo: 'Iluminação' }
          ]},
          { codigo: '13', titulo: 'Animação 2D', subitens: [
            { codigo: '13.1', titulo: 'Desenvolvimento de animação', subitens: [
              { codigo: '13.1.1', titulo: 'Princípios de interatividade com ActionScript' },
              { codigo: '13.1.2', titulo: 'Editor de movimento e Bone' },
              { codigo: '13.1.3', titulo: 'Animação por interpolação' },
              { codigo: '13.1.4', titulo: 'Animação quadro a quadro' },
              { codigo: '13.1.5', titulo: 'Animações pré-definidas (motion presets)' },
              { codigo: '13.1.6', titulo: 'Criação de elementos gráficos' },
              { codigo: '13.1.7', titulo: 'Esboços' },
              { codigo: '13.1.8', titulo: 'Conceituação' },
              { codigo: '13.1.9', titulo: 'Ideação' },
              { codigo: '13.1.10', titulo: 'Plataformas de desenvolvimento' },
              { codigo: '13.1.11', titulo: 'Pesquisa' },
              { codigo: '13.1.12', titulo: 'Definição' }
            ]},
            { codigo: '13.2', titulo: 'Princípios da animação', subitens: [
              { codigo: '13.2.1', titulo: 'Chroma Key' },
              { codigo: '13.2.2', titulo: 'Quadros-chave' },
              { codigo: '13.2.3', titulo: 'Planos' },
              { codigo: '13.2.4', titulo: 'Câmeras' },
              { codigo: '13.2.5', titulo: 'Efeitos' },
              { codigo: '13.2.6', titulo: 'Cortes' },
              { codigo: '13.2.7', titulo: 'Intervalos' },
              { codigo: '13.2.8', titulo: 'Entradas e saídas' }
            ]},
            { codigo: '13.3', titulo: 'Diferença entre 2D e 3D' },
            { codigo: '13.4', titulo: 'Tipos de animação', subitens: [
              { codigo: '13.4.1', titulo: 'Animação 3D' },
              { codigo: '13.4.2', titulo: 'Animação 2D' },
              { codigo: '13.4.3', titulo: 'Rotoscopia' },
              { codigo: '13.4.4', titulo: 'Flipbook' },
              { codigo: '13.4.5', titulo: 'Toy Animation' },
              { codigo: '13.4.6', titulo: 'Cut Out Animation' },
              { codigo: '13.4.7', titulo: 'Puppet Animation' },
              { codigo: '13.4.8', titulo: 'Pixilation' },
              { codigo: '13.4.9', titulo: 'Clay Animation' },
              { codigo: '13.4.10', titulo: 'Stop Motion' },
              { codigo: '13.4.11', titulo: 'Animação clássica' }
            ]}
          ]},
          { codigo: '14', titulo: 'Storyboards e Roteiros', subitens: [
            { codigo: '14.1', titulo: 'Aplicação' },
            { codigo: '14.2', titulo: 'Características' }
          ]},
          { codigo: '15', titulo: 'Plataformas e Dispositivos Audiovisuais', subitens: [
            { codigo: '15.1', titulo: 'Computadores' },
            { codigo: '15.2', titulo: 'Mobile' },
            { codigo: '15.3', titulo: 'TV' }
          ]},
          { codigo: '16', titulo: 'Formatos de Vídeo Aplicado', subitens: [
            { codigo: '16.1', titulo: 'Clipe de filmes' },
            { codigo: '16.2', titulo: 'Aplicações' },
            { codigo: '16.3', titulo: 'Resoluções' },
            { codigo: '16.4', titulo: 'Extensões' }
          ]}
        ]
      }
    ]
  },
  // Curso: Técnico em Programação de Jogos Digitais
  {
    id: 'jogos-digitais',
    nome: 'Técnico em Programação de Jogos Digitais',
    tipoEnsino: TIPO_ENSINO.TECNICO,
    cargaHorariaTotal: 1000,
    competenciaGeral: 'Produzir elementos multimídia e sistemas de jogos digitais, de acordo com metodologia e padrões de qualidade, usabilidade, interatividade, robustez, acessibilidade e segurança da informação.',
    ambientesPedagogicos: [
      'Sala de aula',
      'Laboratório de informática',
      'Biblioteca',
      'AVA com recursos de interatividade'
    ],
    unidadesCurriculares: [
      // Módulo INDÚSTRIA - 1º Período
      {
        id: 'uc1',
        nome: 'Introdução à Tecnologia da Informação e Comunicação',
        cargaHoraria: 40,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Empregar os princípios, padrões e normas técnicas que estabelecem as condições e requisitos para uma comunicação oral e escrita clara, assertiva e eficaz' },
          { codigo: 'CB2', descricao: 'Interpretar dados, informações técnicas e terminologias de textos técnicos relacionados aos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer características e aplicabilidade de hardware e software de sistemas informatizados utilizados na indústria' },
          { codigo: 'CB4', descricao: 'Utilizar recursos e funcionalidades da WEB nos processos de comunicação no trabalho' },
          { codigo: 'CB5', descricao: 'Aplicar os recursos e procedimentos de segurança da informação' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Elementos da Comunicação', subitens: [
            { codigo: '1.1', titulo: 'Emissor' },
            { codigo: '1.2', titulo: 'Receptor' },
            { codigo: '1.3', titulo: 'Mensagem' },
            { codigo: '1.4', titulo: 'Canal' },
            { codigo: '1.5', titulo: 'Ruído' },
            { codigo: '1.6', titulo: 'Código' },
            { codigo: '1.7', titulo: 'Feedback' }
          ]},
          { codigo: '2', titulo: 'Níveis de Fala', subitens: [
            { codigo: '2.1', titulo: 'Linguagem culta' },
            { codigo: '2.2', titulo: 'Linguagem técnica (Jargão, Características)' }
          ]},
          { codigo: '3', titulo: 'Comunicação', subitens: [
            { codigo: '3.1', titulo: 'Identificação de textos técnicos' },
            { codigo: '3.2', titulo: 'Relatórios' },
            { codigo: '3.3', titulo: 'Atas' },
            { codigo: '3.4', titulo: 'Memorandos' },
            { codigo: '3.5', titulo: 'Resumos' }
          ]},
          { codigo: '4', titulo: 'Textos Técnicos', subitens: [
            { codigo: '4.1', titulo: 'Definição' },
            { codigo: '4.2', titulo: 'Tipos e exemplos' },
            { codigo: '4.3', titulo: 'Normas aplicáveis para redação' },
            { codigo: '4.4', titulo: 'Interpretação' }
          ]},
          { codigo: '5', titulo: 'Informática', subitens: [
            { codigo: '5.1', titulo: 'Fundamentos de hardware' },
            { codigo: '5.2', titulo: 'Sistema Operacional' }
          ]},
          { codigo: '6', titulo: 'Software de escritório', subitens: [
            { codigo: '6.1', titulo: 'Editor de Textos' },
            { codigo: '6.2', titulo: 'Editor de Planilhas Eletrônicas' },
            { codigo: '6.3', titulo: 'Editor de Apresentações' }
          ]},
          { codigo: '7', titulo: 'Internet (World Wide Web)', subitens: [
            { codigo: '7.1', titulo: 'Políticas de uso' },
            { codigo: '7.2', titulo: 'Navegadores' },
            { codigo: '7.3', titulo: 'Sites de busca' },
            { codigo: '7.4', titulo: 'Download e gravação de arquivos' },
            { codigo: '7.5', titulo: 'Correio eletrônico' },
            { codigo: '7.6', titulo: 'Direitos autorais' },
            { codigo: '7.7', titulo: 'Armazenamento e compartilhamento em nuvem' }
          ]},
          { codigo: '8', titulo: 'Segurança da Informação', subitens: [
            { codigo: '8.1', titulo: 'Definição dos pilares da Segurança da Informação' },
            { codigo: '8.2', titulo: 'Leis vigentes a segurança da informação' },
            { codigo: '8.3', titulo: 'Tipos de golpes na internet' },
            { codigo: '8.4', titulo: 'Contas e Senhas' },
            { codigo: '8.5', titulo: 'Navegação segura na internet' },
            { codigo: '8.6', titulo: 'Backup' },
            { codigo: '8.7', titulo: 'Códigos maliciosos (Malware)' }
          ]},
          { codigo: '9', titulo: 'Comunicação em equipes de trabalho', subitens: [
            { codigo: '9.1', titulo: 'Dinâmica do trabalho em equipe' },
            { codigo: '9.2', titulo: 'Busca de consenso' },
            { codigo: '9.3', titulo: 'Gestão de Conflitos' }
          ]}
        ]
      },
      {
        id: 'uc2',
        nome: 'Introdução ao Desenvolvimento de Projetos',
        cargaHoraria: 12,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer as diferentes fases pertinentes à elaboração de um projeto' },
          { codigo: 'CB2', descricao: 'Reconhecer diferentes métodos aplicados ao desenvolvimento do projeto' },
          { codigo: 'CB3', descricao: 'Reconhecer os padrões de estrutura estabelecidos para a elaboração de projetos' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Projetos', subitens: [
            { codigo: '1.1', titulo: 'Definição' },
            { codigo: '1.2', titulo: 'Tipos' },
            { codigo: '1.3', titulo: 'Características' },
            { codigo: '1.4', titulo: 'Fases (Concepção, Fundamentação, Planejamento, Viabilidade, Execução, Resultados, Apresentação)' },
            { codigo: '1.5', titulo: 'Normas técnicas relacionadas a projetos' }
          ]},
          { codigo: '2', titulo: 'Métodos de Desenvolvimento de projeto', subitens: [
            { codigo: '2.1', titulo: 'Método indutivo' },
            { codigo: '2.2', titulo: 'Método dedutivo' },
            { codigo: '2.3', titulo: 'Método hipotético-dedutivo' },
            { codigo: '2.4', titulo: 'Método dialético' }
          ]},
          { codigo: '3', titulo: 'Formulação de hipóteses e perguntas', subitens: [
            { codigo: '3.1', titulo: 'Argumentação' },
            { codigo: '3.2', titulo: 'Colaboração' },
            { codigo: '3.3', titulo: 'Comunicação' }
          ]},
          { codigo: '4', titulo: 'Postura Investigativa' },
          { codigo: '5', titulo: 'Estratégias de Resolução de problemas' }
        ]
      },
      {
        id: 'uc3',
        nome: 'Saúde e Segurança no Trabalho',
        cargaHoraria: 12,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os princípios, normas, legislação e procedimentos de saúde, segurança nos processos industriais' },
          { codigo: 'CB2', descricao: 'Reconhecer os tipos de riscos inerentes às atividades laborais nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer os conceitos, classificação e impactos de acidentes e doenças ocupacionais na indústria' },
          { codigo: 'CB4', descricao: 'Reconhecer o papel do trabalhador no cumprimento das normas de saúde e segurança' },
          { codigo: 'CB5', descricao: 'Reconhecer as medidas preventivas e corretivas nas atividades laborais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Segurança do Trabalho', subitens: [
            { codigo: '1.1', titulo: 'Histórico da Segurança do Trabalho no Brasil' },
            { codigo: '1.2', titulo: 'Hierarquia das leis' },
            { codigo: '1.3', titulo: 'Normas Regulamentadoras do Ministério do Trabalho' },
            { codigo: '1.4', titulo: 'CIPA (Definição, Objetivo)' },
            { codigo: '1.5', titulo: 'SESMT (Definição, Objetivo)' }
          ]},
          { codigo: '2', titulo: 'Riscos Ocupacionais', subitens: [
            { codigo: '2.1', titulo: 'Perigo e risco' },
            { codigo: '2.2', titulo: 'Classificação de Riscos Ocupacionais' },
            { codigo: '2.3', titulo: 'Mapa de Riscos' }
          ]},
          { codigo: '3', titulo: 'Medidas de Controle', subitens: [
            { codigo: '3.1', titulo: 'Importância dos Equipamentos de Proteção Individual e coletivo' }
          ]},
          { codigo: '4', titulo: 'Acidentes do Trabalho e Doenças Ocupacionais', subitens: [
            { codigo: '4.1', titulo: 'Definição' },
            { codigo: '4.2', titulo: 'Tipos' },
            { codigo: '4.3', titulo: 'Causa (Imprudência, imperícia e negligência)' },
            { codigo: '4.4', titulo: 'Consequências dos acidentes do trabalho' },
            { codigo: '4.5', titulo: 'CAT (Definição)' }
          ]},
          { codigo: '5', titulo: 'Código de Ética profissional' },
          { codigo: '6', titulo: 'O impacto da falta de ética nos ambientes de trabalho' }
        ]
      },
      {
        id: 'uc4',
        nome: 'Sustentabilidade nos processos industriais',
        cargaHoraria: 8,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer alternativas de prevenção da poluição decorrentes dos processos industriais' },
          { codigo: 'CB2', descricao: 'Reconhecer as fases do ciclo de vida de um produto nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer os fundamentos da logística reversa aplicados ao ciclo de vida do produto' },
          { codigo: 'CB4', descricao: 'Reconhecer os programas de sustentabilidade aplicados aos processos industriais' },
          { codigo: 'CB5', descricao: 'Reconhecer os princípios da economia circular nos processos industriais' },
          { codigo: 'CB6', descricao: 'Reconhecer a destinação dos resíduos dos processos industriais em função de sua caracterização' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Desenvolvimento Sustentável', subitens: [
            { codigo: '1.1', titulo: 'Meio Ambiente (Definição, Relação entre Homem e o meio ambiente)' },
            { codigo: '1.2', titulo: 'Recursos Naturais (Definição, Renováveis, Não renováveis)' },
            { codigo: '1.3', titulo: 'Sustentabilidade (Definição, Pilares, Políticas e Programas)' },
            { codigo: '1.4', titulo: 'Produção e consumo inteligente' }
          ]},
          { codigo: '2', titulo: 'Poluição Industrial', subitens: [
            { codigo: '2.1', titulo: 'Definição' },
            { codigo: '2.2', titulo: 'Resíduos Industriais (Caracterização, Classificação, Destinação)' },
            { codigo: '2.3', titulo: 'Ações de prevenção da Poluição Industrial' },
            { codigo: '2.4', titulo: 'Alternativas para prevenção da poluição (Ciclo de Vida, Logística Reversa, Produção mais limpa, Economia Circular)' }
          ]},
          { codigo: '3', titulo: 'Organização de ambientes de trabalho', subitens: [
            { codigo: '3.1', titulo: 'Princípios de organização' },
            { codigo: '3.2', titulo: 'Organização de ferramentas e instrumentos' },
            { codigo: '3.3', titulo: 'Organização do espaço de trabalho' },
            { codigo: '3.4', titulo: 'Conceitos de organização e disciplina no trabalho' }
          ]}
        ]
      },
      {
        id: 'uc5',
        nome: 'Introdução a Qualidade e Produtividade',
        cargaHoraria: 16,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os fundamentos da qualidade nos processos industriais' },
          { codigo: 'CB2', descricao: 'Identificar as ferramentas da qualidade aplicadas nos processos industriais' },
          { codigo: 'CB3', descricao: 'Reconhecer as etapas da filosofia Lean para otimização de custos e redução do tempo e dos desperdícios de uma empresa' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Qualidade', subitens: [
            { codigo: '1.1', titulo: 'Definição' },
            { codigo: '1.2', titulo: 'Evolução da qualidade' }
          ]},
          { codigo: '2', titulo: 'Princípios da gestão da qualidade', subitens: [
            { codigo: '2.1', titulo: 'Foco no cliente' },
            { codigo: '2.2', titulo: 'Liderança' },
            { codigo: '2.3', titulo: 'Engajamento das pessoas' },
            { codigo: '2.4', titulo: 'Abordagem de processos' },
            { codigo: '2.5', titulo: 'Tomada de decisão baseada em evidências' },
            { codigo: '2.6', titulo: 'Melhoria' },
            { codigo: '2.7', titulo: 'Gestão de relacionamentos' }
          ]},
          { codigo: '3', titulo: 'Métodos e Ferramentas da Qualidade', subitens: [
            { codigo: '3.1', titulo: 'PDCA' },
            { codigo: '3.2', titulo: 'MASP' },
            { codigo: '3.3', titulo: 'Histograma' },
            { codigo: '3.4', titulo: 'Brainstorming' },
            { codigo: '3.5', titulo: 'Fluxograma de processos' },
            { codigo: '3.6', titulo: 'Diagrama de Pareto' },
            { codigo: '3.7', titulo: 'Diagrama de Ishikawa' },
            { codigo: '3.8', titulo: 'CEP' },
            { codigo: '3.9', titulo: '5W2H' },
            { codigo: '3.10', titulo: 'Folha de verificação' },
            { codigo: '3.11', titulo: 'Diagrama de dispersão' }
          ]},
          { codigo: '4', titulo: 'Filosofia Lean', subitens: [
            { codigo: '4.1', titulo: 'Definição e importância' },
            { codigo: '4.2', titulo: 'Mindset' },
            { codigo: '4.3', titulo: 'Pilares' },
            { codigo: '4.4', titulo: 'Etapas' },
            { codigo: '4.5', titulo: 'Ferramentas' }
          ]},
          { codigo: '5', titulo: 'Visão Sistêmica', subitens: [
            { codigo: '5.1', titulo: 'Conceito' },
            { codigo: '5.2', titulo: 'Microcosmo e macrocosmo' },
            { codigo: '5.3', titulo: 'Pensamento sistêmico' }
          ]},
          { codigo: '6', titulo: 'Estrutura organizacional', subitens: [
            { codigo: '6.1', titulo: 'Formal e informal' },
            { codigo: '6.2', titulo: 'Funções e responsabilidades' },
            { codigo: '6.3', titulo: 'Organização das funções, informações e recursos' },
            { codigo: '6.4', titulo: 'Sistema de Comunicação' }
          ]}
        ]
      },
      {
        id: 'uc6',
        nome: 'Introdução a Indústria 4.0',
        cargaHoraria: 24,
        modulo: 'Indústria',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os marcos que alavancaram as revoluções industriais e seus impactos nas atividades de produção e no desenvolvimento do indivíduo' },
          { codigo: 'CB2', descricao: 'Reconhecer as tecnologias habilitadoras para indústria 4.0' },
          { codigo: 'CB3', descricao: 'Correlacionar cada tecnologia habilitadora com impacto gerado em sua aplicação, em um contexto real ou simulado' },
          { codigo: 'CB4', descricao: 'Compreender a inovação como ferramenta de melhoria nos processos de trabalho e resolução de problemas' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Histórico da evolução industrial', subitens: [
            { codigo: '1.1', titulo: '1ª Revolução Industrial (Mecanização dos processos)' },
            { codigo: '1.2', titulo: '2ª Revolução Industrial (A eletricidade, O petróleo)' },
            { codigo: '1.3', titulo: '3ª Revolução Industrial (A energia nuclear, A automação)' },
            { codigo: '1.4', titulo: '4ª Revolução Industrial (Digitalização, Utilização dos dados, Tecnologias Habilitadoras)' }
          ]},
          { codigo: '2', titulo: 'Definições e aplicações', subitens: [
            { codigo: '2.1', titulo: 'Big Data' },
            { codigo: '2.2', titulo: 'Robótica Avançada' },
            { codigo: '2.3', titulo: 'Segurança Digital' },
            { codigo: '2.4', titulo: 'Internet das Coisas (IoT)' },
            { codigo: '2.5', titulo: 'Computação em Nuvem' },
            { codigo: '2.6', titulo: 'Manufatura Aditiva' },
            { codigo: '2.7', titulo: 'Manufatura Digital' },
            { codigo: '2.8', titulo: 'Integração de Sistemas' }
          ]},
          { codigo: '3', titulo: 'Inovação', subitens: [
            { codigo: '3.1', titulo: 'Definição e característica' },
            { codigo: '3.2', titulo: 'Inovação x Invenção' },
            { codigo: '3.3', titulo: 'Importância' },
            { codigo: '3.4', titulo: 'Tipos (Incremental, Disruptiva)' },
            { codigo: '3.5', titulo: 'Impactos' }
          ]},
          { codigo: '4', titulo: 'Raciocínio Lógico', subitens: [
            { codigo: '4.1', titulo: 'Dedução' },
            { codigo: '4.2', titulo: 'Indução' },
            { codigo: '4.3', titulo: 'Abdução' }
          ]},
          { codigo: '5', titulo: 'Comportamento Inovador', subitens: [
            { codigo: '5.1', titulo: 'Postura Investigativa' },
            { codigo: '5.2', titulo: 'Mentalidade de Crescimento (Growth Mindset)' },
            { codigo: '5.3', titulo: 'Curiosidade' },
            { codigo: '5.4', titulo: 'Motivação Pessoal' }
          ]},
          { codigo: '6', titulo: 'Visão sistêmica', subitens: [
            { codigo: '6.1', titulo: 'Elementos da organização e as formas de articulação entre elas' },
            { codigo: '6.2', titulo: 'Pensamento sistêmico' }
          ]}
        ]
      },
      // Módulo INTRODUTÓRIO - 1º Período
      {
        id: 'uc7',
        nome: 'Arquitetura de Hardware e Software',
        cargaHoraria: 24,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer a estrutura física dos elementos computacionais' },
          { codigo: 'CB2', descricao: 'Reconhecer a arquitetura de software de computadores' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Hardware', subitens: [
            { codigo: '1.1', titulo: 'Processadores (Tipos, Frequência, Núcleos)' },
            { codigo: '1.2', titulo: 'Memória (Tipos, Capacidade de armazenamento, Frequência)' },
            { codigo: '1.3', titulo: 'Periféricos (Armazenamento, Portas de comunicação, Interfaces)' },
            { codigo: '1.4', titulo: 'Rede de comunicação (Arquitetura cliente/servidor, Ativos de redes)' },
            { codigo: '1.5', titulo: 'Cloud (IAAS, PAAS, Players)' },
            { codigo: '1.6', titulo: 'Dispositivos móveis (Arquiteturas, Sensores, Óculos RA/RV)' }
          ]},
          { codigo: '2', titulo: 'Software', subitens: [
            { codigo: '2.1', titulo: 'Software básico (Firmware, Sistemas operacionais, Drivers)' },
            { codigo: '2.2', titulo: 'Aplicativos (Prontos, Customizados)' },
            { codigo: '2.3', titulo: 'Tipos (Livre, Proprietário)' },
            { codigo: '2.4', titulo: 'Licenças e distribuição' }
          ]},
          { codigo: '3', titulo: 'Resolução de problemas', subitens: [
            { codigo: '3.1', titulo: 'Identificação de problemas' },
            { codigo: '3.2', titulo: 'Proposição de hipóteses' },
            { codigo: '3.3', titulo: 'Testagem de hipóteses' },
            { codigo: '3.4', titulo: 'Validação de Resultados' }
          ]}
        ]
      },
      {
        id: 'uc8',
        nome: 'Fundamentos de UI / UX Design',
        cargaHoraria: 40,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Aplicar conceitos de identidade visual e entendimento do usuário na criação e desenvolvimento de interfaces' },
          { codigo: 'CB2', descricao: 'Reconhecer formas geométricas para produção de interfaces' },
          { codigo: 'CB3', descricao: 'Empregar técnicas de processos de criação na concepção de interfaces e experiência do usuário' },
          { codigo: 'CB4', descricao: 'Identificar princípios básicos e contexto histórico de Design' },
          { codigo: 'CB5', descricao: 'Identificar conceito de direito autoral no processo de criação de produtos gráficos' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Princípios de design', subitens: [
            { codigo: '1.1', titulo: 'Definição' },
            { codigo: '1.2', titulo: 'Evolução histórica' },
            { codigo: '1.3', titulo: 'Formas geométricas' },
            { codigo: '1.4', titulo: 'Regras de visualização dos elementos da interface' },
            { codigo: '1.5', titulo: 'Teoria das cores' },
            { codigo: '1.6', titulo: 'Processo de criação' }
          ]},
          { codigo: '2', titulo: 'Direito autoral', subitens: [
            { codigo: '2.1', titulo: 'Definição' },
            { codigo: '2.2', titulo: 'Anterioridade' },
            { codigo: '2.3', titulo: 'Creative Commons' },
            { codigo: '2.4', titulo: 'Registro' }
          ]},
          { codigo: '3', titulo: 'User Experience', subitens: [
            { codigo: '3.1', titulo: 'Definição' },
            { codigo: '3.2', titulo: 'Design centrado no usuário' },
            { codigo: '3.3', titulo: 'Processo de design interativo' },
            { codigo: '3.4', titulo: 'Jornada do usuário' },
            { codigo: '3.5', titulo: 'Usabilidade (Friendly, Intuitividade)' }
          ]},
          { codigo: '4', titulo: 'User Interface', subitens: [
            { codigo: '4.1', titulo: 'Definição' },
            { codigo: '4.2', titulo: 'Layout dos elementos da interface' },
            { codigo: '4.3', titulo: 'Eventos' },
            { codigo: '4.4', titulo: 'Navegação' },
            { codigo: '4.5', titulo: 'Tipos (Texto, Voz, Natural)' }
          ]},
          { codigo: '5', titulo: 'Prototipagem', subitens: [
            { codigo: '5.1', titulo: 'Storyboard' },
            { codigo: '5.2', titulo: 'Protótipos de papel (paper prototypes)' },
            { codigo: '5.3', titulo: 'Mock-Ups digitais' }
          ]},
          { codigo: '6', titulo: 'Resolução de problemas', subitens: [
            { codigo: '6.1', titulo: 'Identificação de problemas' },
            { codigo: '6.2', titulo: 'Proposição de hipóteses' },
            { codigo: '6.3', titulo: 'Testagem de hipóteses' },
            { codigo: '6.4', titulo: 'Validação de Resultados' }
          ]}
        ]
      },
      {
        id: 'uc9',
        nome: 'Metodologias de Desenvolvimento de Projetos',
        cargaHoraria: 12,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os procedimentos de desenvolvimento de projetos de software' },
          { codigo: 'CB2', descricao: 'Reconhecer os procedimentos de metodologias ágeis de desenvolvimento de software' },
          { codigo: 'CB3', descricao: 'Reconhecer os procedimentos de metodologias tradicionais de desenvolvimento de software' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Metodologias de Desenvolvimento de Software', subitens: [
            { codigo: '1.1', titulo: 'Definição' },
            { codigo: '1.2', titulo: 'Tipos' },
            { codigo: '1.3', titulo: 'Características' }
          ]},
          { codigo: '2', titulo: 'Metodologias Tradicionais', subitens: [
            { codigo: '2.1', titulo: 'Cascata' },
            { codigo: '2.2', titulo: 'Espiral' },
            { codigo: '2.3', titulo: 'Incremental' },
            { codigo: '2.4', titulo: 'Prototipagem' }
          ]},
          { codigo: '3', titulo: 'Metodologias Ágeis', subitens: [
            { codigo: '3.1', titulo: 'Manifesto Ágil' },
            { codigo: '3.2', titulo: 'Scrum' },
            { codigo: '3.3', titulo: 'Kanban' },
            { codigo: '3.4', titulo: 'XP (Extreme Programming)' },
            { codigo: '3.5', titulo: 'Lean' }
          ]},
          { codigo: '4', titulo: 'Ferramentas de Gestão de Projetos', subitens: [
            { codigo: '4.1', titulo: 'Quadros Kanban' },
            { codigo: '4.2', titulo: 'Ferramentas de gestão de tarefas' },
            { codigo: '4.3', titulo: 'Ferramentas de comunicação' }
          ]},
          { codigo: '5', titulo: 'Resolução de problemas', subitens: [
            { codigo: '5.1', titulo: 'Identificação de problemas' },
            { codigo: '5.2', titulo: 'Proposição de hipóteses' },
            { codigo: '5.3', titulo: 'Testagem de hipóteses' },
            { codigo: '5.4', titulo: 'Validação de Resultados' }
          ]}
        ]
      },
      {
        id: 'uc10',
        nome: 'Lógica de Programação',
        cargaHoraria: 80,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Aplicar técnicas de programação na elaboração de algoritmos inerentes aos sistemas de TI' },
          { codigo: 'CB2', descricao: 'Reconhecer os paradigmas de programação de computadores' },
          { codigo: 'CB3', descricao: 'Aplicar linguagens de programação para elaborar programas e sistemas de TI' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Lógica de Programação e Algoritmos', subitens: [
            { codigo: '1.1', titulo: 'Algoritmos' },
            { codigo: '1.2', titulo: 'Descritivo (Fluxogramas, Pseudocódigo, Decisões, Repetições, Recursividade)' },
            { codigo: '1.3', titulo: 'Lógica (Lógica proposicional, Álgebra Booleana, Operadores, Expressões)' }
          ]},
          { codigo: '2', titulo: 'Software', subitens: [
            { codigo: '2.1', titulo: 'Aplicativos (Definições, Tipos)' },
            { codigo: '2.2', titulo: 'Software de Base (Firmware, Sistemas operacionais, Drivers)' }
          ]},
          { codigo: '3', titulo: 'Paradigmas de programação', subitens: [
            { codigo: '3.1', titulo: 'Definição' },
            { codigo: '3.2', titulo: 'Tipos de programação (estruturada, interativa, funcional, orientada a objetos, procedural)' }
          ]},
          { codigo: '4', titulo: 'Programação', subitens: [
            { codigo: '4.1', titulo: 'Programas de computadores (Definição, Características, Níveis de linguagens)' },
            { codigo: '4.2', titulo: 'Etapas do processo de conversão (Interpretação, Ligação, Compilação, Montagem)' },
            { codigo: '4.3', titulo: 'Linguagens de programação (Características, Semântica, Indentação, Modularização)' }
          ]},
          { codigo: '5', titulo: 'Auto Gestão', subitens: [
            { codigo: '5.1', titulo: 'Organização' },
            { codigo: '5.2', titulo: 'Disciplina' },
            { codigo: '5.3', titulo: 'Responsabilidade' },
            { codigo: '5.4', titulo: 'Concentração' },
            { codigo: '5.5', titulo: 'Gestão do tempo' }
          ]}
        ]
      },
      {
        id: 'uc11',
        nome: 'Versionamento e Colaboração',
        cargaHoraria: 20,
        modulo: 'Introdutório',
        periodo: '1º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os procedimentos de versionamento de código' },
          { codigo: 'CB2', descricao: 'Aplicar ferramentas de versionamento de código' },
          { codigo: 'CB3', descricao: 'Reconhecer os procedimentos de colaboração em projetos de software' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Versionamento de Código', subitens: [
            { codigo: '1.1', titulo: 'Definição' },
            { codigo: '1.2', titulo: 'Importância' },
            { codigo: '1.3', titulo: 'Tipos de sistemas de controle de versão' }
          ]},
          { codigo: '2', titulo: 'Git', subitens: [
            { codigo: '2.1', titulo: 'Instalação e configuração' },
            { codigo: '2.2', titulo: 'Comandos básicos' },
            { codigo: '2.3', titulo: 'Branches' },
            { codigo: '2.4', titulo: 'Merge e Rebase' },
            { codigo: '2.5', titulo: 'Conflitos' }
          ]},
          { codigo: '3', titulo: 'Plataformas de Hospedagem', subitens: [
            { codigo: '3.1', titulo: 'GitHub' },
            { codigo: '3.2', titulo: 'GitLab' },
            { codigo: '3.3', titulo: 'Bitbucket' }
          ]},
          { codigo: '4', titulo: 'Colaboração em Projetos', subitens: [
            { codigo: '4.1', titulo: 'Pull Requests' },
            { codigo: '4.2', titulo: 'Code Review' },
            { codigo: '4.3', titulo: 'Issues e Milestones' },
            { codigo: '4.4', titulo: 'Documentação de projetos' }
          ]},
          { codigo: '5', titulo: 'Boas Práticas', subitens: [
            { codigo: '5.1', titulo: 'Commits semânticos' },
            { codigo: '5.2', titulo: 'Gitflow' },
            { codigo: '5.3', titulo: 'Integração contínua' }
          ]}
        ]
      },
      // Módulo INTRODUTÓRIO - 2º Período
      {
        id: 'uc12',
        nome: 'Fundamentos de Jogos Digitais',
        cargaHoraria: 36,
        modulo: 'Introdutório',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer a estrutura física dos elementos de dispositivos mobile e de consoles' },
          { codigo: 'CB2', descricao: 'Reconhecer a estrutura lógica dos elementos de dispositivos mobile e de consoles' },
          { codigo: 'CB3', descricao: 'Reconhecer a evolução histórica e tecnológica dos jogos digitais' },
          { codigo: 'CB4', descricao: 'Reconhecer os profissionais envolvidos na criação e desenvolvimento de jogos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Jogos Digitais', subitens: [
            { codigo: '1.1', titulo: 'Gerações e Evolução' },
            { codigo: '1.2', titulo: 'Tipos de jogos (Tabuleiro, Arcade/Fliperama, Portáteis, Simuladores)' },
            { codigo: '1.3', titulo: 'Ciclo de produção de jogos digitais (Pré-produção, Produção, Pós-produção)' }
          ]},
          { codigo: '2', titulo: 'Profissionais da área de jogos', subitens: [
            { codigo: '2.1', titulo: 'Designer (Artistas, Sound designer)' },
            { codigo: '2.2', titulo: 'Desenvolvedor (Programador)' }
          ]},
          { codigo: '3', titulo: 'Hardware de dispositivos para jogos', subitens: [
            { codigo: '3.1', titulo: 'Dispositivos Mobile (Processador, Memória, Armazenamento, Periféricos)' },
            { codigo: '3.2', titulo: 'Consoles para jogos (Processador, Memória, Armazenamento, Periféricos)' }
          ]},
          { codigo: '4', titulo: 'Software de dispositivos para jogos', subitens: [
            { codigo: '4.1', titulo: 'Mobile (Software básico, Sistema operacional, Aplicativos)' },
            { codigo: '4.2', titulo: 'Console (Software básico, Aplicativos)' }
          ]},
          { codigo: '5', titulo: 'Resolução de problemas', subitens: [
            { codigo: '5.1', titulo: 'Identificação de problemas' },
            { codigo: '5.2', titulo: 'Proposição de hipóteses' },
            { codigo: '5.3', titulo: 'Testagem de hipóteses' }
          ]}
        ]
      },
      {
        id: 'uc13',
        nome: 'Fundamentos do Design de elementos gráficos de Jogos Digitais',
        cargaHoraria: 48,
        modulo: 'Introdutório',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer procedimentos e recursos para elaboração de projeto conceitual' },
          { codigo: 'CB2', descricao: 'Utilizar as ferramentas para a concepção de elementos de multimídia' },
          { codigo: 'CB3', descricao: 'Reconhecer o documento de design do jogo (GDD)' },
          { codigo: 'CB4', descricao: 'Reconhecer os estilos e tipos de elementos gráficos do jogo' },
          { codigo: 'CB5', descricao: 'Aplicar métodos, ferramentas e técnicas de desenho' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Game Design Document (GDD)', subitens: [
            { codigo: '1.1', titulo: 'Definições (Estrutura, Motivação, Público-alvo)' },
            { codigo: '1.2', titulo: 'Tipos (GDD 10 Páginas, GDD Página única, GDD Bíblia, Short Game Design Document)' },
            { codigo: '1.3', titulo: 'Exemplos' }
          ]},
          { codigo: '2', titulo: 'Concepção conceitual dos elementos', subitens: [
            { codigo: '2.1', titulo: 'Definição' },
            { codigo: '2.2', titulo: 'Recursos' },
            { codigo: '2.3', titulo: 'Ferramentas (Computacional, Gráficas, Sonoras)' },
            { codigo: '2.4', titulo: 'Estilo Arte' },
            { codigo: '2.5', titulo: 'Modelos' },
            { codigo: '2.6', titulo: 'Processo de criação' },
            { codigo: '2.7', titulo: 'Padrão' },
            { codigo: '2.8', titulo: 'Técnicas de Desenho (Observação, Computacional, Mista)' },
            { codigo: '2.9', titulo: 'Técnicas de Multimídia' },
            { codigo: '2.10', titulo: 'Esboço dos Elementos' },
            { codigo: '2.11', titulo: 'Documentação' }
          ]},
          { codigo: '3', titulo: 'Resolução de problemas', subitens: [
            { codigo: '3.1', titulo: 'Identificação de problemas' },
            { codigo: '3.2', titulo: 'Proposição de hipóteses' },
            { codigo: '3.3', titulo: 'Testagem de hipóteses' },
            { codigo: '3.4', titulo: 'Validação de Resultados' }
          ]}
        ]
      },
      {
        id: 'uc14',
        nome: 'Fundamentos de Programação de Jogos Digitais',
        cargaHoraria: 60,
        modulo: 'Introdutório',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CB1', descricao: 'Reconhecer os procedimentos de preparação de ambiente de programação' },
          { codigo: 'CB2', descricao: 'Utilizar linguagem de programação para desenvolvimento de jogos' },
          { codigo: 'CB3', descricao: 'Reconhecer técnicas e algoritmos utilizados na programação de elementos em jogos' },
          { codigo: 'CB4', descricao: 'Reconhecer as diferentes linguagens de programação utilizadas conforme a plataforma do jogo a ser produzido' },
          { codigo: 'CB5', descricao: 'Reconhecer métodos de versionamento aplicados na produção de jogos' },
          { codigo: 'CB6', descricao: 'Reconhecer os processos de integração de elementos de multimídia' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Autogestão', subitens: [
            { codigo: '1.1', titulo: 'Gestão do tempo' },
            { codigo: '1.2', titulo: 'Concentração' },
            { codigo: '1.3', titulo: 'Responsabilidade' },
            { codigo: '1.4', titulo: 'Disciplina' }
          ]},
          { codigo: '2', titulo: 'Inserção de Sprites e Assets', subitens: [
            { codigo: '2.1', titulo: 'Integração de elementos multimídia' },
            { codigo: '2.2', titulo: 'Exemplos e aplicações' },
            { codigo: '2.3', titulo: 'Prática de programação de jogos' }
          ]},
          { codigo: '3', titulo: 'Técnicas e Algoritmos', subitens: [
            { codigo: '3.1', titulo: 'Sistemas de coordenadas 2D' },
            { codigo: '3.2', titulo: 'Cenário do jogo com base na matriz de coordenadas 2D' },
            { codigo: '3.3', titulo: 'Sistema de cores' },
            { codigo: '3.4', titulo: 'Elementos de física' },
            { codigo: '3.5', titulo: 'Movimentação com teclas' },
            { codigo: '3.6', titulo: 'Movimentação com mouse' },
            { codigo: '3.7', titulo: 'Colisões e colisores' },
            { codigo: '3.8', titulo: 'Fluxo de eventos' }
          ]},
          { codigo: '4', titulo: 'Linguagens de Programação para Jogos Digitais', subitens: [
            { codigo: '4.1', titulo: 'CRUD de elementos (Create, Read, Update, Delete)' },
            { codigo: '4.2', titulo: 'Bibliotecas' }
          ]},
          { codigo: '5', titulo: 'Ambiente de Desenvolvimento de Jogos Digitais', subitens: [
            { codigo: '5.1', titulo: 'Instalação' },
            { codigo: '5.2', titulo: 'Ferramentas' },
            { codigo: '5.3', titulo: 'Editor de código' },
            { codigo: '5.4', titulo: 'Compilador' }
          ]}
        ]
      },
      // Módulo ESPECÍFICO I - 2º Período
      {
        id: 'uc15',
        nome: 'Planejamento de elementos multimídia de Jogos Digitais',
        cargaHoraria: 40,
        modulo: 'Específico I',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer procedimentos para coleta de informações do cliente' },
          { codigo: 'CT2', descricao: 'Reconhecer os elementos necessários para avaliação e validação do projeto' },
          { codigo: 'CT3', descricao: 'Elaborar documentação para avaliação e validação do projeto' },
          { codigo: 'CT4', descricao: 'Definir os requisitos funcionais e não funcionais do sistema de jogos demandados pela aplicação' },
          { codigo: 'CT5', descricao: 'Reconhecer as necessidades de hardware e software demandadas pela aplicação' },
          { codigo: 'CT6', descricao: 'Reconhecer as características de um projeto conceitual' },
          { codigo: 'CT7', descricao: 'Aplicar procedimentos e recursos para elaboração de projeto conceitual' },
          { codigo: 'CT8', descricao: 'Criar esboços de artes conceituais de elementos multimídia para jogos' },
          { codigo: 'CT9', descricao: 'Documentar resultados de avaliações e validações de elementos multimídia' },
          { codigo: 'CT10', descricao: 'Avaliar elementos multimídia em conformidade com as especificações técnicas do projeto' },
          { codigo: 'CT11', descricao: 'Validar elementos multimídia em conformidade com as especificações técnicas do projeto' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Game Design Document (GDD)', subitens: [
            { codigo: '1.1', titulo: 'Normas' },
            { codigo: '1.2', titulo: 'Escopo' },
            { codigo: '1.3', titulo: 'Público-alvo' },
            { codigo: '1.4', titulo: 'Level design' },
            { codigo: '1.5', titulo: 'História (Arquétipos, Jornada do herói)' },
            { codigo: '1.6', titulo: 'Painel do usuário (Paleta de Cores, Banco de imagens)' },
            { codigo: '1.7', titulo: 'Tabela de elementos (Comportamentos, Características, Identificação, Artes conceituais)' }
          ]},
          { codigo: '2', titulo: 'Técnicas de levantamento de requisitos', subitens: [
            { codigo: '2.1', titulo: 'Brainstorm' },
            { codigo: '2.2', titulo: 'Questionário' },
            { codigo: '2.3', titulo: 'Entrevista' },
            { codigo: '2.4', titulo: 'Etnografia' },
            { codigo: '2.5', titulo: 'Workshop' },
            { codigo: '2.6', titulo: 'Prototipagem' },
            { codigo: '2.7', titulo: 'Documento de requisitos' }
          ]},
          { codigo: '3', titulo: 'Requisitos de sistema de jogos', subitens: [
            { codigo: '3.1', titulo: 'Requisitos de hardware' },
            { codigo: '3.2', titulo: 'Requisitos de software' },
            { codigo: '3.3', titulo: 'Requisitos funcionais' },
            { codigo: '3.4', titulo: 'Requisitos não funcionais' }
          ]},
          { codigo: '4', titulo: 'Projeto conceitual', subitens: [
            { codigo: '4.1', titulo: 'Características' },
            { codigo: '4.2', titulo: 'Procedimentos de elaboração' },
            { codigo: '4.3', titulo: 'Arte conceitual' },
            { codigo: '4.4', titulo: 'Ilustrações' },
            { codigo: '4.5', titulo: 'Pipeline de produção' },
            { codigo: '4.6', titulo: 'Recursos utilizados em jogos' }
          ]},
          { codigo: '5', titulo: 'Documentação de validação', subitens: [
            { codigo: '5.1', titulo: 'Briefing do projeto' },
            { codigo: '5.2', titulo: 'Blueprint' },
            { codigo: '5.3', titulo: 'Cronograma' },
            { codigo: '5.4', titulo: 'Orçamento' },
            { codigo: '5.5', titulo: 'Termo de aceite' }
          ]},
          { codigo: '6', titulo: 'Posturas profissionais', subitens: [
            { codigo: '6.1', titulo: 'Engajamento' },
            { codigo: '6.2', titulo: 'Disciplina' },
            { codigo: '6.3', titulo: 'Cooperação' },
            { codigo: '6.4', titulo: 'Prudência' },
            { codigo: '6.5', titulo: 'Respeito' },
            { codigo: '6.6', titulo: 'Cordialidade' },
            { codigo: '6.7', titulo: 'Empatia' }
          ]}
        ]
      },
      {
        id: 'uc16',
        nome: 'Produção de elementos multimídia para Jogos Digitais',
        cargaHoraria: 200,
        modulo: 'Específico I',
        periodo: '2º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer as características de elementos 2D' },
          { codigo: 'CT2', descricao: 'Reconhecer as ferramentas para criação de elementos 2D' },
          { codigo: 'CT3', descricao: 'Aplicar métodos e técnicas para criação de elementos 2D' },
          { codigo: 'CT4', descricao: 'Reconhecer as características de elementos audiovisuais' },
          { codigo: 'CT5', descricao: 'Reconhecer as ferramentas para criação de elementos audiovisuais' },
          { codigo: 'CT6', descricao: 'Aplicar métodos e técnicas para criação de elementos audiovisuais' },
          { codigo: 'CT7', descricao: 'Reconhecer as características de elementos 3D' },
          { codigo: 'CT8', descricao: 'Reconhecer as ferramentas para modelagem de elementos 3D' },
          { codigo: 'CT9', descricao: 'Aplicar métodos e técnicas para modelagem de elementos 3D' },
          { codigo: 'CT10', descricao: 'Reconhecer os padrões de mínimos e máximos para aplicabilidade de elementos multimídia em projetos de jogos digitais' },
          { codigo: 'CT11', descricao: 'Aplicar técnicas de verificação e validação de requisitos do projeto de jogos digitais' },
          { codigo: 'CT12', descricao: 'Reconhecer os requisitos mínimos das plataformas de jogos digitais' },
          { codigo: 'CT13', descricao: 'Aplicar técnicas de verificação e validação de especificações das plataformas de jogos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Elementos multimídia em 2D', subitens: [
            { codigo: '1.1', titulo: 'Tipos (Cenários, Elementos, Personagens)' },
            { codigo: '1.2', titulo: 'Ferramentas de criação (Desenho digital, Pintura digital, Vetorização, Exportação/Importação)' },
            { codigo: '1.3', titulo: '2D Sprites (Organização de elementos, Princípios de animação, Sequência de animação)' }
          ]},
          { codigo: '2', titulo: 'Elementos multimídia em 3D', subitens: [
            { codigo: '2.1', titulo: 'Tipos (Cenários, Elementos, Personagens)' }
          ]},
          { codigo: '3', titulo: 'Concept art', subitens: [
            { codigo: '3.1', titulo: 'Desenho digital 3D' },
            { codigo: '3.2', titulo: 'Pintura digital 3D' }
          ]},
          { codigo: '4', titulo: 'Escultura e modelagem 3D', subitens: [
            { codigo: '4.1', titulo: 'Modelagem 3D' },
            { codigo: '4.2', titulo: 'Texturização 3D' },
            { codigo: '4.3', titulo: 'UV Map 3D' }
          ]},
          { codigo: '5', titulo: 'Rigging 3D', subitens: [
            { codigo: '5.1', titulo: 'Fundamentos' },
            { codigo: '5.2', titulo: 'FK IK' },
            { codigo: '5.3', titulo: 'Renderização 3D' }
          ]},
          { codigo: '6', titulo: 'Animação 3D', subitens: [
            { codigo: '6.1', titulo: 'Tipos' },
            { codigo: '6.2', titulo: 'Princípios de animação' },
            { codigo: '6.3', titulo: 'Sequência de animação' }
          ]},
          { codigo: '7', titulo: 'Exportação para motores de jogos' },
          { codigo: '8', titulo: 'Elementos audiovisuais', subitens: [
            { codigo: '8.1', titulo: 'Roteiro (Literário, Storyboard)' },
            { codigo: '8.2', titulo: 'Tipos (Imagem estática, Imagem em movimento, Áudio: trilhas e efeitos sonoros)' },
            { codigo: '8.3', titulo: 'Criação e edição de imagens, vídeos e som' }
          ]},
          { codigo: '9', titulo: 'Validação dos elementos do projeto', subitens: [
            { codigo: '9.1', titulo: 'Elementos multimídia (Padrões de aplicabilidade)' },
            { codigo: '9.2', titulo: 'Plataformas de jogos (Requisitos e especificações)' }
          ]},
          { codigo: '10', titulo: 'Posturas profissionais', subitens: [
            { codigo: '10.1', titulo: 'Engajamento' },
            { codigo: '10.2', titulo: 'Disciplina' },
            { codigo: '10.3', titulo: 'Cooperação' },
            { codigo: '10.4', titulo: 'Prudência' },
            { codigo: '10.5', titulo: 'Respeito' },
            { codigo: '10.6', titulo: 'Cordialidade' },
            { codigo: '10.7', titulo: 'Empatia' }
          ]}
        ]
      },
      // Módulo ESPECÍFICO II - 3º Período
      {
        id: 'uc17',
        nome: 'Planejamento e Publicação de Jogos Digitais',
        cargaHoraria: 40,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Definir os requisitos funcionais e não funcionais do sistema de jogos demandados pela aplicação' },
          { codigo: 'CT2', descricao: 'Reconhecer as necessidades de hardware e software demandadas pela aplicação' },
          { codigo: 'CT3', descricao: 'Relacionar o padrão de usabilidade com os requisitos do sistema de jogos' },
          { codigo: 'CT4', descricao: 'Relacionar o padrão de interatividade com os requisitos do sistema de jogos' },
          { codigo: 'CT5', descricao: 'Avaliar o GDD para garantir conformidade com as especificações técnicas do projeto' },
          { codigo: 'CT6', descricao: 'Reconhecer procedimentos para coleta de informações do cliente' },
          { codigo: 'CT7', descricao: 'Utilizar os procedimentos de desenvolvimento definidos pela metodologia Scrum' },
          { codigo: 'CT8', descricao: 'Reconhecer os procedimentos de publicação de jogos digitais' },
          { codigo: 'CT9', descricao: 'Aplicar os procedimentos de publicação de jogos digitais' },
          { codigo: 'CT10', descricao: 'Reconhecer o conteúdo dos documentos de publicação de jogos digitais' },
          { codigo: 'CT11', descricao: 'Elaborar o documento de publicação de jogos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Fundamentos de levantamento de demandas', subitens: [
            { codigo: '1.1', titulo: 'Brainstorm' },
            { codigo: '1.2', titulo: 'Questionário' },
            { codigo: '1.3', titulo: 'Entrevista' },
            { codigo: '1.4', titulo: 'Etnografia' },
            { codigo: '1.5', titulo: 'Workshop' },
            { codigo: '1.6', titulo: 'Prototipagem' }
          ]},
          { codigo: '2', titulo: 'Requisitos de sistema de jogos', subitens: [
            { codigo: '2.1', titulo: 'Requisitos de hardware' },
            { codigo: '2.2', titulo: 'Requisitos de software' },
            { codigo: '2.3', titulo: 'Requisitos funcionais' },
            { codigo: '2.4', titulo: 'Requisitos não funcionais' }
          ]},
          { codigo: '3', titulo: 'Game Design Document (GDD)', subitens: [
            { codigo: '3.1', titulo: 'Produção multimídia' },
            { codigo: '3.2', titulo: 'Implementação' },
            { codigo: '3.3', titulo: 'Integração (Motivação, Integração de componentes, arte e software, versões, Controle de versões, Testes de integração)' },
            { codigo: '3.4', titulo: 'Testes' },
            { codigo: '3.5', titulo: 'Publicação' }
          ]},
          { codigo: '4', titulo: 'Publicação', subitens: [
            { codigo: '4.1', titulo: 'Planejamento' },
            { codigo: '4.2', titulo: 'Plataformas' },
            { codigo: '4.3', titulo: 'Métodos' },
            { codigo: '4.4', titulo: 'Instalação' },
            { codigo: '4.5', titulo: 'Configuração' },
            { codigo: '4.6', titulo: 'Integração de sistemas' },
            { codigo: '4.7', titulo: 'Validação da publicação' },
            { codigo: '4.8', titulo: 'Documentação' }
          ]},
          { codigo: '5', titulo: 'Posturas profissionais', subitens: [
            { codigo: '5.1', titulo: 'Engajamento' },
            { codigo: '5.2', titulo: 'Disciplina' },
            { codigo: '5.3', titulo: 'Cooperação' },
            { codigo: '5.4', titulo: 'Prudência' },
            { codigo: '5.5', titulo: 'Respeito' },
            { codigo: '5.6', titulo: 'Cordialidade' },
            { codigo: '5.7', titulo: 'Empatia' }
          ]}
        ]
      },
      {
        id: 'uc18',
        nome: 'Codificação de sistemas de Jogos Digitais',
        cargaHoraria: 200,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer as linguagens de programação utilizadas para o desenvolvimento de jogos digitais' },
          { codigo: 'CT2', descricao: 'Aplicar linguagem de programação no desenvolvimento de jogos digitais' },
          { codigo: 'CT3', descricao: 'Reconhecer as especificações técnicas definidas no projeto' },
          { codigo: 'CT4', descricao: 'Aplicar técnicas e métodos de desenvolvimento, conforme a linguagem de programação empregada' },
          { codigo: 'CT5', descricao: 'Reconhecer processos de depuração e tratamento de erros' },
          { codigo: 'CT6', descricao: 'Aplicar as boas práticas para documentação de projetos, conforme as exigências de rastreabilidade' },
          { codigo: 'CT7', descricao: 'Gerenciar o versionamento dos sistemas' },
          { codigo: 'CT8', descricao: 'Reconhecer os procedimentos de instalação e configuração do ambiente de desenvolvimento (IDE)' },
          { codigo: 'CT9', descricao: 'Executar instalação e configuração do ambiente de desenvolvimento (IDE)' },
          { codigo: 'CT10', descricao: 'Reconhecer os diferentes tipos e formatos de dados e arquivo' },
          { codigo: 'CT11', descricao: 'Aplicar técnicas de conversão e manipulação de dados e arquivos' },
          { codigo: 'CT12', descricao: 'Reconhecer os pilares da segurança da informação' },
          { codigo: 'CT13', descricao: 'Reconhecer os níveis hierárquicos de segurança da informação' },
          { codigo: 'CT14', descricao: 'Aplicar boas práticas de segurança da informação' },
          { codigo: 'CT15', descricao: 'Reconhecer as renderizações de elementos multimídia de jogos digitais' },
          { codigo: 'CT16', descricao: 'Aplicar técnicas de integração de elementos multimídia em jogos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Produção de jogos digitais', subitens: [
            { codigo: '1.1', titulo: 'Pré-produção (GDD, Requisitos funcionais e não funcionais, Diagramas)' },
            { codigo: '1.2', titulo: 'Produção (Codificação, Assets, Integração)' },
            { codigo: '1.3', titulo: 'Testes (Plano de testes, Execução dos testes)' },
            { codigo: '1.4', titulo: 'Finalização (Publicação, Manutenção, Suporte aos jogadores)' }
          ]},
          { codigo: '2', titulo: 'Metodologia ágil de desenvolvimento de jogos', subitens: [
            { codigo: '2.1', titulo: 'Aplicação' },
            { codigo: '2.2', titulo: 'Exemplos' },
            { codigo: '2.3', titulo: 'Ferramentas' }
          ]},
          { codigo: '3', titulo: 'Banco de dados', subitens: [
            { codigo: '3.1', titulo: 'Conexão' },
            { codigo: '3.2', titulo: 'Tipos de dados (Índice)' },
            { codigo: '3.3', titulo: 'Relacionamentos' },
            { codigo: '3.4', titulo: 'Manipulação de dados' }
          ]},
          { codigo: '4', titulo: 'Linguagem de programação para desenvolvimento de jogos', subitens: [
            { codigo: '4.1', titulo: 'Histórico' },
            { codigo: '4.2', titulo: 'Instalação' },
            { codigo: '4.3', titulo: 'Ambiente de Desenvolvimento Integrado (IDE)' },
            { codigo: '4.4', titulo: 'Ferramentas de depuração' },
            { codigo: '4.5', titulo: 'Sintaxe (Entrada e Saída de dados, Elementos de física, Coordenadas, Colisões, Animação)' },
            { codigo: '4.6', titulo: 'Ferramentas' },
            { codigo: '4.7', titulo: 'Bibliotecas' },
            { codigo: '4.8', titulo: 'Acesso a dados (Arquivos, Bancos de dados)' },
            { codigo: '4.9', titulo: 'Frameworks' },
            { codigo: '4.10', titulo: 'Boas práticas' },
            { codigo: '4.11', titulo: 'Aplicação' },
            { codigo: '4.12', titulo: 'Documentação' }
          ]},
          { codigo: '5', titulo: 'Programação Orientada a Objetos', subitens: [
            { codigo: '5.1', titulo: 'Introdução' },
            { codigo: '5.2', titulo: 'Estrutura' },
            { codigo: '5.3', titulo: 'Composição' },
            { codigo: '5.4', titulo: 'Herança' },
            { codigo: '5.5', titulo: 'Hierarquia dos tipos' },
            { codigo: '5.6', titulo: 'Polimorfismo' },
            { codigo: '5.7', titulo: 'Relacionamento entre objetos' }
          ]},
          { codigo: '6', titulo: 'Programação Orientada a Componentes', subitens: [
            { codigo: '6.1', titulo: 'Introdução' },
            { codigo: '6.2', titulo: 'Estrutura' },
            { codigo: '6.3', titulo: 'Componentes' },
            { codigo: '6.4', titulo: 'Relacionamentos entre componentes' }
          ]},
          { codigo: '7', titulo: 'Estruturas de dados avançadas', subitens: [
            { codigo: '7.1', titulo: 'Grafos em jogos digitais (Busca em largura, Busca em profundidade, Grafo direcional, Representação do espaço)' },
            { codigo: '7.2', titulo: 'Árvores de decisão em jogos digitais (Estruturação do Level Design)' }
          ]},
          { codigo: '8', titulo: 'Padrões de projeto (Design Patterns) em Jogos Digitais', subitens: [
            { codigo: '8.1', titulo: 'Introdução' },
            { codigo: '8.2', titulo: 'Facade' },
            { codigo: '8.3', titulo: 'Factory' },
            { codigo: '8.4', titulo: 'Adapter' },
            { codigo: '8.5', titulo: 'Mediator' },
            { codigo: '8.6', titulo: 'Singleton' },
            { codigo: '8.7', titulo: 'Visitor' },
            { codigo: '8.8', titulo: 'Strategy' },
            { codigo: '8.9', titulo: 'Decorator' },
            { codigo: '8.10', titulo: 'Observer' }
          ]},
          { codigo: '9', titulo: 'Segurança da informação', subitens: [
            { codigo: '9.1', titulo: 'Políticas de segurança da informação' },
            { codigo: '9.2', titulo: 'Criptografia' },
            { codigo: '9.3', titulo: 'Perfis de usuários' },
            { codigo: '9.4', titulo: 'Proteção de dados pessoais' }
          ]},
          { codigo: '10', titulo: 'Posturas profissionais', subitens: [
            { codigo: '10.1', titulo: 'Engajamento' },
            { codigo: '10.2', titulo: 'Disciplina' },
            { codigo: '10.3', titulo: 'Cooperação' },
            { codigo: '10.4', titulo: 'Prudência' },
            { codigo: '10.5', titulo: 'Respeito' },
            { codigo: '10.6', titulo: 'Cordialidade' },
            { codigo: '10.7', titulo: 'Empatia' }
          ]}
        ]
      },
      {
        id: 'uc19',
        nome: 'Testes de Jogos Digitais',
        cargaHoraria: 60,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Analisar documentação de teste para planejamento da rotina' },
          { codigo: 'CT2', descricao: 'Identificar tipos, função, ferramentas de teste de acordo com o sistema de jogos digitais' },
          { codigo: 'CT3', descricao: 'Empregar ferramenta de documentação de teste para registro do resultado obtido' },
          { codigo: 'CT4', descricao: 'Identificar problemas de sistemas por meio de aplicação de teste' },
          { codigo: 'CT5', descricao: 'Organizar o ambiente para o desenvolvimento das rotinas de testes' },
          { codigo: 'CT6', descricao: 'Definir roteiro de teste para execução, conforme recomendações técnicas' },
          { codigo: 'CT7', descricao: 'Reconhecer normas, métodos e técnicas de testes para correção de falhas de sistema' },
          { codigo: 'CT8', descricao: 'Reconhecer os elementos de um Plano de Testes' },
          { codigo: 'CT9', descricao: 'Desenvolver Plano de Testes' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Testes em jogos Digitais', subitens: [
            { codigo: '1.1', titulo: 'Motivação' },
            { codigo: '1.2', titulo: 'Objetivos' },
            { codigo: '1.3', titulo: 'Testes no processo de desenvolvimento de jogos' }
          ]},
          { codigo: '2', titulo: 'Processo fundamental de teste', subitens: [
            { codigo: '2.1', titulo: 'Planejamento' },
            { codigo: '2.2', titulo: 'Desenho dos Testes' },
            { codigo: '2.3', titulo: 'Execução' },
            { codigo: '2.4', titulo: 'Monitoração e Controle' },
            { codigo: '2.5', titulo: 'Avaliação dos Resultados' }
          ]},
          { codigo: '3', titulo: 'Planejamento de testes em jogos digitais', subitens: [
            { codigo: '3.1', titulo: 'Análise do documento de requisitos' },
            { codigo: '3.2', titulo: 'Plano de teste' },
            { codigo: '3.3', titulo: 'Suíte de testes' },
            { codigo: '3.4', titulo: 'Casos de testes' }
          ]},
          { codigo: '4', titulo: 'Conceitos fundamentais', subitens: [
            { codigo: '4.1', titulo: 'Verificação' },
            { codigo: '4.2', titulo: 'Validação' }
          ]},
          { codigo: '5', titulo: 'Tipos de testes', subitens: [
            { codigo: '5.1', titulo: 'Testes de Funcionalidade' },
            { codigo: '5.2', titulo: 'Testes de Usabilidade' },
            { codigo: '5.3', titulo: 'Testes de Confiabilidade' },
            { codigo: '5.4', titulo: 'Testes de Desempenho' },
            { codigo: '5.5', titulo: 'Testes de Manutenibilidade' },
            { codigo: '5.6', titulo: 'Teste de mesa' },
            { codigo: '5.7', titulo: 'Teste e versão alfa' },
            { codigo: '5.8', titulo: 'Teste e versão beta' },
            { codigo: '5.9', titulo: 'Teste e versão candidate' },
            { codigo: '5.10', titulo: 'Teste e versão Gold' },
            { codigo: '5.11', titulo: 'Testes de certificação' },
            { codigo: '5.12', titulo: 'Testes de plataforma' },
            { codigo: '5.13', titulo: 'Testes de publicação' }
          ]},
          { codigo: '6', titulo: 'Técnicas de testes', subitens: [
            { codigo: '6.1', titulo: 'Teste funcional (caixa preta)' },
            { codigo: '6.2', titulo: 'Teste estrutural (caixa branca)' }
          ]},
          { codigo: '7', titulo: 'Níveis de testes', subitens: [
            { codigo: '7.1', titulo: 'Teste de Unidade ou Teste Unitário' },
            { codigo: '7.2', titulo: 'Teste de Integração' },
            { codigo: '7.3', titulo: 'Teste de Sistema' },
            { codigo: '7.4', titulo: 'Teste de Aceitação' }
          ]},
          { codigo: '8', titulo: 'Frameworks de teste em jogos digitais', subitens: [
            { codigo: '8.1', titulo: 'Estrutura' },
            { codigo: '8.2', titulo: 'Instalação' },
            { codigo: '8.3', titulo: 'Configuração' },
            { codigo: '8.4', titulo: 'Ferramentas' },
            { codigo: '8.5', titulo: 'Documentação' }
          ]},
          { codigo: '9', titulo: 'Práticas de testes', subitens: [
            { codigo: '9.1', titulo: 'Review' },
            { codigo: '9.2', titulo: 'Passeio' },
            { codigo: '9.3', titulo: 'Inspeção' }
          ]},
          { codigo: '10', titulo: 'Posturas profissionais', subitens: [
            { codigo: '10.1', titulo: 'Engajamento' },
            { codigo: '10.2', titulo: 'Disciplina' },
            { codigo: '10.3', titulo: 'Cooperação' },
            { codigo: '10.4', titulo: 'Prudência' },
            { codigo: '10.5', titulo: 'Respeito' },
            { codigo: '10.6', titulo: 'Cordialidade' },
            { codigo: '10.7', titulo: 'Empatia' }
          ]}
        ]
      },
      {
        id: 'uc20',
        nome: 'Manutenção de Jogos Digitais',
        cargaHoraria: 28,
        modulo: 'Específico II',
        periodo: '3º Período',
        capacidades: [
          { codigo: 'CT1', descricao: 'Reconhecer os procedimentos de manutenção de jogos digitais' },
          { codigo: 'CT2', descricao: 'Aplicar procedimentos de manutenção de jogos digitais' },
          { codigo: 'CT3', descricao: 'Reconhecer os procedimentos de manutenção corretiva de jogos digitais' },
          { codigo: 'CT4', descricao: 'Aplicar procedimentos de manutenção corretiva de jogos digitais' },
          { codigo: 'CT5', descricao: 'Reconhecer os procedimentos de aprimoramento de jogos digitais' },
          { codigo: 'CT6', descricao: 'Aplicar procedimentos de aprimoramento de jogos digitais' }
        ],
        conhecimentos: [
          { codigo: '1', titulo: 'Manutenção em jogos Digitais', subitens: [
            { codigo: '1.1', titulo: 'Motivação' },
            { codigo: '1.2', titulo: 'Objetivos' },
            { codigo: '1.3', titulo: 'Evolução de software no processo de desenvolvimento de jogos' },
            { codigo: '1.4', titulo: 'Correção de bugs em jogos digitais' }
          ]},
          { codigo: '2', titulo: 'Processo fundamental de manutenção e evolução', subitens: [
            { codigo: '2.1', titulo: 'Planejamento' },
            { codigo: '2.2', titulo: 'Plano de manutenção' },
            { codigo: '2.3', titulo: 'Execução' },
            { codigo: '2.4', titulo: 'Monitoração e Controle (Métricas de uso)' },
            { codigo: '2.5', titulo: 'Avaliação dos Riscos' },
            { codigo: '2.6', titulo: 'Procedimentos' },
            { codigo: '2.7', titulo: 'Demandas internas e externas' },
            { codigo: '2.8', titulo: 'Suporte ao jogador' }
          ]},
          { codigo: '3', titulo: 'Refatoração de código', subitens: [
            { codigo: '3.1', titulo: 'Motivação' },
            { codigo: '3.2', titulo: 'Técnicas de refatoramento (Extract Method, Mover Método, Mover Atributo, Extrair Classe, Encapsular Atributo, Renomear Método, Subir/Descer Método e Atributo, Extrair Sub-classe, Extrair Super-classe)' }
          ]},
          { codigo: '4', titulo: 'Posturas profissionais', subitens: [
            { codigo: '4.1', titulo: 'Engajamento' },
            { codigo: '4.2', titulo: 'Disciplina' },
            { codigo: '4.3', titulo: 'Cooperação' },
            { codigo: '4.4', titulo: 'Prudência' },
            { codigo: '4.5', titulo: 'Respeito' },
            { codigo: '4.6', titulo: 'Cordialidade' },
            { codigo: '4.7', titulo: 'Empatia' }
          ]}
        ]
      }
    ]
  }
];

// Função auxiliar para obter o termo correto (Capacidade ou Habilidade)
export const getTermoCapacidade = (tipoEnsino) => {
  return tipoEnsino === TIPO_ENSINO.INTEGRADO ? 'Habilidade' : 'Capacidade';
};

// Função auxiliar para obter o prefixo do código (H ou CT)
export const getPrefixoCodigo = (tipoEnsino) => {
  return tipoEnsino === TIPO_ENSINO.INTEGRADO ? 'H' : 'CT';
};

export default cursos;
