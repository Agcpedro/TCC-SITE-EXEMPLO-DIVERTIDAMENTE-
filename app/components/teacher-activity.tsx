"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionBubble } from '@/app/lesson/question-bubble';
import { Challenge } from '@/app/lesson/challenge';
import { Footer } from '@/app/lesson/footer';
import { toast } from 'sonner';

export default function TeacherActivity({ activity }: { activity: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none');
  const [selected, setSelected] = useState<number | undefined>();
  const [pending, startTransition] = useTransition();

  const q = activity.questions?.[activeIndex];

  const onSelect = (index: number) => {
    if (status !== 'none') return;
    setSelected(index);
  };

  const checkAnswer = async () => {
    if (selected === undefined) return;

    if (q.correctIndex === selected) {
      setStatus('correct');
      try {
        // only award if user hasn't completed this activity before (client-side guard)
        try {
          const raw = localStorage.getItem('teacher_activity_completed');
          const map = raw ? JSON.parse(raw) : {};
          const already = map[String(activity.id)];
          if (!already) {
            await fetch('/api/teacher-activities/award', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ points: 10 })
            });
          }
        } catch (e) {
          // if localStorage read fails for any reason, fall back to calling the endpoint (best effort)
          await fetch('/api/teacher-activities/award', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: 10 })
          });
        }
      } catch (e) {
        toast.error('Failed to award points');
      }
    } else {
      setStatus('wrong');
    }
  };

  const onNext = () => {
    setActiveIndex((i) => i + 1);
    setStatus('none');
    setSelected(undefined);
  };

  if (!q) return <div />;

  return (
    <div className="p-4 border rounded mb-4">
      <QuestionBubble question={q.text} />
      <Challenge
        options={q.choices.map((c: string, idx: number) => ({ id: idx + 1, text: c }))}
        onSelect={(id: number) => onSelect(id - 1)}
  status={status}
  optionStatuses={{}}
        selectedOption={selected !== undefined ? selected + 1 : undefined}
        disabled={pending}
  type={'SELECT' as any}
      />
      <Footer
        disabled={pending || selected === undefined}
        status={status}
        onCheck={() => {
          if (status === 'correct') {
            onNext();
          } else if (status === 'wrong') {
            // allow retry: reset status and keep selected undefined
            setStatus('none');
            setSelected(undefined);
          } else {
            checkAnswer();
          }
        }}
      />
    </div>
  );
}
