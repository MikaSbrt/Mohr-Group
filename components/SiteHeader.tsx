'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TransitionLink, { NavTransitions } from '@/components/ui/TransitionLink';
import Magnetic from '@/components/ui/Magnetic';
import { navAll, navLeft, navRight, type NavItem } from '@/lib/nav';
import { useIntro } from '@/components/intro/IntroProvider';
import { MOHR_MARK_ID } from '@/components/intro/IntroSequence';

const EASE = [0.16, 1, 0.3, 1] as const;

function NavLink({ item }: { item: NavItem }) {
  return (
    /* Sehr zurückhaltend: bei 0.16 lief der Link dem Zeiger spürbar
       hinterher und wirkte wacklig. Es soll nur leicht antworten. */
    <Magnetic strength={0.055} className="inline-block">
      <TransitionLink
        href={item.href}
        className="label whitespace-nowrap !text-[10px] px-2 py-2 transition-colors duration-300 hover:text-chrome-hi lg:!text-[11px] lg:px-3"
      >
        {item.label}
      </TransitionLink>
    </Magnetic>
  );
}

export default function SiteHeader() {
  const { stage } = useIntro();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü schließt sich, sobald navigiert wurde
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* Solange die Intro-Sequenz läuft, gehört das Logo ihr – sonst gäbe es
     zwei Elemente mit derselben `layoutId` und die Übergabe bräche.
     Im Zustand `pending` (erster Render, noch nichts entschieden) wird ein
     schlichtes Logo ohne `layoutId` gezeigt, damit auf Unterseiten nichts
     aufblitzt. */
  /* Schon beim Durchflug übernimmt der Header das Zeichen: die Übergabe aus
     der Bildmitte läuft dann, während man durch die Schrift fährt. Wartete
     sie bis zum Ende, käme sie erst, wenn die Seite längst steht. */
  const markMode: 'shared' | 'plain' | 'hidden' =
    stage === 'done' || stage === 'zoom'
      ? 'shared'
      : stage === 'pending'
        ? 'plain'
        : 'hidden';

  const logo = (
    <Image
      src="/logos/mohr-group-logo.png"
      alt="MOHR GROUP · Finest Brands"
      width={444}
      height={348}
      priority
      /* Das Zeichen trägt viel Detail (Kranz, Wortmarke, "Finest Brands").
         Unter etwa 48 px zerfällt die Unterzeile zu Matsch. */
      className="h-12 w-auto drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] sm:h-14"
    />
  );

  return (
    <>
      <NavTransitions />
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:bg-chrome focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Zum Inhalt springen
      </a>

      <header
        data-intro-hide
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          solid
            ? 'border-b border-chrome/10 bg-void/72 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        {/* Drei Spalten mit gleich breiten Außenspalten: das Logo bleibt
            exakt mittig, egal wie breit die Navigationstexte ausfallen.

            Die beiden Navigationsblöcke stehen `justify-center` in ihrer
            Spalte, nicht am Logo geklebt. Links sind es zwei kurze Punkte,
            rechts drei lange – mit `justify-end`/`justify-start` klaffte
            deshalb außen links eine Lücke, während rechts bis zum Rand
            gefüllt war. Zentriert verteilt sich der Weißraum auf beiden
            Seiten gleich und die Leiste steht ruhig. */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-3 sm:px-8 lg:px-12">
          <nav aria-label="Hauptnavigation links" className="hidden justify-center gap-2 lg:flex">
            {navLeft.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Mobil links: Menüschalter statt Navigation */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="label flex items-center gap-2 justify-self-start !text-[10px] py-2 lg:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-chrome transition-transform duration-300 ${
                  menuOpen ? 'translate-y-[4px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-chrome transition-transform duration-300 ${
                  menuOpen ? '-translate-y-[4px] -rotate-45' : ''
                }`}
              />
            </span>
            {menuOpen ? 'Schließen' : 'Menü'}
          </button>

          <div className="flex justify-center">
            <TransitionLink href="/" aria-label="MOHR GROUP – Startseite" className="block">
              {markMode === 'shared' && (
                <motion.div layoutId={MOHR_MARK_ID} transition={{ duration: 0.9, ease: EASE }}>
                  {logo}
                </motion.div>
              )}
              {markMode === 'plain' && logo}
              {/* `hidden`: das Logo steht währenddessen in der Intro-Sequenz.
                  Der Platzhalter hält die Kopfhöhe stabil. */}
              {markMode === 'hidden' && <div className="h-12 sm:h-14" />}
            </TransitionLink>
          </div>

          <nav aria-label="Hauptnavigation rechts" className="hidden justify-center gap-2 lg:flex">
            {navRight.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Rechte Spalte mobil leer – hält das Logo trotzdem mittig */}
          <span className="lg:hidden" aria-hidden="true" />
        </div>
      </header>

      {/* Mobiles Menü */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[55] bg-void/96 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <nav
              aria-label="Hauptnavigation"
              /* Größerer Abstand zwischen den Einträgen, engerer innerhalb:
                 sonst liest die Unterzeile als Überschrift des nächsten. */
              className="flex h-full flex-col items-center justify-center gap-7 px-8"
            >
              {navAll.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 * i, ease: EASE }}
                  className="text-center"
                >
                  <TransitionLink
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-chrome-gradient block text-[clamp(1.9rem,8vw,2.8rem)]"
                  >
                    {item.label}
                  </TransitionLink>
                  <span className="label !text-[9px] !text-ink-dim/70">{item.hint}</span>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
