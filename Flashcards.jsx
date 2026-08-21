import { useState, useMemo } from "react";
import { useFlashcards } from "@/lib/useUserData";
import { LANGUAGES, DIFFICULTY } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Check, Shuffle, Layers, Loader2 } from "lucide-react";

export default function Flashcards() {
  const { data: cards = [], isLoading } = useFlashcards();
  const [lang, setLang] = useState("all");
  const [order, setOrder] = useState([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);

  const filtered = useMemo(() => (lang === "all" ? cards : cards.filter((c) => c.language === lang)), [cards, lang]);

  // current sequence (shuffled order of indices into filtered)
  const currentOrder = order.length ? order : filtered.map((_, i) => i);
  const cardIdx = currentOrder[pos];
  const card = filtered[cardIdx];

  const shuffle = () => {
    const indices = filtered.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setOrder(indices);
    setPos(0);
    setFlipped(false);
    setKnown(0);
    setReview(0);
  };