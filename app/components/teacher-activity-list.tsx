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
    <div className="space-y-8 mt-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">❓</span>
          <h3 className="text-xl font-bold text-green-900">Atividades com Questões</h3>
        </div>
        {available.length === 0 ? (
          <div className="text-sm text-muted-foreground bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            ✅ Todas as atividades foram concluídas!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map(a => (
              <Link 
                key={a.id} 
                href={`/learn/activity/${a.id}`} 
                className="block border-2 border-green-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-green-400 transition-all transform hover:-translate-y-1"
              >
                {a.image ? (
                  <img src={a.image} alt={a.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                    <span className="text-6xl">❓</span>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h4 className="font-bold text-green-900 mb-2">{a.title}</h4>
                  {a.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{a.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      🎯 Nova
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-gray-700">Atividades Concluídas</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map(a => (
              <Link 
                key={a.id} 
                href={`/learn/activity/${a.id}`} 
                className="block border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all opacity-75 hover:opacity-100"
              >
                {a.image ? (
                  <img src={a.image} alt={a.title} className="w-full h-36 object-cover grayscale" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <span className="text-6xl">✓</span>
                  </div>
                )}
                <div className="p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-700 mb-2">{a.title}</h4>
                  <div className="text-xs text-gray-500">
                    🔄 Refazer (sem ganhar XP)
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
