"use client";

import React, { useState } from 'react';
import { QuestionBubble } from '@/app/lesson/question-bubble';
import { Challenge } from '@/app/lesson/challenge';
import { Footer } from '@/app/lesson/footer';
import { toast } from 'sonner';

export default function TeacherActivityPlayer({ activity }: { activity: any }) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none');
  const [selected, setSelected] = useState<number | undefined>();
  const [attempts, setAttempts] = useState<number[]>(() => (activity.questions || []).map(() => 0));
  const [optionStatuses, setOptionStatuses] = useState<Record<number, Record<number, 'correct' | 'wrong' | 'none'>>>(() => (activity.questions || []).map ? (activity.questions || []).map(() => ({})) as any : {} as any);
  const [finished, setFinished] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [wasPreviouslyCompleted, setWasPreviouslyCompleted] = useState<boolean | null>(null);

  const q = activity.questions?.[index];

  const onSelect = (i: number) => {
    if (status !== 'none') return;
    setSelected(i);
  };

  // compute xp for a question based on attempts (first try = 10, -3 per wrong; if correct on 4th attempt => 0)
  function xpForAttempt(attemptCount: number) {
    // attemptCount is number of wrong attempts before correct answer (0 means correct on first try)
    const attemptNumber = attemptCount + 1; // which attempt succeeded
    if (attemptNumber >= 4) return 0; // 4th attempt or more -> 0 XP
    // first attempt:10, second:7, third:4 => pattern: 10 - (attemptCount * 3)
    return Math.max(0, 10 - attemptCount * 3);
  }

  const checkAnswer = async () => {
    if (selected === undefined || !q) return;

    const isCorrect = q.correctIndex === selected;

  if (isCorrect) {
      // calculate attempts for this question
      const copy = [...attempts];
      const wrongs = copy[index];
      const earned = xpForAttempt(wrongs);
      copy[index] = wrongs; // keep attempts as number of wrong tries
      setAttempts(copy);
      setStatus('correct');

      // If this was the last question, finish and award total
      const isLast = index + 1 >= (activity.questions?.length || 0);
  if (isLast) {
        // compute total xp for this run
        const total = (activity.questions || []).reduce((sum: number, _: any, idx: number) => {
          const wrongs = copy[idx];
          return sum + xpForAttempt(wrongs);
        }, 0);
        // Persist completion locally (always mark completed so Learn can show history)
        try {
          const raw = localStorage.getItem('teacher_activity_completed');
          const map = raw ? JSON.parse(raw) : {};
          const already = map[String(activity.id)];
          // record whether the activity was previously completed before we write it
          setWasPreviouslyCompleted(!!already);
          if (!already) {
            // award only if not previously completed
            try {
              await fetch('/api/teacher-activities/award', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points: total })
              });
            } catch (e) {
              toast.error('Failed to award points');
            }
            // show the XP actually earned on this run
            setTotalEarned(total);
          } else {
            // already completed previously: don't show XP gain for this run
            setTotalEarned(0);
          }
          // mark finished after we've recorded whether it was previously completed
          map[String(activity.id)] = { completedAt: Date.now(), earned: already ? already.earned : total };
          localStorage.setItem('teacher_activity_completed', JSON.stringify(map));
          setFinished(true);
        } catch (e) {
          toast.error('Failed to persist completion');
          // still finish but don't show earned XP if persisting failed
          setTotalEarned(0);
          setFinished(true);
        }
      } else {
        // not last, let user press next to continue
      }

    } else {
      // wrong answer: increment attempt count for this question and mark wrong (red)
      const copy = [...attempts];
      copy[index] = (copy[index] || 0) + 1;
      setAttempts(copy);
      // mark this option as wrong for the current attempt (will be cleared when retrying)
      setOptionStatuses((prev) => {
        const next = [...(prev as any)];
        const qMap = { ...(next[index] || {}) };
        qMap[selected + 1] = 'wrong';
        next[index] = qMap;
        return next as any;
      });
      setStatus('wrong');
    }
  };

  const onNext = () => {
    if (finished) return;
    if (status === 'none') return;
    if (status === 'correct') {
      if (index + 1 < (activity.questions?.length || 0)) {
        setIndex(index + 1);
        setStatus('none');
        setSelected(undefined);
        // clear any temporary wrong marks for the next question (safe no-op if none)
        setOptionStatuses((prev) => {
          const next = [...(prev as any)];
          next[index + 1] = next[index + 1] || {};
          return next as any;
        });
      }
    } else if (status === 'wrong') {
      // allow retry: reset selection/status but keep attempts
      setStatus('none');
      setSelected(undefined);
      // clear temporary wrong marks for this question so red highlights don't persist across attempts
      setOptionStatuses((prev) => {
        const next = [...(prev as any)];
        next[index] = {};
        return next as any;
      });
    }
  };

  if (!q) return <div className="p-4">No questions</div>;

  if (finished) {
    const totalQuestions = (activity.questions || []).length;

    // determine if this activity was previously completed. We prefer the precomputed
    // wasPreviouslyCompleted (set before we wrote the completion record). If that's
    // not available, fall back to reading localStorage.
    let previouslyCompleted = false;
    if (wasPreviouslyCompleted !== null) {
      previouslyCompleted = wasPreviouslyCompleted;
    } else {
      try {
        const raw = localStorage.getItem('teacher_activity_completed');
        const map = raw ? JSON.parse(raw) : {};
        previouslyCompleted = !!map[String(activity.id)];
      } catch (e) {
        previouslyCompleted = false;
      }
    }

    return (
      <div className="p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold mb-2">Resumo da atividade</h3>
        <p className="mb-2">Você respondeu {totalQuestions} perguntas.</p>
        <div className="mb-4">
          {(activity.questions || []).map((ques: any, idx: number) => (
            <div key={idx} className="mb-2">
              <div className="text-sm font-medium">Pergunta {idx + 1}</div>
              <div className="text-sm text-muted-foreground">Tentativas: {attempts[idx] ?? 0} {previouslyCompleted ? '— XP: 0 (atividade já concluída)' : `— XP: ${xpForAttempt(attempts[idx] ?? 0)}`}</div>
            </div>
          ))}
        </div>
        <div className="text-lg font-semibold mb-4">XP ganho: {previouslyCompleted ? 0 : totalEarned}</div>
        <div className="flex gap-2">
          <a href="/learn" className="inline-block px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">Voltar para Lessons</a>
          <button type="button" onClick={() => {
            // allow replay without awarding XP (localStorage indicates completed)
            // reset runtime state for a fresh attempt but keep localStorage completion marker (so no XP)
            setFinished(false);
            setIndex(0);
            setStatus('none');
            setSelected(undefined);
            setAttempts((activity.questions || []).map(() => 0));
            setOptionStatuses((activity.questions || []).map ? (activity.questions || []).map(() => ({})) as any : {} as any);
            setTotalEarned(0);
          }} className="inline-block px-4 py-2 bg-white border rounded">Tentar novamente (sem XP)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <QuestionBubble question={q.text} />
      {q.image ? <img src={q.image} alt={`question-${index}`} className="w-full h-48 object-contain mb-4" /> : null}
      <Challenge
        options={q.choices.map((c: string, idx: number) => ({ id: idx + 1, text: c }))}
        onSelect={(id: number) => onSelect(id - 1)}
        status={status}
        optionStatuses={optionStatuses[index]}
        selectedOption={selected !== undefined ? selected + 1 : undefined}
        disabled={false}
        type={'SELECT' as any}
      />
      <Footer
        disabled={selected === undefined}
        status={status}
        onCheck={() => {
          if (status === 'correct') {
            onNext();
          } else if (status === 'wrong') {
            // on wrong, allow user to retry (keep attempts count)
            setStatus('none');
            setSelected(undefined);
          } else {
            checkAnswer();
          }
        }}
      />
      {status === 'wrong' && <div className="mt-3 text-sm text-red-600">Resposta incorreta. Tente novamente.</div>}
    </div>
  );
}
