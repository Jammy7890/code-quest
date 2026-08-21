const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, Gem } from "lucide-react";

export default function AITutor({ context, language, title, gemCost = 0, gems = null, onSpend = null }) {
  const initial = `Hi! I'm your AI tutor for this ${language} lesson${title ? `: ${title}` : ""}.${gemCost > 0 ? ` Each question costs ${gemCost} 💎.` : ""} Ask me anything — I can explain concepts, debug your code, or give another hint.`;
  const [messages, setMessages] = useState([{ role: "assistant", content: initial }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const balance = typeof gems === "number" ? gems : null;
  const insufficient = gemCost > 0 && balance !== null && balance < gemCost;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    if (gemCost > 0 && onSpend) {
      const ok = await onSpend(gemCost);
      if (!ok) return;
    }
    const userMsg = input.trim();
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const convo = newMessages.map((m) => `${m.role}: ${m.content}`).join("\n");
      const prompt = `You are a friendly, concise coding tutor teaching ${language}. Lesson context:\n${context}\n\nConversation so far:\n${convo}\n\nAnswer the user's latest message. Keep it short, clear, and encouraging. Use inline code or short code blocks when helpful. Do not write the full solution unless the user explicitly asks for it — prefer to guide.`;
      const res = await db.integrations.Core.InvokeLLM({ prompt });