"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NewActivityPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(() => [createEmptyQuestion()]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function createEmptyQuestion() {
    return { text: '', choices: ['', '', '', ''], correctIndex: 0 };
  }

  function addQuestion() {
    if (questions.length >= 5) return;
    setQuestions([...questions, createEmptyQuestion()]);
  }

  function updateQuestion(idx: number, changes: any) {
    const copy = [...questions];
    copy[idx] = { ...copy[idx], ...changes };
    setQuestions(copy);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageDataUrl = null;
    if (imageFile) {
      imageDataUrl = await fileToDataUrl(imageFile);
    }

    const payload = { title, description, questions, image: imageDataUrl };

    const res = await fetch('/api/teacher-activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/teacher/${data.id}/edit`);
    } else {
      alert('Failed to save');
    }

    setSaving(false);
  }

  function fileToDataUrl(file: File) {
    return new Promise<string | null>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(file);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm">Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="p-3 border rounded">
            <label className="block text-sm font-medium">Question {i+1}</label>
            <input value={q.text} onChange={(e) => updateQuestion(i, { text: e.target.value })} className="w-full rounded border px-2 py-1 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.choices.map((c, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${i}`} checked={q.correctIndex === ci} onChange={() => updateQuestion(i, { correctIndex: ci })} />
                  <input value={c} onChange={(e) => {
                    const copy = [...q.choices]; copy[ci] = e.target.value; updateQuestion(i, { choices: copy });
                  }} className="w-full rounded border px-2 py-1" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={addQuestion}>Add question</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Publish to Learn'}</Button>
      </div>
    </form>
  );
}
