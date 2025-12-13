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
    tipo: TIPO_ENSINO.TECNICO,
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
        ]
      }
    ]
  },
  {
    id: 'info-internet',
    nome: 'Técnico em Informática para Internet',
    tipo: TIPO_ENSINO.TECNICO,
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
    tipo: TIPO_ENSINO.TECNICO,
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
