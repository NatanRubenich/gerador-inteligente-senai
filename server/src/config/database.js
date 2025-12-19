import { MongoClient, ServerApiVersion } from 'mongodb';

let client = null;
let db = null;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'gerador_provas_senai';

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false, // Desabilitado para permitir índices de texto
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });

    await client.connect();
    
    // Ping para confirmar conexão
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');

    db = client.db(DB_NAME);
    return { client, db };
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 Conexão com MongoDB fechada');
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database não inicializado. Chame connectToDatabase() primeiro.');
  }
  return db;
}

export function getClient() {
  return client;
}
