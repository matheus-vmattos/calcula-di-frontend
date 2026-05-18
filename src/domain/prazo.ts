/**
 * Conversão de prazo (dias/meses/anos) para dias corridos e dias úteis.
 * Convenções ANBIMA/B3.
 */

const DIAS_CORRIDOS_ANO = 360;
const DIAS_CORRIDOS_MES = 30;
const DIAS_UTEIS_ANO = 252;
const DIAS_UTEIS_MES = 21;
const FATOR_CORRIDO_PARA_UTIL = 1.4;

export type UnidadePrazo = 'dias' | 'meses' | 'anos';

export interface PrazoConvertido {
  diasCorridos: number;
  diasUteis: number;
}

export function converterPrazo(valor: number, unidade: UnidadePrazo): PrazoConvertido {
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error(`valor deve ser > 0, recebido: ${valor}`);
  }

  switch (unidade) {
    case 'dias':
      return {
        diasCorridos: Math.round(valor),
        diasUteis: Math.max(1, Math.round(valor / FATOR_CORRIDO_PARA_UTIL)),
      };
    case 'meses':
      return {
        diasCorridos: Math.round(valor) * DIAS_CORRIDOS_MES,
        diasUteis: Math.round(valor) * DIAS_UTEIS_MES,
      };
    case 'anos':
      return {
        diasCorridos: Math.round(valor) * DIAS_CORRIDOS_ANO,
        diasUteis: Math.round(valor) * DIAS_UTEIS_ANO,
      };
    default:
      throw new Error(`unidade inválida: ${String(unidade)}`);
  }
}