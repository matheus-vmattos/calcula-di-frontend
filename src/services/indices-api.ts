import { API_CONFIG } from './config';
import type { IndicesSnapshot } from '../types/indices';

const ORIGENS_VALIDAS: ReadonlySet<IndicesSnapshot['origem']> = new Set([
  'cache',
  'live',
  'parcial',
]);

const NOMES_MENSAIS: ReadonlySet<'IPCA' | 'IGP-M'> = new Set(['IPCA', 'IGP-M']);
const NOMES_ANUAIS: ReadonlySet<'SELIC' | 'CDI'> = new Set(['SELIC', 'CDI']);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isIndiceMensal(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.nome === 'string' &&
    NOMES_MENSAIS.has(item.nome as 'IPCA' | 'IGP-M') &&
    isFiniteNumber(item.valorMes) &&
    isFiniteNumber(item.acumulado12m) &&
    // Campo pode não existir em snapshots legados da API.
    (item.mesReferencia === undefined || isNonEmptyString(item.mesReferencia)) &&
    isNonEmptyString(item.mesReferenciaDisplay) &&
    isNonEmptyString(item.dataAtualizacao)
  );
}

function isIndiceAnual(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.nome === 'string' &&
    NOMES_ANUAIS.has(item.nome as 'SELIC' | 'CDI') &&
    isFiniteNumber(item.valorAnual) &&
    isFiniteNumber(item.valorDiarioEquivalente) &&
    isNonEmptyString(item.dataAtualizacao)
  );
}

function isSnapshotPayload(payload: unknown): payload is IndicesSnapshot {
  if (typeof payload !== 'object' || payload === null) return false;
  const data = payload as Record<string, unknown>;

  return (
    isNonEmptyString(data.geradoEm) &&
    typeof data.origem === 'string' &&
    ORIGENS_VALIDAS.has(data.origem as IndicesSnapshot['origem']) &&
    (data.ipca === null || isIndiceMensal(data.ipca)) &&
    (data.igpm === null || isIndiceMensal(data.igpm)) &&
    (data.selic === null || isIndiceAnual(data.selic)) &&
    (data.cdi === null || isIndiceAnual(data.cdi))
  );
}

/**
 * Erro lançado pelo cliente da API CalculaDI.
 *
 * - statusCode: status HTTP quando aplicável (undefined em erros de rede)
 * - isNetworkError: distingue erros de conectividade de erros do servidor
 */
export class IndicesApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isNetworkError: boolean = false,
  ) {
    super(message);
    this.name = 'IndicesApiError';
  }
}

/**
 * Busca o snapshot atual dos índices financeiros.
 *
 * Lida com:
 *   - Timeout (AbortController com 15s)
 *   - Erro de rede (sem conexão)
 *   - Status HTTP de erro (4xx, 5xx)
 *   - Payload malformado
 *
 * @returns Snapshot completo dos 4 índices
 * @throws IndicesApiError em qualquer falha
 */
export async function fetchIndicesSnapshot(): Promise<IndicesSnapshot> {
  const url = `${API_CONFIG.baseUrl}/indices`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    throw new IndicesApiError(
      isTimeout ? 'Tempo de resposta excedido' : 'Falha de rede ao consultar índices',
      undefined,
      true,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new IndicesApiError(
      `Servidor retornou erro ${response.status}`,
      response.status,
      false,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new IndicesApiError('Resposta inválida do servidor');
  }

  if (!isSnapshotPayload(payload)) {
    throw new IndicesApiError('Estrutura de resposta inesperada');
  }

  return payload;
}