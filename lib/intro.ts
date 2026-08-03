/**
 * Konstanten der Begrüßungssequenz.
 *
 * Bewusst ein eigenes Modul ohne `'use client'`: das Inline-Skript im
 * `<head>` wird im Server-Layout zusammengesetzt. Käme der Schlüssel aus
 * einem Client-Modul, erhielte der Server nur einen Client-Referenz-Stub –
 * dessen Quelltext landete dann im Skript und zerbrach die Syntax.
 */

/** Merker, dass die Begrüßung in dieser Sitzung schon gelaufen ist. */
export const INTRO_SESSION_KEY = 'mg-intro-seen';

/** Wird vom Inline-Skript vor dem ersten Paint an <html> gesetzt. */
export const INTRO_PENDING_CLASS = 'intro-pending';
