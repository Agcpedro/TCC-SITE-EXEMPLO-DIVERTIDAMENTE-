"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Small role selector modal: persist role in localStorage under 'user_role'
export default function RoleModal() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_role');
      if (!stored) {
        // show the modal on every visit where role isn't set
        setOpen(true);
      } else {
        setRole(stored);
      }
    } catch (e) {
      setOpen(true);
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
