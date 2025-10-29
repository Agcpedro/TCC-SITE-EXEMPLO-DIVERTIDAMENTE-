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

export default function TeacherQuestsManager({ quests }: { quests: any[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [xpValue, setXpValue] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/teacher-quests/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Missão deletada com sucesso!');
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error('Erro ao deletar missão');
      }
    } catch (error) {
      toast.error('Erro ao deletar missão');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async () => {
    const value = parseInt(xpValue);
    if (!value || value <= 0) {
      toast.error('Por favor, insira um valor de XP válido');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/teacher-quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      
      if (res.ok) {
        toast.success('Missão criada com sucesso!');
        setXpValue('');
        router.refresh();
      } else {
        toast.error('Erro ao criar missão');
      }
    } catch (error) {
      toast.error('Erro ao criar missão');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Valor de XP necessário</label>
            <input 
              type="number" 
              value={xpValue}
              onChange={(e) => setXpValue(e.target.value)}
              placeholder="Ex: 100"
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={creating}
            className="bg-green-600 hover:bg-green-700"
          >
            {creating ? 'Criando...' : 'Criar missão'}
          </Button>
        </div>

        {quests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma missão personalizada criada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {quests.map((q: any) => (
              <li key={q.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">Ganhar {q.value} XP</div>
                  <div className="text-sm text-muted-foreground">Missão personalizada</div>
                </div>
                <button 
                  onClick={() => setDeleteId(q.id)} 
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
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
              Esta ação não pode ser desfeita. A missão será deletada permanentemente 
              e desaparecerá da área de missões dos alunos.
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

