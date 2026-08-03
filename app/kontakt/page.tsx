import type { Metadata } from 'next';
import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/ui/Reveal';
import DemoForm from '@/components/DemoForm';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'MOHR GROUP in der Motorworld München – offizieller Vertragshändler für ABT Sportsline, BRABUS, TECHART, ZENVO und KTM X-BOW.',
};

/* Platzhalter: Adresse und Zeiten sind für den Entwurf gesetzt und vor einem
   echten Einsatz durch die tatsächlichen Angaben zu ersetzen. */
const details = [
  { k: 'Showroom', v: ['Motorworld München', 'München, Deutschland'] },
  { k: 'Telefon', v: ['+49 000 000 00 00'] },
  { k: 'E-Mail', v: ['kontakt@example.com'] },
  { k: 'Öffnungszeiten', v: ['Mo – Fr  10 – 18 Uhr', 'Sa  10 – 16 Uhr'] },
];

export default function KontaktPage() {
  return (
    <>
      <PageIntro
        label="Kontakt"
        title="Motorworld München"
        lead="Zwischen Klassikern, Rennwagen und Manufakturen: die MOHR GROUP steht in der Motorworld München. Wer hereinkommt, sucht selten ein Auto – er sucht ein bestimmtes."
        image="/fahrzeuge/ABT_RS6-S.jpg"
        imageAlt="Showroom der MOHR GROUP in der Motorworld München"
      />

      <section className="px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.85fr_1fr]">
            <Reveal>
              <dl className="border-t border-chrome/12">
                {details.map((d) => (
                  <div
                    key={d.k}
                    className="grid grid-cols-[9rem_1fr] gap-4 border-b border-chrome/12 py-6"
                  >
                    <dt className="label !text-[9px]">{d.k}</dt>
                    <dd className="space-y-1">
                      {d.v.map((line) => (
                        <p key={line} className="text-[15px] text-ink/85">
                          {line}
                        </p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 max-w-[44ch] text-[13px] leading-relaxed text-ink-dim">
                Konzeptentwurf: Adresse, Telefonnummer und Öffnungszeiten sind Platzhalter und vor
                einem Live-Einsatz zu ersetzen.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="label">Nachricht</p>
              <h2 className="font-display text-chrome-gradient mt-5 max-w-[14ch] text-[clamp(2rem,5.5vw,3.4rem)]">
                Schreiben Sie uns
              </h2>
              <div className="mt-9">
                <DemoForm
                  submitLabel="Nachricht senden"
                  fields={[
                    { name: 'name', label: 'Name', placeholder: 'Vor- und Nachname' },
                    {
                      name: 'email',
                      label: 'E-Mail',
                      type: 'email',
                      placeholder: 'name@beispiel.de',
                    },
                    { name: 'telefon', label: 'Telefon', type: 'tel', placeholder: 'Optional' },
                    { name: 'betreff', label: 'Betreff', placeholder: 'Worum geht es?' },
                    {
                      name: 'nachricht',
                      label: 'Nachricht',
                      type: 'textarea',
                      span: 'full',
                      placeholder: 'Ihre Nachricht an die MOHR GROUP',
                    },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
