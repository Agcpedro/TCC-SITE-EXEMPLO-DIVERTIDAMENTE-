import Link from "next/link";
import Image from "next/image";

import { courses } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { getRankFromXP, getProgressToNextRank, getNextRank } from "@/lib/ranks";
import { getCourseEmoji } from "@/lib/course-emojis";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({ 
  activeCourse, 
  points, 
  hasActiveSubscription
}: Props) => {
  const rank = getRankFromXP(points);
  const progress = getProgressToNextRank(points);
  const nextRank = getNextRank(rank);
  const courseEmoji = getCourseEmoji(activeCourse.title);

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between gap-x-2 w-full">
        <Link href="/courses">
          <Button variant="ghost" className="text-2xl">
            {courseEmoji}
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="ghost" className="text-orange-500">
            <Image src="/points.svg" height={28} width={28} alt="Points" className="mr-2" />
            {points} XP
          </Button>
        </Link>
      </div>
      
      <div className="border-2 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rank.icon}</span>
            <span className={`font-bold ${rank.color}`}>{rank.name}</span>
          </div>
          {nextRank && (
            <span className="text-xs text-muted-foreground">
              Próximo: {nextRank.icon} {nextRank.name}
            </span>
          )}
        </div>
        
        {progress && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className={`${rank.bgColor} h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(progress.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {progress.current} / {progress.total} XP
            </p>
          </div>
        )}
        
        {!nextRank && (
          <p className="text-xs text-center text-muted-foreground">
            Rank máximo alcançado! 🏆
          </p>
        )}
      </div>
    </div>
  );
};
