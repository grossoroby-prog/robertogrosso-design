import { Label, PageHeader, Stats } from '../components/ui';
import { useDriftReport } from '../components/Layout';

const show = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v));

export default function DriftPage() {
  const { report, failed } = useDriftReport();

  return (
    <>
      <PageHeader kicker="Lab 03 · Design systems tooling" title="Token drift detector.">
        Design systems rot quietly: someone tweaks a colour in Figma, someone else hard-codes a spacing value, and six months later
        the two no longer agree. This script reads this site’s Figma variables and its <code>tokens.json</code>, and reports every
        difference. It runs every day.
      </PageHeader>

      <section className="container stack gap-7" style={{ paddingBottom: 'var(--space-9)' }}>
        {failed && <p className="notice">The latest report couldn’t be loaded.</p>}
        {!report && !failed && <p className="muted" role="status">Loading the latest report…</p>}
        {report && (
          <>
            <div className="stack gap-3" role="status">
              <Label>Last check · {new Date(report.checkedAt).toLocaleString('en-GB')}</Label>
              <p className="h3">
                {report.status === 'in-sync'
                  ? `All ${report.total} tokens match between Figma and code.`
                  : `${report.issues} of ${report.total} tokens have drifted.`}
              </p>
              <p className="small muted">
                Source: {report.source === 'figma-api' ? 'live Figma REST API (variables/local)' : 'Figma variables snapshot committed to the repo'}.
              </p>
            </div>
            <Stats items={[
              { value: String(report.matched), label: 'Matching' },
              { value: String(report.drifted.length), label: 'Value or alias drift' },
              { value: String(report.missingInFigma.length), label: 'Missing in Figma' },
              { value: String(report.missingInCode.length), label: 'Missing in code' },
            ]} />
            {report.issues > 0 && (
              <div className="table-wrap">
                <table>
                  <caption className="sr-only">Drifted tokens</caption>
                  <thead><tr><th scope="col">Token</th><th scope="col">Issue</th><th scope="col">Code</th><th scope="col">Figma</th></tr></thead>
                  <tbody>
                    {report.drifted.map((d) => <tr key={d.name}><td><code>{d.name}</code></td><td>{d.kind} drift</td><td><code>{show(d.code)}</code></td><td><code>{show(d.figma)}</code></td></tr>)}
                    {report.missingInFigma.map((d) => <tr key={d.name}><td><code>{d.name}</code></td><td>missing in Figma</td><td><code>{show(d.code)}</code></td><td>—</td></tr>)}
                    {report.missingInCode.map((d) => <tr key={d.name}><td><code>{d.name}</code></td><td>missing in code</td><td>—</td><td><code>{show(d.figma)}</code></td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="split" style={{ paddingTop: 'var(--space-7)' }}>
          <div className="stack gap-4">
            <Label>How it works</Label>
            <h2 className="h2">Three steps, no plugin.</h2>
          </div>
          <ol className="rule-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="numbered"><span className="label">01</span><span className="body">Pull variables from the Figma REST API and flatten <code>color/bg/page</code> to <code>color.bg.page</code>, resolving each collection’s default mode.</span></li>
            <li className="numbered"><span className="label">02</span><span className="body">Compare against <code>tokens.json</code>. Aliases compare by reference, so a token that points somewhere new is drift even if the colour happens to match.</span></li>
            <li className="numbered"><span className="label">03</span><span className="body">Write a report the site reads, and fail CI in strict mode, so drift is caught before it ships.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
