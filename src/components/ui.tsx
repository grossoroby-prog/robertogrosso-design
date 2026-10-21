import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Label({ children, as: Tag = 'span' }: { children: ReactNode; as?: 'span' | 'p' | 'h2' | 'h3' }) {
  return <Tag className="label" style={{ margin: 0 }}>{children}</Tag>;
}

type BtnProps = { to: string; variant?: 'primary' | 'secondary'; children: ReactNode; small?: boolean };
/** Internal routes use <Link>, everything else a plain anchor. */
export function ButtonLink({ to, variant = 'primary', small, children }: BtnProps) {
  const cls = `btn btn--${variant}${small ? ' btn--small' : ''}`;
  if (to.startsWith('/') && !to.endsWith('.pdf')) return <Link className={cls} to={to}>{children}</Link>;
  return <a className={cls} href={to}>{children}</a>;
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="pill">{children}</span>;
}

export function Placeholder({ label, wide, dark }: { label: string; wide?: boolean; dark?: boolean }) {
  return (
    <div role="img" aria-label={`Placeholder: ${label}`} className={`placeholder${wide ? ' placeholder--wide' : ''}${dark ? ' placeholder--dark' : ''}`}>
      [{label}]
    </div>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="stats" style={{ margin: 0 }}>
      {items.map((s) => (
        <div className="stat" key={s.label}>
          <dt className="label" style={{ order: 2 }}>{s.label}</dt>
          <dd className="stat__value" style={{ margin: 0, order: 1 }}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionIntro({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="split">
      <div className="stack gap-4">
        <Label>{kicker}</Label>
        <h2 className="h2">{title}</h2>
      </div>
      {children && <div className="prose">{children}</div>}
    </div>
  );
}

/** "How AI was used" — three columns, honest about the split of work. */
export function AIUsage({ ai, me, cut }: { ai: string; me: string; cut: string }) {
  return (
    <section aria-label="How AI was used" className="stack gap-4">
      <Label>How AI was used</Label>
      <div className="ai-strip">
        <div><span className="label">What AI did</span><p className="body">{ai}</p></div>
        <div><span className="label">What I decided</span><p className="body">{me}</p></div>
        <div><span className="label">What I threw away</span><p className="body">{cut}</p></div>
      </div>
    </section>
  );
}

export function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <section className="container stack gap-6" style={{ paddingBlock: 'var(--space-9) var(--space-7)' }}>
      <Label>{kicker}</Label>
      <h1 className="display" style={{ maxWidth: 1050 }}>{title}</h1>
      {children && <div className="lead" style={{ maxWidth: 680 }}>{children}</div>}
    </section>
  );
}
