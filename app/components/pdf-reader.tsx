"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  pdfUrl: string;
  activityId: string;
  activityTitle: string;
  xpReward: number;
};

export default function PDFReader({ pdfUrl, activityId, activityTitle, xpReward }: Props) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already completed
    try {
      const completed = localStorage.getItem(`reading_completed_${activityId}`);
      if (completed) {
        setHasCompleted(true);
      }
    } catch (e) {
      // ignore
    }
  }, [activityId]);

  const handleMarkAsRead = async () => {
    if (hasCompleted) {
      router.push('/learn');
      return;
    }

    setIsCompleting(true);
    try {
      const res = await fetch('/api/reading-activities/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpReward }),
      });

      if (res.ok) {
        // Mark as completed in localStorage
        try {
          localStorage.setItem(`reading_completed_${activityId}`, 'true');
        } catch (e) {
          // ignore
        }
        
        toast.success(`Parabéns! Você ganhou ${xpReward} XP!`);
        
        // Redirect immediately
        router.push('/learn');
      } else {
        toast.error('Erro ao completar atividade');
        setIsCompleting(false);
      }
    } catch (error) {
      toast.error('Erro ao completar atividade');
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{activityTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {hasCompleted ? 'Atividade concluída! ✓' : 'Marque como lido após terminar'}
          </p>
        </div>
        <Button 
          onClick={handleMarkAsRead}
          disabled={isCompleting}
          className={hasCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
        >
          {isCompleting ? 'Processando...' : hasCompleted ? 'Voltar' : `Lido (+${xpReward} XP)`}
        </Button>
      </div>

      <div 
        className="border rounded-lg overflow-auto bg-gray-50"
        style={{ height: '70vh' }}
      >
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title={activityTitle}
        />
      </div>
    </div>
  );
}

