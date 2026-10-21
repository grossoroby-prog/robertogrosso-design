import { AIUsage, ButtonLink, Label, Placeholder, SectionIntro, Stats } from '../components/ui';

const META = [
  { k: 'Role', v: 'Sole design lead' },
  { k: 'Team', v: 'Managed 3 designers' },
  { k: 'Timeline', v: '2023–2025' },
  { k: 'Stack', v: 'Figma · Vue' },
];

export default function CaseStudyMVI() {
  return (
    <article>
      <header className="container stack gap-6" style={{ paddingBlock: 'var(--space-9) var(--space-7)' }}>
        <Label>Case study 01 · McKinsey &amp; Company</Label>
        <h1 className="display" style={{ fontSize: 'clamp(44px, 6.5vw, 88px)', maxWidth: 1050 }}>
          One system for analysts and partners: McKinsey Value Intelligence.
        </h1>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', borderTop: '1px solid var(--color-border-strong)', margin: 0 }}>
          {META.map((m) => (
            <div key={m.k} className="stack gap-2" style={{ padding: '20px 20px 20px 0' }}>
              <dt className="label">{m.k}</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>{m.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="container"><Placeholder wide label="Hero: NDA-safe dashboard view" /></div>

      <section className="container band">
        <SectionIntro kicker="01 — The problem" title="Corporate finance analysis, with no shared design language.">
          <p>MVI helps McKinsey teams analyse company performance: ROIC, TSR and the drivers behind them. Business analysts work through it in depth, every day.</p>
          <p>[What the product looked like before: inconsistent screens, slow handoff, one sentence on the cost of that.]</p>
        </SectionIntro>
      </section>

      <section className="band band--inverse">
        <div className="container stack gap-8">
          <SectionIntro kicker="02 — The system" title="A design system built from scratch, in parity with code.">
            <p>I built the token architecture and component library myself, then kept Figma and the Vue codebase in one-to-one parity so designers and engineers worked from the same source.</p>
            <p>[Two or three sentences on token tiers, naming, theming and how parity was maintained.]</p>
          </SectionIntro>
          <Stats items={[
            { value: '1,500+', label: 'Design tokens' },
            { value: '100+', label: 'Components' },
            { value: '1:1', label: 'Figma ↔ Vue' },
            { value: '[X]', label: '[Outcome metric]' },
          ]} />
          <div className="split" style={{ gap: 'var(--space-5)' }}>
            <Placeholder label="Token tiers diagram" />
            <Placeholder label="Component library overview" />
          </div>
        </div>
      </section>

      <section className="container band stack gap-8">
        <SectionIntro kicker="03 — The turn" title="Partners said it was too hard. So I designed them a different door.">
          <p>The platform worked for analysts, but partners and senior partners found it too difficult to use. Rather than strip features out, I designed Value Intelligence: a guided view through company performance in premade steps.</p>
          <p>The depth was still there, one step away, augmented by AI when a partner wanted to go further. It ran on the same design system, so it took [weeks] rather than a rebuild.</p>
        </SectionIntro>
        <div className="split" style={{ gap: 'var(--space-5)' }}>
          <figure className="stack gap-3" style={{ margin: 0 }}>
            <Placeholder label="Analyst view" />
            <figcaption className="small muted">Analyst view: full depth, every driver.</figcaption>
          </figure>
          <figure className="stack gap-3" style={{ margin: 0 }}>
            <Placeholder label="Partner guided view" />
            <figcaption className="small muted">Partner view: guided steps, depth on demand.</figcaption>
          </figure>
        </div>
        <div className="notice row gap-4" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <span>The real product is under NDA. I rebuilt the guided-view pattern on open data so you can try it.</span>
          <ButtonLink to="/lab/value-explorer" small>Open the explorer →</ButtonLink>
        </div>
      </section>

      <section className="band band--raised">
        <div className="container stack gap-8">
          <SectionIntro kicker="04 — Outcome" title="What changed." />
          <ul className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 18 }}>
            <li>[Outcome 1, with a number: adoption, time saved, handoff speed]</li>
            <li>[Outcome 2: what partners did with the guided view]</li>
            <li>[Outcome 3: what the team could ship because of the system]</li>
          </ul>
          <AIUsage
            ai="[e.g. synthesised partner interview notes; drafted component documentation; generated first-pass guided-step copy]"
            me="[e.g. the guided-view concept itself; which metrics a partner sees first; the token tier structure]"
            cut="[e.g. AI-generated dashboard layouts that hid the drivers partners needed to trust the numbers]"
          />
        </div>
      </section>

      <section className="band">
        <div className="container row gap-6" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="stack gap-4">
            <Label>Next</Label>
            <span className="h2" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>Try the pattern</span>
          </div>
          <div className="row gap-3">
            <ButtonLink to="/lab/value-explorer">Guided value explorer →</ButtonLink>
            <ButtonLink to="/" variant="secondary">Back to home</ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
