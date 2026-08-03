'use client';

import { useState } from 'react';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  span?: 'full';
  placeholder?: string;
};

/**
 * Formular für den Konzeptentwurf.
 *
 * Bewusst ohne Ziel: es gibt kein Backend und keinen Empfänger, und es wäre
 * unehrlich, ein Formular zu zeigen, das so aussieht, als würde es etwas
 * verschicken. Der Absendeknopf sagt genau das.
 */
export default function DemoForm({
  fields,
  submitLabel,
}: {
  fields: Field[];
  submitLabel: string;
}) {
  const [notice, setNotice] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setNotice(true);
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {fields.map((f) => (
        <div key={f.name} className={f.span === 'full' ? 'sm:col-span-2' : undefined}>
          <label htmlFor={f.name} className="label block !text-[9px]">
            {f.label}
          </label>
          {f.type === 'textarea' ? (
            <textarea
              id={f.name}
              name={f.name}
              rows={5}
              placeholder={f.placeholder}
              className="mt-3 w-full resize-y border border-chrome/15 bg-void/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink-dim/50 focus:border-chrome/50"
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? 'text'}
              placeholder={f.placeholder}
              className="mt-3 w-full border border-chrome/15 bg-void/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink-dim/50 focus:border-chrome/50"
            />
          )}
        </div>
      ))}

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-4 border border-chrome/25 px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome/60 hover:bg-chrome/5"
        >
          <span>{submitLabel}</span>
          <span
            aria-hidden="true"
            className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-10"
          />
        </button>

        <p aria-live="polite" className="mt-5 max-w-[52ch] text-[13px] leading-relaxed text-ink-dim">
          {notice
            ? 'Konzeptentwurf: Dieses Formular ist nicht angeschlossen – es wurde nichts gesendet und nichts gespeichert.'
            : 'Konzeptentwurf: Das Formular zeigt nur den Aufbau, es versendet keine Daten.'}
        </p>
      </div>
    </form>
  );
}
