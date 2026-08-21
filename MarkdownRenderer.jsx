import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }) {
  return (
    <div className="text-[15px]">
      <ReactMarkdown
        components={{
          h1: ({ node, ...p }) => <h1 className="text-2xl font-heading font-bold mt-6 mb-3" {...p} />,
          h2: ({ node, ...p }) => <h2 className="text-xl font-heading font-semibold mt-5 mb-2" {...p} />,
          h3: ({ node, ...p }) => <h3 className="text-lg font-heading font-semibold mt-4 mb-2" {...p} />,
          p: ({ node, ...p }) => <p className="text-foreground/80 leading-relaxed mb-3" {...p} />,
          ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-foreground/80" {...p} />,
          ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-foreground/80" {...p} />,
          li: ({ node, ...p }) => <li className="leading-relaxed" {...p} />,
          code: ({ node, ...p }) => <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono text-primary" {...p} />,
          strong: ({ node, ...p }) => <strong className="font-semibold text-foreground" {...p} />,
          blockquote: ({ node, ...p }) => <blockquote className="border-l-2 border-primary/40 pl-4 italic text-muted-foreground my-3" {...p} />,
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}