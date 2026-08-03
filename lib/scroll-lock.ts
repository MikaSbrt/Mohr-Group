/**
 * Kleine Brücke zu Lenis.
 *
 * Lenis wird in `SmoothScroll` erzeugt, die Intro-Sequenz muss das Scrollen
 * aber sperren können. Statt die Instanz durch den halben Baum zu reichen,
 * meldet `SmoothScroll` sie hier an.
 */
type LenisLike = { stop: () => void; start: () => void };

let instance: LenisLike | null = null;

export function registerLenis(lenis: LenisLike | null) {
  instance = lenis;
}

export function lockScroll() {
  instance?.stop();
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
}

export function unlockScroll() {
  instance?.start();
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
}
