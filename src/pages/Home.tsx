import { Link } from 'react-router-dom';
import { ButtonLink, Label, Pill, Placeholder, Stats } from '../components/ui';
import { CONTACT, EXPERIENCE } from '../data/site';
import tokenStats from '../data/token-stats.json';

const PRINCIPLES = [
  { title: 'Systems first', body: 'Tokens and components that match one to one between design and code, so teams ship faster and stay consistent.' },
  { title: 'Design for the person deciding', body: 'Dense financial data, shaped into guided views, with the depth one step away.' },
  { title: 'AI-native, hands in the code', body: 'I prototype in working code with Claude and Figma, and test ideas with real behaviour before they reach engineering.' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container stack gap-7" style={{ paddingBlock: 'var(--space-10) var(--space-9)' }}>
        <div className="row gap-3 label">
          <span>Lead Product Designer</span><span aria-hidden="true">/</span><span>Lisbon · Remote</span>
        </div>
        <h1 className="display" style={{ maxWidth: 1050 }}>I design the systems that complex financial products run on.</h1>
        <div className="row gap-7" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <p className="lead" style={{ maxWidth: 560 }}>
            15+ years in product design. Most recently sole design lead on McKinsey Value Intelligence, where I built the
            design system from zero to 1,500+ tokens and 100+ components, in parity between Figma and Vue.
          </p>
          <div className="row gap-3">
            <ButtonLink to="/work/mvi">Read the MVI case study →</ButtonLink>
            <ButtonLink to={CONTACT.cv} variant="secondary">Download CV</ButtonLink>
          </div>
        </div>
        <div className="row gap-2">
          <Pill>Design systems</Pill>
          <Pill>Financial product UX</Pill>
          <Pill>AI-native workflows</Pill>
          <Pill>Open to Lead / Head of Design roles</Pill>
        </div>
      </section>

      {/* Featured */}
      <section id="work" className="band band--inverse" aria-labelledby="featured-title">
        <div className="container stack gap-7">
          <div className="row gap-4 label" style={{ justifyContent: 'space-between' }}>
            <span>Featured case study · 01</span><span>McKinsey &amp; Company · 2023–2025</span>
          </div>
          <div className="split">
            <div className="stack gap-6">
              <h2 id="featured-title" className="h2" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)' }}>McKinsey Value Intelligence</h2>
              <p className="lead">A corporate finance analytics platform built for analysts working through ROIC and TSR. I led design end to end, built its design system from scratch, and managed a team of three.</p>
              <p className="lead">When partners found the platform too dense, I designed a guided view for them: premade steps through company performance, with AI-augmented depth on demand.</p>
              <div className="row gap-3">
                <ButtonLink to="/work/mvi">Read the case study →</ButtonLink>
                <ButtonLink to="/lab/value-explorer" variant="secondary">Try the pattern live</ButtonLink>
              </div>
            </div>
            <div className="stack gap-5">
              <Placeholder label="NDA-safe product screenshot" />
              <Stats items={[
                { value: '1,500+', label: 'Design tokens' },
                { value: '100+', label: 'Components' },
                { value: '1:1', label: 'Figma ↔ Vue parity' },
              ]} />
            </div>
          </div>
        </div>
      </section>

      {/* More work */}
      <section className="container band stack gap-7" aria-labelledby="more-work">
        <div className="section-head">
          <h2 id="more-work" className="h3" style={{ fontSize: 32 }}>More work</h2>
          <span className="label">02 — 04</span>
        </div>
        <div className="cards">
          <article className="work-card">
            <Placeholder label="ValueLens screen" />
            <span className="label">02 · Design Founder · 2025–</span>
            <h3 className="h3">ValueLens</h3>
            <p className="body">Leading product design for an AI-driven finance platform, built with former McKinsey colleagues.</p>
          </article>
          <article className="work-card">
            <Placeholder label="HSBC · WPP visual" />
            <span className="label">03 · WPP / Hogarth Worldwide</span>
            <h3 className="h3">Consumer banking at scale</h3>
            <p className="body">Banking and enterprise tooling for HSBC, alongside work on Johnson &amp; Johnson and Nike accounts.</p>
          </article>
          <Link to="/how-this-was-built" className="work-card">
            <div className="placeholder placeholder--dark" style={{ fontSize: 13, textTransform: 'none', letterSpacing: 0 }}>
              tokens.json → {tokenStats.total} variables → every component
            </div>
            <span className="label">04 · Open source · 2026</span>
            <h3 className="h3">This site</h3>
            <p className="body">Designed on a canvas, built with Claude Code on its own token-driven design system, and checked against Figma every day.</p>
          </Link>
        </div>
      </section>

      {/* Lab teaser */}
      <section className="band band--raised" aria-labelledby="lab-title">
        <div className="container split">
          <div className="stack gap-4">
            <Label>Lab</Label>
            <h2 id="lab-title" className="h2">Working proof, not claims.</h2>
            <p className="lead">Small, real tools that show how I design with and for AI.</p>
          </div>
          <div className="rule-list">
            <Link to="/lab/value-explorer" className="numbered" style={{ textDecoration: 'none' }}>
              <span className="label" style={{ paddingTop: 4 }}>01</span>
              <span className="stack gap-2"><span className="h3" style={{ fontSize: 20 }}>Guided value explorer →</span><span className="body">The MVI guided-view pattern, rebuilt on open data.</span></span>
            </Link>
            <Link to="/lab/ai-patterns" className="numbered" style={{ textDecoration: 'none' }}>
              <span className="label" style={{ paddingTop: 4 }}>02</span>
              <span className="stack gap-2"><span className="h3" style={{ fontSize: 20 }}>AI interaction patterns →</span><span className="body">Streaming, citations, confidence, approvals and “I don’t know”, as live components.</span></span>
            </Link>
            <Link to="/lab/drift" className="numbered" style={{ textDecoration: 'none' }}>
              <span className="label" style={{ paddingTop: 4 }}>03</span>
              <span className="stack gap-2"><span className="h3" style={{ fontSize: 20 }}>Token drift detector →</span><span className="body">Checks this site’s code against its Figma variables, daily.</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* How I work */}
      <section id="about" className="container band split">
        <div className="stack gap-5">
          <Label>How I work</Label>
          <h2 className="h2">Clarity for the analyst. Speed for the decision-maker.</h2>
          <Link to="/ai-for-design-teams" className="small" style={{ fontWeight: 600 }}>How I’d bring AI into a design team →</Link>
        </div>
        <div className="rule-list">
          {PRINCIPLES.map((p, i) => (
            <div className="numbered" key={p.title}>
              <span className="label" style={{ paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
              <div className="stack gap-2">
                <h3 className="h3" style={{ fontSize: 20 }}>{p.title}</h3>
                <p className="body">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="container stack gap-6" style={{ paddingBottom: 'var(--space-9)' }} aria-labelledby="exp">
        <div className="section-head">
          <h2 id="exp" className="h3" style={{ fontSize: 32 }}>Experience</h2>
          <a href={CONTACT.cv} className="small" style={{ fontWeight: 600 }}>Full CV ↓</a>
        </div>
        <ul className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {EXPERIENCE.map((e) => (
            <li className="exp-row" key={e.role} style={{ paddingBlock: 18 }}>
              <span style={{ fontWeight: 600 }}>{e.role}</span><span className="muted">{e.years}</span>
            </li>
          ))}
        </ul>
        <p className="body">Outside product work I’m a multisensory artist, exhibiting internationally — <a href={CONTACT.art}>robertogrosso.com</a>.</p>
      </section>
    </>
  );
}
