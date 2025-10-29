import { Button } from "@/components/ui/button";
import { getCourseEmoji } from "@/lib/course-emojis";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <span className="text-2xl mr-3">{getCourseEmoji('Português')}</span>
          Português
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <span className="text-2xl mr-3">{getCourseEmoji('Matemática')}</span>
          Matemática
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <span className="text-2xl mr-3">{getCourseEmoji('Geografia')}</span>
          Geografia
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <span className="text-2xl mr-3">{getCourseEmoji('História')}</span>
          História
        </Button>
      </div>
    </footer>
  );
};
