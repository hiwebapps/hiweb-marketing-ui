import { useEffect, useRef, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { ViewStagingButton } from './ViewStagingButton';

type DocumentLayoutProps = {
  documentId: string;
  documentType: string;
  renderDefault: (props: DocumentLayoutProps) => JSX.Element;
};

/**
 * Sanity 6.19 removed the document-footer slot. This mounts Ver Staging in the
 * status bar, to the left of Publish, for the pane this layout wraps.
 */
export function StagingDocumentLayout(props: DocumentLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mount = document.createElement('span');
    mount.setAttribute('data-view-staging-mount', '');
    mount.style.display = 'contents';
    setSlot(mount);

    const place = () => {
      const footer = root.querySelector('[data-testid="pane-footer"]');
      const anchor = footer?.querySelector('[data-testid^="action-"]');
      const parent = anchor?.parentElement;
      if (!parent || mount.parentElement === parent) return;
      parent.insertBefore(mount, parent.firstChild);
    };

    place();
    const observer = new MutationObserver(place);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mount.remove();
    };
  }, []);

  return (
    <div ref={rootRef} style={{ display: 'contents' }}>
      {props.renderDefault(props)}
      {slot ? createPortal(<ViewStagingButton />, slot) : null}
    </div>
  );
}
