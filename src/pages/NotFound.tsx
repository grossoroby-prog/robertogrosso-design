import { ButtonLink, PageHeader } from '../components/ui';

export default function NotFound() {
  return (
    <>
      <PageHeader kicker="404" title="This page doesn’t exist.">
        It may have moved when the site was rebuilt.
      </PageHeader>
      <div className="container" style={{ paddingBottom: 'var(--space-9)' }}>
        <ButtonLink to="/">Go to the home page</ButtonLink>
      </div>
    </>
  );
}
