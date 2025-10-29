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
    <div className="space-y-8 mt-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📖</span>
          <h3 className="text-xl font-bold text-purple-900">Atividades de Leitura</h3>
        </div>
        {available.length === 0 && completed.length === 0 ? (
          <div className="text-sm text-muted-foreground bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            Nenhuma atividade de leitura disponível no momento.
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {available.map(a => (
                    <Link 
                      key={a.id} 
                      href={`/learn/reading/${a.id}`} 
                      className="block border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-purple-400 transition-all transform hover:-translate-y-1"
                    >
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 h-36 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">📄</div>
                          <div className="text-xs font-medium text-purple-700">PDF</div>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-bold text-purple-900 mb-2">{a.title}</h4>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{a.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            📚 {a.xpReward} XP
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            🎯 Nova
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
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h4 className="text-lg font-bold text-gray-700">Leituras Concluídas</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completed.map(a => (
                    <Link 
                      key={a.id} 
                      href={`/learn/reading/${a.id}`} 
                      className="block border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all opacity-75 hover:opacity-100"
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">✓</div>
                          <div className="text-xs text-muted-foreground">Concluída</div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-bold text-gray-700 mb-2">{a.title}</h4>
                        {a.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          🔄 Reler documento
                        </div>
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

