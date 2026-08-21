import { useState } from "react";
import { Link } from "react-router-dom";
import { useLessons, useUserProgress } from "@/lib/useUserData";
import { LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { CheckCircle2, Lock, Star, ChevronRight } from "lucide-react";

export default function Learn() {
  const [active, setActive] = useState("python");
  const { data: lessons = [] } = useLessons();
  const { data: progress = [] } = useUserProgress();

  const completedIds = new Set(progress.filter((p) => p.status === "completed" && p.item_type === "lesson").map((p) => p.item_id));
  const langLessons = lessons
    .filter((l) => l.language === active)
    .sort((a, b) => (a.track_order || 0) - (b.track_order || 0));

  const isUnlocked = (lesson, index) => index === 0 || completedIds.has(langLessons[index - 1].id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-1">Learn to code</h1>
        <p className="text-muted-foreground">Pick a language. Lessons unlock one at a time as you complete them.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setActive(lang.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              active === lang.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
          >
            <span className="text-base">{lang.emoji}</span>
            {lang.label}
            <span className={`text-xs ${active === lang.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {lessons.filter((l) => l.language === lang.id && completedIds.has(l.id)).length}/{lessons.filter((l) => l.language === lang.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {langLessons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No lessons for this track yet — check back soon.
          </div>
        )}
        {langLessons.map((lesson, index) => {
          const done = completedIds.has(lesson.id);
          const unlocked = isUnlocked(lesson, index);
          const lang = LANGUAGES.find((l) => l.id === lesson.language);
          const diff = DIFFICULTY[lesson.difficulty];
          const content = (
            <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${unlocked ? "border-border bg-card hover:border-primary/40" : "border-border bg-muted/30 opacity-60"}`}>
              <div className="shrink-0">
                {done ? (
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                ) : unlocked ? (
                  <div className="w-7 h-7 rounded-full border-2 border-border flex items-center justify-center text-sm font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-base">{lesson.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{lesson.summary}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${lang?.badge}`}>{lang?.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff?.badge}`}>{diff?.label}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> {lesson.xp_reward} XP
                  </span>
                </div>
              </div>
              {unlocked && <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
            </div>
          );
          return unlocked ? (
            <Link key={lesson.id} to={`/learn/${lesson.language}/${lesson.id}`}>
              {content}
            </Link>
          ) : (
            <div key={lesson.id} className="cursor-not-allowed" title="Complete the previous lesson to unlock">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}