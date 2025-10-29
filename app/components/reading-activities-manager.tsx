"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function ReadingActivitiesManager({ activities }: { activities: any[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState('10');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/reading-activities/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Atividade de leitura deletada com sucesso!');
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error('Erro ao deletar atividade');
      }
    } catch (error) {
      toast.error('Erro ao deletar atividade');
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setXpReward('10');
    setPdfFile(null);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (activity: any) => {
    setEditingId(activity.id);
    setTitle(activity.title);
    setDescription(activity.description || '');
    setXpReward(activity.xpReward.toString());
    setShowForm(true);
    setPdfFile(null); // PDF is optional in edit mode
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Por favor, insira um título');
      return;
    }

    const xp = parseInt(xpReward);
    if (!xp || xp <= 0) {
      toast.error('Por favor, insira um valor de XP válido');
      return;
    }

    if (editingId) {
      // UPDATE
      setCreating(true);
      try {
        let pdfUrl = undefined;
        
        if (pdfFile) {
          // If new PDF uploaded, convert it
          const reader = new FileReader();
          reader.readAsDataURL(pdfFile);
          
          await new Promise((resolve, reject) => {
            reader.onload = () => {
              pdfUrl = reader.result as string;
              resolve(pdfUrl);
            };
            reader.onerror = reject;
          });
        }

        const body: any = { title, description, xpReward: xp };
        if (pdfUrl) body.pdfUrl = pdfUrl;
        
        const res = await fetch(`/api/reading-activities/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        
        if (res.ok) {
          toast.success('Atividade atualizada com sucesso!');
          resetForm();
          router.refresh();
        } else {
          toast.error('Erro ao atualizar atividade');
        }
      } catch (error) {
        toast.error('Erro ao atualizar atividade');
      } finally {
        setCreating(false);
      }
    } else {
      // CREATE
      if (!pdfFile) {
        toast.error('Por favor, selecione um arquivo PDF');
        return;
      }

      setCreating(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(pdfFile);
        
        reader.onload = async () => {
          const pdfUrl = reader.result as string;
          
          const res = await fetch('/api/reading-activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title, 
              description, 
              xpReward: xp,
              pdfUrl 
            }),
          });
          
          if (res.ok) {
            toast.success('Atividade criada com sucesso!');
            resetForm();
            router.refresh();
          } else {
            toast.error('Erro ao criar atividade');
          }
          setCreating(false);
        };
        
        reader.onerror = () => {
          toast.error('Erro ao processar arquivo PDF');
          setCreating(false);
        };
      } catch (error) {
        toast.error('Erro ao criar atividade');
        setCreating(false);
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            + Nova atividade de leitura
          </Button>
        ) : (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h4 className="font-semibold">
              {editingId ? 'Editar Atividade' : 'Nova Atividade'}
            </h4>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Leitura sobre fotossíntese"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descrição (opcional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição da atividade..."
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Arquivo PDF {editingId && '(deixe em branco para manter o atual)'}
              </label>
              <input 
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {pdfFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Arquivo selecionado: {pdfFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">XP ao completar</label>
              <input 
                type="number" 
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 border rounded-md"
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={creating}
                className="bg-green-600 hover:bg-green-700"
              >
                {creating ? 'Salvando...' : editingId ? 'Salvar' : 'Criar atividade'}
              </Button>
              <Button 
                onClick={resetForm}
                variant="outline"
                disabled={creating}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma atividade de leitura criada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {activities.map((a: any) => (
              <li key={a.id} className="p-3 border rounded flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{a.title}</div>
                  {a.description && (
                    <div className="text-sm text-muted-foreground">{a.description}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    📄 PDF • {a.xpReward} XP
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => startEdit(a)} 
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => setDeleteId(a.id)} 
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A atividade de leitura será deletada permanentemente 
              e também desaparecerá da área de aprendizado dos alunos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

