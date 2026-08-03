import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-void px-6 text-center">
      <p className="label">Fehler 404</p>
      <h1 className="font-display text-chrome-gradient max-w-[14ch] text-[clamp(2.5rem,9vw,7rem)]">
        Diese Seite steht nicht im Showroom
      </h1>
      <Link
        href="/"
        className="border border-chrome/30 px-8 py-4 text-sm transition-colors duration-500 hover:border-chrome hover:bg-chrome hover:text-black"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
