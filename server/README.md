# 🖥️ Backend API - Gerador Inteligente SENAI

API REST para gerenciamento de cursos, unidades curriculares e capacidades do sistema Gerador Inteligente SENAI.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.10-47A248?logo=mongodb)

---

## 🌐 Hospedagem (Produção)

| Serviço | URL | Região |
|---------|-----|--------|
| **API** | [gerador-provas-api-531942819894.southamerica-east1.run.app](https://gerador-provas-api-531942819894.southamerica-east1.run.app) | São Paulo (southamerica-east1) |
| **Banco de Dados** | MongoDB Atlas | AWS (Cluster M0 - Gratuito) |
| **Hospedagem** | Google Cloud Run | GCP |

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **MongoDB Atlas** (ou MongoDB local)

### Instalação

```bash
# 1. Entre na pasta do servidor
cd server

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Inicie o servidor
npm run dev
```

O servidor estará disponível em: **http://localhost:3001**

---

## 🔑 Variáveis de Ambiente

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
MONGODB_DB_NAME=gerador_provas_senai

# Servidor
PORT=3001
NODE_ENV=development

# CORS - URL do frontend
FRONTEND_URL=http://localhost:5173
```

---

## 📋 Endpoints da API

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verifica status da API |

### Cursos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/cursos` | Lista todos os cursos |
| GET | `/api/cursos/:id` | Busca curso por ID |
| GET | `/api/cursos/:id/unidades` | Lista UCs de um curso |
| POST | `/api/cursos` | Cria novo curso |
| PUT | `/api/cursos/:id` | Atualiza curso |
| DELETE | `/api/cursos/:id` | Remove curso |

### Unidades Curriculares

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/unidades` | Lista todas as UCs |
| GET | `/api/unidades/:id` | Busca UC por ID |
| GET | `/api/unidades/:id/capacidades` | Lista capacidades de uma UC |
| POST | `/api/unidades` | Cria nova UC |
| PUT | `/api/unidades/:id` | Atualiza UC |
| DELETE | `/api/unidades/:id` | Remove UC |
| POST | `/api/unidades/busca` | Busca UCs por texto |

### Capacidades

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/capacidades` | Lista todas as capacidades |
| GET | `/api/capacidades/stats` | Estatísticas de capacidades |
| POST | `/api/capacidades/busca` | Busca capacidades por texto |

### Conhecimentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/conhecimentos` | Lista todos os conhecimentos |
| GET | `/api/unidades/:id/conhecimentos` | Lista conhecimentos de uma UC |
| POST | `/api/conhecimentos/busca` | Busca conhecimentos por texto |

---

## 📁 Estrutura do Projeto

```
server/
├── src/
│   ├── index.js           # Entry point do servidor
│   ├── config/
│   │   └── database.js    # Conexão MongoDB
│   ├── models/
│   │   └── Curso.js       # Modelo de dados
│   ├── routes/
│   │   ├── cursos.js      # Rotas de cursos
│   │   ├── unidades.js    # Rotas de UCs
│   │   ├── capacidades.js # Rotas de capacidades
│   │   └── conhecimentos.js # Rotas de conhecimentos
│   └── scripts/
│       └── migrate.js     # Script de migração
├── Dockerfile             # Container para Cloud Run
├── .dockerignore
├── .env.example
└── package.json
```

---

## 📋 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com hot-reload (desenvolvimento) |
| `npm run migrate` | Executa migrações de dados |

---

## 🐳 Docker

### Build local

```bash
docker build -t gerador-provas-api .
docker run -p 3001:3001 --env-file .env gerador-provas-api
```

### Deploy no Google Cloud Run

```bash
gcloud run deploy gerador-provas-api \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=...,MONGODB_DB_NAME=gerador_provas_senai,NODE_ENV=production,FRONTEND_URL=https://natanrubenich.github.io"
```

---

## 🔒 CORS

O servidor está configurado para aceitar requisições apenas do frontend autorizado:

- **Desenvolvimento:** `http://localhost:5173`
- **Produção:** `https://natanrubenich.github.io`

---

## 📄 Exemplo de Resposta

### GET /api/cursos

```json
{
  "success": true,
  "data": [
    {
      "id": "desenvolvimento-sistemas",
      "nome": "Técnico em Desenvolvimento de Sistemas",
      "tipoEnsino": "tecnico",
      "cargaHorariaTotal": 1200,
      "competenciaGeral": "Desenvolver sistemas computacionais...",
      "unidadesCurriculares": [...]
    }
  ]
}
```

### GET /api/health

```json
{
  "status": "ok",
  "timestamp": "2025-12-22T01:46:18.210Z",
  "service": "gerador-provas-senai-api"
}
```

---

## 📄 Licença

Desenvolvido para uso educacional no **SENAI Santa Catarina**.
