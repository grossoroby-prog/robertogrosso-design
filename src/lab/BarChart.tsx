type Bar = { label: string; value: number | null; id: string };

/** Minimal accessible bar chart. Supports negatives, a dashed reference line and a highlighted bar. */
export default function BarChart({
  bars, format, reference, highlight, title,
}: { bars: Bar[]; format: (v: number) => string; reference?: { value: number; label: string }; highlight?: string | null; title: string }) {
  const W = 640, H = 280, padT = 28, padB = 36, padX = 8;
  const vals = bars.map((b) => b.value ?? 0).concat(reference ? [reference.value] : []);
  const max = Math.max(0, ...vals), min = Math.min(0, ...vals);
  const span = max - min || 1;
  const y = (v: number) => padT + ((max - v) / span) * (H - padT - padB);
  const slot = (W - padX * 2) / bars.length;
  const bw = Math.min(72, slot * 0.56);
  const summary = bars.map((b) => `${b.label}: ${b.value === null ? 'no value' : format(b.value)}`).join(', ');

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${title}. ${summary}`} style={{ display: 'block', fontFamily: 'var(--font-family-mono)' }}>
        <line x1={padX} x2={W - padX} y1={y(0)} y2={y(0)} stroke="var(--color-border-strong)" />
        {bars.map((b, i) => {
          const cx = padX + slot * i + slot / 2;
          if (b.value === null) {
            return <text key={b.id} x={cx} y={y(0) - 8} textAnchor="middle" fontSize="11" fill="var(--color-fg-muted)">n/a</text>;
          }
          const top = Math.min(y(b.value), y(0));
          const h = Math.max(1, Math.abs(y(b.value) - y(0)));
          const hot = highlight === b.id;
          return (
            <g key={b.id}>
              <rect x={cx - bw / 2} y={top} width={bw} height={h}
                fill={hot ? 'var(--color-signal-info)' : b.value < 0 ? 'var(--color-neutral-400)' : 'var(--color-neutral-900)'} />
              <text x={cx} y={b.value >= 0 ? top - 8 : top + h + 16} textAnchor="middle" fontSize="12" fill="var(--color-fg-default)" fontWeight={hot ? 700 : 400}>
                {format(b.value)}
              </text>
            </g>
          );
        })}
        {bars.map((b, i) => (
          <text key={`l-${b.id}`} x={padX + slot * i + slot / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--color-fg-muted)">{b.label}</text>
        ))}
        {reference && (
          <g>
            <line x1={padX} x2={W - padX} y1={y(reference.value)} y2={y(reference.value)} stroke="var(--color-signal-caution)" strokeDasharray="6 5" strokeWidth="1.5" />
            <text x={W - padX} y={y(reference.value) - 6} textAnchor="end" fontSize="11" fill="var(--color-signal-caution)">{reference.label}</text>
          </g>
        )}
      </svg>
    </figure>
  );
}
