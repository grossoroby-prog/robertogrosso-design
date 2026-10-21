import { useEffect, useMemo, useState } from 'react';
import { AIUsage, Label, PageHeader } from '../components/ui';
import { Confidence, GeneratedBy, StreamingAnswer, UnknownNotice } from '../components/ai';
import { COMPANIES, DATASET, computeMetrics, num, pct, type Metrics } from '../data/companies';
import { explain, type StepId } from './explain';
import BarChart from './BarChart';

type MetricKey = 'revenue' | 'growth' | 'margin' | 'nopat' | 'roic' | 'spread' | 'tsr';

const STEPS: { id: StepId; question: string; metric: MetricKey; ref?: boolean }[] = [
  { id: 'growth', question: 'Is it growing?', metric: 'revenue' },
  { id: 'margin', question: 'Is growth turning into profit?', metric: 'margin' },
  { id: 'roic', question: 'Does it earn more than its capital costs?', metric: 'roic', ref: true },
  { id: 'tsr', question: 'Have shareholders been rewarded?', metric: 'tsr' },
  { id: 'verdict', question: 'So — is it creating value?', metric: 'spread' },
];

const ROWS: { key: MetricKey; label: string; fmt: (m: Metrics) => string; formula: string }[] = [
  { key: 'revenue', label: `Revenue (${DATASET.currency})`, fmt: (m) => num(m.revenue), formula: 'Reported' },
  { key: 'growth', label: 'Revenue growth', fmt: (m) => pct(m.growth), formula: 'Revenue ÷ prior revenue − 1' },
  { key: 'margin', label: 'EBIT margin', fmt: (m) => pct(m.margin), formula: 'EBIT ÷ revenue' },
  { key: 'nopat', label: `NOPAT (${DATASET.currency})`, fmt: (m) => num(m.nopat), formula: 'EBIT × (1 − tax rate)' },
  { key: 'roic', label: 'ROIC', fmt: (m) => pct(m.roic), formula: 'NOPAT ÷ average invested capital' },
  { key: 'spread', label: 'Spread vs WACC', fmt: (m) => pct(m.spread), formula: `ROIC − ${pct(DATASET.wacc, 0)} assumed WACC` },
  { key: 'tsr', label: 'TSR', fmt: (m) => pct(m.tsr), formula: '(Price change + dividend) ÷ start price' },
];

