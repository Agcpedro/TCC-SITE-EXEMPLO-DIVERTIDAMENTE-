"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { eq } from "drizzle-orm";

export const awardTeacherActivityPoints = async (points: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  await db.update(userProgress).set({
    points: currentUserProgress.points + points,
  }).where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath('/learn');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
};
