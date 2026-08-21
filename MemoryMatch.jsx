import { useState, useMemo } from "react";
import { useFlashcards } from "@/lib/useUserData";
import { LANGUAGES } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Layers, RotateCcw, Trophy } from "lucide-react";

export default function MemoryMatch() {
  const { data: cards = [] } = useFlashcards();
  const [lang, setLang] = useState(null);
  const [board, setBoard] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const pairs = useMemo(() => new Set(board.map((t) => t.pair)).size, [board]);
  const won = pairs > 0 && matched.length === pairs;

  const start = (l) => {
    setLang(l);
    const pool = l === "all" ? cards : cards.filter((c) => c.language === l);
    const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    const tiles = [];
    chosen.forEach((c) => {
      tiles.push({ id: `${c.id}-f`, pair: c.id, text: c.front });
      tiles.push({ id: `${c.id}-b`, pair: c.id, text: c.back });
    });
    setBoard(tiles.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const flip = (i) => {
    if (won) return;
    if (flipped.includes(i)) return;
    if (matched.includes(board[i].pair)) return;
    if (flipped.length === 2) return;
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nf;
      if (board[a].pair === board[b].pair) {
        setMatched((m) => [...m, board[a].pair]);
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  if (!lang) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-1">Memory Match</h2>
          <p className="text-muted-foreground">Pick a language to start matching concepts with answers.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => start("all")} className="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:border-primary/40">
            All
          </button>
          {LANGUAGES.map((l) => (
            <button key={l.id} onClick={() => start(l.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:border-primary/40">
              <span>{l.emoji}</span> {l.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (board.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No flashcards available for this language yet — try another.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Moves: <span className="font-medium text-foreground">{moves}</span></span>
          <span className="text-sm text-muted-foreground">Pairs: <span className="font-medium text-foreground">{matched.length}/{pairs}</span></span>
        </div>
        <Button variant="outline" size="sm" onClick={() => start(lang)}>
          <RotateCcw className="w-4 h-4 mr-1.5" /> Restart
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {board.map((tile, i) => {
          const isOpen = flipped.includes(i) || matched.includes(tile.pair);
          return (
            <button
              key={tile.id}
              onClick={() => flip(i)}
              className={`relative h-28 rounded-2xl border-2 p-3 flex items-center justify-center text-center transition-all ${isOpen ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
            >
              {isOpen ? (
                <span className="text-xs sm:text-sm font-medium line-clamp-4">{tile.text}</span>
              ) : (
                <span className="text-2xl text-muted-foreground">?</span>
              )}
            </button>
          );
        })}
      </div>
      {won && (
        <div className="rounded-2xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 p-6 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-2 text-amber-500" />
          <h3 className="text-xl font-heading font-bold">You matched them all!</h3>
          <p className="text-sm text-muted-foreground mt-1">Completed in {moves} moves.</p>
          <Button className="mt-4" onClick={() => start(lang)}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> Play again
          </Button>
        </div>
      )}
    </div>
  );
}