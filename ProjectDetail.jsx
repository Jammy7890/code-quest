const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProjects, useUserProgress, useUserStat } from "@/lib/useUserData";

import { useQueryClient } from "@tanstack/react-query";
import { applyStreak, todayStr, LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { GEM_COSTS, gemsForReward, spendGems } from "@/lib/gems";
import CodeEditor from "@/components/CodeEditor";
import CodeBlock from "@/components/CodeBlock";
import AITutor from "@/components/AITutor";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle2, Loader2, Sparkles, ArrowLeft, Trophy, X, PartyPopper, ListChecks, Gem } from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: projects = [] } = useProjects();
  const { data: progress = [] } = useUserProgress();
  const { data: stat } = useUserStat();

  const project = projects.find((p) => p.id === projectId);
  const lang = LANGUAGES.find((l) => l.id === project?.language);
  const myProgress = progress.find((p) => p.item_id === projectId);
  const isCompleted = myProgress?.status === "completed";

  const [code, setCode] = useState(myProgress?.last_code || project?.starter_code || "");
  const [showHint, setShowHint] = useState(false);
  const [hintError, setHintError] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showTutor, setShowTutor] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [earnedGems, setEarnedGems] = useState(0);

  if (!project) {
    return <div className="py-20 text-center text-muted-foreground">Loading project…</div>;
  }

  const gemBalance = stat?.gems ?? 0;

  const handleSpend = async (cost) => {
    const r = await spendGems(base44, stat, qc, cost);
    return r.ok;
  };

  const revealHint = async () => {
    setHintError("");
    if (showHint) {
      setShowHint(false);
      return;
    }
    const ok = await handleSpend(GEM_COSTS.hint);
    if (!ok) {
      setHintError("Not enough gems — complete lessons to earn more.");
      return;
    }
    setShowHint(true);
  };

  const context = `Project: ${project.title} (${project.language})\nDescription: ${project.description}\nRequirements: ${(project.requirements || []).join("; ")}\nReference solution: ${project.solution}`;

  const checkAnswer = async () => {
    setChecking(true);
    setFeedback(null);
    setHintError("");
    const ok = await handleSpend(GEM_COSTS.ai);
    if (!ok) {
      setFeedback({ correct: false, feedback: "Not enough gems to check with AI. Complete lessons to earn more." });
      setChecking(false);
      return;
    }
    try {
      const prompt = `You are a coding mentor reviewing a student's project for ${project.language}.
Project: ${project.title}
Requirements: ${(project.requirements || []).join(", ")}
Reference solution: ${project.solution}
Student's code:
${code}

Check whether the student's code satisfies the requirements. Be lenient on style but strict on functionality. Return JSON with "correct" (boolean) and "feedback" (a short, encouraging review of at most 3 sentences; if incomplete, list what's missing without writing the full solution).`;
      const res = await db.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: { correct: { type: "boolean" }, feedback: { type: "string" } },
          required: ["correct", "feedback"],
        },
      });
      setFeedback(res);
      if (myProgress && myProgress.status !== "completed") {
        await db.entities.UserProgress.update(myProgress.id, { status: "in_progress", last_code: code });
      } else if (!myProgress) {
        await db.entities.UserProgress.create({ item_type: "project", item_id: project.id, status: "in_progress", last_code: code });
        qc.invalidateQueries(["userProgress"]);
      }
    } catch (e) {
      setFeedback({ correct: false, feedback: "Could not check your code right now. Try the AI mentor or review the requirements." });
    } finally {
      setChecking(false);
    }
  };

  const complete = async () => {
    setCompleting(true);
    try {
      if (!isCompleted) {
        if (myProgress) {
          await db.entities.UserProgress.update(myProgress.id, {
            status: "completed",
            xp_earned: project.xp_reward,
            completed_date: todayStr(),
            last_code: code,
          });
        } else {
          await db.entities.UserProgress.create({
            item_type: "project",
            item_id: project.id,
            status: "completed",
            xp_earned: project.xp_reward,
            completed_date: todayStr(),
            last_code: code,
          });
        }
        const streak = applyStreak(stat, todayStr());
        const reward = gemsForReward(project.gem_reward || 0, streak.current_streak);
        setEarnedGems(reward);
        if (stat) {
          await db.entities.UserStat.update(stat.id, {
            current_streak: streak.current_streak,
            longest_streak: streak.longest_streak,
            last_lesson_date: streak.last_lesson_date,
            total_xp: (stat.total_xp || 0) + (project.xp_reward || 0),
            lessons_completed: (stat.lessons_completed || 0) + 1,
            gems: (stat.gems || 0) + reward,
          });
        }
        setCelebrate(true);
      }
      qc.invalidateQueries(["userStat"]);
      qc.invalidateQueries(["userProgress"]);
      if (isCompleted) navigate("/projects");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-7">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lang?.badge}`}>{lang?.emoji} {lang?.label}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY[project.difficulty]?.badge}`}>{DIFFICULTY[project.difficulty]?.label}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className="w-3 h-3" /> {project.xp_reward} XP</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Gem className="w-3 h-3" /> +{project.gem_reward || 0}</span>
          {isCompleted && <span className="text-xs font-medium text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>}
        </div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">{project.title}</h1>
        <p className="text-muted-foreground mt-1">{project.description}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Requirements</h3>
        </div>
        <ul className="space-y-2">
          {(project.requirements || []).map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-foreground/80">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-[15px]">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-heading font-semibold">Your code</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Gem className="w-3.5 h-3.5" /> {gemBalance} gems</span>
            <Button variant="outline" size="sm" onClick={revealHint}>
              <Lightbulb className="w-4 h-4 mr-1.5" /> {showHint ? "Hide hint" : "Hint"} <span className="text-xs text-muted-foreground">· 💎{GEM_COSTS.hint}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSolution((s) => !s)}>
              {showSolution ? "Hide" : "Show"} solution
            </Button>
          </div>
        </div>
        {showHint && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 text-sm text-amber-800 dark:text-amber-200">
            <Lightbulb className="w-4 h-4 inline mr-1.5" /> {project.hint}
          </div>
        )}
        {hintError && <div className="text-xs text-rose-500">{hintError}</div>}
        <CodeEditor value={code} onChange={setCode} language={project.language} minHeight={320} />
        {showSolution && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reference solution</div>
            <CodeBlock code={project.solution} language={project.language} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={checkAnswer} disabled={checking}>
            {checking ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
            Check with AI <span className="text-xs text-muted-foreground">· 💎{GEM_COSTS.ai}</span>
          </Button>
          <Button variant="outline" onClick={() => setShowTutor((s) => !s)}>
            <Sparkles className="w-4 h-4 mr-1.5" /> {showTutor ? "Hide" : "Ask"} AI Mentor
          </Button>
        </div>
        {feedback && (
          <div className={`rounded-xl p-4 text-sm ${feedback.correct ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-200" : "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200"}`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {feedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {feedback.correct ? "Great work!" : "Needs more work"}
            </div>
            {feedback.feedback}
          </div>
        )}
      </div>

      {showTutor && <AITutor context={context} language={lang?.label || project.language} title={project.title} gemCost={GEM_COSTS.ai} gems={gemBalance} onSpend={handleSpend} />}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button onClick={complete} disabled={completing} size="lg">
          {completing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : isCompleted ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <Trophy className="w-4 h-4 mr-1.5" />}
          {isCompleted ? "Back to projects" : "Mark project complete"}
        </Button>
      </div>

      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-3xl p-8 max-w-sm text-center mx-4 shadow-2xl">
            <PartyPopper className="w-12 h-12 mx-auto mb-3 text-orange-500" />
            <h2 className="text-2xl font-heading font-bold mb-1">Project complete!</h2>
            <p className="text-muted-foreground">+{project.xp_reward} XP · +{earnedGems} 💎 earned</p>
            <p className="text-xs text-muted-foreground mt-1">You're leveling up fast! 🚀</p>
            <Button className="mt-5" onClick={() => navigate("/projects")}>Back to projects</Button>
          </div>
        </div>
      )}
    </div>
  );
}