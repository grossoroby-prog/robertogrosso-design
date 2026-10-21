import { useState, type ReactNode } from 'react';
import { Label, PageHeader } from '../components/ui';
import { Confidence, StreamingAnswer, UnknownNotice } from '../components/ai';
import type { Segment } from './explain';

function Pattern({ n, title, when, rule, children }: { n: string; title: string; when: string; rule: string; children: ReactNode }) {
  return (
    <section className="split" style={{ paddingBlock: 'var(--space-7)', borderTop: '1px solid var(--color-border-subtle)' }} aria-labelledby={`p-${n}`}>
      <div className="stack gap-4">
        <Label>Pattern {n}</Label>
        <h2 id={`p-${n}`} className="h3" style={{ fontSize: 30 }}>{title}</h2>
        <dl className="stack gap-4" style={{ margin: 0 }}>
          <div className="stack gap-1"><dt className="label">When</dt><dd className="body" style={{ margin: 0 }}>{when}</dd></div>
          <div className="stack gap-1"><dt className="label">Rule</dt><dd className="body" style={{ margin: 0 }}>{rule}</dd></div>
        </dl>
      </div>
      <div className="panel">{children}</div>
    </section>
  );
}

const STREAM: Segment[] = [
  { text: 'Tokens and components let a small team keep a large product consistent. The trick is keeping design and code reading from the same source, and checking that they still agree.' },
];

const SOURCES = [
  { id: 's1', title: 'Q3 board pack, p. 12', quote: 'Net revenue retention 118%' },
  { id: 's2', title: 'Customer interviews, #7', quote: '“We only open the dashboard before the board meeting.”' },
];
const CITED: Segment[] = [
  { text: 'Existing customers are expanding, with retention at 118% ' }, { text: '', cite: 's1' },
  { text: ', but usage clusters around reporting deadlines ' }, { text: '', cite: 's2' }, { text: '.' },
];

function StreamingDemo() {
  const [run, setRun] = useState(0);
  return (
    <>
      <StreamingAnswer key={run} segments={STREAM} speed={70} />
      <div><button type="button" className="btn btn--secondary btn--small" onClick={() => setRun((r) => r + 1)}>Replay</button></div>
    </>
  );
}

function CitationDemo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <StreamingAnswer segments={CITED} onCite={setActive} activeCite={active} speed={45} />
      <ol className="stack gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {SOURCES.map((s, i) => (
          <li key={s.id} className={`small${active === s.id ? ' highlight' : ''}`} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)' }}>
            <span className="label" style={{ marginRight: 8 }}>{i + 1}</span><strong>{s.title}</strong> — {s.quote}
          </li>
        ))}
      </ol>
    </>
  );
}

const CHANGES = [
  ['color/grey/100', 'color/neutral/100'],
  ['color/grey/500', 'color/neutral/500'],
  ['color/grey/900', 'color/neutral/900'],
];

