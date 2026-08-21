import { Link } from "react-router-dom";
import { useUserStat, useUserProgress, useLessons } from "@/lib/useUserData";
import { computeLevel, sortLessons, LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { Flame, BookOpen, Trophy, Zap, ArrowRight, CheckCircle2, Target } from "lucide-react";

export default function Dashboard() {
  const { data: stat } = useUserStat();
  const { data: progress = [] } = useUserProgress();
  const { data: lessons = [] } = useLessons();

  const level = computeLevel(stat?.total_xp || 0);
  const completedIds = new Set(progress.filter((p) => p.status === "completed" && p.item_type === "lesson").map((p) => p.item_id));
  const sorted = sortLessons(lessons);
  const nextLesson = sorted.find((l) => !completedIds.has(l.id));

  const langProgress = LANGUAGES.map((lang) => {
    const ls = lessons.filter((l) => l.language === lang.id);
    const done = ls.filter((l) => completedIds.has(l.id)).length;
    return { ...lang, total: ls.length, done, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
  });

  const stats = [
    { label: "Current streak", value: stat?.current_streak || 0, icon: Flame, color: "text-orange-500" },
    { label: "Longest streak", value: stat?.longest_streak || 0, icon: Trophy, color: "text-amber-500" },
    { label: "Lessons done", value: stat?.lessons_completed || 0, icon: CheckCircle2, color: "text-green-500" },
    { label: "Total XP", value: stat?.total_xp || 0, icon: Zap, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-7 sm:p-9 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium mb-2">
            <Flame className="w-4 h-4" /> {stat?.current_streak ? `${stat.current_streak}-day streak — keep it going!` : "Start your streak today"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-1">Level {level.level}</h1>
          <p className="text-primary-foreground/80 mb-5">
            {level.currentLevelXp} / {level.nextLevelXp} XP to level {level.level + 1}
          </p>
          <div className="h-2.5 rounded-full bg-primary-foreground/20 overflow-hidden max-w-md">
            <div className="h-full bg-primary-foreground rounded-full transition-all duration-700" style={{ width: `${Math.round(level.progress * 100)}%` }} />
          </div>
        </div>
      </div>

      {nextLesson && (
        <Link
          to={`/learn/${nextLesson.language}/${nextLesson.id}`}
          className="group block rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" /> Continue learning
              </div>
              <div className="text-lg font-heading font-semibold truncate">{nextLesson.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {LANGUAGES.find((l) => l.id === nextLesson.language)?.label} · {DIFFICULTY[nextLesson.difficulty]?.label} · +{nextLesson.xp_reward} XP
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <Icon className={`w-5 h-5 mb-3 ${s.color}`} />
              <div className="text-3xl font-heading font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-semibold">Your tracks</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {langProgress.map((lang) => (
            <Link key={lang.id} to="/learn" className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{lang.emoji}</span>
                  <span className="font-heading font-semibold">{lang.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{lang.done}/{lang.total}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${lang.dot} rounded-full transition-all duration-500`} style={{ width: `${lang.pct}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <BookOpen className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Want to build something real?{" "}
          <Link to="/projects" className="text-primary font-medium hover:underline">
            Browse practice projects →
          </Link>
        </p>
      </div>
    </div>
  );
}