'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ComponentProps } from 'react';
import { finishTransition, navigateWithTransition } from '@/lib/view-transition';

/** Liegt im Layout und schließt einen laufenden Übergang ab. */
export function NavTransitions() {
  const pathname = usePathname();
  useEffect(() => {
    finishTransition();
  }, [pathname]);
  return null;
}

export default function TransitionLink({
  href,
  children,
  onClick,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Modifier-Klicks (neuer Tab, Fenster) unangetastet lassen
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigateWithTransition(() => router.push(href));
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
