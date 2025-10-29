"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RoleToggle = () => {
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('user_role');
      if (stored === 'teacher' || stored === 'student') {
        setRole(stored);
      } else {
        // Default to student if no role set
        setRole('student');
        localStorage.setItem('user_role', 'student');
        document.cookie = `user_role=student; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
    } catch (e) {
      setRole('student');
    }
  }, []);

  const toggleRole = () => {
    const newRole = role === 'teacher' ? 'student' : 'teacher';
    setRole(newRole);
    
    try {
      localStorage.setItem('user_role', newRole);
      const oneYearSeconds = 60 * 60 * 24 * 365;
      document.cookie = `user_role=${encodeURIComponent(newRole)}; path=/; max-age=${oneYearSeconds}`;
      
      // Dispatch event for sidebar to update
      const ev = new CustomEvent('role-selected', { detail: { role: newRole } });
      window.dispatchEvent(ev);
      
      // Refresh page to update UI
      window.location.reload();
    } catch (e) {
      console.error('Failed to update role', e);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="border-t-2 pt-4">
      <div className="text-xs text-muted-foreground mb-2 px-1">Modo de Visualização</div>
      <div className="flex gap-2">
        <Button
          variant={role === 'student' ? 'default' : 'outline'}
          size="sm"
          onClick={toggleRole}
          className={cn(
            "flex-1 gap-2",
            role === 'student' && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          <User className="h-4 w-4" />
          Aluno
        </Button>
        <Button
          variant={role === 'teacher' ? 'default' : 'outline'}
          size="sm"
          onClick={toggleRole}
          className={cn(
            "flex-1 gap-2",
            role === 'teacher' && "bg-green-600 hover:bg-green-700"
          )}
        >
          <GraduationCap className="h-4 w-4" />
          Professor
        </Button>
      </div>
    </div>
  );
};

