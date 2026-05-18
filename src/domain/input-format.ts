export function maskMoneyBR(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';

  const cents = Number(digits);
  const value = cents / 100;

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function maskPercentBR(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 6);
  if (!digits) return '';

  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function parseMoneyBRToNumber(masked: string): number {
  const normalized = masked.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) throw new Error('Valor inválido');
  return n;
}

export function parsePercentBRToNumber(masked: string): number {
  const normalized = masked.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(normalized);
  if (!Number.isFinite(n)) throw new Error('Percentual inválido');
  return n;
}