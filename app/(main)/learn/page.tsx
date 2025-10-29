import { redirect } from "next/navigation";

// Promo removed from Learn page
import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Header } from "./header";
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TEACHER_DATA = path.join(process.cwd(), 'data', 'teacher_activities.json');
const READING_DATA = path.join(process.cwd(), 'data', 'reading_activities.json');

// Dynamically import client components
const TeacherActivityClient = dynamic(() => import('@/app/components/teacher-activity'), { ssr: false });
const TeacherActivityList = dynamic(() => import('@/app/components/teacher-activity-list'), { ssr: false });
const ReadingActivityList = dynamic(() => import('@/app/components/reading-activity-list'), { ssr: false });

const LearnPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([getUserProgress(), getUserSubscription()]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  // Get activities
  let readingActivities: any[] = [];
  let teacherActivities: any[] = [];
  
  try {
    const raw = fs.readFileSync(READING_DATA, 'utf-8');
    const activities = JSON.parse(raw || '[]');
    readingActivities = Array.isArray(activities)
      ? activities.filter((a: any) => a && a.courseId === userProgress.activeCourseId)
      : [];
  } catch (e) {
    // ignore
  }
  
  try {
    const raw = fs.readFileSync(TEACHER_DATA, 'utf-8');
    const activities = JSON.parse(raw || '[]');
    teacherActivities = Array.isArray(activities)
      ? activities.filter((a: any) => a && a.courseId === userProgress.activeCourseId)
      : [];
  } catch (e) {
    // ignore
  }
  
  const hasActivities = readingActivities.length > 0 || teacherActivities.length > 0;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        <Quests points={userProgress.points} courseId={userProgress.activeCourseId} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        
        {!hasActivities ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-neutral-700 mb-3">
              Nenhuma atividade disponível
            </h2>
            <p className="text-muted-foreground mb-6">
              Aguarde! Seu professor adicionará atividades em breve.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Enquanto isso, explore as outras seções no menu lateral!
              </p>
            </div>
          </div>
        ) : (
          <>
            {readingActivities.length > 0 && (
              <ReadingActivityList activities={readingActivities} />
            )}
            {teacherActivities.length > 0 && (
              <TeacherActivityList activities={teacherActivities} />
            )}
          </>
        )}
      </FeedWrapper>
    </div>
  );
};
 
export default LearnPage;
