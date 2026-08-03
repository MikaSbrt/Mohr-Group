import type { Metadata } from 'next';
import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/ui/Reveal';
import DemoForm from '@/components/DemoForm';

export const metadata: Metadata = {
  title: 'Fahrzeug Annahme',
  description:
    'We Sell Your Car: Wir übernehmen Ihr Fahrzeug in Kommission oder kaufen es direkt an – Bewertung, Präsentation und Abwicklung aus der Motorworld München.',
};

const modes = [
  {
    title: 'Kommission',
    lead: 'Wir verkaufen für Sie',
    text: 'Ihr Fahrzeug steht bei uns im Showroom, wird professionell fotografiert und über unsere Kanäle angeboten. Sie bleiben Eigentümer bis zum Verkauf und erhalten den vereinbarten Erlös.',
    points: ['Präsentation in der Motorworld', 'Fotostrecke und Exposé', 'Abrechnung nach Verkauf'],
  },
  {
    title: 'Direktankauf',
    lead: 'Wir kaufen sofort',
    text: 'Wenn es schnell gehen soll: Bewertung, Angebot, Abwicklung. Sie bekommen einen festen Preis und müssen nicht auf einen Käufer warten.',
    points: ['Bewertung innerhalb weniger Tage', 'Fester Preis ohne Wartezeit', 'Abmeldung und Papiere über uns'],
  },
];

export default function AnnahmePage() {
  return (
    <>
      <PageIntro
        label="We Sell Your Car"
        title="Fahrzeug Annahme"
        lead="Sport- und Klassikfahrzeuge finden ihren Käufer nicht über den Preis, sondern über die Präsentation. Wir übernehmen Ihr Fahrzeug in Kommission – oder kaufen es direkt an."
        image="/fahrzeuge/Porsche_911_Turbo_3.3.jpg"
        imageAlt="Porsche 911 Turbo 3.3 im Showroom der MOHR GROUP"
      />

      <section className="px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="label">Zwei Wege</p>
            <h2 className="font-display text-chrome-gradient mt-5 max-w-[18ch] text-[clamp(2rem,5.5vw,3.6rem)]">
              Kommission oder Ankauf
            </h2>
          </Reveal>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-px border border-chrome/10 bg-chrome/10 lg:grid-cols-2">
            {modes.map((m, i) => (
              <Reveal key={m.title} delay={0.06 * i}>
                <article className="h-full bg-void px-7 py-9 sm:px-9 sm:py-11">
                  <p className="label !text-[9px]">{m.lead}</p>
                  <h3 className="font-display text-chrome-gradient mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">
                    {m.title}
                  </h3>
                  <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-ink/78">
                    {m.text}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[14px] text-ink/70">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] block h-px w-4 shrink-0 bg-chrome/50"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="anfrage"
        className="border-t border-chrome/10 px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1fr]">
            <Reveal>
              <p className="label">Fahrzeug anbieten</p>
              <h2 className="font-display text-chrome-gradient mt-5 max-w-[14ch] text-[clamp(2rem,5.5vw,3.4rem)]">
                Was steht bei Ihnen
              </h2>
              <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-ink/78">
                Modell, Laufleistung, Zustand – der Rest klärt sich im Gespräch. Bilder können Sie
                später nachreichen.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <DemoForm
                submitLabel="Fahrzeug anbieten"
                fields={[
                  { name: 'name', label: 'Name', placeholder: 'Vor- und Nachname' },
                  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'name@beispiel.de' },
                  { name: 'fahrzeug', label: 'Fahrzeug', placeholder: 'z. B. Porsche 992 Turbo S' },
                  { name: 'laufleistung', label: 'Laufleistung', placeholder: 'z. B. 24.000 km' },
                  {
                    name: 'zustand',
                    label: 'Zustand und Historie',
                    type: 'textarea',
                    span: 'full',
                    placeholder: 'Scheckheft, Unfallfreiheit, Sonderausstattung, Umbauten …',
                  },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
