import { getIofAliquota } from './iof-table';
import { getIrAliquota } from './ir-table';

const DIAS_UTEIS_ANO = 252;

export interface PrefixadoMtmInput {
  valorInvestido: number;
  taxaContratadaAnual: number;
  taxaMercadoAnual: number;
  dataCompra: string; // YYYY-MM-DD
  dataHoje: string; // YYYY-MM-DD
  dataVencimento: string; // YYYY-MM-DD
  margemSegurancaPp?: number; // default 0.5
}

export interface PrefixadoMtmResult {
  valorNoVencimento: number;
  valorCurvaContratadaHoje: number;
  valorMercadoHoje: number;
  diferencaMtmVsCurvaHoje: number;
  diferencaMtmVsCurvaHojePercentual: number;
  valorMercadoConservador: number;
  valorMercadoOtimista: number;

  // novos campos líquidos
  ganhoBrutoNaVenda: number;
  iof: number;
  baseIr: number;
  aliquotaIr: number;
  ir: number;
  valorLiquidoEstimado: number;
  ganhoLiquidoEstimado: number;

  diasCorridosDecorridos: number;
  diasUteisTotais: number;
  diasUteisDecorridos: number;
  diasUteisRestantes: number;
}

function arredondar(v: number, c: number): number {
  const f = Math.pow(10, c);
  return Math.round(v * f) / f;
}

function validarInput(i: PrefixadoMtmInput): void {
  if (!Number.isFinite(i.valorInvestido) || i.valorInvestido <= 0) throw new Error('valorInvestido inválido');
  if (!Number.isFinite(i.taxaContratadaAnual)) throw new Error('taxaContratadaAnual inválida');
  if (!Number.isFinite(i.taxaMercadoAnual)) throw new Error('taxaMercadoAnual inválida');
}

function toDate(iso: string): Date {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`Data inválida: ${iso}`);
  return d;
}

function diasCorridos(inicio: Date, fim: Date): number {
  const ms = fim.getTime() - inicio.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function diasUteisAproximados(inicio: Date, fim: Date): number {
  const dc = diasCorridos(inicio, fim);
  return Math.max(0, Math.round((dc * 5) / 7));
}

function fatorAcumuladoAnualParaDiasUteis(taxaAnualPct: number, diasUteis: number): number {
  const taxaDiaria = Math.pow(1 + taxaAnualPct / 100, 1 / DIAS_UTEIS_ANO) - 1;
  return Math.pow(1 + taxaDiaria, diasUteis);
}

export function calcularPrefixadoMtm(input: PrefixadoMtmInput): PrefixadoMtmResult {
  validarInput(input);

  const margem = input.margemSegurancaPp ?? 0.5;

  const compra = toDate(input.dataCompra);
  const hoje = toDate(input.dataHoje);
  const venc = toDate(input.dataVencimento);

  if (venc <= compra) throw new Error('Vencimento deve ser após compra');
  if (hoje < compra) throw new Error('Data de hoje não pode ser antes da compra');

  const diasCorridosDecorridos = diasCorridos(compra, hoje);

  const diasUteisTotais = Math.max(1, diasUteisAproximados(compra, venc));
  const diasUteisDecorridos = Math.min(diasUteisTotais, diasUteisAproximados(compra, hoje));
  const diasUteisRestantes = Math.max(0, diasUteisTotais - diasUteisDecorridos);

  const fatorContratoTotal = fatorAcumuladoAnualParaDiasUteis(input.taxaContratadaAnual, diasUteisTotais);
  const valorNoVencimento = input.valorInvestido * fatorContratoTotal;

  const fatorContratoHoje = fatorAcumuladoAnualParaDiasUteis(input.taxaContratadaAnual, diasUteisDecorridos);
  const valorCurvaContratadaHoje = input.valorInvestido * fatorContratoHoje;

  const fatorDescontoMercado = fatorAcumuladoAnualParaDiasUteis(input.taxaMercadoAnual, diasUteisRestantes);
  const valorMercadoHoje = valorNoVencimento / fatorDescontoMercado;

  const taxaConservadora = input.taxaMercadoAnual + margem;
  const taxaOtimista = input.taxaMercadoAnual - margem;

  const fatorDescConservador = fatorAcumuladoAnualParaDiasUteis(taxaConservadora, diasUteisRestantes);
  const fatorDescOtimista = fatorAcumuladoAnualParaDiasUteis(taxaOtimista, diasUteisRestantes);

  const valorMercadoConservador = valorNoVencimento / fatorDescConservador;
  const valorMercadoOtimista = valorNoVencimento / fatorDescOtimista;

  const diferenca = valorMercadoHoje - valorCurvaContratadaHoje;
  const diferencaPct = (diferenca / valorCurvaContratadaHoje) * 100;

  // líquido estimado na venda antecipada
  const ganhoBrutoNaVenda = Math.max(0, valorMercadoHoje - input.valorInvestido);
  const aliquotaIof = getIofAliquota(diasCorridosDecorridos);
  const iof = ganhoBrutoNaVenda * aliquotaIof;

  const baseIr = Math.max(0, ganhoBrutoNaVenda - iof);
  const aliquotaIr = getIrAliquota(diasCorridosDecorridos);
  const ir = baseIr * aliquotaIr;

  const ganhoLiquidoEstimado = ganhoBrutoNaVenda - iof - ir;
  const valorLiquidoEstimado = input.valorInvestido + ganhoLiquidoEstimado;

  return {
    valorNoVencimento: arredondar(valorNoVencimento, 2),
    valorCurvaContratadaHoje: arredondar(valorCurvaContratadaHoje, 2),
    valorMercadoHoje: arredondar(valorMercadoHoje, 2),
    diferencaMtmVsCurvaHoje: arredondar(diferenca, 2),
    diferencaMtmVsCurvaHojePercentual: arredondar(diferencaPct, 4),
    valorMercadoConservador: arredondar(valorMercadoConservador, 2),
    valorMercadoOtimista: arredondar(valorMercadoOtimista, 2),

    ganhoBrutoNaVenda: arredondar(ganhoBrutoNaVenda, 2),
    iof: arredondar(iof, 2),
    baseIr: arredondar(baseIr, 2),
    aliquotaIr,
    ir: arredondar(ir, 2),
    valorLiquidoEstimado: arredondar(valorLiquidoEstimado, 2),
    ganhoLiquidoEstimado: arredondar(ganhoLiquidoEstimado, 2),

    diasCorridosDecorridos,
    diasUteisTotais,
    diasUteisDecorridos,
    diasUteisRestantes,
  };
}