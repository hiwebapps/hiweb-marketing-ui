import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { Button } from '@sanity/ui';
import { useDocumentPane } from 'sanity/structure';
import { pagePath, type PageMetaDoc } from '../../lib/page-meta';

const STAGING_ORIGIN = 'https://staging.hiweb.com.mx';

function pageDocument(displayed: { locale?: unknown; slug?: unknown } | null): PageMetaDoc {
  const slug = displayed?.slug;
  return {
    locale: typeof displayed?.locale === 'string' ? displayed.locale : undefined,
    slug:
      typeof slug === 'string' || (slug && typeof slug === 'object' && 'current' in slug)
        ? (slug as PageMetaDoc['slug'])
        : undefined,
  };
}

/** Sits in the document footer, immediately to the left of Publish. */
export function ViewStagingButton() {
  const { displayed, documentId, documentType } = useDocumentPane();
  const path = pagePath(
    documentType,
    documentId,
    pageDocument(displayed as { locale?: unknown; slug?: unknown } | null),
  );
  if (!path) return null;

  return (
    <Button
      as="a"
      href={`${STAGING_ORIGIN}${path}`}
      target="_blank"
      rel="noreferrer"
      icon={EyeOpenIcon}
      mode="ghost"
      text="Ver Staging"
      data-testid="view-staging"
    />
  );
}
