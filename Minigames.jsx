import { useState } from "react";
import SpeedQuiz from "@/components/games/SpeedQuiz";
import MemoryMatch from "@/components/games/MemoryMatch";
import { Zap, Layers, ArrowLeft } from "lucide-react";

export default function Minigames() {
  const [game, setGame] = useState(null);

  if (game === "quiz") {
    return (
      <div className="space-y-5">
        <button onClick={() => setGame(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> All games
        </button>
        <SpeedQuiz />
      </div>
    );
  }
  if (game === "match") {
    return (
      <div className="space-y-5">
        <button onClick={() => setGame(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> All games
        </button>
        <MemoryMatch />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-1">Minigames</h1>
        <p className="text-muted-foreground">Prefer playing over flipping cards? Sharpen your skills with these quick games.</p>
      </div>