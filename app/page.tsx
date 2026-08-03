import HomeHero from '@/components/HomeHero';
import Partners from '@/components/Partners';
import BrandVault from '@/components/BrandVault';
import VehicleGallery from '@/components/VehicleGallery';
import VehicleShowcase from '@/components/vehicle3d/VehicleShowcase';
import Showroom from '@/components/Showroom';

/* ---------------------------------------------------------------------------
   PARKPLATZ: WebGL-Partikel-Hero
   ---------------------------------------------------------------------------
   Der Einstieg der Startseite ist jetzt die Begrüßungssequenz
   (`components/intro/IntroSequence.tsx`). Der frühere Vollbild-Hero war für
   den ersten Eindruck zu wuchtig, bleibt aber vollständig erhalten:

     components/hero/Hero.tsx            Sektion mit Fallback ohne WebGL
     components/hero/HeroCanvas.tsx      R3F-Canvas
     components/hero/ParticleVehicle.tsx sampelt ABT_SQ8_abtpage.jpg zur Punktwolke
     components/hero/ChromeDust.tsx      Staubschicht

   Wieder einhängen: Import unten aktivieren und <Hero /> an die gewünschte
   Stelle setzen. Die Komponente bringt Höhe, Scroll-Choreografie und
   Reduced-Motion-Fallback selbst mit, sie funktioniert an jeder Position.

   import Hero from '@/components/hero/Hero';

   ---------------------------------------------------------------------------
   PARKPLATZ: Kanten-Hologramm und Foto-Studie
   ---------------------------------------------------------------------------
   An dieser Stelle standen nacheinander zwei Vorstufen der heutigen Sektion
   `components/vehicle3d/VehicleShowcase.tsx`. Beide bleiben erhalten:

     components/hologram/HologramSpotlight.tsx  prozedurales Kantenmodell
     components/hologram/HologramCanvas.tsx     R3F-Szene dazu
     components/hologram/rs6-lines.ts           Geometrie und Maße
     components/VehicleStudy.tsx                Foto mit Detailhinweisen

   Die Foto-Studie ist weiter brauchbar, falls das 3D-Modell wegfällt – siehe
   den Lizenzhinweis in der README. Sie ist eigenständig und lässt sich ohne
   Anpassung wieder einsetzen.

   import HologramSpotlight from '@/components/hologram/HologramSpotlight';
   import VehicleStudy from '@/components/VehicleStudy';
   --------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Partners />
      <BrandVault />
      <VehicleGallery />
      <VehicleShowcase />
      <Showroom />
    </>
  );
}
