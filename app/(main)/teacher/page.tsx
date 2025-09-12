import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const TEACHER_DATA = path.join(process.cwd(), 'data', 'teacher_activities.json');

export default function TeacherPage() {
  let activities = [];
  try {
    const raw = fs.readFileSync(TEACHER_DATA, 'utf-8');
    activities = JSON.parse(raw || '[]');
  } catch (e) {
    activities = [];
  }

  return (
    <div>
      <p className="text-muted-foreground mb-4">Welcome to the Teacher area. Create and manage detailed activities below.</p>

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
          <ul className="space-y-2">
            {activities.map((a: any) => (
              <li key={a.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.description}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/teacher/${a.id}/edit`} className="text-sky-600">Edit</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
