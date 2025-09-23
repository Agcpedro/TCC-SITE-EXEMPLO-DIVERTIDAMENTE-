"use client";
import React, { useEffect, useRef } from 'react';
import RoleModal from './role-modal';
import { usePathname } from 'next/navigation';

export default function RoleModalMount() {
  const pathname = usePathname();
  const didDispatchRef = useRef(false);

  useEffect(() => {
    try {
      // If user is entering /learn and has no role, trigger the modal
      const role = localStorage.getItem('user_role');
      if (!role && pathname && pathname.startsWith('/learn') && !didDispatchRef.current) {
        window.dispatchEvent(new Event('show-role-modal'));
        didDispatchRef.current = true;
      }
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  return <RoleModal />;
}
