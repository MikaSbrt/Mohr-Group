'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { partners, type Partner } from '@/lib/partners';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { useIntro } from './IntroProvider';
import WelcomeZoom, { type Anker } from './WelcomeZoom';

/** Scrollweg in Pixeln für den vollständigen Durchflug durch die Schrift.
    Bewusst lang: bei 900 war der Effekt nach vier Radrasten vorbei, bevor
    man ihn gesehen hatte. */
const ZOOM_WEG = 1700;

/** Standzeit je Partnerlogo inklusive Lichtreflex. */
const PARTNER_MS = 780;
/**
 * Lage eines Partnerlogos in der Sequenz.
 *
 * Reihenfolge zählt: CSS wendet Transformationen von rechts nach links an,
 * also erst skalieren, dann verschieben. Die Prozentangabe bezieht sich auf
 * die eigene Höhe und bleibt damit auf jeder Boxgröße richtig.
 */
function markTransform(p: Partner) {
  return `translateY(${p.introOffsetY ?? 0}%) scale(${p.introScale ?? 1})`;
}

/** Wie lange das MOHR-Logo allein steht, bevor der Willkommensgruß kommt.
    Großzügig, damit der langsame Lichtreflex zur Wirkung kommt. */
const MOHR_MS = 1700;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Gemeinsame Kennung für die Layout-Animation Intro → Header. */
export const MOHR_MARK_ID = 'mohr-mark';