export default function ValueExplorer() {
  const [companyId, setCompanyId] = useState(COMPANIES[0].id);
  const [stepIdx, setStepIdx] = useState(0);
  const [explainOpen, setExplainOpen] = useState(false);
  const [analystOpen, setAnalystOpen] = useState(false);
  const [cite, setCite] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<number | null>(null);
  const [streamDone, setStreamDone] = useState(false);

  const company = COMPANIES.find((c) => c.id === companyId)!;
  const step = STEPS[stepIdx];
  const metrics = useMemo(() => computeMetrics(company), [company]);
  const explanation = useMemo(() => explain(company, step.id), [company, step.id]);

  // Reset the conversation whenever the context changes.
  useEffect(() => { setCite(null); setFollowUp(null); setStreamDone(false); }, [companyId, stepIdx]);

  const onCite = (id: string) => {
    setCite(id);
    setAnalystOpen(true);
    requestAnimationFrame(() => document.getElementById(`cell-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };

  const fmtFor = (k: MetricKey) => (v: number) => (k === 'revenue' || k === 'nopat' ? num(v) : pct(v));
  const bars = metrics.map((m) => ({ label: String(m.year), value: m[step.metric] as number | null, id: `${step.metric}-${m.year}` }));
  const fullText = explanation.segments.map((s) => s.text).join('').replace(/\s+([.,):])/g, '$1');
  const headline = (fullText.match(/^.*?[.:](\s|$)/)?.[0] ?? fullText).replace(/:\s*$/, '.');

  return (
    <>
      <PageHeader kicker="Lab 01 · The MVI pattern, on open data" title="Guided value explorer.">
        At McKinsey, partners found our analytics platform too dense. My answer was a guided view: a few questions, in order,
        with the full analysis one click away. This is that pattern, rebuilt from scratch so you can try it.
      </PageHeader>

      <section className="container stack gap-6" style={{ paddingBottom: 'var(--space-9)' }}>
        {DATASET.illustrative && (
          <p className="notice"><strong>Illustrative data.</strong> These are fictional companies with realistic shapes. The pattern and the maths are real; swap in figures from any annual report.</p>
        )}

        <div className="stack gap-3">
          <span className="label" id="co-label">Company</span>
          <div className="row gap-2" role="group" aria-labelledby="co-label">
            {COMPANIES.map((c) => (
              <button key={c.id} type="button" className="pill" aria-pressed={c.id === companyId} onClick={() => setCompanyId(c.id)}>
                {c.name} <span className="muted" style={{ color: 'inherit', opacity: 0.7 }}>· {c.sector}</span>
              </button>
            ))}
          </div>
        </div>

        <nav aria-label="Guided steps">
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button type="button" className="step-btn" aria-current={i === stepIdx ? 'step' : undefined} onClick={() => setStepIdx(i)}>
                  <span className="step-btn__n">{String(i + 1).padStart(2, '0')}</span>{s.question}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
          <div className="panel panel--strong" style={{ gap: 'var(--space-5)' }}>
            <div className="stack gap-2">
              <Label>Step {stepIdx + 1} of {STEPS.length} · {company.name}</Label>
              <h2 className="h3" style={{ fontSize: 28 }}>{step.question}</h2>
              <p className="body">{headline.trim()}</p>
            </div>
            <BarChart
              title={`${ROWS.find((r) => r.key === step.metric)!.label}, ${company.name}`}
              bars={bars}
              format={fmtFor(step.metric)}
              highlight={cite}
              reference={step.ref ? { value: DATASET.wacc, label: `WACC ${pct(DATASET.wacc, 0)} (assumed)` } : undefined}
            />
            <div className="row gap-3" style={{ justifyContent: 'space-between' }}>
              <div className="row gap-3">
                <button type="button" className="btn btn--primary btn--small" aria-expanded={explainOpen} onClick={() => setExplainOpen((o) => !o)}>
                  {explainOpen ? 'Hide explanation' : 'Explain this'}
                </button>
                <button type="button" className="btn btn--secondary btn--small" aria-expanded={analystOpen} aria-controls="analyst" onClick={() => setAnalystOpen((o) => !o)}>
                  {analystOpen ? 'Hide analyst view' : 'Show analyst view'}
                </button>
              </div>
              <div className="row gap-2">
                <button type="button" className="btn btn--secondary btn--small" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>← Back</button>
                <button type="button" className="btn btn--secondary btn--small" disabled={stepIdx === STEPS.length - 1} onClick={() => setStepIdx((i) => i + 1)}>Next →</button>
              </div>
            </div>
          </div>

          <aside className="panel" aria-label="Explanation" style={{ minHeight: 200 }}>
            {!explainOpen ? (
              <div className="stack gap-3">
                <Label>Explain this</Label>
                <p className="body">Ask for a plain-language read of this step. Every claim links to the number it came from, and it says when it can’t answer.</p>
              </div>
            ) : (
              <>
                <Label>Explanation · {step.question}</Label>
                <StreamingAnswer key={`${companyId}-${step.id}`} segments={explanation.segments} onCite={onCite} activeCite={cite} onDone={() => setStreamDone(true)} />
                {streamDone && (
                  <>
                    <Confidence {...explanation.confidence} />
                    <div className="stack gap-2">
                      <span className="label">Ask a follow-up</span>
                      <div className="row gap-2">
                        {explanation.followUps.map((f, i) => (
                          <button key={f.q} type="button" className="pill" aria-pressed={followUp === i} onClick={() => setFollowUp(i)}>{f.q}</button>
                        ))}
                      </div>
                    </div>
                    {followUp !== null && (() => {
                      const f = explanation.followUps[followUp];
                      return f.unknown
                        ? <UnknownNotice>{f.answer.map((s) => s.text).join('')}</UnknownNotice>
                        : <StreamingAnswer key={`${companyId}-${step.id}-${followUp}`} segments={f.answer} onCite={onCite} activeCite={cite} />;
                    })()}
                    <GeneratedBy>Written from the numbers on screen by a deterministic template · swap in a model via src/lab/explain.ts</GeneratedBy>
                  </>
                )}
              </>
            )}
          </aside>
        </div>

        {analystOpen && (
          <section id="analyst" className="stack gap-4" aria-label="Analyst view">
            <div className="section-head"><h2 className="h3">Analyst view</h2><span className="label">{company.name} · {DATASET.currency}</span></div>
            <div className="table-wrap">
              <table>
                <caption className="sr-only">All metrics for {company.name}, by year</caption>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    {metrics.map((m) => <th scope="col" key={m.year} className="num">{m.year}</th>)}
                    <th scope="col">How it’s calculated</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.key} style={r.key === step.metric ? { background: 'var(--color-bg-page)' } : undefined}>
                      <th scope="row" style={{ fontFamily: 'inherit', fontSize: 'inherit', textTransform: 'none', letterSpacing: 0, color: 'var(--color-fg-default)', fontWeight: 600 }}>{r.label}</th>
                      {metrics.map((m) => {
                        const id = `${r.key}-${m.year}`;
                        return <td key={id} id={`cell-${id}`} className={`num${cite === id ? ' highlight' : ''}`}>{r.fmt(m)}</td>;
                      })}
                      <td className="muted">{r.formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{ paddingTop: 'var(--space-7)' }}>
          <AIUsage
            ai="Wrote the first version of the explorer, the metric maths and the chart component in Claude Code, from my brief."
            me="The five questions and their order, what a partner sees first, citations on every claim, and the cases where it must refuse to answer."
            cut="A free-text chat box. It invited questions the data can’t answer, which is exactly what partners didn’t trust."
          />
        </div>
      </section>
    </>
  );
}
