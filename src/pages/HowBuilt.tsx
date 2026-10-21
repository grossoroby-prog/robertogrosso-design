import { AIUsage, ButtonLink, Label, PageHeader, Stats } from '../components/ui';
import { CONTACT } from '../data/site';
import tokenStats from '../data/token-stats.json';

const LOG = [
  {
    stage: 'Starting point',
    title: 'A Lovable site that looked like everyone else’s.',
    body: 'The previous version was quick to build and did its job. But its stat tiles, repeated logo strip and six process cards are the default shape of AI-built portfolios, and they buried the work.',
  },
  {
    stage: 'Critique',
    title: 'Lead with one case study, not with claims.',
    body: 'I had Claude review the live site as a hiring manager would. The decision that came out of it was mine: put McKinsey Value Intelligence first, cut everything that asserts skill without showing it.',
  },
  {
    stage: 'Design',
    title: 'Designed on a canvas before any code.',
    body: 'Home and case-study pages were laid out as artboards, keeping my existing visual language: cool neutrals, near-black bands, square corners, tight grotesk headlines, mono labels.',
  },
  {
    stage: 'System',
    title: `One tokens.json, ${tokenStats.total} variables, no hard-coded styles.`,
    body: `Colours, type, spacing and radii live in a single file (${tokenStats.aliases} of them are aliases, like a real semantic layer). A script compiles it to CSS variables; components only read tokens.`,
  },
  {
    stage: 'Build',
    title: 'Built in Claude Code, reviewed line by line.',
    body: 'Claude Code wrote most of the React and TypeScript from my briefs. I reviewed, rejected and redirected: accessibility, copy, what each page should prove.',
  },
  {
    stage: 'Proof',
    title: 'Three things you can use, not just read about.',
    body: 'A guided value explorer (the MVI pattern on open data), a set of AI interaction patterns, and a drift detector that checks this site against Figma every day.',
  },
];

export default function HowBuilt() {
  return (
    <>
      <PageHeader kicker="Open source · Build log" title="How this site was built.">
        Designed and shipped with AI, with the decisions left to me. The code is public, so you can check every claim on this page.
      </PageHeader>

      <section className="container stack gap-7" style={{ paddingBottom: 'var(--space-9)' }}>
        <Stats items={[
          { value: String(tokenStats.total), label: 'Design tokens' },
          { value: String(tokenStats.aliases), label: 'Semantic aliases' },
          { value: '0', label: 'Hard-coded colours in components' },
          { value: '[X h]', label: 'From brief to live' },
        ]} />
        <div className="row gap-3">
          <ButtonLink to={CONTACT.repo}>View the source on GitHub</ButtonLink>
          <ButtonLink to="/lab/drift" variant="secondary">See today’s drift check</ButtonLink>
        </div>
      </section>

      <section className="band band--raised">
        <div className="container stack gap-7">
          <Label>Build log</Label>
          <ol className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {LOG.map((l, i) => (
              <li key={l.stage} className="split" style={{ gap: 'var(--space-5)', paddingBlock: 'var(--space-6)' }}>
                <div className="row gap-4" style={{ alignItems: 'baseline' }}>
                  <span className="label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="label" style={{ color: 'var(--color-fg-default)' }}>{l.stage}</span>
                </div>
                <div className="stack gap-3">
                  <h2 className="h3">{l.title}</h2>
                  <p className="body">{l.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container band stack gap-7">
        <AIUsage
          ai="Reviewed the old site, laid out the first page designs, wrote most of the code, and drafted copy for me to edit."
          me="To leave Lovable, to lead with MVI, the visual language, which proof to build, and every word that went live. [Add your own calls.]"
          cut="The stat tiles, the repeated logo strip and the process cards. A chatbot that answers questions about me. [Add what else you rejected.]"
        />
        <div className="split">
          <div className="stack gap-4">
            <Label>Stack</Label>
            <h2 className="h2">Small, boring, mine.</h2>
          </div>
          <ul className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="exp-row"><span style={{ fontWeight: 600 }}>Claude — design canvas &amp; Claude Code</span><span className="muted">Design and build</span></li>
            <li className="exp-row"><span style={{ fontWeight: 600 }}>Figma variables</span><span className="muted">Design source</span></li>
            <li className="exp-row"><span style={{ fontWeight: 600 }}>React · TypeScript · Vite</span><span className="muted">Site</span></li>
            <li className="exp-row"><span style={{ fontWeight: 600 }}>GitHub Actions</span><span className="muted">Daily drift check</span></li>
            <li className="exp-row"><span style={{ fontWeight: 600 }}>[Vercel / Netlify]</span><span className="muted">Hosting</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}
