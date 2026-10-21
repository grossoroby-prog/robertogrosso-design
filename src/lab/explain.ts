// The "explain this" layer.
//
// Today this is deterministic: explanations are written from the numbers on screen, and every
// claim carries a citation to the cell it came from. That makes it honest to demo without a model.
// To use a live model, replace `explain()` with a call to your own endpoint that receives the
// same metrics and must return the same shape — segments with citations — so the UI is unchanged.
import { DATASET, cagr, cumulativeTSR, computeMetrics, pct, num, type Company, type Metrics } from '../data/companies';

export type StepId = 'growth' | 'margin' | 'roic' | 'tsr' | 'verdict';
export type Segment = { text: string; cite?: string };
export type Explanation = {
  segments: Segment[];
  confidence: { level: 1 | 2 | 3; reason: string };
  followUps: { q: string; unknown?: boolean; answer: Segment[] }[];
};

const cell = (metric: string, year: number) => `${metric}-${year}`;
const t = (text: string, cite?: string): Segment => ({ text, cite });

const extreme = (ms: Metrics[], key: keyof Metrics, dir: 'max' | 'min') =>
  ms.filter((m) => m[key] !== null).reduce((a, b) => ((dir === 'max' ? (b[key] as number) > (a[key] as number) : (b[key] as number) < (a[key] as number)) ? b : a));

const WHY_UNKNOWN = (what: string): Segment[] => [
  t(`I can’t answer that from this data. It holds totals only — no ${what} — so any reason I gave would be a guess. An analyst would check the annual report’s segment notes.`),
];

