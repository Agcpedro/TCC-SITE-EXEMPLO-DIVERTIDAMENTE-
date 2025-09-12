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

// Dynamically import client components
const TeacherActivityClient = dynamic(() => import('@/app/components/teacher-activity'), { ssr: false });
const TeacherActivityList = dynamic(() => import('@/app/components/teacher-activity-list'), { ssr: false });

const LearnPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([getUserProgress(), getUserSubscription()]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
  {/* Built-in Units removed — only teacher activities are displayed here now. */}
        {/* Teacher-created activities: client component splits available vs history using localStorage */}
        {(() => {
          try {
            const raw = fs.readFileSync(TEACHER_DATA, 'utf-8');
            const activities = JSON.parse(raw || '[]');
            if (!activities || activities.length === 0) return null;
            return (
              <TeacherActivityList activities={activities} />
            );
          } catch (e) {
            return null;
          }
        })()}
      </FeedWrapper>
    </div>
  );
};
 
export default LearnPage;
