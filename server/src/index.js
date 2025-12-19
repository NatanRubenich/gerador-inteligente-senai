/**
 * Servidor Express - Gerador de Provas SENAI
 * API para acesso ao MongoDB Atlas
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase, closeConnection } from './config/database.js';

// Rotas
import cursosRouter from './routes/cursos.js';
import unidadesRouter from './routes/unidades.js';
import capacidadesRouter from './routes/capacidades.js';
import conhecimentosRouter from './routes/conhecimentos.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: true, // Permitir qualquer origem em desenvolvimento
  credentials: true
}));
app.use(express.json());

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
