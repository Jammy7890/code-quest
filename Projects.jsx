import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects, useUserProgress } from "@/lib/useUserData";
import { LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { CheckCircle2, Clock, Star, ArrowRight } from "lucide-react";

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const { data: projects = [] } = useProjects();
  const { data: progress = [] } = useUserProgress();

  const completedIds = new Set(progress.filter((p) => p.status === "completed" && p.item_type === "project").map((p) => p.item_id));
  const shown = filter === "all" ? projects : projects.filter((p) => p.language === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-1">Practice projects</h1>
        <p className="text-muted-foreground">Apply what you've learned. Build real, runnable projects — free to explore.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"}`}
        >
          All
        </button>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setFilter(lang.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === lang.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"}`}
          >
            <span>{lang.emoji}</span> {lang.label}