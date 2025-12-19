/**
 * Serviço de API para comunicação com o backend MongoDB
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Cache simples para evitar requisições repetidas
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(endpoint) {
  return endpoint;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro desconhecido na API');
    }

    return result.data;
  } catch (error) {
    // Melhor log de erro para debug
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.error(`Erro de conexão com ${url}. Verifique se o servidor backend está rodando em ${API_BASE_URL}`);
    } else {
      console.error(`Erro ao acessar ${url}:`, error.message || error);
    }
    throw error;
  }
}

// ============ CURSOS ============

export async function getCursos() {
  const cacheKey = getCacheKey('/cursos');
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI('/cursos');
  setCache(cacheKey, data);
  return data;
}

export async function getCursoById(cursoId) {
  const cacheKey = getCacheKey(`/cursos/${cursoId}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(`/cursos/${cursoId}`);
  setCache(cacheKey, data);
  return data;
}

export async function getCursosByTipoEnsino(tipoEnsino) {
  const cursos = await getCursos();
  return cursos.filter(c => c.tipoEnsino === tipoEnsino);
}

// ============ UNIDADES CURRICULARES ============

export async function getUnidadesCurriculares(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cursoId) params.append('cursoId', filters.cursoId);
  if (filters.modulo) params.append('modulo', filters.modulo);
  if (filters.periodo) params.append('periodo', filters.periodo);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = `/unidades${queryString ? `?${queryString}` : ''}`;
  
  const cacheKey = getCacheKey(endpoint);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(endpoint);
  setCache(cacheKey, data);
  return data;
}

export async function getUnidadesByCurso(cursoId) {
  const cacheKey = getCacheKey(`/cursos/${cursoId}/unidades`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(`/cursos/${cursoId}/unidades`);
  setCache(cacheKey, data);
  return data;
}

export async function getUnidadeById(unidadeId) {
  const cacheKey = getCacheKey(`/unidades/${unidadeId}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(`/unidades/${unidadeId}`);
  setCache(cacheKey, data);
  return data;
}

export async function buscarUnidades(query, cursoId = null, limit = 10) {
  const body = { query, limit };
  if (cursoId) body.cursoId = cursoId;

  return await fetchAPI('/unidades/busca', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ============ CAPACIDADES ============

export async function getCapacidades(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cursoId) params.append('cursoId', filters.cursoId);
  if (filters.unidadeCurricularId) params.append('unidadeCurricularId', filters.unidadeCurricularId);
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = `/capacidades${queryString ? `?${queryString}` : ''}`;

  return await fetchAPI(endpoint);
}

export async function getCapacidadesByUnidade(unidadeId) {
  const cacheKey = getCacheKey(`/unidades/${unidadeId}/capacidades`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(`/unidades/${unidadeId}/capacidades`);
  setCache(cacheKey, data);
  return data;
}

export async function buscarCapacidades(query, cursoId = null, tipo = null, limit = 20) {
  const body = { query, limit };
  if (cursoId) body.cursoId = cursoId;
  if (tipo) body.tipo = tipo;

  return await fetchAPI('/capacidades/busca', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getCapacidadesStats() {
  return await fetchAPI('/capacidades/stats');
}

// ============ CONHECIMENTOS ============

export async function getConhecimentos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cursoId) params.append('cursoId', filters.cursoId);
  if (filters.unidadeCurricularId) params.append('unidadeCurricularId', filters.unidadeCurricularId);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = `/conhecimentos${queryString ? `?${queryString}` : ''}`;

  return await fetchAPI(endpoint);
}

export async function getConhecimentosByUnidade(unidadeId) {
  const cacheKey = getCacheKey(`/unidades/${unidadeId}/conhecimentos`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const data = await fetchAPI(`/unidades/${unidadeId}/conhecimentos`);
  setCache(cacheKey, data);
  return data;
}

export async function buscarConhecimentos(query, cursoId = null, limit = 20) {
  const body = { query, limit };
  if (cursoId) body.cursoId = cursoId;

  return await fetchAPI('/conhecimentos/busca', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ============ HEALTH CHECK ============

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// ============ LIMPAR CACHE ============

export function clearCache() {
  cache.clear();
}

// ============ CONSTANTES (mantidas para compatibilidade) ============

export const TIPO_ENSINO = {
  TECNICO: 'tecnico',
  INTEGRADO: 'integrado'
};

export function getTermoCapacidade(tipoEnsino) {
  return tipoEnsino === TIPO_ENSINO.INTEGRADO ? 'Habilidade' : 'Capacidade';
}
