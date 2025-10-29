import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourseEmoji } from "@/lib/course-emojis";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  const emoji = getCourseEmoji(title);
  
  return (
    <div className="sticky top-0 bg-gradient-to-r from-white via-blue-50 to-white pb-4 lg:pt-[28px] lg:mt-[-28px] border-b-2 border-blue-200 mb-6 lg:z-50 rounded-b-xl shadow-sm">
      <div className="flex items-center justify-between">
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="hover:bg-blue-100">
            <ArrowLeft className="h-5 w-5 stroke-2 text-blue-600" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <h1 className="font-bold text-2xl text-blue-900">
            {title}
          </h1>
        </div>
        <div className="w-10" />
      </div>
      <p className="text-center text-sm text-blue-700 mt-2">
        Complete as atividades e ganhe XP! 🚀
      </p>
    </div>
  );
};
