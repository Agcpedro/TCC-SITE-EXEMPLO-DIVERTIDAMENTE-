"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function createEmptyQuestion() {
  return { text: '', choices: ['', '', '', ''], correctIndex: 0, image: null };
}

function fileToDataUrl(file: File) {
  return new Promise<string | null>((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => resolve(null);
    fr.readAsDataURL(file);
  });
}

export default function NewActivityPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(() => [createEmptyQuestion()]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function addQuestion() {
    if (questions.length >= 5) return;
    setQuestions([...questions, createEmptyQuestion()]);
  }

  function updateQuestion(idx: number, changes: any) {
    const copy = [...questions];
    copy[idx] = { ...copy[idx], ...changes };
    setQuestions(copy);
  }

  async function onQuestionImage(idx: number, file: File | null) {
    if (!file) {
      updateQuestion(idx, { image: null });
      return;
    }
    const data = await fileToDataUrl(file);
    updateQuestion(idx, { image: data });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageDataUrl = null;
    if (imageFile) {
      imageDataUrl = await fileToDataUrl(imageFile);
    }

    const payload = { title, description, questions, image: imageDataUrl };

    try {
      const res = await fetch('/api/teacher-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/teacher/${data.id}/edit`);
        return;
      }
      alert('Falha ao salvar');
    } catch (err) {
      alert('Erro de rede');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Criar nova atividade</h2>
          <p className="text-sm text-muted-foreground mt-1">Crie uma atividade com até 5 perguntas. Cada pergunta pode ter uma imagem.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Imagem da atividade (opcional)</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageFile ? <span className="text-sm text-muted-foreground">{imageFile.name}</span> : null}
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Pergunta {i + 1}</label>
                    <input value={q.text} onChange={(e) => updateQuestion(i, { text: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 mt-2 mb-3" />
                  </div>
                  <div className="text-right w-32">
                    <div className="text-xs text-muted-foreground">Máx 5 perguntas</div>
                    <div className="text-xs text-muted-foreground">Questão {i + 1}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.choices.map((c, ci) => (
                    <label key={ci} className="flex items-center gap-3 bg-white border border-slate-200 rounded-md px-3 py-2">
                      <input type="radio" name={`correct-${i}`} checked={q.correctIndex === ci} onChange={() => updateQuestion(i, { correctIndex: ci })} />
                      <input value={c} onChange={(e) => {
                        const copy = [...q.choices]; copy[ci] = e.target.value; updateQuestion(i, { choices: copy });
                      }} className="w-full border-0 focus:ring-0" />
                    </label>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Imagem da pergunta (opcional)</label>
                  {q.image ? (
                    <div className="flex items-center gap-3">
                      <img src={q.image} alt={`q-${i}-img`} className="w-36 h-24 object-cover rounded border" />
                      <div className="flex flex-col gap-2">
                        <input type="file" accept="image/*" onChange={(e) => onQuestionImage(i, e.target.files?.[0] ?? null)} />
                        <button type="button" className="text-sm text-red-600" onClick={() => onQuestionImage(i, null)}>Remover imagem</button>
                      </div>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => onQuestionImage(i, e.target.files?.[0] ?? null)} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={addQuestion} disabled={questions.length >= 5}>Adicionar pergunta</Button>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="lg" disabled={saving}>{saving ? 'Salvando...' : 'Publicar na Learn'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

