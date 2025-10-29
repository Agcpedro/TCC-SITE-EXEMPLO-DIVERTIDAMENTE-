import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/placeholder-course.svg" 
            alt="Português" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Português
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/placeholder-course.svg" 
            alt="Matemática" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Matemática
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/placeholder-course.svg" 
            alt="Geografia" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Geografia
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/placeholder-course.svg" 
            alt="História" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          História
        </Button>
      </div>
    </footer>
  );
};