export function explain(c: Company, step: StepId): Explanation {
  const ms = computeMetrics(c);
  const first = ms[0];
  const last = ms[ms.length - 1];
  const withGrowth = ms.filter((m) => m.growth !== null);

  switch (step) {
    case 'growth': {
      const g = cagr(first.revenue, last.revenue, ms.length - 1);
      const early = withGrowth[0];
      const slowing = (last.growth ?? 0) < (early.growth ?? 0);
      const allUp = withGrowth.every((m) => (m.growth ?? 0) > 0);
      return {
        segments: [
          t(`Revenue went from ${DATASET.currency.replace('m', '')}${num(first.revenue)}m `), t('', cell('revenue', first.year)),
          t(` to ${DATASET.currency.replace('m', '')}${num(last.revenue)}m `), t('', cell('revenue', last.year)),
          t(`, a compound growth rate of ${pct(g)} a year. `),
          t(`Growth ${slowing ? 'slowed' : 'picked up'}, from ${pct(early.growth)} in ${early.year} `), t('', cell('growth', early.year)),
          t(` to ${pct(last.growth)} in ${last.year}`), t('', cell('growth', last.year)), t('.'),
        ],
        confidence: allUp
          ? { level: 3, reason: 'Revenue rose every year; the trend is unambiguous.' }
          : { level: 2, reason: 'Growth changed direction at least once, so the average hides real swings.' },
        followUps: [
          { q: 'Which year grew fastest?', answer: (() => { const b = extreme(ms, 'growth', 'max'); return [t(`${b.year}, at ${pct(b.growth)}`), t('', cell('growth', b.year)), t('.')]; })() },
          { q: 'Why did growth slow?', unknown: true, answer: WHY_UNKNOWN('product, region or customer breakdown') },
        ],
      };
    }
    case 'margin': {
      const peak = extreme(ms, 'margin', 'max');
      const up = last.margin > first.margin;
      return {
        segments: [
          t(`EBIT margin ${up ? 'expanded' : 'compressed'} from ${pct(first.margin)} `), t('', cell('margin', first.year)),
          t(` to ${pct(last.margin)} `), t('', cell('margin', last.year)),
          t(`. It peaked in ${peak.year} at ${pct(peak.margin)}`), t('', cell('margin', peak.year)),
          t(up ? ', so the business is getting more profitable as it grows.' : ', so revenue growth has not turned into operating leverage.'),
        ],
        confidence: { level: 2, reason: 'Margin is reported EBIT; one-off items could move it and are not separated here.' },
        followUps: [
          { q: 'How much profit did that add?', answer: [t(`EBIT moved by ${DATASET.currency.replace('m', '')}${num(last.margin * last.revenue - first.margin * first.revenue)}m over the period.`)] },
          { q: 'Was it pricing or cost cuts?', unknown: true, answer: WHY_UNKNOWN('cost lines or pricing data') },
        ],
      };
    }
    case 'roic': {
      const rs = ms.filter((m) => m.roic !== null);
      const avg = rs.reduce((s, m) => s + (m.roic ?? 0), 0) / rs.length;
      const positive = rs.filter((m) => (m.spread ?? 0) > 0).length;
      return {
        segments: [
          t(`Return on invested capital averaged ${pct(avg)}, against an assumed ${pct(DATASET.wacc, 0)} cost of capital. `),
          t(`It beat that hurdle in ${positive} of ${rs.length} years. `),
          t(`In ${last.year} ROIC was ${pct(last.roic)}`), t('', cell('roic', last.year)),
          t(`, a spread of ${pct(last.spread)}`), t('', cell('spread', last.year)),
          t((last.spread ?? 0) > 0 ? ': each euro invested is creating value.' : ': new capital is earning less than it costs.'),
        ],
        confidence: positive === 0 || positive === rs.length
          ? { level: 3, reason: 'The spread kept the same sign every year.' }
          : { level: 1, reason: 'The spread flips sign, and the cost of capital is an assumption — small changes would change the verdict.' },
        followUps: [
          { q: 'What if cost of capital is 10%?', answer: [t(`Then ${rs.filter((m) => (m.roic ?? 0) > 0.1).length} of ${rs.length} years would clear the hurdle; ${last.year} would show a spread of ${pct((last.roic ?? 0) - 0.1)}.`)] },
          { q: 'Is management allocating capital well?', unknown: true, answer: WHY_UNKNOWN('acquisition, capex or buyback detail') },
        ],
      };
    }
    case 'tsr': {
      const cum = cumulativeTSR(c);
      const best = extreme(ms, 'tsr', 'max');
      const worst = extreme(ms, 'tsr', 'min');
      return {
        segments: [
          t(`A shareholder who reinvested dividends earned ${pct(cum)} over five years. `),
          t(`The best year was ${best.year} (${pct(best.tsr)}`), t('', cell('tsr', best.year)),
          t(`) and the worst ${worst.year} (${pct(worst.tsr)}`), t('', cell('tsr', worst.year)), t(').'),
        ],
        confidence: { level: 2, reason: 'TSR depends on start and end dates; a different window could tell a different story.' },
        followUps: [
          { q: 'Did returns track ROIC?', answer: [t(`ROIC in ${last.year} was ${pct(last.roic)}`), t('', cell('roic', last.year)), t(` and TSR ${pct(last.tsr)}`), t('', cell('tsr', last.year)), t('. Over five years, markets usually follow returns on capital, but not year by year.')] },
          { q: 'What will the share price do next?', unknown: true, answer: [t('I won’t forecast that. Nothing in this data predicts future prices, and a confident-sounding guess would be worse than none.')] },
        ],
      };
    }
    case 'verdict': {
      const g = cagr(first.revenue, last.revenue, ms.length - 1);
      const creating = (last.spread ?? 0) > 0;
      return {
        segments: [
          t(`${c.name} is ${g > 0.08 ? 'growing fast' : g > 0.02 ? 'growing modestly' : 'barely growing'} (${pct(g)} a year)`),
          t(` and ${creating ? 'earning more than its cost of capital' : 'earning less than its cost of capital'}`), t('', cell('spread', last.year)),
          t(creating ? '. Growth like this creates value.' : '. More growth on these returns would destroy value, so the first question is how to lift ROIC.'),
        ],
        confidence: { level: 2, reason: 'A two-signal summary. Useful for orientation, not a substitute for the analyst view.' },
        followUps: [
          { q: 'What should I look at next?', answer: [t(creating ? 'Whether returns hold as capital grows: compare invested capital growth with NOPAT growth in the analyst view.' : 'Where margin went: the margin step shows when profitability started to slip.')] },
        ],
      };
    }
  }
}
