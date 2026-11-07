import * as Sanity from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';
import { lpTemplateTypes, makeLpBlock, type LpTemplateKind } from '../lpTemplate';

interface SectionLike {
  _type?: string;
}

type StudioPatch = {
  setIfMissing: (value: Record<string, unknown>) => StudioPatch;
  set: (value: Record<string, unknown>) => StudioPatch;
  commit: (options?: Record<string, unknown>) => Promise<unknown>;
};

type StudioClient = {
  patch: (id: string) => StudioPatch;
};

function useStudioClient() {
  const hook = (
    Sanity as unknown as { useClient: (options: { apiVersion: string }) => StudioClient }
  ).useClient;
  return hook({ apiVersion: '2026-09-18' });
}

function isKind(value: unknown): value is LpTemplateKind {
  return value === 'general' || value === 'servicios' || value === 'industrias';
}

export const completeLpTemplate: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, draft, published, onComplete } = props;
  const client = useStudioClient();
  const doc = (draft ?? published) as { template?: string; role?: string; sections?: SectionLike[] } | null;
  const kind: LpTemplateKind = isKind(doc?.template) ? doc.template : 'general';
  const existing = doc?.sections ?? [];
  const present = new Set(existing.map((section) => section?._type).filter(Boolean));
  const missing = lpTemplateTypes(kind, doc?.role).filter((sectionType) => !present.has(sectionType));

  return {
    label: missing.length === 0 ? 'Plantilla completa' : `Completar plantilla (+${missing.length})`,
    disabled: missing.length === 0,
    onHandle: () => {
      const publishedId = id.replace(/^drafts\./, '');
      const targetId = draft?._id ?? `drafts.${publishedId}`;
      client
        .patch(targetId)
        .setIfMissing({ _type: type })
        .set({ sections: [...existing, ...missing.map((sectionType) => makeLpBlock(sectionType))] })
        .commit({ autoGenerateArrayKeys: false })
        .then(() => onComplete())
        .catch((error: unknown) => {
          console.error(error);
        });
    },
  };
};
