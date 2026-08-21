export const LANGUAGES = [
  { id: "python", label: "Python", emoji: "🐍", badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300", dot: "bg-blue-500" },
  { id: "javascript", label: "JavaScript", emoji: "🟨", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300", dot: "bg-yellow-500" },
  { id: "typescript", label: "TypeScript", emoji: "🔷", badge: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300", dot: "bg-sky-500" },
  { id: "gdscript", label: "GDScript", emoji: "🎮", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", dot: "bg-emerald-500" },
];

export const DIFFICULTY = {
  beginner: { label: "Beginner", badge: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300" },
  intermediate: { label: "Intermediate", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" },
  advanced: { label: "Advanced", badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" },
};

const LANG_ORDER = { python: 0, javascript: 1, typescript: 2, gdscript: 3 };

export function sortLessons(lessons) {
  return [...lessons].sort(
    (a, b) => (LANG_ORDER[a.language] ?? 9) - (LANG_ORDER[b.language] ?? 9) || (a.track_order || 0) - (b.track_order || 0)
  );
}

export function computeLevel(totalXp) {
  let level = 1;
  let needed = 100;
  let acc = 0;
  let xp = totalXp || 0;
  while (xp >= acc + needed) {
    acc += needed;
    level += 1;
    needed = Math.round(needed * 1.25);
  }
  const currentLevelXp = xp - acc;
  return { level, currentLevelXp, nextLevelXp: needed, progress: needed ? currentLevelXp / needed : 0 };
}