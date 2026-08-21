const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useQuery } from "@tanstack/react-query";

export function useUserStat() {
  return useQuery({
    queryKey: ["userStat"],
    queryFn: async () => {
      const list = await db.entities.UserStat.list(undefined, 50);
      if (list && list.length) {
        const s = list[0];
        if (s.gems === undefined) {
          return await db.entities.UserStat.update(s.id, { gems: 10 });
        }
        return s;
      }
      return await db.entities.UserStat.create({
        current_streak: 0,
        longest_streak: 0,
        total_xp: 0,
        last_lesson_date: null,
        lessons_completed: 0,
        gems: 10,
      });
    },
  });
}

export function useUserProgress() {
  return useQuery({
    queryKey: ["userProgress"],
    queryFn: async () => {
      return await db.entities.UserProgress.list(undefined, 500);
    },
  });
}

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      return await db.entities.Lesson.list(undefined, 500);
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await db.entities.Project.list(undefined, 200);
    },
  });
}

export function useFlashcards() {
  return useQuery({
    queryKey: ["flashcards"],
    queryFn: async () => {
      return await db.entities.Flashcard.list(undefined, 500);
    },
  });
}