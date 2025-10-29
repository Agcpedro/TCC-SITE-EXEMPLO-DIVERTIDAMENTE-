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
    <div>
      <p className="text-muted-foreground mb-4">Welcome to the Teacher area. Create and manage detailed activities and quests below.</p>

      <div className="space-y-4">
        <div className="p-4 border rounded flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Create detailed activity</h3>
            <p className="text-sm text-muted-foreground">Full editor with up to 5 questions and image support.</p>
          </div>
          <Link href="/teacher/new" className="text-sky-600">New activity</Link>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Existing activities</h3>
          {activities.length === 0 && <p className="text-sm text-muted-foreground">No activities yet.</p>}
          {activities.length > 0 && <TeacherActivitiesManager activities={activities} />}
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-4">Reading Activities</h3>
          <p className="text-sm text-muted-foreground mb-4">Create reading activities with PDF uploads. Students earn XP by scrolling to the end.</p>
          <ReadingActivitiesManager activities={readingActivities} />
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-4">Custom Quests</h3>
          <p className="text-sm text-muted-foreground mb-4">Create custom quests by setting the required XP value. They will appear in the Quests page.</p>
          <TeacherQuestsManager quests={quests} />
        </div>
      </div>
    </div>
  );
}