function ApprovalDemo() {
  const [state, setState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selected, setSelected] = useState(() => new Set(CHANGES.map((c) => c[0])));
  const toggle = (k: string) => setSelected((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  if (state !== 'pending') {
    return (
      <div className="stack gap-3" role="status">
        <p><strong>{state === 'approved' ? `Renamed ${selected.size} token${selected.size === 1 ? '' : 's'}.` : 'Nothing changed.'}</strong> {state === 'approved' ? 'You can undo this for 30 seconds.' : 'The agent will not retry without asking.'}</p>
        <div><button type="button" className="btn btn--secondary btn--small" onClick={() => setState('pending')}>{state === 'approved' ? 'Undo' : 'Reset demo'}</button></div>
      </div>
    );
  }
  return (
    <>
      <p><span className="label" style={{ marginRight: 8 }}>Agent proposes</span>Rename deprecated <code>grey</code> tokens to <code>neutral</code>. Affects 3 tokens and 41 component references.</p>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="stack gap-2">
        <legend className="sr-only">Changes to apply</legend>
        {CHANGES.map(([from, to]) => (
          <label key={from} className="row gap-3 small" style={{ alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)', border: '1px solid var(--color-border-subtle)' }}>
            <input type="checkbox" checked={selected.has(from)} onChange={() => toggle(from)} style={{ width: 18, height: 18 }} />
            <code style={{ textDecoration: 'line-through', color: 'var(--color-fg-muted)' }}>{from}</code> → <code>{to}</code>
          </label>
        ))}
      </fieldset>
      <div className="row gap-2">
        <button type="button" className="btn btn--primary btn--small" disabled={selected.size === 0} onClick={() => setState('approved')}>Apply {selected.size} change{selected.size === 1 ? '' : 's'}</button>
        <button type="button" className="btn btn--secondary btn--small" onClick={() => setState('rejected')}>Reject</button>
      </div>
    </>
  );
}

function ErrorDemo() {
  const [state, setState] = useState<'error' | 'retrying' | 'ok'>('error');
  const retry = () => { setState('retrying'); window.setTimeout(() => setState('ok'), 900); };
  return state === 'ok' ? (
    <div className="stack gap-3"><p>Summary complete. The three paragraphs you already had were kept.</p>
      <div><button type="button" className="btn btn--secondary btn--small" onClick={() => setState('error')}>Reset demo</button></div></div>
  ) : (
    <div className="stack gap-3" role="alert">
      <p className="body">Three paragraphs of the summary were written before the connection dropped.</p>
      <p><strong>The answer stopped partway.</strong> Your partial result is saved.</p>
      <div className="row gap-2">
        <button type="button" className="btn btn--primary btn--small" onClick={retry} disabled={state === 'retrying'}>{state === 'retrying' ? 'Retrying…' : 'Continue from where it stopped'}</button>
        <button type="button" className="btn btn--secondary btn--small" onClick={() => setState('ok')}>Keep what I have</button>
      </div>
    </div>
  );
}

export default function AIPatterns() {
  return (
    <>
      <PageHeader kicker="Lab 02 · Designing for AI" title="AI interaction patterns.">
        Using AI tools is one skill. Designing products that use AI is another. These are the patterns I reach for, built as real
        components from this site’s design system. Each one is live: try it.
      </PageHeader>
      <div className="container" style={{ paddingBottom: 'var(--space-9)' }}>
        <Pattern n="01" title="Streaming, with a way out" when="Any answer that takes more than a second to generate." rule="Show progress as it happens, and always let people stop it. A stopped answer is labelled incomplete, never passed off as finished.">
          <StreamingDemo />
        </Pattern>
        <Pattern n="02" title="Every claim has a source" when="Answers that summarise documents, data or research someone will act on." rule="Cite at the claim, not at the end. Selecting a citation shows the exact source, so trust is checked, not assumed.">
          <CitationDemo />
        </Pattern>
        <Pattern n="03" title="Confidence, with a reason" when="Analysis where the evidence is uneven." rule="Never a bare percentage. Say how sure, and why — the reason is what helps people decide whether to dig deeper.">
          <div className="stack gap-4">
            <Confidence level={3} reason="Revenue rose every year; the trend is unambiguous." />
            <Confidence level={2} reason="Margin includes one-off items that aren’t separated here." />
            <Confidence level={1} reason="The result depends on an assumed cost of capital." />
          </div>
        </Pattern>
        <Pattern n="04" title="Approve before acting" when="An agent wants to change something: data, files, settings, money." rule="Show exactly what will change and let people edit the plan, not just accept or reject it. Make the result undoable.">
          <ApprovalDemo />
        </Pattern>
        <Pattern n="05" title="“I don’t know” is a feature" when="Questions the available data can’t answer." rule="Say so plainly, explain what’s missing and where to look. A confident guess costs more trust than a clear refusal.">
          <p className="body"><strong>Q:</strong> Why did margin fall in 2022?</p>
          <UnknownNotice>I can’t answer that from this data. It holds totals only — no cost breakdown — so any reason I gave would be a guess. Check the segment notes in the annual report.</UnknownNotice>
        </Pattern>
        <Pattern n="06" title="Failure keeps the work" when="Generation fails partway: timeouts, rate limits, lost connection." rule="Keep what was produced, say what happened in plain words, and offer to continue rather than start over.">
          <ErrorDemo />
        </Pattern>
      </div>
    </>
  );
}
