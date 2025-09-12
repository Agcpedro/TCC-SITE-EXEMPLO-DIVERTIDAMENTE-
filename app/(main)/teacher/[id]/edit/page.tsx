"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/teacher-activities/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setActivity(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setQuestions(data.questions || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    await fetch(`/api/teacher-activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, questions }),
    });
    router.push('/teacher');
  };

  if (loading) return <div>Loading...</div>;
  if (!activity) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={i} className="p-3 border rounded">
            <label className="block text-sm font-medium">Question {i+1}</label>
            <input value={q.text} onChange={(e) => { const c = [...questions]; c[i].text = e.target.value; setQuestions(c); }} className="w-full rounded border px-2 py-1 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.choices.map((c: string, ci: number) => (
                <div key={ci} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${i}`} checked={q.correctIndex === ci} onChange={() => { const c = [...questions]; c[i].correctIndex = ci; setQuestions(c); }} />
                  <input value={c} onChange={(e) => { const copy = [...questions]; copy[i].choices[ci] = e.target.value; setQuestions(copy); }} className="w-full rounded border px-2 py-1" />
                </div>
              ))}
            </div>
            <div className="mt-2">
              <label className="block text-sm">Question image (optional)</label>
              {q.image ? (
                <div className="flex items-center gap-2 mt-2">
                  <img src={q.image} alt={`q-${i}-img`} className="w-32 h-20 object-cover rounded border" />
                  <div className="flex flex-col">
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fr = new FileReader();
                      fr.onload = () => { const copy = [...questions]; copy[i].image = fr.result as string; setQuestions(copy); };
                      fr.readAsDataURL(file);
                    }} />
                    <button type="button" className="text-sm text-red-600 mt-1" onClick={() => { const copy = [...questions]; copy[i].image = null; setQuestions(copy); }}>Remove image</button>
                  </div>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fr = new FileReader();
                  fr.onload = () => { const copy = [...questions]; copy[i].image = fr.result as string; setQuestions(copy); };
                  fr.readAsDataURL(file);
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => router.push('/teacher')}>Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
