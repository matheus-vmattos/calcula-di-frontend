import { calcularPrefixadoMtm } from './prefixado-mtm';

describe('calcularPrefixadoMtm', () => {
  const baseInput = {
    valorInvestido: 10000,
    taxaContratadaAnual: 15,
    dataCompra: '2025-01-02',
    dataHoje: '2026-01-02',
    dataVencimento: '2027-01-02',
  };

  it('quando taxa de mercado sobe, valor MTM deve cair', () => {
    const taxaBaixa = calcularPrefixadoMtm({
      ...baseInput,
      taxaMercadoAnual: 12,
    });

    const taxaAlta = calcularPrefixadoMtm({
      ...baseInput,
      taxaMercadoAnual: 16,
    });

    expect(taxaAlta.valorMercadoHoje).toBeLessThan(taxaBaixa.valorMercadoHoje);
  });

  it('valor líquido estimado deve ser <= valor de mercado hoje', () => {
    const r = calcularPrefixadoMtm({
      ...baseInput,
      taxaMercadoAnual: 14,
    });

    expect(r.valorLiquidoEstimado).toBeLessThanOrEqual(r.valorMercadoHoje);
  });

  it('faixa otimista deve ser >= conservadora', () => {
    const r = calcularPrefixadoMtm({
      ...baseInput,
      taxaMercadoAnual: 14,
      margemSegurancaPp: 0.5,
    });

    expect(r.valorMercadoOtimista).toBeGreaterThanOrEqual(r.valorMercadoConservador);
  });
});