// Reusable AI interaction patterns. Used by the explorer and documented on /lab/ai-patterns.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Segment } from '../lab/explain';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Streams segments word by word. Citations appear as numbered chips; `onCite` lets the host highlight the source. */
export function StreamingAnswer({
  segments, onCite, activeCite, speed = 28, onDone,
}: { segments: Segment[]; onCite?: (id: string) => void; activeCite?: string | null; speed?: number; onDone?: () => void }) {
  // Flatten into units: each word of text, or one citation chip.
  const units = useMemo(() => {
    const out: ({ kind: 'word'; text: string } | { kind: 'cite'; id: string; n: number })[] = [];
    const order = new Map<string, number>();
    for (const s of segments) {
      if (s.text) for (const w of s.text.split(/(?<=\s)/)) out.push({ kind: 'word', text: w });
      if (s.cite) {
        if (!order.has(s.cite)) order.set(s.cite, order.size + 1);
        out.push({ kind: 'cite', id: s.cite, n: order.get(s.cite)! });
      }
    }
    return out;
  }, [segments]);

  const [shown, setShown] = useState(prefersReducedMotion() ? units.length : 0);
  const [stopped, setStopped] = useState(false);
  const done = shown >= units.length;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => { setShown(prefersReducedMotion() ? units.length : 0); setStopped(false); }, [units]);
  useEffect(() => {
    if (done || stopped) { if (done) doneRef.current?.(); return; }
    const id = window.setTimeout(() => setShown((n) => n + 1), speed);
    return () => window.clearTimeout(id);
  }, [shown, done, stopped, speed]);

  return (
    <div className="stack gap-3">
      <p aria-live="polite" aria-busy={!done && !stopped} style={{ fontSize: 17, lineHeight: 1.65 }} className={!done && !stopped ? 'cursor' : undefined}>
        {units.slice(0, shown).map((u, i) =>
          u.kind === 'word' ? <span key={i}>{u.text}</span> : (
            <button
              key={i} type="button" className="chip-cite"
              aria-pressed={activeCite === u.id}
              aria-label={`Source ${u.n}: show ${u.id.replace('-', ' ')} in the data`}
              onClick={() => onCite?.(u.id)}
            >{u.n}</button>
          ),
        )}
      </p>
      {!done && !stopped && (
        <div><button type="button" className="btn btn--secondary btn--small" onClick={() => setStopped(true)}>Stop generating</button></div>
      )}
      {stopped && !done && (
        <div className="row gap-3 small muted" style={{ alignItems: 'center' }}>
          <span>Stopped. The answer above is incomplete.</span>
          <button type="button" className="btn btn--secondary btn--small" onClick={() => setStopped(false)}>Continue</button>
        </div>
      )}
    </div>
  );
}

export function Confidence({ level, reason }: { level: 1 | 2 | 3; reason: string }) {
  const word = ['', 'Low', 'Medium', 'High'][level];
  return (
    <div className="row gap-3 small" style={{ alignItems: 'center' }}>
      <span className="label">Confidence</span>
      <span className="meter" aria-hidden="true">{[1, 2, 3].map((i) => <span key={i} className={i <= level ? 'on' : ''} />)}</span>
      <span><strong>{word}.</strong> <span className="body">{reason}</span></span>
    </div>
  );
}

export function UnknownNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice row gap-3" style={{ alignItems: 'flex-start' }}>
      <span className="label" style={{ paddingTop: 3, flex: 'none' }}>Can’t answer</span>
      <span>{children}</span>
    </div>
  );
}

export function GeneratedBy({ children }: { children: React.ReactNode }) {
  return <p className="label" style={{ fontSize: 11, letterSpacing: '0.1em' }}>{children}</p>;
}
