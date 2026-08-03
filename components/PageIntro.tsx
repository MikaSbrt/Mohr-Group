import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

/**
 * Gemeinsamer Seitenkopf für die Unterseiten – hält Typografie, Abstände
 * und Bildbehandlung über alle Routen hinweg gleich.
 */
export default function PageIntro({
  label,
  title,
  lead,
  image,
  imageAlt,
  imageClass = 'opacity-70 contrast-[1.06] brightness-[0.6] saturate-[0.85]',
}: {
  label: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  imageClass?: string;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-chrome/10">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover ${imageClass}`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,6,0.82) 0%, rgba(5,5,6,0.34) 38%, rgba(5,5,6,0.88) 100%)',
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 pt-[clamp(9rem,20vh,13rem)] pb-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <Reveal>
          <p className="label">{label}</p>
          <h1 className="font-display text-chrome-gradient mt-5 max-w-[16ch] text-[clamp(2.6rem,8vw,6rem)]">
            {title}
          </h1>
          <p className="mt-7 max-w-[54ch] text-[15px] leading-relaxed text-ink/85 sm:text-base">
            {lead}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
