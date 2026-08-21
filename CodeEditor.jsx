export default function CodeEditor({ value, onChange, language, readOnly, minHeight = 260 }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">{language}</span>
        <span className="text-xs text-slate-500">{readOnly ? "read-only" : "editor"}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        style={{ minHeight }}
        className="w-full p-4 bg-transparent text-slate-100 font-mono text-sm leading-relaxed resize-y outline-none placeholder:text-slate-600"
        placeholder="// Write your code here..."
      />
    </div>
  );
}