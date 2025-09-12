import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';

const TEACHER_DATA = path.join(process.cwd(), 'data', 'teacher_activities.json');

const Player = dynamic(() => import('@/app/components/teacher-activity-player'), { ssr: false });

type Props = {
  params: { id: string };
};

export default async function ActivityPage({ params }: Props) {
  try {
    const raw = fs.readFileSync(TEACHER_DATA, 'utf-8');
    const activities = JSON.parse(raw || '[]');
    const activity = activities.find((a: any) => String(a.id) === String(params.id));
    if (!activity) return <div className="p-6">Activity not found</div>;

    return (
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{activity.title}</h1>
          {activity.description ? <p className="text-sm text-muted-foreground mb-4">{activity.description}</p> : null}
          {activity.image ? <img src={activity.image} alt={activity.title} className="w-full h-56 object-cover rounded mb-4" /> : null}
          <Player activity={activity} />
        </div>
      </div>
    );
  } catch (e) {
    return <div className="p-6">Failed to load activity</div>;
  }
}
