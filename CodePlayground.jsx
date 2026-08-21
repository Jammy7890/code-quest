import React, { useState } from 'react';

const defaultCode = `// Welcome to the Playground!
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Code Quest Adventurer"));
`;

function CodePlayground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState([]);

  const runCode = () => {
    const logs = [];
    const customConsole = {
      log: (...a) => logs.push(a.map((item) => (typeof item === 'object' ? JSON.stringify(item) : item)).join(' ')),
      error: (...a) => logs.push(`[Error] ${a.join(' ')}`),
      warn: (...a) => logs.push(`[Warn] ${a.join(' ')}`),
      info: (...a) => logs.push(a.join(' ')),
    };

    try {
      const runFn = new Function('console', code);
      runFn(customConsole);
      setOutput(logs.length > 0 ? logs : ['Code executed successfully with no console output.']);
    } catch (err) {
      setOutput([`Runtime Error: ${err.message}`]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Code Playground</h1>
          <p className="text-slate-600 text-sm">Write, test, and execute JavaScript directly in your browser.</p>
        </div>
        <button
          onClick={runCode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-sm transition-all"
        >
          Run Code
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm">
          <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-mono border-b border-slate-700">
            Editor (JavaScript)
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-slate-950 shadow-sm">
          <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between items-center">
            <span>Console Output</span>
            <button
              onClick={() => setOutput([])}
              className="hover:text-slate-200 underline"
            >
              Clear
            </button>
          </div>
          <div className="p-4 font-mono text-sm text-green-400 h-80 overflow-y-auto space-y-1">
            {output.length === 0 ? (
              <span className="text-slate-600 italic">// Click "Run Code" to view output here</span>
            ) : (
              output.map((line, index) => <div key={index}>{line}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePlayground;
