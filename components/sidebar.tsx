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

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const r = localStorage.getItem('user_role');
      setRole(r);
    } catch (e) {
      setRole(null);
    }
  }, []);

  // remember a path the user attempted to navigate to before role selection
  const requestedPathRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const r = ce.detail?.role;
        if (r) {
          setRole(r);
        }
        const requested = requestedPathRef.current;
        if (requested) {
          // navigate after a small timeout to let the modal close
          window.location.href = requested;
          requestedPathRef.current = null;
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
          label="Learn" 
          href="/learn"
          iconSrc="/learn.svg"
          onBeforeNavigate={(href) => {
            try {
              const r = localStorage.getItem('user_role');
              if (!r) {
                // store intent and show modal
                requestedPathRef.current = href;
                const ev = new Event('show-role-modal');
                window.dispatchEvent(ev);
                return false; // prevent navigation
              }
            } catch (e) {
              // if any error, allow navigation
            }
          }}
        />
        <SidebarItem 
          label="Leaderboard" 
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem 
          label="quests" 
          href="/quests"
          iconSrc="/quests.svg"
        />    
        {role === 'teacher' && (
          <SidebarItem 
            label="Teacher"
            href="/teacher"
            iconSrc="/teacher.svg"
          />
        )}
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
