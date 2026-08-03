/**
 * Einzige Quelle für die Hauptnavigation.
 *
 * Die Reihenfolge ist von links nach rechts gelesen; das Logo steht zwischen
 * `navLeft` und `navRight`. Zwei links / drei rechts ist die ausgeglichenste
 * Aufteilung, weil "Fahrzeuge" und "ABT Sportsline" zusammen etwa so breit
 * bauen wie die drei kürzeren Punkte auf der rechten Seite.
 */
export type NavItem = {
  href: string;
  label: string;
  /** Zusatzzeile im mobilen Menü. */
  hint: string;
};

export const navLeft: NavItem[] = [
  { href: '/fahrzeuge', label: 'Fahrzeuge', hint: 'Portfolio' },
  { href: '/abt-sportsline', label: 'ABT Sportsline', hint: 'Vertragshändler' },
];

export const navRight: NavItem[] = [
  { href: '/veredelungsanfrage', label: 'Veredelungsanfrage', hint: 'Ihr Fahrzeug, veredelt' },
  { href: '/fahrzeug-annahme', label: 'Fahrzeug Annahme', hint: 'We Sell Your Car' },
  { href: '/kontakt', label: 'Kontakt', hint: 'Motorworld München' },
];

export const navAll: NavItem[] = [...navLeft, ...navRight];
