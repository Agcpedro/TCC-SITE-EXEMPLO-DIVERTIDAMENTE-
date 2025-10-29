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

  return <RoleModal />;
}
