import { useState } from "react";

import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Trash2, Terminal, Wand2 } from "lucide-react";
import { LANGUAGES } from "@/lib/progress";

const STARTERS = {
  python: '# Try anything in Python!\nfor i in range(5):\n    print("Hello", i)\n',
  javascript: '// Try anything in JavaScript!\nfor (let i = 0; i < 5; i++) {\n  console.log("Hello", i);\n}\n',
  typescript: '// Try anything in TypeScript!\nconst greet = (name: string): string => `Hi, ${name}!`;\nconsole.log(greet("Ada"));\n',
  gdscript: '# Try anything in GDScript!\nextends Node\n\nfunc _ready():\n    for i in range(5):\n        print("Hello ", i)\n',
};

export default function CodePlayground() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(STARTERS.javascript);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const pickLang = (l) => {
    setLang(l);
    setCode(STARTERS[l]);
    setOutput("");
  };

  const runJS = (src) => {
    const logs = [];
    const fakeConsole = {
      log: (...a) => logs.push(a.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join(" ")),
      error: (...a) => logs.push("Error: " + a.join(" ")),
      warn: (...a) => logs.push(a.join(" ")),
      info: (...a) => logs.push(a.join(" ")),
    };
    try {