export default function IntroSequence() {
  const { stage, setStage } = useIntro();

  /* Bewusst synchron gelesen statt über den geteilten Hook: der startet aus
     gutem Grund mit `true` und korrigiert sich erst im Effekt – hier würde
     das die Sequenz erst überspringen und dann doch starten. Die Komponente
     rendert ohnehin nur im Browser. */
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  /* 0 … partners.length-1 = Index des sichtbaren Partnerlogos,
     partners.length     = MOHR GROUP */
  const [step, setStep] = useState(() => (reduced ? partners.length : 0));

  /* Eine einzige Wheel- oder Wisch-Geste feuert dutzende Events. Ohne
     Unterscheidung würde dasselbe Scrollen erst überspringen und sofort
     danach das Endbild wegwischen – der Willkommensgruß wäre nie zu sehen.
     Eine feste Zeitsperre wäre zu grob: sie verschluckt auch eine bewusst
     neu angesetzte Geste. Stattdessen zählt die Pause zwischen den Events –
     innerhalb einer Geste liegen wenige Millisekunden, zwischen zwei Gesten
     deutlich mehr. */
  const welcomeAt = useRef(0);
  const lastInputAt = useRef(0);

  const skip = useCallback(() => {
    setStep(partners.length);
    welcomeAt.current = Date.now();
    setStage('welcome');
  }, [setStage]);

  /* Fortschritt des Durchflugs. `ziel` sammelt die Scrolleingaben, `zoom`
     läuft weich hinterher – rohe Radwerte sind sprunghaft und ruckelten
     sichtbar in der Skalierung. */
  const ziel = useRef(0);
  const [zoom, setZoom] = useState(0);

  /* Lage der Willkommensschrift, am gerenderten Element abgemessen. Die
     Maske beim Durchflug setzt darauf auf – nachgerechnet aus `top` und
     Schriftgrad lag sie daneben, weil die Zeilenhöhe fehlt. */
  const grussRef = useRef<HTMLParagraphElement>(null);
  const [anker, setAnker] = useState<Anker>({ x: 720, y: 546, grad: 44 });

  const finish = useCallback(() => {
    const now = Date.now();
    const continuesSameGesture = now - lastInputAt.current < 220;
    lastInputAt.current = now;
    if (continuesSameGesture) return;
    // Kurzer Moment, damit der Gruß überhaupt sichtbar wird.
    if (now - welcomeAt.current < 260) return;
    if (reduced) {
      setStage('done');
      return;
    }
    setStage('zoom');
  }, [setStage, reduced]);

  /** Merkt sich jede Eingabe, damit `finish` Gesten auseinanderhalten kann. */
  const noteInput = useCallback(() => {
    lastInputAt.current = Date.now();
  }, []);

  /* ---- Ablauf ---------------------------------------------------------- */
  useEffect(() => {
    if (stage !== 'running') return;

    const toWelcome = () => {
      welcomeAt.current = Date.now();
      setStage('welcome');
    };

    if (reduced) {
      // Kein Nacheinander – direkt das Endbild zeigen.
      const t = window.setTimeout(toWelcome, 400);
      return () => window.clearTimeout(t);
    }

    const timers = partners.map((_, i) =>
      window.setTimeout(() => setStep(i), i * PARTNER_MS),
    );
    timers.push(
      window.setTimeout(() => setStep(partners.length), partners.length * PARTNER_MS),
    );
    timers.push(
      window.setTimeout(toWelcome, partners.length * PARTNER_MS + MOHR_MS),
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [stage, reduced, setStage]);

  /* ---- Scrollsperre, solange der Vorhang liegt -------------------------- */
  useEffect(() => {
    if (stage !== 'running' && stage !== 'welcome' && stage !== 'zoom') return;
    lockScroll();
    return () => unlockScroll();
  }, [stage]);

  /* ---- Lage der Schrift abmessen --------------------------------------- */
  useEffect(() => {
    if (stage !== 'welcome') return;
    const messen = () => {
      const el = grussRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setAnker({
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        grad: parseFloat(getComputedStyle(el).fontSize) || 44,
      });
    };
    messen();
    window.addEventListener('resize', messen);
    return () => window.removeEventListener('resize', messen);
  }, [stage]);

  /* ---- Durchflug durch die Schrift ------------------------------------- */
  useEffect(() => {
    if (stage !== 'zoom') return;

    let laeuft = true;
    let gezeigt = 0;

    const schieben = (weg: number) => {
      ziel.current = Math.min(1.06, Math.max(0, ziel.current + weg / ZOOM_WEG));
    };

    const onWheel = (e: WheelEvent) => schieben(e.deltaY);

    /* Finger: gewandert wird die Strecke zwischen zwei Berührungspunkten.
       Nach oben gewischt heißt vorwärts, wie beim Rad.

       Der erste Bewegungspunkt setzt den Bezug selbst, statt auf ein
       `touchstart` zu warten: der Durchflug beginnt ja mitten in einer
       Wischgeste, deren Beginn längst vorbei ist, wenn diese Zuhörer sich
       anmelden. Ohne das bliebe der ganze erste Wisch wirkungslos. */
    let letzteY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      letzteY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      if (letzteY == null) {
        letzteY = y;
        return;
      }
      schieben((letzteY - y) * 2.2);
      letzteY = y;
    };
    const onTouchEnd = () => {
      letzteY = null;
    };

    /* Klick und Tastatur haben keinen Weg – sie fahren den Rest von allein
       durch, damit die Begrüßung auch ohne Rad zu verlassen ist. */
    const durchziehen = () => {
      ziel.current = 1.06;
    };
    const onKey = (e: KeyboardEvent) => {
      if (['Escape', ' ', 'Enter', 'ArrowDown', 'PageDown'].includes(e.key)) durchziehen();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    /* Erst im nächsten Takt anmelden: sonst fängt dieser Zuhörer genau den
       Klick ab, der den Durchflug gerade ausgelöst hat, und zieht ihn sofort
       bis zum Ende durch. */
    const klickAn = window.setTimeout(
      () => window.addEventListener('click', durchziehen),
      120,
    );

    const takt = () => {
      if (!laeuft) return;
      /* Ohne eigene Eingabe zieht es sich weiter: einmal angestoßen soll der
         Durchflug zu Ende gehen und nicht auf halbem Weg stehen bleiben,
         wenn jemand aufhört zu scrollen. Rund viereinhalb Sekunden von
         allein – wer scrollt, ist deutlich schneller da. */
      ziel.current = Math.min(1.06, ziel.current + 0.004);
      gezeigt += (ziel.current - gezeigt) * 0.12;
      setZoom(gezeigt);
      if (gezeigt >= 1) {
        laeuft = false;
        setStage('done');
        return;
      }
      requestAnimationFrame(takt);
    };
    const id = requestAnimationFrame(takt);

    return () => {
      laeuft = false;
      cancelAnimationFrame(id);
      window.clearTimeout(klickAn);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', durchziehen);
    };
  }, [stage, setStage]);

  /* ---- Überspringen bzw. Weiterscrollen -------------------------------- */
  useEffect(() => {
    if (stage === 'running') {
      const onScrollIntent = () => {
        noteInput();
        skip();
      };
      const onKey = (e: KeyboardEvent) => {
        if (['Escape', ' ', 'Enter', 'ArrowDown', 'PageDown'].includes(e.key)) skip();
      };
      window.addEventListener('keydown', onKey);
      window.addEventListener('wheel', onScrollIntent, { passive: true });
      window.addEventListener('touchmove', onScrollIntent, { passive: true });
      return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('wheel', onScrollIntent);
        window.removeEventListener('touchmove', onScrollIntent);
      };
    }

    if (stage === 'welcome') {
      // Tastatur und Klick brauchen keine Gestenerkennung – sie sind eindeutig.
      const onKey = (e: KeyboardEvent) => {
        if (['Escape', ' ', 'Enter', 'ArrowDown', 'PageDown'].includes(e.key)) {
          lastInputAt.current = 0;
          finish();
        }
      };
      window.addEventListener('keydown', onKey);
      window.addEventListener('wheel', finish, { passive: true });
      window.addEventListener('touchmove', finish, { passive: true });
      return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('wheel', finish);
        window.removeEventListener('touchmove', finish);
      };
    }
  }, [stage, skip, finish, noteInput]);

  if (stage === 'pending') return null;

  const showMark = (stage === 'running' || stage === 'welcome') && step >= partners.length;

  return (
    <>
      <AnimatePresence>
        {stage !== 'done' && (
          <motion.div
            key="curtain"
            aria-label="Begrüßung"
            /* Nur zum Nachsehen von außen: die Phase ist sonst allein an
               Nebenwirkungen erkennbar, was das Prüfen unnötig indirekt
               macht.

               Achtung beim Auswerten: Während der Ausblende rendert
               AnimatePresence dieses Element mit seinen alten Werten weiter.
               Das Attribut steht dann noch auf `welcome`, obwohl die Phase
               längst `done` ist. Verlässlich sind in dem Moment nur die
               Wirkungen – Scrollsperre, `intro-pending`, der Merker in
               sessionStorage. */
            data-intro-stage={stage}
            /* Während des Durchflugs kein eigener Hintergrund: das Schwarz
               kommt dann aus der Maske, die die Schrift ausspart. Läge hier
               noch eine Fläche, sähe man durch das Loch nichts.

               Die Bedingung fragt `zoom > 0` und nicht die Phase ab: beim
               Wechsel auf `done` rendert AnimatePresence den Vorhang für die
               Ausblende ein letztes Mal, und mit der Phasenabfrage bekäme er
               dabei sein Schwarz zurück – ein Aufblitzen genau in dem
               Moment, in dem die Seite stehen soll. */
            className={`fixed inset-0 z-[80] cursor-pointer select-none ${
              stage === 'zoom' || zoom > 0 ? '' : 'bg-void'
            }`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: zoom > 0 ? 0 : 0.8, ease: EASE }}
            onClick={() => {
              if (stage === 'running') {
                skip();
              } else {
                // Ein Klick ist eindeutig, hier braucht es keine Gestenprüfung.
                lastInputAt.current = 0;
                finish();
              }
            }}
          >
            {stage === 'zoom' && <WelcomeZoom fortschritt={zoom} anker={anker} />}

            {/* Partnerlogos, eines nach dem anderen */}
            <div className="pointer-events-none absolute inset-0 px-8" hidden={stage === 'zoom'}>
              {/* Kein `mode="wait"`: dort müsste erst die Ausblende fertig
                  sein, bevor das nächste Logo startet – zusammen wäre das
                  länger als der Taktabstand und die Sequenz liefe aus dem
                  Ruder. Stattdessen liegen die Logos deckungsgleich
                  übereinander und blenden ineinander. */}
              <AnimatePresence>
                {step < partners.length && (
                  <motion.div
                    key={partners[step].key}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    /* Das abtretende Logo geht deutlich schneller als das neue
                       kommt – sonst liegen zwei Logos für einen Moment
                       halbtransparent übereinander, und das sieht nach
                       Fehler aus, nicht nach Übergang. */
                    exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.14 } }}
                    transition={{ duration: 0.26, ease: EASE }}
                  >
                    {/* Feste Box: die Logos haben sehr verschiedene
                        Seitenverhältnisse (TECHART 13:1, ZENVO 1,1:1).
                        `object-contain` bringt sie auf eine gemeinsame
                        optische Größe, und die Maske des Lichtreflexes
                        liegt in genau derselben Box – dadurch deckt sie
                        sich exakt mit dem Bild. */}
                    <div className="relative flex h-[84px] w-[min(74vw,430px)] items-center justify-center sm:h-[124px]">
                      {/* Der Höhenabgleich sitzt auf einem gemeinsamen
                          Wrapper, nicht auf Bild und Reflex einzeln: das
                          Bild ist je nach Seitenverhältnis breiten- oder
                          höhenbegrenzt, der Reflex füllt immer die ganze
                          Box. Dieselbe Prozentangabe hätte beide
                          unterschiedlich weit verschoben – der Reflex wäre
                          als Geisterbild neben der Form gelandet. */}
                      <div
                        className="relative flex h-full w-full items-center justify-center"
                        style={{ transform: markTransform(partners[step]) }}
                      >
                        {/* Kein Flackern hier: der harte Wechsel las als
                            Fehler, nicht als Effekt. Die Marken werden
                            vorgestellt – das trägt allein der ruhige
                            Lichtreflex. */}
                        <Image
                          src={partners[step].logo}
                          alt={partners[step].name}
                          width={partners[step].w}
                          height={partners[step].h}
                          priority
                          /* `h-full w-full object-contain` statt `w-auto`:
                             der Reflex daneben maskiert mit `mask-size:
                             contain` über die volle Box. Steht das Bild in
                             seiner Eigengröße (TECHART und KTM sind kleiner
                             als die Box), ist die Maske größer als das Logo
                             und der Reflex ragt daneben heraus. So haben
                             Bild und Maske exakt dieselbe Geometrie. */
                          className={`h-full w-full object-contain ${
                            partners[step].invertLogo ? 'invert' : ''
                          }`}
                        />
                        {/* Lichtreflex läuft einmal diagonal über die
                            Logoform. Bewusst länger als der Takt: so läuft er
                            noch, wenn das nächste Logo kommt, und wirkt
                            durchgehend statt fünfmal neu angesetzt. */}
                        <span
                          aria-hidden="true"
                          className="logo-shine logo-shine--auto"
                          style={{
                            ['--logo' as string]: `url('${partners[step].logo}')`,
                            ['--sweep' as string]: `${Math.round(PARTNER_MS * 1.6)}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Willkommensgruß – Platz bleibt immer reserviert, damit das
                Logo beim Einblenden nicht nachspringt. */}
            {/* Beim Durchflug verschwindet diese Schrift vollständig – die
                Maske bringt eine eigene mit, deckungsgleich und im SVG. Sie
                hier mitlaufen zu lassen war zweimal falsch: sie lag nie
                exakt auf der Maskenschrift (zweiter Schriftzug knapp
                daneben), und eine CSS-Skalierung vergrößert das gerasterte
                Bild der Schrift, wodurch sie verwischt. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-[calc(50%+4.5rem)] px-6 text-center sm:top-[calc(50%+6rem)]"
              hidden={stage === 'zoom'}
            >
              <motion.div
                data-intro-welcome
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === 'welcome' ? 1 : 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p
                  ref={grussRef}
                  className="font-display text-chrome-gradient text-[clamp(1.9rem,5.5vw,3.1rem)]"
                >
                  Herzlich Willkommen
                </p>
                <p className="label mt-3">Offizieller Vertragshändler</p>
              </motion.div>
            </div>

            {/* Hinweis unten */}
            <motion.p
              className="label pointer-events-none absolute inset-x-0 bottom-8 text-center !text-[9px] !text-ink-dim/70"
              hidden={stage === 'zoom'}
              animate={{ opacity: stage === 'welcome' ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
            >
              {stage === 'welcome' ? 'Scrollen' : 'Klicken zum Überspringen'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Das MOHR-Zeichen liegt bewusst außerhalb des Vorhangs: der Vorhang
          blendet aus, während dasselbe Element per `layoutId` in den Header
          wandert. Läge es im Vorhang, würde es mit ausgeblendet. */}
      {showMark && (
        <div className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center px-8">
          <motion.div
            layoutId={MOHR_MARK_ID}
            data-mohr-mark
            className="relative"
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Image
              src="/logos/mohr-group-logo.png"
              alt="MOHR GROUP · Finest Brands"
              width={444}
              height={348}
              priority
              className="h-[96px] w-auto sm:h-[132px]"
            />
            <span
              aria-hidden="true"
              className="logo-shine logo-shine--auto"
              /* Deutlich langsamer als bei den Partnerlogos: hier ist der
                 Reflex nicht Teil einer Sequenz, sondern der Schlusspunkt –
                 er darf sich Zeit nehmen. */
              style={{
                ['--logo' as string]: "url('/logos/mohr-group-logo.png')",
                ['--sweep' as string]: '3200ms',
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
