import { getIofAliquota } from './iof-table';
import { getIrAliquota } from './ir-table';

const DIAS_UTEIS_ANO = 252;

export interface CdbInput {
  valorInvestido: number;
  percentualCdi: number;
  taxaCdiAnual: number;
  diasCorridos: number;
  diasUteis: number;
}

export interface CdbResult {
  valorInvestido: number;
  diasCorridos: number;
  diasUteis: number;
  taxaCdiAnual: number;
  percentualCdi: number;
  taxaContratadaAnual: number;
  rendimentoBruto: number;
  iof: number;
  baseIr: number;
  aliquotaIr: number;
  ir: number;
  rendimentoLiquido: number;
  valorFinal: number;
  rentabilidadeLiquidaPercentual: number;
}

function arredondar(valor: number, casas: number): number {
  const fator = Math.pow(10, casas);
  return Math.round(valor * fator) / fator;
}

function validarInput(input: CdbInput): void {
  const { valorInvestido, percentualCdi, taxaCdiAnual, diasCorridos, diasUteis } = input;
  if (!Number.isFinite(valorInvestido) || valorInvestido <= 0) {
    throw new Error(`valorInvestido deve ser > 0`);
  }
  if (!Number.isFinite(percentualCdi) || percentualCdi <= 0) {
    throw new Error(`percentualCdi deve ser > 0`);
  }
  if (!Number.isFinite(taxaCdiAnual) || taxaCdiAnual < 0) {
    throw new Error(`taxaCdiAnual deve ser >= 0`);
  }
  if (!Number.isFinite(diasCorridos) || diasCorridos < 1) {
    throw new Error(`diasCorridos deve ser >= 1`);
  }
  if (!Number.isFinite(diasUteis) || diasUteis < 1) {
    throw new Error(`diasUteis deve ser >= 1`);
  }
}

/**
 * Calcula o rendimento de um CDB pós-fixado indexado ao CDI.
 * Mesma lógica validada no backend (convenção ANBIMA 252 dias úteis).
 */
export function calcularCdb(input: CdbInput): CdbResult {
  validarInput(input);
  const { valorInvestido, percentualCdi, taxaCdiAnual, diasCorridos, diasUteis } = input;

  const taxaDiariaCdi = Math.pow(1 + taxaCdiAnual / 100, 1 / DIAS_UTEIS_ANO) - 1;
  const taxaDiariaContratada = taxaDiariaCdi * (percentualCdi / 100);
  const fatorAcumulado = Math.pow(1 + taxaDiariaContratada, diasUteis);

  const montanteBruto = valorInvestido * fatorAcumulado;
  const rendimentoBruto = montanteBruto - valorInvestido;

  const aliquotaIof = getIofAliquota(diasCorridos);
  const iof = rendimentoBruto * aliquotaIof;

  const baseIr = rendimentoBruto - iof;
  const aliquotaIr = getIrAliquota(diasCorridos);
  const ir = baseIr * aliquotaIr;

  const rendimentoLiquido = baseIr - ir;
  const valorFinal = valorInvestido + rendimentoLiquido;

  const taxaContratadaAnual = (Math.pow(1 + taxaDiariaContratada, DIAS_UTEIS_ANO) - 1) * 100;
  const rentabilidadeLiquidaPercentual = (rendimentoLiquido / valorInvestido) * 100;

  return {
    valorInvestido,
    diasCorridos,
    diasUteis,
    taxaCdiAnual,
    percentualCdi,
    taxaContratadaAnual: arredondar(taxaContratadaAnual, 4),
    rendimentoBruto: arredondar(rendimentoBruto, 2),
    iof: arredondar(iof, 2),
    baseIr: arredondar(baseIr, 2),
    aliquotaIr,
    ir: arredondar(ir, 2),
    rendimentoLiquido: arredondar(rendimentoLiquido, 2),
    valorFinal: arredondar(valorFinal, 2),
    rentabilidadeLiquidaPercentual: arredondar(rentabilidadeLiquidaPercentual, 4),
  };
}