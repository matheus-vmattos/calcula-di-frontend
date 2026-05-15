import { API_CONFIG } from './config';
import type { IndicesSnapshot } from '../types/indices';

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
    const detail = err instanceof Error ? err.message : String(err);
    throw new IndicesApiError(
      isTimeout ? 'Tempo de resposta excedido' : `Falha de rede: ${detail}`,
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
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new IndicesApiError(`Resposta inválida do servidor: ${detail}`);
  }

  // Validação mínima de estrutura
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('geradoEm' in payload) ||
    !('origem' in payload)
  ) {
    throw new IndicesApiError('Estrutura de resposta inesperada');
  }

  return payload as IndicesSnapshot;
}