/**
 * Traduções em Português (Brasil).
 * Cada chave deve ter equivalente em en-US.ts.
 */

export const ptBR = {
  common: {
    appName: 'CalculaDI',
    loading: 'Carregando...',
    error: 'Algo deu errado',
    retry: 'Tentar de novo',
    back: 'Voltar',
    refresh: 'Atualizar',
    lastUpdate: 'Última atualização',
  },

  navigation: {
    indices: 'Índices',
    calculator: 'Calculadora',
    about: 'Sobre',
  },

  indices: {
    title: 'Taxas hoje',
    subtitle: 'Dados oficiais do Banco Central ',
    ipca: 'IPCA',
    igpm: 'IGP-M',
    selic: 'SELIC META',
    cdi: 'CDI',
    accumulated12m: '12 meses',
    yearly: 'ao ano',
    dailyEquivalent: 'equivalente diária',
    dailyRate: 'taxa diária',
    simulateCdb: 'Calcular meu título',
    sourceLive: 'Atualizado agora',
    sourceCache: 'Dados em cache',
    sourcePartial: 'Dados parciais',
  },

  calculator: {
    title: 'Simular um Título',
    label: 'CALCULADORA',
    amount: 'Quanto vai investir?',
    rate: 'Rentabilidade',
    rateHint: '{{percent}}% do CDI · {{annual}}% a.a. estimado',
    customRate: 'Outro',
    duration: 'Por quanto tempo?',
    days: 'Dias',
    months: 'Meses',
    years: 'Anos',
    durationHint: '{{value}} {{unit}} · {{calendarDays}} dias corridos',
    youWillReceive: 'VOCÊ RECEBERÁ',
    grossYield: 'Rendimento bruto',
    iof: 'IOF',
    incomeTax: 'IR ({{rate}}%)',
    netYield: 'Rendimento líquido',
    showCalculation: 'Ver memorial de cálculo',
  },

  about: {
    title: 'Sobre o CalculaDI',
    dataSource: 'De onde vêm os dados?',
    glossary: 'Glossário',
    github: 'Código no GitHub',
    linkedin: 'Conecte-se no LinkedIn',
  },
} as const;