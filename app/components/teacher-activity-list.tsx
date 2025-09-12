"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TeacherActivityList({ activities }: { activities: any[] }) {
  const [completedMap, setCompletedMap] = useState<Record<string, any>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacher_activity_completed');
      const map = raw ? JSON.parse(raw) : {};
      setCompletedMap(map);
    } catch (e) {
      setCompletedMap({});
    }
  }, []);

  const available = activities.filter(a => !completedMap[String(a.id)]);
  const history = activities.filter(a => completedMap[String(a.id)]);

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Atividades disponíveis</h3>
        {available.length === 0 ? <div className="text-sm text-muted-foreground">Nenhuma atividade nova.</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map(a => (
              <Link key={a.id} href={`/learn/activity/${a.id}`} className="block border rounded overflow-hidden hover:shadow-lg">
                {a.image ? <img src={a.image} alt={a.title} className="w-full h-36 object-cover" /> : <div className="w-full h-36 bg-gray-100 flex items-center justify-center"><span className="text-sm text-gray-500">No image</span></div>}
                <div className="p-3">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Histórico (atividades feitas)</h3>
        {history.length === 0 ? <div className="text-sm text-muted-foreground">Nenhuma atividade concluída ainda.</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map(a => (
              <Link key={a.id} href={`/learn/activity/${a.id}`} className="block border rounded overflow-hidden hover:shadow-lg opacity-80">
                {a.image ? <img src={a.image} alt={a.title} className="w-full h-36 object-cover" /> : <div className="w-full h-36 bg-gray-100 flex items-center justify-center"><span className="text-sm text-gray-500">No image</span></div>}
                <div className="p-3">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  <div className="text-xs text-muted-foreground mt-1">Refaça a atividade (sem ganhar XP)</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
