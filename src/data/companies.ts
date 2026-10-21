// ILLUSTRATIVE DATA — fictional companies with plausible shapes, so the pattern can be shown
// without NDA material. To use real public data, replace these with figures from annual
// reports (revenue, EBIT, invested capital, tax rate, share price, dividends per share)
// and set `illustrative: false`.
export type Year = {
  year: number;
  revenue: number;        // €m
  ebit: number;           // €m
  investedCapital: number; // €m, year end
  taxRate: number;        // 0–1
  priceEnd: number;       // € per share, year end
  dividend: number;       // € per share paid in year
};

export type Company = { id: string; name: string; sector: string; priceStart: number; years: Year[] };

export const DATASET = { illustrative: true, wacc: 0.08, currency: '€m' };

export const COMPANIES: Company[] = [
  {
    id: 'northwind',
    name: 'Northwind Payments',
    sector: 'Payments infrastructure',
    priceStart: 40,
    years: [
      { year: 2020, revenue: 820, ebit: 74, investedCapital: 610, taxRate: 0.24, priceEnd: 46, dividend: 0.4 },
      { year: 2021, revenue: 1010, ebit: 111, investedCapital: 690, taxRate: 0.24, priceEnd: 61, dividend: 0.5 },
      { year: 2022, revenue: 1190, ebit: 155, investedCapital: 760, taxRate: 0.25, priceEnd: 52, dividend: 0.6 },
      { year: 2023, revenue: 1360, ebit: 204, investedCapital: 820, taxRate: 0.25, priceEnd: 70, dividend: 0.8 },
      { year: 2024, revenue: 1520, ebit: 243, investedCapital: 870, taxRate: 0.25, priceEnd: 84, dividend: 1.0 },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour Retail Group',
    sector: 'Retail',
    priceStart: 22,
    years: [
      { year: 2020, revenue: 4100, ebit: 205, investedCapital: 3300, taxRate: 0.27, priceEnd: 19, dividend: 0.9 },
      { year: 2021, revenue: 4350, ebit: 239, investedCapital: 3420, taxRate: 0.27, priceEnd: 23, dividend: 0.9 },
      { year: 2022, revenue: 4480, ebit: 197, investedCapital: 3610, taxRate: 0.27, priceEnd: 17, dividend: 0.9 },
      { year: 2023, revenue: 4520, ebit: 172, investedCapital: 3700, taxRate: 0.26, priceEnd: 16, dividend: 0.7 },
      { year: 2024, revenue: 4610, ebit: 184, investedCapital: 3720, taxRate: 0.26, priceEnd: 18, dividend: 0.7 },
    ],
  },
  {
    id: 'meridian',
    name: 'Meridian Industrial',
    sector: 'Industrial machinery',
    priceStart: 55,
    years: [
      { year: 2020, revenue: 2300, ebit: 207, investedCapital: 2050, taxRate: 0.23, priceEnd: 51, dividend: 1.6 },
      { year: 2021, revenue: 2480, ebit: 248, investedCapital: 2180, taxRate: 0.23, priceEnd: 58, dividend: 1.7 },
      { year: 2022, revenue: 2760, ebit: 290, investedCapital: 2520, taxRate: 0.24, priceEnd: 54, dividend: 1.8 },
      { year: 2023, revenue: 2890, ebit: 289, investedCapital: 2900, taxRate: 0.24, priceEnd: 57, dividend: 1.8 },
      { year: 2024, revenue: 2950, ebit: 280, investedCapital: 3150, taxRate: 0.24, priceEnd: 55, dividend: 1.8 },
    ],
  },
];

export type Metrics = {
  year: number;
  revenue: number;
  growth: number | null;
  margin: number;
  nopat: number;
  roic: number | null;
  spread: number | null;
  tsr: number;
};

/** Derive the metrics an analyst would compute. ROIC uses average invested capital, so the first year has none. */
export function computeMetrics(c: Company): Metrics[] {
  return c.years.map((y, i) => {
    const prev = c.years[i - 1];
    const nopat = y.ebit * (1 - y.taxRate);
    const roic = prev ? nopat / ((prev.investedCapital + y.investedCapital) / 2) : null;
    const startPrice = prev ? prev.priceEnd : c.priceStart;
    return {
      year: y.year,
      revenue: y.revenue,
      growth: prev ? y.revenue / prev.revenue - 1 : null,
      margin: y.ebit / y.revenue,
      nopat,
      roic,
      spread: roic === null ? null : roic - DATASET.wacc,
      tsr: (y.priceEnd - startPrice + y.dividend) / startPrice,
    };
  });
}

export function cagr(first: number, last: number, years: number) {
  return Math.pow(last / first, 1 / years) - 1;
}

export function cumulativeTSR(c: Company) {
  let reinvested = 1;
  for (const m of computeMetrics(c)) reinvested *= 1 + m.tsr;
  return reinvested - 1;
}

export const pct = (v: number | null, digits = 1) => (v === null ? '—' : `${(v * 100).toFixed(digits)}%`);
export const num = (v: number) => v.toLocaleString('en-GB', { maximumFractionDigits: 0 });
