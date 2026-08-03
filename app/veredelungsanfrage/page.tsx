import type { Metadata } from 'next';
import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/ui/Reveal';
import DemoForm from '@/components/DemoForm';

export const metadata: Metadata = {
  title: 'Veredelungsanfrage',
  description:
    'Ihr Fahrzeug, veredelt: Leistung, Aerodynamik, Räder und Interieur durch ABT Sportsline, BRABUS oder TECHART – abgestimmt in der Motorworld München.',
};

const steps = [
  {
    n: '01',
    title: 'Gespräch',
    text: 'Wir klären, was das Fahrzeug können soll und wo es später steht. Manches lässt sich kombinieren, manches schließt sich aus – das gehört vor die Kalkulation, nicht dahinter.',
  },
  {
    n: '02',
    title: 'Konzept',
    text: 'Sie erhalten eine Zusammenstellung mit Bauteilen, Leistungsstufe, Terminfenster und Preis. Auf Wunsch mit Visualisierung von Lack, Rad und Innenraum.',
  },
  {
    n: '03',
    title: 'Umbau',
    text: 'Die Arbeiten laufen beim jeweiligen Veredler oder in unserer Werkstatt. Bauteile mit Gutachten werden eingetragen, alles andere dokumentiert.',
  },
  {
    n: '04',
    title: 'Abnahme',
    text: 'Übergabe in der Motorworld, inklusive Papieren, Gutachten und Fotostrecke des fertigen Fahrzeugs.',
  },
];

export default function VeredelungPage() {
  return (
    <>
      <PageIntro
        label="Veredelung"
        title="Ihr Fahrzeug, veredelt"
        lead="Leistung, Aerodynamik, Räder, Interieur – als Vertragshändler von ABT Sportsline, BRABUS und TECHART setzen wir Programme um, die freigegeben und eintragungsfähig sind. Kein Basteln, sondern Serienqualität."
        image="/fahrzeuge/ABT_RS6_Legacy_Edition_abtpage.jpg"
        imageAlt="ABT RS6 Legacy Edition"
      />

      <section className="px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="label">Ablauf</p>
            <h2 className="font-display text-chrome-gradient mt-5 max-w-[16ch] text-[clamp(2rem,5.5vw,3.6rem)]">
              Vier Schritte
            </h2>
          </Reveal>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-px border border-chrome/10 bg-chrome/10 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={0.05 * i}>
                <article className="h-full bg-void px-7 py-9 sm:px-9 sm:py-11">
                  <p className="font-display text-[clamp(2rem,4vw,2.8rem)] text-chrome/22">{s.n}</p>
                  <h3 className="font-display text-chrome-gradient mt-3 text-[clamp(1.4rem,2.8vw,1.9rem)]">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink/78">
                    {s.text}
                  </p>
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
              <p className="label">Anfrage</p>
              <h2 className="font-display text-chrome-gradient mt-5 max-w-[14ch] text-[clamp(2rem,5.5vw,3.4rem)]">
                Erzählen Sie uns vom Fahrzeug
              </h2>
              <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-ink/78">
                Je genauer die Ausgangslage, desto belastbarer das Konzept. Fahrgestellnummer
                brauchen wir erst später.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <DemoForm
                submitLabel="Anfrage senden"
                fields={[
                  { name: 'name', label: 'Name', placeholder: 'Vor- und Nachname' },
                  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'name@beispiel.de' },
                  { name: 'telefon', label: 'Telefon', type: 'tel', placeholder: 'Optional' },
                  { name: 'fahrzeug', label: 'Fahrzeug', placeholder: 'z. B. Audi RS6 C8, 2023' },
                  {
                    name: 'wunsch',
                    label: 'Gewünschte Veredelung',
                    type: 'textarea',
                    span: 'full',
                    placeholder: 'Leistung, Optik, Räder, Interieur – was schwebt Ihnen vor?',
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
