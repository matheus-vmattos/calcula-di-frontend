/**
 * English (US) translations.
 * Every key must have an equivalent in pt-BR.ts.
 */

export const enUS = {
  common: {
    appName: 'CalculaDI',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try again',
    back: 'Back',
    refresh: 'Refresh',
    lastUpdate: 'Last updated',
  },

  navigation: {
    indices: 'Indices',
    calculator: 'Calculator',
    about: 'About',
  },

  indices: {
    title: "Today's rates",
    subtitle: 'Official data from Brazil Central Bank ',
    ipca: 'IPCA',
    igpm: 'IGP-M',
    selic: 'SELIC',
    cdi: 'CDI',
    accumulated12m: '12 months',
    yearly: 'per year',
    dailyEquivalent: 'daily equivalent',
    dailyRate: 'daily rate',
    simulateCdb: 'Calculate yield',
    sourceLive: 'Updated now',
    sourceCache: 'Cached data',
    sourcePartial: 'Partial data',
  },

  calculator: {
    title: 'Simulate Bond',
    label: 'CALCULATOR',
    amount: 'How much will you invest?',
    rate: 'Yield rate',
    rateHint: '{{percent}}% of CDI · {{annual}}% p.a. estimated',
    customRate: 'Other',
    duration: 'For how long?',
    days: 'Days',
    months: 'Months',
    years: 'Years',
    durationHint: '{{value}} {{unit}} · {{calendarDays}} calendar days',
    youWillReceive: 'YOU WILL RECEIVE',
    grossYield: 'Gross yield',
    iof: 'IOF',
    incomeTax: 'Income tax ({{rate}}%)',
    netYield: 'Net yield',
    showCalculation: 'Show calculation details',
  },

  mtm: {
    title: 'Fixed-rate (MTM)',
    subtitle: 'Simulate early sale with mark-to-market pricing.',
    investAmount: 'Invested amount (R$)',
    contractedRate: 'Contracted rate (% p.a.)',
    marketRateRef: 'Market rate reference',
    marketRateUsed: 'Market rate used (% p.a.)',
    purchaseDate: 'Purchase date',
    maturityDate: 'Maturity date',
    sellTodayEstimated: 'Estimated sale value today',
    versusCurveToday: 'Comparison against contracted curve today',
    aboveCurve: 'Above curve',
    belowCurve: 'Below curve',
    estimatedNetSaleValue: 'Estimated net sale value',
    grossGain: 'Gross gain',
    estimatedIof: 'Estimated IOF',
    estimatedIncomeTax: 'Estimated income tax ({{rate}}%)',
    netGain: 'Net gain',
    educationalDisclaimer:
      'Educational estimate with business-day approximation and reference rate.',
    chartTitle: 'Estimated evolution',
    chartContractedCurve: 'Contracted curve',
    chartMtmToday: 'Sale today (MTM)',
    dateFormatHint: 'Date format: DD/MM/YYYY',
  },

  about: {
    title: 'About CalculaDI',
    dataSource: 'Where does the data come from?',
    glossary: 'Glossary',
    github: 'Code on GitHub',
    linkedin: 'Connect on LinkedIn',
  },
} as const;