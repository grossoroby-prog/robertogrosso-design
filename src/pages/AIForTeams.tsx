import { ButtonLink, Label, PageHeader } from '../components/ui';

const WORKFLOW = [
  { stage: 'Research', ai: 'Transcribe, tag and cluster interview notes; draft the first synthesis.', human: 'Run the conversations live, and own the insight. AI summarises what was said; it can’t notice what wasn’t.' },
  { stage: 'Exploration', ai: 'Generate many directions fast, on the real design system rather than blank canvases.', human: 'Pick the direction, and kill the ones that only look good.' },
  { stage: 'Prototyping', ai: 'Build working prototypes in code, with real data and real states.', human: 'Decide what the prototype must prove before it’s built, and test it with people.' },
  { stage: 'System upkeep', ai: 'Check Figma against code daily, draft component docs, flag inconsistencies.', human: 'Approve every change to the system. Agents propose; the team decides.' },
];

const GUARDRAILS = [
  'No customer or client data goes into a tool the company hasn’t approved.',
  'Nothing ships that a designer hasn’t reviewed — AI output is a draft, always.',
  'Accessibility is checked by people and tools, never assumed from generated code.',
  'We measure outcomes (cycle time, rework, research coverage), not prompts written.',
];

const PLAN = [
  { when: 'Weeks 1–4', what: 'Audit how the team works today. Pilot with one squad on one workflow: prototyping on the design system.' },
  { when: 'Weeks 5–8', what: 'Turn what worked into shared, versioned prompts and components. Add the drift check to CI.' },
  { when: 'Weeks 9–12', what: 'Measure cycle time and review rework against the baseline. Expand, adjust or stop based on the numbers.' },
];

export default function AIForTeams() {
  return (
    <>
      <PageHeader kicker="For hiring managers · Leadership" title="How I’d bring AI into a design team.">
        AI changes the cost of trying things. It doesn’t change the standard for shipping them. That’s the line I’d hold as a design lead.
      </PageHeader>

      <section className="container stack gap-6" style={{ paddingBottom: 'var(--space-9)' }}>
        <div className="section-head"><h2 className="h3" style={{ fontSize: 32 }}>Where it goes in the workflow</h2><span className="label">AI does · people own</span></div>
        <div className="table-wrap" style={{ background: 'transparent', border: 0 }}>
          <table style={{ fontSize: 16 }}>
            <caption className="sr-only">What AI does and what people own at each stage</caption>
            <thead><tr><th scope="col">Stage</th><th scope="col">AI does</th><th scope="col">People own</th></tr></thead>
            <tbody>
              {WORKFLOW.map((w) => (
                <tr key={w.stage}>
                  <th scope="row" style={{ fontFamily: 'inherit', fontSize: 'inherit', textTransform: 'none', letterSpacing: 0, color: 'var(--color-fg-default)', fontWeight: 700, verticalAlign: 'top' }}>{w.stage}</th>
                  <td style={{ whiteSpace: 'normal', verticalAlign: 'top', minWidth: 240 }} className="body">{w.ai}</td>
                  <td style={{ whiteSpace: 'normal', verticalAlign: 'top', minWidth: 240 }}>{w.human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="band band--inverse">
        <div className="container split">
          <div className="stack gap-4">
            <Label>Guardrails</Label>
            <h2 className="h2">Fast is only useful if it’s trusted.</h2>
          </div>
          <ul className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 18 }}>
            {GUARDRAILS.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </section>

      <section className="container band stack gap-7">
        <div className="split">
          <div className="stack gap-4">
            <Label>The first 90 days</Label>
            <h2 className="h2">Pilot, prove, then scale.</h2>
          </div>
          <ol className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {PLAN.map((p) => (
              <li key={p.when} className="stack gap-2">
                <span className="label">{p.when}</span>
                <span className="body">{p.what}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="split">
          <div className="stack gap-4">
            <Label>Where I’d stop</Label>
            <h2 className="h3">Three things stay human.</h2>
          </div>
          <p className="lead">Talking to users. Deciding what to build. Judging whether it’s good enough to ship. AI can make all three better informed; it shouldn’t make any of them.</p>
        </div>
        <div className="row gap-3">
          <ButtonLink to="/lab/ai-patterns">See the patterns I design with</ButtonLink>
          <ButtonLink to="/#contact" variant="secondary">Talk to me about your team</ButtonLink>
        </div>
      </section>
    </>
  );
}
