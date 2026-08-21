import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLessons, useUserProgress, useUserStat } from "@/lib/useUserData";

import { useQueryClient } from "@tanstack/react-query";
import { applyStreak, todayStr, LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { GEM_COSTS, gemsForReward, spendGems } from "@/lib/gems";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CodeBlock from "@/components/CodeBlock";
import CodeEditor from "@/components/CodeEditor";
import AITutor from "@/components/AITutor";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle2, Loader2, Sparkles, ArrowRight, ArrowLeft, Trophy, X, PartyPopper, Gem, HelpCircle } from "lucide-react";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: lessons = [] } = useLessons();
  const { data: progress = [] } = useUserProgress();
  const { data: stat } = useUserStat();

  const lesson = lessons.find((l) => l.id === lessonId);
  const lang = LANGUAGES.find((l) => l.id === lesson?.language);
  const myProgress = progress.find((p) => p.item_id === lessonId);
  const isCompleted = myProgress?.status === "completed";

  const [code, setCode] = useState(myProgress?.last_code || lesson?.starter_code || "");
  const [showHint, setShowHint] = useState(false);
  const [hintError, setHintError] = useState("");
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showTutor, setShowTutor] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);