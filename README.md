# MOHR GROUP – Demo-Website (Konzeptentwurf)

Privater Akquise-Entwurf für die MOHR GROUP, offizieller Vertragshändler für
ABT Sportsline, BRABUS, TECHART, ZENVO und KTM X-BOW in der Motorworld
München. **Kein Live-Auftritt, keine Bestandsanzeige, kein verbindliches
Angebot.**

> ## ⚠ Vor dem Bereitstellen lesen
>
> **Ein privates Repository macht die Seite nicht privat.** Das Repository
> schützt den Quelltext; jede Vercel-Bereitstellung bekommt trotzdem eine
> öffentlich erreichbare Adresse unter `*.vercel.app`. Wer sie kennt oder
> errät, sieht die Seite.
>
> Drei Inhalte dürfen **nicht öffentlich ausgeliefert** werden:
>
> | Inhalt | Lage |
> |---|---|
> | `public/modelle/abt-rs6-r.glb` | CC-BY-NC-SA 4.0 – **keine kommerzielle Nutzung**, Namensnennung Pflicht |
> | `public/hero/*` | Fundstücke, Herkunft ungeklärt |
> | `public/logos/*` | fremde Wortmarken, hier nur zur Darstellung der Partnerschaft |
>
> **Also vor dem ersten Deployment in Vercel den Zugriffsschutz einschalten**
> (Projekt → Settings → Deployment Protection), sodass nur angemeldete
> Berechtigte die Seite öffnen können. Erst danach bereitstellen.
>
> `noindex, nofollow` ist gesetzt und hält Suchmaschinen fern – aber nicht
> jemanden, der die Adresse hat. Das ersetzt den Zugriffsschutz nicht.
>
> Für einen echten Livegang: kommerzielle Lizenz für das 3D-Modell erwerben
> oder die Sektion auf `components/VehicleStudy.tsx` zurückschalten (Foto mit
> Detailhinweisen, liegt fertig daneben), und die Herkunft der Hero-Motive
> klären.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber /
three · GSAP + ScrollTrigger · Framer Motion · Lenis.

Rein statisch – alle Seiten werden vorgerendert, kein Server, keine Datenbank.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deployment

Zuerst den Zugriffsschutz oben lesen. Dann: Zero-Config auf Vercel –
Repository verbinden oder `vercel .`, das Framework wird als Next.js erkannt,
Build-Command und Output-Verzeichnis bleiben leer.

`.gitignore` schließt `node_modules/`, `.next/` und `.vercel/` aus.

### Der Ordner `GitHub-Upload/`

Eine aufgeräumte Kopie zum Hochladen: nur `app/`, `components/`, `lib/`,
`public/` und die Konfiguration. Nicht enthalten sind Dinge, die niemanden
außerhalb angehen – der Bildbestand unter `Meine Bilder/`, die erste Fassung
in `_v1-teaser/`, die Aufgabenstellung und eine fremde Demo-Datei.

**Es ist eine Kopie, kein zweiter Arbeitsstand.** Änderungen gehören in den
Projektstamm; der Ordner wird danach neu erzeugt, sonst veraltet er
stillschweigend. Genau daran ist ein früherer `Website final/` gescheitert.

```bash
robocopy . GitHub-Upload app components lib public /MIR
copy .gitignore next.config.mjs package.json package-lock.json postcss.config.mjs tsconfig.json README.md GitHub-Upload\
```

## Seitenstruktur

Die fünf Navigationspunkte definieren die Struktur (Reihenfolge von links
nach rechts um das zentrierte Logo):

| Route | Navigationspunkt |
|---|---|
| `/fahrzeuge` | Fahrzeuge (Portfolio) |
| `/abt-sportsline` | ABT Sportsline |
| `/veredelungsanfrage` | Veredelungsanfrage |
| `/fahrzeug-annahme` | Fahrzeug Annahme (We Sell Your Car) |
| `/kontakt` | Kontakt |

Dazu `/` (Startseite) und `/fahrzeuge/[slug]` mit 12 Fahrzeug-Detailseiten.

