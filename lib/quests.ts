import { quests as defaultQuests } from '@/constants';
import fs from 'fs';
import path from 'path';

export type Quest = {
  title: string;
  value: number;
  id?: string;
  custom?: boolean;
};

export function getAllQuests(courseId?: number): Quest[] {
  const customQuests: Quest[] = [];
  
  try {
    const DATA_PATH = path.join(process.cwd(), 'data', 'teacher_quests.json');
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    
    // Filter by courseId if provided
    const filtered = courseId 
      ? items.filter((q: any) => q.courseId === courseId)
      : items;
    
    filtered.forEach((q: any) => {
      customQuests.push({
        id: q.id,
        title: `Earn ${q.value} XP`,
        value: q.value,
        custom: true,
      });
    });
  } catch (e) {
    // ignore
  }

  // Combine default quests with custom quests
  const allQuests = [...defaultQuests, ...customQuests];
  
  // Sort by value
  allQuests.sort((a, b) => a.value - b.value);
  
  return allQuests;
}

