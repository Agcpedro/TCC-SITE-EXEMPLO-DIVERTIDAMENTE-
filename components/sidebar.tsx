"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";
import { RoleToggle } from "./role-toggle";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const r = localStorage.getItem('user_role');
      setRole(r || 'student');
    } catch (e) {
      setRole('student');
    }
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const r = ce.detail?.role;
        if (r) {
          setRole(r);
        }
      } catch (err) {}
    };
    window.addEventListener('role-selected', handler as EventListener);
    return () => window.removeEventListener('role-selected', handler as EventListener);
  }, []);
  return (
    <div className={cn(
      "flex h-full lg:w-[300px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Divertidamente
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          label="Atividades" 
          href="/learn"
          iconSrc="/learn.svg"
        />
        <SidebarItem 
          label="Ranking" 
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem 
          label="Missões" 
          href="/quests"
          iconSrc="/quests.svg"
        />    
        {role === 'teacher' && (
          <SidebarItem 
            label="Professor"
            href="/teacher"
            emoji="👨‍🏫"
          />
        )}
      </div>
      <div className="p-4 space-y-4">
        <RoleToggle />
        <div className="border-t-2 pt-4">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};