```
app/
  layout.tsx              Fonts, Intro-Gate, Header/Footer, Smooth-Scroll
  page.tsx                Startseite
  abt-sportsline/         Markenseite
  veredelungsanfrage/     Veredelung + Anfrageformular
  fahrzeug-annahme/       We Sell Your Car + Formular
  kontakt/                Kontaktdaten + Formular
  fahrzeuge/              Übersicht und Detailseiten
components/
  intro/                  Begrüßungssequenz (Vorhang, Partnerlogos, Übergabe)
  vehicle3d/              Studie am RS6-R-Modell, Legende steuert die Kamera
  hologram/               PARKPLATZ – Kantenmodell, Vorstufe der Studie
  VehicleStudy.tsx        PARKPLATZ – Foto mit Detailhinweisen, Vorstufe
  hero/                   PARKPLATZ – siehe unten
  Partners.tsx            fünf Vertragspartner als Kacheln
  BrandVault.tsx          ABT ⇄ BRABUS, scrollgesteuerter Wisch
  VehicleGallery.tsx      kuratierte Startseiten-Galerie
  PageIntro.tsx           gemeinsamer Seitenkopf der Unterseiten
  DemoForm.tsx            Formular ohne Ziel (sagt das auch)
lib/
  intro.ts                Konstanten der Begrüßung (bewusst serverfähig)
  nav.ts                  Navigation, links/rechts vom Logo
  partners.ts             die fünf Marken
  vehicles.ts             Fahrzeugdaten (12 Einträge)
  motion.ts               reduced-motion, Geräteklasse, WebGL-Test
public/fahrzeuge/         85 Originalfotos der MOHR GROUP
public/logos/             MOHR GROUP, ABT, BRABUS, TECHART, ZENVO, KTM X-BOW
_v1-teaser/               erste Fassung, reines HTML/CSS/JS (Archiv)
```

## Begrüßungssequenz

Beim ersten Aufruf der Startseite pro Sitzung: schwarzes Vollbild, die fünf
Partnerlogos erscheinen nacheinander mit einem Lichtreflex, dann übernimmt
das MOHR-Zeichen und „Herzlich Willkommen".

Danach fährt man **durch die Schrift in die Seite hinein**: „Herzlich
Willkommen“ ist dann kein Text mehr, sondern ein Loch. Über der Startseite
liegt eine schwarze Fläche, aus der die Buchstaben ausgespart sind – dadurch
sieht man die Seite *durch* die Schrift. Beim Scrollen wächst sie, das Loch
wird größer, am Ende ist die Fläche weg (`components/intro/WelcomeZoom.tsx`).

Umgesetzt als SVG-Maske: weiß deckt, schwarz stanzt aus. `background-clip:
text` kann das nicht – es färbt Schrift, schneidet aber nichts heraus.
(Audi macht es auf der A6-e-tron-Seite mit „Ready.“ genauso; ihr Modul heißt
`scroll-zoom-text-mask`.)

Vier Dinge, die dabei zusammenpassen müssen:

- **Der Zoom zielt auf das „I“ von WILLKOMMEN**, nicht auf den
  Wortmittelpunkt. Dort läge das Leerzeichen, und durch ein Leerzeichen
  kommt man nicht hindurch. Das „I“ ist ein voller senkrechter Balken; zoomt
  man auf einen Punkt darin, wächst diese Fläche über den ganzen Bildschirm.
  Seine Lage wird mit `getExtentOfChar` am gerenderten Text erfragt.
- **Die Vergrößerung muss groß genug sein** (320): der Balken ist bei 50 px
  Schriftgrad nur rund acht Pixel breit. Bei zu kleinem Wert bliebe links
  und rechts Seite sichtbar und der Schluss käme aus dem Ausblenden – der
  Durchflug wäre dann keiner.
- **Alles im SVG, nichts in HTML.** Eine CSS-Skalierung vergrößert das
  bereits gerasterte Bild der Schrift, sie verwischt sichtbar. Der helle
  Schriftzug beim Start ist deshalb ein zweiter SVG-Text über der Maske,
  deckungsgleich – nicht der HTML-Text des Vorhangs.
- **Die Phase `zoom` nimmt `intro-pending` schon weg**, sonst läge der
  Seiteninhalt hinter der Maske noch auf Deckkraft 0.

Beim Prüfen: `data-intro-stage` am Vorhang steht während der Ausblende noch
auf dem alten Wert, weil AnimatePresence das Element mit seinen alten Werten
weiterrendert. Verlässlich sind dann nur die Wirkungen – Scrollsperre,
`intro-pending`, der Merker in sessionStorage.

- Klick, Leertaste, Escape oder Scrollen überspringt zum Endbild.
- Das Logo wandert per `layoutId` aus der Mitte in den Header – die Übergabe
  läuft, während man durch die Schrift fährt.
- `prefers-reduced-motion` überspringt den Durchflug ganz.
- Ein Inline-Skript im `<head>` legt den Vorhang **vor dem ersten Paint**;
  ohne das wäre für einen Moment der Seiteninhalt zu sehen.
- `sessionStorage`-Merker verhindert die Wiederholung. Zum Testen leeren.
- `prefers-reduced-motion` zeigt direkt das Endbild.

## Startsektion

`components/HomeHero.tsx` – Vollbild, ein Motiv, eine Aussage. Ohne sie
landete man nach der Begrüßung mitten in der Seite.

