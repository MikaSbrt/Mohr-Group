'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { INTRO_PENDING_CLASS, INTRO_SESSION_KEY } from '@/lib/intro';

/**
 * `pending`  – noch nicht entschieden (erster Render, kennt sessionStorage nicht)
 * `running`  – Partnerlogos laufen durch
 * `welcome`  – Endbild: MOHR-Logo + "Herzlich Willkommen", wartet auf Scrollen
 * `zoom`     – man fährt durch die Schrift in die Seite hinein
 * `done`     – Vorhang weg, Seite normal bedienbar
 */
export type IntroStage = 'pending' | 'running' | 'welcome' | 'zoom' | 'done';

type IntroValue = {
  stage: IntroStage;
  setStage: (stage: IntroStage) => void;
};

const IntroContext = createContext<IntroValue>({ stage: 'done', setStage: () => {} });

export const useIntro = () => useContext(IntroContext);

export default function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [stage, setStage] = useState<IntroStage>('pending');

  /* Ob die Sequenz läuft, entscheidet allein die Klasse am <html>. Das
     Inline-Skript hat sessionStorage bereits vor dem ersten Paint geprüft –
     hier nochmal zu lesen würde bei clientseitiger Navigation zu falschen
     Ergebnissen führen. */
  useEffect(() => {
    const pending =
      pathname === '/' && document.documentElement.classList.contains(INTRO_PENDING_CLASS);
    setStage(pending ? 'running' : 'done');
  }, [pathname]);

  /* Die Klasse fällt schon beim Zoom, nicht erst am Ende: durch die Schrift
     hindurch soll die Startseite zu sehen sein, und solange `intro-pending`
     liegt, ist ihr Inhalt auf Deckkraft 0 gesetzt. Der Merker in
     sessionStorage wird erst gesetzt, wenn die Begrüßung wirklich durch ist. */
  useEffect(() => {
    if (stage === 'zoom' || stage === 'done') {
      document.documentElement.classList.remove(INTRO_PENDING_CLASS);
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== 'done') return;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      /* Privater Modus: dann läuft das Intro beim nächsten Aufruf erneut. */
    }
  }, [stage]);

  const value = useMemo(() => ({ stage, setStage }), [stage]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
