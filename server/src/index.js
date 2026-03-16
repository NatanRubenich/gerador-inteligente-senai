/**
 * Servidor Express - Gerador de Provas SENAI
 * API para acesso ao MongoDB Atlas
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase, closeConnection } from './config/database.js';
import { helmetMiddleware, globalLimiter, geminiLimiter, writeLimiter } from './middleware/security.js';

// Rotas
import cursosRouter from './routes/cursos.js';
import unidadesRouter from './routes/unidades.js';
import capacidadesRouter from './routes/capacidades.js';
import conhecimentosRouter from './routes/conhecimentos.js';
import geminiRouter from './routes/gemini.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Validação de variáveis de ambiente obrigatórias
const requiredEnvVars = ['GEMINI_API_KEY', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Variáveis de ambiente obrigatórias não definidas: ${missingEnvVars.join(', ')}`);
  console.error('Configure-as no arquivo .env antes de iniciar o servidor.');
  process.exit(1);
}

// Middlewares de segurança
app.use(helmetMiddleware);
app.use(globalLimiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'gerador-provas-senai-api'
  });
});

// Rotas da API
app.use('/api/cursos', cursosRouter);
app.use('/api/unidades', unidadesRouter);
app.use('/api/capacidades', capacidadesRouter);
app.use('/api/conhecimentos', conhecimentosRouter);
app.use('/api/gemini', geminiLimiter, geminiRouter);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ success: false, error: 'Erro interno do servidor' });
});

// Iniciar servidor
async function startServer() {
  try {
    // Conectar ao MongoDB
    await connectToDatabase();
    
    // Iniciar Express
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 API disponível em http://localhost:${PORT}/api`);
      console.log(`\nEndpoints disponíveis:`);
      console.log(`  GET  /api/health`);
      console.log(`  GET  /api/cursos`);
      console.log(`  GET  /api/cursos/:id`);
      console.log(`  GET  /api/cursos/:id/unidades`);
      console.log(`  GET  /api/unidades`);
      console.log(`  GET  /api/unidades/:id`);
      console.log(`  GET  /api/unidades/:id/capacidades`);
      console.log(`  GET  /api/unidades/:id/conhecimentos`);
      console.log(`  POST /api/unidades/busca`);
      console.log(`  GET  /api/capacidades`);
      console.log(`  POST /api/capacidades/busca`);
      console.log(`  GET  /api/capacidades/stats`);
      console.log(`  GET  /api/conhecimentos`);
      console.log(`  POST /api/conhecimentos/busca`);
      console.log(`  POST /api/gemini/extract-course`);
      console.log(`  POST /api/gemini/extract-capacidades`);
      console.log(`  POST /api/gemini/extract-conhecimentos`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

startServer();
