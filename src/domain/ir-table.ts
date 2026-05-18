/**
 * Tabela regressiva de IR sobre rendimento de renda fixa.
 * Base legal: Lei 11.033/2004, art. 1º.
 */

/**
 * Retorna a alíquota de IR (decimal) para resgate após N dias corridos.
 *   - 22,5% até 180 dias
 *   - 20%   181 a 360
 *   - 17,5% 361 a 720
 *   - 15%   acima de 720
 * @throws Error se diasCorridos < 1
 */
export function getIrAliquota(diasCorridos: number): number {
  if (diasCorridos < 1 || !Number.isFinite(diasCorridos)) {
    throw new Error(`diasCorridos deve ser >= 1, recebido: ${diasCorridos}`);
  }
  if (diasCorridos <= 180) return 0.225;
  if (diasCorridos <= 360) return 0.2;
  if (diasCorridos <= 720) return 0.175;
  return 0.15;
}