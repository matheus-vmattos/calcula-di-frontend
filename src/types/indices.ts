/**
 * Tipos espelhados da API CalculaDI.
 *
 * IMPORTANTE: estes tipos devem refletir EXATAMENTE o que o backend retorna
 * em /indices. Se mudar a API, atualizar aqui.
 *
 * Backend: https://github.com/matheus-vmattos/calcula-di-api
 */

export interface IndiceMensal {
  nome: 'IPCA' | 'IGP-M';
  valorMes: number;
  acumulado12m: number;
  mesReferencia?: string; // "MM/YYYY" (opcional em snapshots legados)
  mesReferenciaDisplay: string; // "Abril/2026"
  dataAtualizacao: string; // ISO date
}

export interface IndiceAnual {
  nome: 'SELIC' | 'CDI';
  valorAnual: number;
  valorDiarioEquivalente: number;
  dataAtualizacao: string;
}

export interface IndicesSnapshot {
  ipca: IndiceMensal | null;
  igpm: IndiceMensal | null;
  selic: IndiceAnual | null;
  cdi: IndiceAnual | null;
  geradoEm: string;
  origem: 'cache' | 'live' | 'parcial';
}