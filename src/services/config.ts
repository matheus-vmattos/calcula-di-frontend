/**
 * Configuração da API CalculaDI.
 *
 * URL pode ser sobrescrita por variável de ambiente em builds futuros
 * (process.env.EXPO_PUBLIC_API_URL), mas por enquanto está hardcoded
 * pra simplificar — a API é pública mesmo, sem secrets envolvidos.
 */

export const API_CONFIG = {
  baseUrl: 'https://calcula-di-api.mvmattos.workers.dev',
  timeoutMs: 15_000, // 15s — generoso pra acomodar lentidão móvel
} as const;