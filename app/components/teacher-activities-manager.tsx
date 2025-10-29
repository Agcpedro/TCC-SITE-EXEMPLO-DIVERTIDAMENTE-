"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function TeacherActivitiesManager({ activities }: { activities: any[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/teacher-activities/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Atividade deletada com sucesso!');
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

  return (
    <>
      <ul className="space-y-2">
        {activities.map((a: any) => (
          <li key={a.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-muted-foreground">{a.description}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/teacher/${a.id}/edit`} className="text-sky-600 hover:underline">
                Edit
              </Link>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A atividade será deletada permanentemente 
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

