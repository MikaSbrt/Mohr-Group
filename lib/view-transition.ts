/**
 * Shared-Element-Übergang zwischen Galerie und Fahrzeug-Detailseite.
 *
 * Genutzt wird die native View-Transitions-API: Galerie-Bild und Detail-Hero
 * tragen denselben `view-transition-name`, der Browser morpht das eine ins
 * andere. Wo die API fehlt (aktuell u. a. Firefox) oder Bewegung reduziert
 * werden soll, wird einfach normal navigiert.
 */

type VTDocument = Document & {
  startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> };
};

let resolver: (() => void) | null = null;

export function supportsViewTransitions() {
  if (typeof document === 'undefined') return false;
  return typeof (document as VTDocument).startViewTransition === 'function';
}

/** Navigation starten – `run` löst den eigentlichen Routenwechsel aus. */
export function navigateWithTransition(run: () => void) {
  const doc = document as VTDocument;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || typeof doc.startViewTransition !== 'function') {
    run();
    return;
  }

  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        resolver = resolve;
        run();
        // Sicherheitsnetz: der Übergang darf die Navigation nie blockieren.
        window.setTimeout(finishTransition, 700);
      }),
  );
}

/** Wird vom Route-Listener im Layout aufgerufen, sobald die neue Seite steht. */
export function finishTransition() {
  resolver?.();
  resolver = null;
}

/** Eindeutiger Name je Fahrzeug – muss auf beiden Seiten identisch sein. */
export const vehicleTransitionName = (slug: string) => `veh-${slug}`;
