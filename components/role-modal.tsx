"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Small role selector modal: persist role in localStorage under 'user_role'
export default function RoleModal() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Read stored role once on mount (do not auto-open here — only via event)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_role');
      if (stored) setRole(stored);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
    };
    window.addEventListener('show-role-modal', handler);
    return () => window.removeEventListener('show-role-modal', handler);
  }, []);

  const choose = (r: string) => {
    try {
      localStorage.setItem('user_role', r);
      setRole(r);
    } catch (e) {
      // ignore
    }
    // Also persist as a cookie so middleware/server can gate routes
    try {
      const oneYearSeconds = 60 * 60 * 24 * 365;
      document.cookie = `user_role=${encodeURIComponent(r)}; path=/; max-age=${oneYearSeconds}`;
    } catch (e) {
      // ignore
    }
    setOpen(false);
    // dispatch a global event so other components (sidebar) can update reactively
    try {
      const ev = new CustomEvent('role-selected', { detail: { role: r } });
      window.dispatchEvent(ev);
    } catch (e) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Você é professor ou aluno?</DialogTitle>
        <div className="pt-2">
          <div className="flex gap-3">
            <Button onClick={() => choose('teacher')} className="bg-green-600 text-white">Sou professor</Button>
            <Button onClick={() => choose('student')} className="bg-slate-100">Sou aluno</Button>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
