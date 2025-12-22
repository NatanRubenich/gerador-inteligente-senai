# 📝 Gerador Inteligente SENAI

Sistema completo para geração automatizada de **avaliações, planos de ensino e situações de aprendizagem** seguindo a Metodologia SENAI de Educação Profissional (MSEP) e o padrão SAEP.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run-4285F4?logo=googlecloud)
![License](https://img.shields.io/badge/License-Educational-green)

---

## 🌐 Acesso Online (Produção)

| Componente | URL | Hospedagem |
|------------|-----|------------|
| **Frontend** | [natanrubenich.github.io/gerador-inteligente-senai](https://natanrubenich.github.io/gerador-inteligente-senai/) | GitHub Pages |
| **Backend API** | [gerador-provas-api-531942819894.southamerica-east1.run.app](https://gerador-provas-api-531942819894.southamerica-east1.run.app) | Google Cloud Run (São Paulo) |
| **Banco de Dados** | MongoDB Atlas | AWS (Cluster M0 - Gratuito) |

> ⚠️ **Nota:** A hospedagem atual é para fins de desenvolvimento/demonstração.

---

## ✨ Funcionalidades

### 📋 Tipos de Documentos Gerados

| Tipo | Descrição | Status |
|------|-----------|--------|
| **Avaliação Objetiva** | Questões de múltipla escolha no padrão SAEP | ✅ Disponível |
| **Avaliação Prática** | Situação-problema com critérios de avaliação | ✅ Disponível |
| **Situação de Aprendizagem (SA)** | Projeto pedagógico completo com desafio, atividades e avaliação | ✅ Disponível |
| **Plano de Ensino** | Planejamento completo da UC compatível com SGN | ✅ Disponível |

### 🚀 Recursos Principais

- **🤖 IA Generativa (Google Gemini)**: Geração inteligente de conteúdo pedagógico
- **📚 RAG (Retrieval-Augmented Generation)**: Base de conhecimento SENAI integrada
- **📤 Exportação Moodle XML**: Exporte questões diretamente para o Moodle
- **🎯 Níveis de Dificuldade**: Fácil, Médio e Difícil com distribuição automática
- **✏️ Edição Completa**: Revise e edite todo conteúdo antes de finalizar
- **🖨️ Impressão Profissional**: Templates formatados no padrão SENAI
- **📊 Gabarito Separado**: Visualize e imprima gabaritos independentemente
- **📁 Administração de Cursos**: Adicione novos cursos via upload de PPC (PDF) e Matriz Curricular (Excel)
- **🔄 Extração com IA**: Extrai automaticamente UCs e capacidades de documentos PDF

### 🎓 Suporte a Terminologia

| Tipo de Ensino | Terminologia |
|----------------|--------------|
| Ensino Técnico | Capacidade Técnica (CT) / Capacidade Básica (CB) |
| Ensino Médio Integrado (SESI/SENAI) | Habilidade (H) |

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** ou **yarn**
- **API Key do Google Gemini** ([obter aqui](https://aistudio.google.com/app/apikey))

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/NatanRubenich/gerador-inteligente-senai.git

# 2. Entre na pasta do projeto
cd gerador-inteligente-senai

# 3. Instale as dependências do frontend
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua chave Gemini

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em: **http://localhost:5173**

### Executar Backend Local (opcional)

```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite com suas credenciais MongoDB

# Inicie o servidor
npm run dev
```

O backend estará disponível em: **http://localhost:3001**

---

## 🔑 Configuração das Variáveis de Ambiente

### Frontend (`.env`)

```env
# API Key do Google Gemini (obrigatório)
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui

# URL do Backend (opcional - usa localhost:3001 por padrão)
VITE_API_URL=http://localhost:3001
```

### Backend (`server/.env`)

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
MONGODB_DB_NAME=gerador_provas_senai

# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Importante:** Nunca compartilhe suas API Keys ou faça commit de arquivos `.env`

---

## 📋 Scripts Disponíveis

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Visualiza build localmente |
| `npm run lint` | Verifica código com ESLint |

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor |
| `npm run dev` | Servidor com hot-reload |
| `npm run migrate` | Executa migrações |

---

## 🎓 Como Usar

### 1. Selecionar Tipo de Documento
Escolha entre:
- **Avaliação Objetiva** - Questões de múltipla escolha
- **Avaliação Prática** - Situação-problema com critérios
- **Situação de Aprendizagem** - Projeto pedagógico completo
- **Plano de Ensino** - Planejamento da UC

### 2. Dados Básicos (Passo 1)
- Selecione o tipo de ensino (Técnico ou Integrado)
- Escolha o curso e unidade curricular
- Preencha turma, data e professor

### 3. Capacidades (Passo 2)
- Selecione as capacidades/habilidades a serem trabalhadas
- Configure parâmetros específicos do tipo de documento

### 4. Gerar com IA (Passo 3)
- Clique em **"Gerar com IA"**
- Aguarde a geração (usa Google Gemini + RAG)
- Revise e edite o conteúdo gerado

### 5. Visualizar e Exportar (Passo 4)
- Visualize o documento completo
- Imprima ou exporte (Moodle XML para questões)

### 🔐 Painel de Administração
Acesse com **Ctrl+Shift+A** para:
- Adicionar novos cursos via upload de PPC (PDF)
- Importar matriz curricular (Excel)
- Gerenciar UCs e capacidades

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2 | Framework UI |
| Vite | 7.2 | Build tool |
| TailwindCSS | 4.1 | Estilização |
| Lucide React | 0.561 | Ícones |
| React Router | 7.10 | Navegação |
| pdfjs-dist | 5.4 | Leitura de PDFs |
| xlsx | 0.18 | Leitura de Excel |

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 20 LTS | Runtime |
| Express | 4.21 | Framework API |
| MongoDB | 6.10 | Driver do banco |
| CORS | 2.8 | Cross-origin |

### IA & Infraestrutura

| Serviço | Uso |
|---------|-----|
| Google Gemini 2.5 Flash | Geração de conteúdo |
| MongoDB Atlas | Banco de dados (cluster gratuito) |
| Google Cloud Run | Hospedagem do backend |
| GitHub Pages | Hospedagem do frontend |

---

## 📁 Estrutura do Projeto

```
gerador-inteligente-senai/
├── public/
│   └── senai.png                    # Logo SENAI
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── StepIndicator.jsx
│   │   ├── TipoAvaliacaoSelector.jsx
│   │   ├── admin/
│   │   │   └── AdminCursos.jsx      # Painel de administração
│   │   └── steps/
│   │       ├── Step1DadosBasicos.jsx
│   │       ├── Step2Capacidades.jsx
│   │       ├── Step3GerarQuestoes.jsx
│   │       ├── Step4VisualizarProva.jsx
│   │       ├── pratica/             # Avaliação Prática
│   │       ├── sa/                  # Situação de Aprendizagem
│   │       └── plano/               # Plano de Ensino
│   ├── context/
│   │   └── ProvaContext.jsx         # Estado global
│   ├── data/
│   │   └── cursos.js                # Cursos pré-cadastrados
│   ├── services/
│   │   ├── llmService.js            # Integração Gemini/Groq
│   │   ├── ragService.js            # Base de conhecimento SENAI
│   │   ├── apiService.js            # Comunicação com backend
│   │   ├── planoEnsinoService.js    # Geração de planos
│   │   ├── saService.js             # Geração de SAs
│   │   ├── moodleExportService.js   # Exportação Moodle XML
│   │   └── cursoAIExtractionService.js  # Extração de PDFs
│   ├── config/
│   │   └── api.js                   # Configurações de API
│   ├── App.jsx
│   └── main.jsx
├── server/                          # Backend API
│   ├── src/
│   │   ├── index.js                 # Entry point
│   │   ├── config/
│   │   ├── models/
│   │   └── routes/
│   ├── Dockerfile                   # Container para Cloud Run
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml               # CI/CD GitHub Actions
├── .env.example
├── package.json
└── vite.config.js
```

---

## 📚 Cursos Pré-cadastrados

- Técnico em Desenvolvimento de Sistemas
- Técnico em Desenvolvimento de Sistemas (Integrado ao Ensino Médio)
- Técnico em Informática para Internet
- Técnico em Multimídia

> 💡 Novos cursos podem ser adicionados via painel de administração (Ctrl+Shift+A)

---

## 📐 Metodologia SAEP

As questões objetivas seguem o padrão SAEP:

| Elemento | Descrição |
|----------|-----------|
| **Contexto** | Situação-problema real do mundo do trabalho |
| **Comando** | Pergunta diretamente relacionada ao contexto |
| **Alternativas** | 4 opções (a, b, c, d) com tamanhos semelhantes |

### Regras de Elaboração

- ✅ Sem pegadinhas nas alternativas
- ✅ Alternativa correta com tamanho similar às outras
- ✅ Comando sem frases subjetivas
- ✅ Distratores plausíveis
- ✅ Respostas distribuídas equilibradamente

---

## 🐛 Solução de Problemas

### "API não configurada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a chave Gemini começa com `AIza`
- Reinicie o servidor após criar/editar o `.env`

### "Erro ao gerar questões"
- Verifique sua conexão com a internet
- Confirme que a API Key é válida em [Google AI Studio](https://aistudio.google.com/app/apikey)
- Tente novamente (pode ser limite de rate)

### "Erro de conexão com backend"
- Verifique se o backend está rodando (`npm run dev` na pasta `server/`)
- Confirme que `VITE_API_URL` está correto no `.env`

### Build falha
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

---

## � Deploy

### Frontend (GitHub Pages)

O deploy é automático via GitHub Actions ao fazer push na branch `main`.

### Backend (Google Cloud Run)

```bash
cd server

# Deploy via gcloud CLI
gcloud run deploy gerador-provas-api \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=...,MONGODB_DB_NAME=...,FRONTEND_URL=..."
```

---

## �📄 Licença

Desenvolvido para uso educacional no **SENAI Santa Catarina**.

---

## 👤 Autor

**Natan Rubenich**
- GitHub: [@NatanRubenich](https://github.com/NatanRubenich)

---

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
