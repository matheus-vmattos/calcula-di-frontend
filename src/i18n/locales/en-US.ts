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
    title: 'Market overview',
    subtitle: 'Official data from Brazil Central Bank · 12h cache',
    ipca: 'IPCA',
    igpm: 'IGP-M',
    selic: 'SELIC',
    cdi: 'CDI',
    accumulated12m: '12 months',
    yearly: 'per year',
    dailyEquivalent: 'daily equivalent',
    dailyRate: 'daily rate',
    simulateCdb: 'Simulate a CDB',
    sourceLive: 'Updated now',
    sourceCache: 'Cached data',
    sourcePartial: 'Partial data',
  },

  calculator: {
    title: 'Simulate a CDB',
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

  about: {
    title: 'About CalculaDI',
    dataSource: 'Where does the data come from?',
    glossary: 'Glossary',
    github: 'Code on GitHub',
    linkedin: 'Connect on LinkedIn',
  },
} as const;