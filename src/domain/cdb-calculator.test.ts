import { calcularCdb } from './cdb-calculator';

describe('calcularCdb', () => {
  it('deve retornar valor final maior que investido em cenário padrão', () => {
    const r = calcularCdb({
      valorInvestido: 10000,
      percentualCdi: 100,
      taxaCdiAnual: 14.4,
      diasCorridos: 365,
      diasUteis: 252,
    });

    expect(r.valorFinal).toBeGreaterThan(10000);
    expect(r.rendimentoBruto).toBeGreaterThan(0);
    expect(r.rendimentoLiquido).toBeGreaterThan(0);
  });

  it('deve aplicar IOF em prazo curto', () => {
    const r = calcularCdb({
      valorInvestido: 10000,
      percentualCdi: 100,
      taxaCdiAnual: 14.4,
      diasCorridos: 10,
      diasUteis: 7,
    });

    expect(r.iof).toBeGreaterThan(0);
  });

  it('deve ter aliquota de IR menor para prazos longos', () => {
    const curto = calcularCdb({
      valorInvestido: 10000,
      percentualCdi: 100,
      taxaCdiAnual: 14.4,
      diasCorridos: 180,
      diasUteis: 126,
    });

    const longo = calcularCdb({
      valorInvestido: 10000,
      percentualCdi: 100,
      taxaCdiAnual: 14.4,
      diasCorridos: 800,
      diasUteis: 560,
    });

    expect(longo.aliquotaIr).toBeLessThan(curto.aliquotaIr);
  });
});