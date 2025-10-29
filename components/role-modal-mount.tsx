"use client";
import React, { useEffect, useRef } from 'react';
import RoleModal from './role-modal';
import { usePathname } from 'next/navigation';

export default function RoleModalMount() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const isLearn = Boolean(pathname && pathname.startsWith('/learn'));
      const wasLearn = Boolean(previousPathnameRef.current && previousPathnameRef.current.startsWith('/learn'));
      // When transitioning into /learn from a non-/learn route (or on first load at /learn), always show
      if (isLearn && !wasLearn) {
        window.dispatchEvent(new Event('show-role-modal'));
      }
      previousPathnameRef.current = pathname ?? null;
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  // If the user changes role to non-teacher while on /teacher, navigate away immediately
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ role?: string }>;
        const newRole = ce.detail?.role;
        if (pathname && pathname.startsWith('/teacher') && newRole !== 'teacher') {
          window.location.href = '/learn';
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('role-selected', handler as EventListener);
    return () => window.removeEventListener('role-selected', handler as EventListener);
  }, [pathname]);

  return <RoleModal />;
}
