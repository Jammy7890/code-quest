import { useState, useEffect, useMemo } from "react";
import { useLessons } from "@/lib/useUserData";
import { LANGUAGES } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Trophy } from "lucide-react";

export default function SpeedQuiz() {
  const { data: lessons = [] } = useLessons();
  const quizzes = useMemo(
    () =>
      lessons.filter(
        (l) => l.quiz_question && Array.isArray(l.quiz_options) && l.quiz_options.length >= 2 && typeof l.quiz_answer_index === "number"
      ),
    [lessons]
  );

  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const current = questions[idx];

  useEffect(() => {
    if (!running || pick !== null || done) return;
    if (time <= 0) {
      setPick(-1);
      return;
    }
    const t = setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [running, pick, time, done]);