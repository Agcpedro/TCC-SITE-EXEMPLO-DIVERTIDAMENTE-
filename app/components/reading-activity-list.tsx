"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReadingActivityList({ activities }: { activities: any[] }) {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const map: Record<string, boolean> = {};
      activities.forEach(a => {
        const completed = localStorage.getItem(`reading_completed_${a.id}`);
        if (completed) {
          map[a.id] = true;
        }
      });
      setCompletedMap(map);
    } catch (e) {
      setCompletedMap({});
    }
  }, [activities]);

  const available = activities.filter(a => !completedMap[a.id]);
  const completed = activities.filter(a => completedMap[a.id]);

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          📖 Atividades de Leitura
        </h3>
        {available.length === 0 && completed.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nenhuma atividade de leitura disponível.</div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Disponíveis</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {available.map(a => (
                    <Link 
                      key={a.id} 
                      href={`/learn/reading/${a.id}`} 
                      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-36 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-xs text-muted-foreground">PDF</div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold mb-1">{a.title}</h4>
                        {a.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            +{a.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Concluídas ✓</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completed.map(a => (
                    <Link 
                      key={a.id} 
                      href={`/learn/reading/${a.id}`} 
                      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow opacity-70"
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">✓</div>
                          <div className="text-xs text-muted-foreground">Concluída</div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold mb-1">{a.title}</h4>
                        {a.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