Zwei Motive wurden gebaut und verglichen (`public/hero/`), entschieden ist
`drei-autos`: RS7 und G-Klasse sind ABT- und BRABUS-Terrain, und das kalte,
neblige Bild trägt das Chrome-auf-Schwarz der Seite. Die Alternative vom
Odeonsplatz zeigt einen Pininfarina – keine der fünf Marken – und bringt
eine gelbe Fassade mit, die gegen das Farbklima arbeitet. Umschalten über
die Konstante `VARIANTE`.

**Beide Motive sind Fundstücke, keine belegten Eigenaufnahmen.** Vor einem
Livegang ist die Herkunft zu klären.

## Studie am 3D-Modell

`components/vehicle3d/` – ein ABT RS6-R in einer Halle, zum Drehen und
Heranholen. Die Legende ist die Steuerung: ein Klick fährt die Kamera an die
Stelle, ein zweiter zurück zur Gesamtansicht.

**Bedienung.** Mit der Maus dreht Ziehen jederzeit; das Rad zoomt erst nach
einem Klick in die Fläche und gibt beim Verlassen wieder ab. Ohne diese
Sperre bliebe die Seite hängen, sobald jemand mit dem Zeiger über dem
Fahrzeug weiterblättert. Dazu gehört `data-lenis-prevent` auf der Fläche –
Lenis hört global auf das Mausrad, ein `preventDefault` der OrbitControls
erreicht es nicht. Am Fingergerät macht ein Finger nichts (die Seite
scrollt), zwei Finger drehen und zoomen.

**Halle.** Spiegelnder Boden, Lichtbänder unter der Decke, die sich darin
abzeichnen, eine Standmarkierung und eine dunkle Rundwand, die der Nebel
ausklingen lässt. Zuvor stand der Wagen im leeren Schwarz und schwebte.

**Leuchten.** Scheinwerfer und Rückleuchten strahlen selbst, dazu je eine
kurzreichweitige Lampe im Zentrum jeder Leuchteinheit für den Abglanz.

Die vier Positionen werden aus der Geometrie **ausgemessen** (Mittel über die
Eckpunkte der Leuchtenmeshes, getrennt nach vorn/hinten und links/rechts),
nicht geschätzt. Geschätzte Werte lagen vor der Haube statt in den
Scheinwerfern und leuchteten das Fahrzeug von außen an – das las als
Flutlicht.

Zwei weitere Fallstricke: das Scheinwerfermaterial ist ein gewöhnliches
`MeshStandardMaterial` – der glTF-Loader erzeugt `MeshPhysicalMaterial` nur
bei Erweiterungen wie Transmission, eine Prüfung auf Physical übersieht es
stillschweigend. Und die Leuchtvorlage muss `emissiveMap` sein, sonst glüht
das ganze Gehäuse statt nur der Lichtleiter.

```
components/vehicle3d/VehicleShowcase.tsx  Sektion, Legende, Fallback
components/vehicle3d/VehicleCanvas.tsx    R3F-Szene, Licht, Kamerafahrt
lib/rs6-details.ts                        die fünf Ansichten
public/modelle/abt-rs6-r.glb              das Modell (2,3 MB)
public/draco/                             Dekoder, lokal statt vom CDN
```

Die Rohdaten waren 15,3 MB in glTF, Bin und 38 PNG. Über `gltf-transform`
(zusammenführen, verschweißen, WebP, Draco) bleiben **2,3 MB** in einer
Datei. Allein der Bremssattel lag als rund 170 Einzelobjekte vor.

Achsen: X quer, Y hoch, Z längs, **Front bei positivem Z**. Das Modell wird
beim Laden mit Faktor 100 auf Meter gebracht, dadurch sind die Kamerawerte
in `lib/rs6-details.ts` am realen Fahrzeug nachvollziehbar.

> ### ⚠ Lizenz – blockiert den Livegang
>
> Das Modell steht unter **CC-BY-NC-SA 4.0** (Ddiaz Design, via Sketchfab):
> Namensnennung Pflicht, **keine kommerzielle Nutzung**, Bearbeitungen unter
> gleicher Lizenz. Für diesen nicht öffentlichen Entwurf tragbar, für einen
> Auftritt der MOHR GROUP **nicht**.
>
> Vor einem Livegang entweder eine kommerzielle Lizenz erwerben oder die
> Sektion gegen `components/VehicleStudy.tsx` tauschen (Foto mit
> Detailhinweisen, liegt fertig daneben, siehe `app/page.tsx`).
>
> Die Namensnennung unter dem Modell ist Auflage der Lizenz – sie darf nicht
> entfernt werden, solange das Modell eingebunden ist. Der Lizenztext liegt
> als `public/modelle/abt-rs6-r.license.txt` bei.

Vorstufen dieser Sektion sind erhalten und in `app/page.tsx` dokumentiert:
das prozedurale Kanten-Hologramm (`components/hologram/`) und die Foto-Studie
(`components/VehicleStudy.tsx`), bei der die Detailpunkte über ein
Koordinatenraster auf dem Originalbild abgelesen wurden.

