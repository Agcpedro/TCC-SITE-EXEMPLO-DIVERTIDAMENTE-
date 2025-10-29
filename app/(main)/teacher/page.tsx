import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import TeacherActivitiesManager from '@/app/components/teacher-activities-manager';
import TeacherQuestsManager from '@/app/components/teacher-quests-manager';
import ReadingActivitiesManager from '@/app/components/reading-activities-manager';

const TEACHER_DATA = path.join(process.cwd(), 'data', 'teacher_activities.json');
const QUESTS_DATA = path.join(process.cwd(), 'data', 'teacher_quests.json');
const READING_DATA = path.join(process.cwd(), 'data', 'reading_activities.json');

export default function TeacherPage() {
  let activities = [];
  try {
    const raw = fs.readFileSync(TEACHER_DATA, 'utf-8');
    activities = JSON.parse(raw || '[]');
  } catch (e) {
    activities = [];
  }

  let quests = [];
  try {
    const raw = fs.readFileSync(QUESTS_DATA, 'utf-8');
    quests = JSON.parse(raw || '[]');
  } catch (e) {
    quests = [];
  }

  let readingActivities = [];
  try {
    const raw = fs.readFileSync(READING_DATA, 'utf-8');
    readingActivities = JSON.parse(raw || '[]');
  } catch (e) {
    readingActivities = [];
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Painel do Professor 🎓</h1>
        <p className="text-muted-foreground">Crie e gerencie atividades, leituras e missões para seus alunos.</p>
      </div>

      <div className="grid gap-6">
        {/* Create Activity Card */}
        <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="text-5xl">❓</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Atividades com Questões</h3>
              <p className="text-sm text-blue-700 mb-4">Editor completo com até 5 questões de múltipla escolha e suporte para imagens.</p>
              <Link 
                href="/teacher/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ➕ Nova Atividade
              </Link>
            </div>
          </div>
          
          {activities.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                📋 Atividades Existentes ({activities.length})
              </h4>
              <TeacherActivitiesManager activities={activities} />
            </div>
          )}
        </div>

        {/* Reading Activities Card */}
        <div className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="text-5xl">📖</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Atividades de Leitura</h3>
              <p className="text-sm text-purple-700 mb-4">Faça upload de arquivos PDF para os alunos lerem. Eles ganham XP ao marcar como lido.</p>
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                📄 Suporte para PDF
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t-2 border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              {readingActivities.length > 0 ? `📚 Leituras (${readingActivities.length})` : '📚 Criar Leituras'}
            </h4>
            <ReadingActivitiesManager activities={readingActivities} />
          </div>
        </div>

        {/* Custom Quests Card */}
        <div className="border-2 border-amber-200 rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🏆</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Missões Personalizadas</h3>
              <p className="text-sm text-amber-700 mb-4">Defina o valor de XP necessário para criar missões customizadas que aparecerão na página de Missões.</p>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                ⭐ Motivação Extra
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t-2 border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
              {quests.length > 0 ? `🎯 Missões (${quests.length})` : '🎯 Criar Missões'}
            </h4>
            <TeacherQuestsManager quests={quests} />
          </div>
        </div>
      </div>
    </div>
  );
}
