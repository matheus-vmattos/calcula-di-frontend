/**
 * Formatadores de valores numéricos no padrão brasileiro.
 *
 * Todos os formatadores são puros (entrada → string) — sem efeitos colaterais,
 * sem locale do dispositivo. Funcionam igual em qualquer ambiente.
 *
 * IMPORTANTE: separamos a apresentação dos dados aqui pra não espalhar
 * `toLocaleString` por todas as telas. Se um dia precisarmos suportar
 * en-US, é só estender este módulo.
 */

const FORMATTER_PT_BR_2 = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const FORMATTER_PT_BR_4 = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const FORMATTER_MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

/**
 * Formata um número como percentual com 2 casas decimais.
 * Ex: 4.3917 → "4,39%"
 */
export function formatarPercentual(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return `${FORMATTER_PT_BR_2.format(valor)}%`;
}

/**
 * Formata um número como percentual com 4 casas decimais.
 * Útil para taxas diárias (CDI, equivalente Selic).
 * Ex: 0.0537 → "0,0537%"
 */
export function formatarPercentual4(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return `${FORMATTER_PT_BR_4.format(valor)}%`;
}

/**
 * Formata um número como moeda em reais.
 * Ex: 13282.40 → "R$ 13.282,40"
 */
export function formatarMoeda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return 'R$ —';
  return FORMATTER_MOEDA.format(valor);
}