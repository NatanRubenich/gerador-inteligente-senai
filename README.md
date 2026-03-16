# Gerador Inteligente SENAI

**v0.7.0** — Sistema de geração automatizada de avaliações e documentos pedagógicos com Inteligência Artificial, desenvolvido para o SENAI Santa Catarina.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=googlegemini)
![License](https://img.shields.io/badge/Licen%C3%A7a-Educacional-green)

---

## Sobre o Projeto

O **Gerador Inteligente** é uma aplicação web que utiliza IA generativa (Google Gemini 2.5 Flash) com técnicas de RAG (Retrieval-Augmented Generation) para gerar documentos pedagógicos alinhados à **Metodologia SENAI de Educação Profissional (MSEP)** e ao padrão **SAEP**.

A aplicação segue um fluxo de wizard em 4 etapas: o docente seleciona curso, unidade curricular e capacidades; configura os parâmetros da geração; a IA gera o conteúdo com base na metodologia SENAI; e o resultado pode ser revisado, editado, impresso ou exportado.

### O que pode ser gerado

| Documento | Descrição |
|-----------|-----------|
| **Avaliação Objetiva** | Questões de múltipla escolha no padrão SAEP com gabarito e exportação Moodle XML |
| **Avaliação Prática** | Situação-problema com critérios e lista de verificação (checklist) |
| **Situação de Aprendizagem (SA)** | Projeto pedagógico completo com atividades, recursos e rubrica de avaliação |
| **Plano de Ensino** | Planejamento completo da UC com blocos de aulas, estratégias e instrumentos |

### Principais recursos

- **IA Generativa** — Google Gemini 2.5 Flash gera conteúdo pedagógico contextualizado
- **RAG** — Base de conhecimento da metodologia SENAI (MSEP, SAEP, Taxonomia de Bloom) integrada às gerações
- **Exportação Moodle XML** — Questões objetivas exportáveis para importação direta no Moodle
- **Impressão flexível** — Imprima apenas a avaliação, apenas o gabarito/rubrica, ou ambos
- **Edição completa** — Todo conteúdo gerado pode ser revisado e editado antes de finalizar
- **Rascunho automático** — O estado do wizard é salvo em `localStorage` para evitar perda de dados
- **Administração de cursos** — Upload de PPC (PDF) e Matriz Curricular (Excel) com extração automática via IA
- **Terminologia adaptável** — "Capacidade" para Ensino Técnico, "Habilidade" para Ensino Médio Integrado

---

## Hospedagem

| Componente | URL | Serviço |
|------------|-----|---------|
| **Frontend** | [natanrubenich.github.io/gerador-inteligente-senai](https://natanrubenich.github.io/gerador-inteligente-senai/) | GitHub Pages |
| **Backend API** | [gerador-provas-api-531942819894.southamerica-east1.run.app](https://gerador-provas-api-531942819894.southamerica-east1.run.app) | Google Cloud Run (São Paulo) |
| **Banco de Dados** | MongoDB Atlas | AWS (Cluster M0) |

O deploy do **frontend** é feito via `npm run deploy` (gh-pages). O deploy do **backend** é automático via push no branch `main` (Google Cloud Run).

---

## Tecnologias

### Frontend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 19.2 | Biblioteca UI (SPA) |
| Vite | 7.2 | Build tool e dev server |
| TailwindCSS | 4.1 | Framework CSS utilitário |
| Lucide React | 0.561 | Biblioteca de ícones |
| React Router DOM | 7.10 | Roteamento SPA |
| pdfjs-dist | 5.4 | Leitura e extração de PDFs |
| xlsx | 0.18 | Leitura de planilhas Excel |
| gh-pages | 6.3 | Deploy para GitHub Pages |
| ESLint | 9.39 | Linting de código |

### Backend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 20 LTS | Runtime JavaScript |
| Express | 4.21 | Framework HTTP |
| MongoDB (driver) | 6.10 | Conexão com MongoDB Atlas |
| Helmet | 8.1 | Segurança HTTP headers |
| CORS | 2.8 | Cross-origin requests |
| express-rate-limit | 8.3 | Rate limiting |
| express-validator | 7.3 | Validação de dados |
| dotenv | 16.4 | Variáveis de ambiente |

### IA e Infraestrutura

| Serviço | Finalidade |
|---------|------------|
| Google Gemini 2.5 Flash | Modelo de IA para geração de conteúdo |
| MongoDB Atlas | Banco de dados na nuvem |
| Google Cloud Run | Hospedagem do backend (container) |
| GitHub Pages | Hospedagem do frontend (estático) |
| GitHub Actions | CI/CD para deploy automático do backend |

---

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18 ou superior — [download](https://nodejs.org/)
- **npm** (incluído com Node.js)
- **API Key do Google Gemini** — [obter aqui](https://aistudio.google.com/app/apikey)
- **MongoDB Atlas** (para o backend) — [criar cluster gratuito](https://www.mongodb.com/atlas)

### 1. Clonar o repositório

```bash
git clone https://github.com/NatanRubenich/gerador-inteligente-senai.git
cd gerador-inteligente-senai
```

### 2. Configurar e rodar o Frontend

```bash
# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env
```

Edite o arquivo `.env` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
VITE_API_URL=http://localhost:3001
```

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em **http://localhost:5173/gerador-inteligente-senai/**

### 3. Configurar e rodar o Backend

```bash
# Entrar na pasta do servidor
cd server

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env
```

Edite o arquivo `server/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
MONGODB_DB_NAME=gerador_provas_senai
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_gemini_aqui
```

```bash
# Iniciar servidor
npm run dev
```

O backend estará disponível em **http://localhost:3001**

### 4. Acessar o sistema

Abra o navegador em **http://localhost:5173/gerador-inteligente-senai/** e comece a usar.

---

## Scripts Disponíveis

### Frontend (`/`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (Vite) |
| `npm run build` | Gera build de produção em `/dist` |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa ESLint no código |
| `npm run deploy` | Build + deploy para GitHub Pages |

### Backend (`/server`)

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com hot-reload (--watch) |
| `npm run migrate` | Executa migrações do banco de dados |

---

## Estrutura do Projeto

```
gerador-inteligente-senai/
├── public/
│   └── senai.png                         # Logo SENAI (impressão)
├── src/                                  # === FRONTEND ===
│   ├── main.jsx                          # Entry point React
│   ├── App.jsx                           # Roteamento do wizard por tipo de avaliação
│   ├── index.css                         # TailwindCSS + estilos de impressão
│   ├── config/
│   │   └── api.js                        # URL da API e modelo LLM
│   ├── context/
│   │   └── ProvaContext.jsx              # Estado global + persistência localStorage
│   ├── components/
│   │   ├── Header.jsx                    # Cabeçalho com versão e status da API
│   │   ├── Footer.jsx                    # Rodapé com créditos
│   │   ├── StepIndicator.jsx             # Indicador de progresso (4 etapas)
│   │   ├── TipoAvaliacaoSelector.jsx     # Seletor de tipo de avaliação
│   │   ├── admin/
│   │   │   └── AdminCursos.jsx           # Painel admin (Ctrl+Shift+A)
│   │   └── steps/
│   │       ├── Step1DadosBasicos.jsx      # Etapa 1: Curso, UC, turma, data
│   │       ├── Step2Capacidades.jsx       # Etapa 2: Seleção de capacidades
│   │       ├── Step3GerarQuestoes.jsx     # Etapa 3: Geração com IA (objetiva)
│   │       ├── Step4VisualizarProva.jsx   # Etapa 4: Visualização/impressão (objetiva)
│   │       ├── pratica/                   # Steps da avaliação prática
│   │       │   ├── Step3GerarPratica.jsx
│   │       │   └── Step4VisualizarPratica.jsx
│   │       ├── sa/                        # Steps da situação de aprendizagem
│   │       │   ├── Step3GerarSA.jsx
│   │       │   └── Step4VisualizarSA.jsx
│   │       └── plano/                     # Steps do plano de ensino
│   │           ├── Step3GerarPlano.jsx
│   │           └── Step4VisualizarPlano.jsx
│   ├── services/
│   │   ├── apiService.js                 # Cliente da API backend (CRUD cursos/UCs)
│   │   ├── llmService.js                 # Integração com Google Gemini
│   │   ├── ragService.js                 # Motor RAG (TF-IDF + base de conhecimento)
│   │   ├── saService.js                  # Geração de situações de aprendizagem
│   │   ├── planoEnsinoService.js         # Geração de planos de ensino
│   │   ├── moodleExportService.js        # Exportação para Moodle XML
│   │   ├── cursoExtractionService.js     # Extração de texto de PDFs
│   │   └── cursoAIExtractionService.js   # Extração com IA de PDFs/Excel
│   └── data/
│       ├── cursos.js                     # Dados de cursos (fallback local)
│       └── knowledge-base/              # Base de conhecimento SENAI
│           └── metodologia-senai.json    # MSEP, SAEP, Bloom, estratégias
├── server/                               # === BACKEND ===
│   ├── src/
│   │   ├── index.js                      # Entry point Express
│   │   ├── config/
│   │   │   └── database.js              # Conexão MongoDB Atlas
│   │   ├── middleware/
│   │   │   ├── security.js              # Helmet, rate limiting
│   │   │   └── validation.js            # Validação de requests
│   │   ├── models/
│   │   │   └── schemas.js               # Schemas MongoDB + índices
│   │   ├── routes/
│   │   │   ├── cursos.js                # CRUD de cursos
│   │   │   ├── unidades.js              # CRUD de UCs e capacidades
│   │   │   ├── capacidades.js           # Listagem/busca de capacidades
│   │   │   ├── conhecimentos.js         # Listagem/busca de conhecimentos
│   │   │   └── gemini.js               # Proxy para Gemini API
│   │   └── scripts/
│   │       └── migrate.js               # Script de migração
│   ├── Dockerfile                        # Container para Cloud Run
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml                    # CI/CD deploy backend
├── .env.example                          # Template de variáveis de ambiente
├── package.json
├── vite.config.js
├── eslint.config.js
└── requirements.txt                      # Lista de tecnologias e versões
```

---

## Deploy

### Frontend — GitHub Pages

```bash
npm run deploy
```

Executa `vite build` e publica o conteúdo de `/dist` no branch `gh-pages`.

### Backend — Google Cloud Run

O deploy é automático via GitHub Actions ao fazer push na branch `main`. O workflow está em `.github/workflows/deploy.yml`.

Deploy manual (se necessário):

```bash
cd server
gcloud run deploy gerador-provas-api \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=...,MONGODB_DB_NAME=...,FRONTEND_URL=...,GEMINI_API_KEY=..."
```

---

## Solução de Problemas

| Problema | Solução |
|----------|---------|
| "API não configurada" | Verifique se `.env` existe e se `VITE_GEMINI_API_KEY` começa com `AIza`. Reinicie o dev server. |
| "Erro ao gerar questões" | Verifique conexão com internet e valide a API Key em [Google AI Studio](https://aistudio.google.com/app/apikey). |
| "Erro de conexão com backend" | Confirme que o backend está rodando e que `VITE_API_URL` aponta para a URL correta. |
| Build falha | Execute `rm -rf node_modules package-lock.json && npm install` para limpar o cache. |

---

## Licença

Desenvolvido para uso educacional no **SENAI Santa Catarina**.

---

## Autor

**Natan Rubenich** — [@NatanRubenich](https://github.com/NatanRubenich)
