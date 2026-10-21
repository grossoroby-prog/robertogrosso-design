import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';

const ITEMS = [
  { to: '/lab/value-explorer', n: '01', title: 'Guided value explorer', body: 'The guided-view pattern I designed for McKinsey partners, rebuilt on open data: five questions, depth on demand, an explain layer that cites every number.' },
  { to: '/lab/ai-patterns', n: '02', title: 'AI interaction patterns', body: 'Streaming, citations, confidence, approvals, refusals and recovery — as live components from this site’s design system.' },
  { to: '/lab/drift', n: '03', title: 'Token drift detector', body: 'A script and daily check that compares this site’s code with its Figma variables, and fails the build when they disagree.' },
  { to: '/ai-for-design-teams', n: '04', title: 'AI in a design team', body: 'How I’d bring these tools into a team: where they go in the workflow, the guardrails, and where I’d stop.' },
];

export default function Lab() {
  return (
    <>
      <PageHeader kicker="Lab" title="Working proof, not claims.">
        Everyone says they’re AI-native. These are small, real things you can use, each built with AI and designed for people who need to trust the result.
      </PageHeader>
      <section className="container" style={{ paddingBottom: 'var(--space-9)' }}>
        <div className="rule-list">
          {ITEMS.map((i) => (
            <Link key={i.to} to={i.to} className="numbered" style={{ textDecoration: 'none', paddingBlock: 'var(--space-6)' }}>
              <span className="label" style={{ paddingTop: 8 }}>{i.n}</span>
              <span className="stack gap-2">
                <span className="h3" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>{i.title} →</span>
                <span className="body" style={{ maxWidth: 680 }}>{i.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
