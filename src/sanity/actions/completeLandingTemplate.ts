import * as Sanity from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';
import {
  LANDING_TEMPLATE_TYPES,
  makeLandingBlock,
  type LandingTemplateKind,
} from '../landingTemplate';

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

function isTemplateKind(value: unknown): value is LandingTemplateKind {
  return value === 'serviceLite' || value === 'industryLite' || value === 'campaign';
}

export const completeLandingTemplate: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, draft, published, onComplete } = props;
  const client = useStudioClient();

  const doc = (draft ?? published) as
    | { _id?: string; templateKind?: string; sections?: SectionLike[] }
    | null;

  const kind: LandingTemplateKind = isTemplateKind(doc?.templateKind) ? doc.templateKind : 'campaign';
  const existing = doc?.sections ?? [];
  const presentTypes = new Set(existing.map((section) => section?._type).filter(Boolean));
  const missing = LANDING_TEMPLATE_TYPES[kind].filter((sectionType) => !presentTypes.has(sectionType));

  return {
    label: missing.length === 0 ? 'Plantilla completa' : `Completar plantilla (+${missing.length})`,
    disabled: missing.length === 0,
    title:
      missing.length === 0
        ? 'La página ya tiene todos los bloques de la plantilla.'
        : `Añade al final: ${missing.join(', ')}`,
    onHandle: () => {
      const newBlocks = missing.map((sectionType) => makeLandingBlock(sectionType, kind));
      const publishedId = id.replace(/^drafts\./, '');
      const targetId = draft?._id ?? `drafts.${publishedId}`;
      const nextSections = [...existing, ...newBlocks];

      client
        .patch(targetId)
        .setIfMissing({ _type: type })
        .set({ sections: nextSections })
        .commit({ autoGenerateArrayKeys: false })
        .then(() => {
          onComplete();
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    },
  };
};
