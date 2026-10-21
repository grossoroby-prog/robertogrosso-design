import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ButtonLink, Label } from './ui';
import { CONTACT } from '../data/site';

export type DriftReport = {
  checkedAt: string;
  source: 'figma-api' | 'snapshot';
  total: number;
  matched: number;
  status: 'in-sync' | 'drift';
  issues: number;
  drifted: { name: string; kind: string; code: unknown; figma: unknown }[];
  missingInFigma: { name: string; code: unknown }[];
  missingInCode: { name: string; figma: unknown }[];
};

export function useDriftReport() {
  const [report, setReport] = useState<DriftReport | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}drift-report.json`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setReport)
      .catch(() => setFailed(true));
  }, []);
  return { report, failed };
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function DriftBadge() {
  const { report, failed } = useDriftReport();
  const state = failed ? 'unknown' : !report ? 'loading' : report.status;
  const text =
    state === 'in-sync' ? `Figma ↔ code: 0 drifted tokens of ${report!.total} · checked ${fmtDate(report!.checkedAt)}`
    : state === 'drift' ? `Figma ↔ code: ${report!.issues} drifted of ${report!.total} · checked ${fmtDate(report!.checkedAt)}`
    : state === 'loading' ? 'Checking Figma ↔ code…'
    : 'Drift report unavailable';
  return (
    <Link to="/lab/drift" className="drift-badge" aria-label={`${text}. View the drift report`}>
      <span aria-hidden="true" className={`drift-badge__dot${state === 'in-sync' ? ' drift-badge__dot--ok' : state === 'drift' ? ' drift-badge__dot--drift' : ''}`} />
      {text}
    </Link>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollManager />
      <header className="nav">
        <nav aria-label="Main" className="container nav__inner">
          <Link to="/" className="nav__brand">Roberto Grosso</Link>
          <div className="nav__links">
            <Link to="/#work">Work</Link>
            <NavLink to="/lab">Lab</NavLink>
            <NavLink to="/how-this-was-built">How this was built</NavLink>
            <Link to="/#contact">Contact</Link>
            <a href={CONTACT.cv} style={{ fontWeight: 600 }}>CV ↓</a>
          </div>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer id="contact" className="band--inverse inverse">
        <div className="container stack gap-8" style={{ paddingBlock: 'var(--space-10) var(--space-7)' }}>
          <div className="stack gap-6">
            <Label>Contact</Label>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', maxWidth: 900 }}>
              Hiring a design lead for a complex product? Let’s talk.
            </h2>
            <div className="row gap-3">
              <ButtonLink to={`mailto:${CONTACT.email}`}>{CONTACT.email}</ButtonLink>
              <ButtonLink to={CONTACT.linkedin} variant="secondary">LinkedIn</ButtonLink>
              <ButtonLink to={CONTACT.cv} variant="secondary">Download CV</ButtonLink>
            </div>
          </div>
          <div className="footer__meta">
            <span>© {new Date().getFullYear()} Roberto Grosso · Lisbon</span>
            <DriftBadge />
            <a href={CONTACT.repo} style={{ textDecoration: 'none' }}>Built with Claude Code · source on GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
