import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import IntroProvider from '@/components/intro/IntroProvider';
import IntroSequence from '@/components/intro/IntroSequence';
import { INTRO_PENDING_CLASS, INTRO_SESSION_KEY } from '@/lib/intro';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MOHR GROUP – Finest Brands',
    template: '%s · MOHR GROUP',
  },
  description:
    'Offizieller Vertragshändler für ABT Sportsline, BRABUS, TECHART, ZENVO und KTM X-BOW in der Motorworld München. Konzeptentwurf eines digitalen Markenauftritts.',
  // Private Demo – bleibt bewusst außerhalb der Suchmaschinen.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#050506',
  colorScheme: 'dark',
};

/**
 * Läuft synchron vor dem ersten Paint. Entscheidet, ob die Begrüßung gezeigt
 * wird, und legt vorab den schwarzen Vorhang – sonst wäre für einen Moment
 * die Seite zu sehen, bevor React übernimmt.
 */
const introGate = `
try {
  if (location.pathname === '/' && !sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})) {
    document.documentElement.classList.add(${JSON.stringify(INTRO_PENDING_CLASS)});
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${bebas.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
      </head>
      <body className="antialiased">
        <IntroProvider>
          <SmoothScroll />
          <IntroSequence />
          <SiteHeader />
          <main id="inhalt" data-intro-hide>
            {children}
          </main>
          <div data-intro-hide>
            <SiteFooter />
          </div>
        </IntroProvider>
      </body>
    </html>
  );
}