## Parkplatz: WebGL-Partikel-Hero

Der Vollbild-Hero aus Runde 1 war für den ersten Eindruck zu wuchtig und ist
**aus `app/page.tsx` ausgehängt, aber vollständig erhalten**:

```
components/hero/Hero.tsx             Sektion inkl. Fallback ohne WebGL
components/hero/HeroCanvas.tsx       R3F-Canvas
components/hero/ParticleVehicle.tsx  sampelt ABT_SQ8_abtpage.jpg zur Punktwolke
components/hero/ChromeDust.tsx       Staubschicht
```

Wieder einhängen: in `app/page.tsx` den dort kommentierten Import aktivieren
und `<Hero />` an die gewünschte Stelle setzen. Die Komponente bringt Höhe,
Scroll-Choreografie und Reduced-Motion-Fallback selbst mit.

## Laufruhe

Drei Eingriffe, alle ohne sichtbare Wirkung – gemessen, nicht geschätzt:

**Das 3D-Fenster entsteht erst kurz bevor man es braucht.** Vorher wurde es
sofort beim Seitenaufruf gebaut, mitten in der Begrüßung: Entpacken des
Modells, 198 Meshes aufbauen, Shader übersetzen, Spiegelung einrichten. Das
blockierte den Hauptstrang **7502 ms** am Stück (längste Einzelaufgabe
4636 ms) – daher blieb die Logofolge stehen und Scrollen kam nicht an. Jetzt
löst ein `IntersectionObserver` den Aufbau aus, wenn die Sektion noch gut
einen Bildschirm entfernt ist; zusätzlich baut ein `requestIdleCallback`
schon vor, sobald die Begrüßung durch ist und nichts zu tun hat.
**Nachher: 144–151 ms.**

**Es zeichnet nur, wenn es im Bild ist.** `frameloop` steht sonst auf
`demand`. Vorher lief die Szene dauerhaft mit voller Bildrate – auch mehrere
Bildschirmhöhen entfernt –, und jedes Bild kostet dreifach: Szene,
Spiegelung im Boden, Schattenkarte. Das lief die ganze Zeit gegen das
Scrollen der übrigen Seite.

**Kein Schattenwurf am Scheinwerfer.** Er kostete pro Bild einen weiteren
kompletten Durchgang durch alle 271.000 Dreiecke – **35 statt 44 fps** – und
war praktisch unsichtbar: bei identischer Kamera wichen 0,5 % der Bildpunkte
ab, im Mittel 0,34 von 765. Der sichtbare Schatten unter dem Fahrzeug kommt
von `ContactShadows` und ist unberührt. Damit fällt auch `shadows` am
`<Canvas>` weg.

Beim Nachmessen: Der Entwicklungsserver rechnet jede Bildgröße beim ersten
Abruf aus und stiehlt dabei selbst Rechenzeit – ohne Vorwärmen misst man den
Server mit, nicht die Seite.

## Bewegungsbudget

1. **Begrüßung** – Partnerlogos, Lichtreflex, Übergabe des Logos in den Header.
2. **Brand Vault** – BRABUS wischt über ABT, Inhalte gestaffelt.
3. **Studie** – 3D-Modell in der Halle, dreht langsam von selbst,
   Kamerafahrt auf Klick, leuchtende Scheinwerfer und Rückleuchten.

Dazu leise: Scroll-Reveals, Parallax im Showroom, magnetische Buttons,
Chrome-Shine auf den Markenlogos, Shared-Element-Übergang in die
Fahrzeugseiten.

`prefers-reduced-motion: reduce` schaltet WebGL-Bewegung, Lenis, GSAP und alle
Reveals ab.

## Inhaltliche Hinweise

- Die **Fotos sind Originalmaterial der MOHR GROUP** (85 Dateien), keine
  Platzhalter. Für Hero- und Hauptaufnahmen wurden die Motive mit ruhigem
  Hintergrund gewählt.
- **Logos**: TECHART und KTM X-BOW lagen nur auf schwarzem Grund bzw. mit
  schwarzer Schrift vor und wurden freigestellt und umgefärbt
  (`public/logos/`).
- **ZENVO** hat keine Kachel-Aufnahme, weil im Bestand kein passendes
  Fahrzeugfoto liegt – die Kachel trägt bewusst nur Grafit statt eines
  fremden Autos.
- **TECHART** ist mit einer Porsche-Aufnahme hinterlegt, da TECHART
  ausschließlich Porsche veredelt.
- Die **technischen Daten in `lib/vehicles.ts` sind Beispieldaten**.
  Kontaktdaten, Adresse und Öffnungszeiten sind Platzhalter.
- Die Seite trägt `noindex, nofollow`.
