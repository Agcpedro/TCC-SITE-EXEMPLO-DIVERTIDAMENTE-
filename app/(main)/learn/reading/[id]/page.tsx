import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import { getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';

const READING_DATA = path.join(process.cwd(), 'data', 'reading_activities.json');

const PDFReader = dynamic(() => import('@/app/components/pdf-reader'), { ssr: false });

type Props = {
  params: { id: string };
};

export default async function ReadingActivityPage({ params }: Props) {
  try {
    const raw = fs.readFileSync(READING_DATA, 'utf-8');
    const activities = JSON.parse(raw || '[]');
    const activity = activities.find((a: any) => String(a.id) === String(params.id));
    
    if (!activity) {
      redirect('/learn');
    }

    // Enforce subject scoping: only allow if activity matches user's active course
    const user = await getUserProgress();
    if (!user?.activeCourseId || activity.courseId !== user.activeCourseId) {
      redirect('/learn');
    }

    return (
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {activity.description && (
            <p className="text-muted-foreground mb-4">{activity.description}</p>
          )}
          <PDFReader 
            pdfUrl={activity.pdfUrl}
            activityId={activity.id}
            activityTitle={activity.title}
            xpReward={activity.xpReward}
          />
        </div>
      </div>
    );
  } catch (e) {
    redirect('/learn');
  }
}

