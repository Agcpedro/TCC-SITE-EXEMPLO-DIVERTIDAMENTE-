import React from "react";
import Link from "next/link";

import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Teacher — Divertidamente",
};

export default function TeacherLayout({ children, }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar className="hidden lg:flex" />
      <div className={cn("ml-0 lg:ml-[256px] w-full p-6")}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
          <Link href="/teacher/new" className="text-sm text-sky-600">Create activity</Link>
        </div>
        {children}
      </div>
    </div>
  );
}
