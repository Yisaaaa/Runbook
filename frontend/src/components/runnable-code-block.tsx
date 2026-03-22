import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { runtimeLanguageMap } from "@/contants";
import type { OutputChunk, ExitChunk, ErrorChunk } from "@/types/stream.chunk";
import { useState } from "react";
import { join } from "node:path";

type RunnableCodeBlock = {
  sessionId: number | null;
  runtime: string;
  code: string;
  index: number;
};

export default function RunnableCodeBlock({
  sessionId,
  runtime,
  code,
  index,
}: RunnableCodeBlock) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<ErrorChunk | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [exitCode, setExitCode] = useState<number | null>(null);

  const handleRunButton = async () => {
    console.log("Executing code indexed: ", index);
    setIsRunning(true);
    setError(null);
    setOutput([]);
    setExitCode(null);

    try {
      const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + `/executions/exec-block`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          runtime,
          blockIndex: index,
        }),
      });

      if (!res.ok) throw new Error("Failed to execute block");

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue; // skipping empty line

          const chunk = JSON.parse(line);
          handleChunk(chunk);
        }
      }
    } catch (error) {
      console.log(
        "Error executing block: ",
        error instanceof Error ? error.message : error,
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleChunk = (chunk: OutputChunk | ExitChunk | ErrorChunk) => {
    switch (chunk.type) {
      case "output":
        console.log("Output chunk: ", chunk.data);
        handleOutputChunk(chunk);
        break;
      case "exit":
        console.log("Exit chunk: ", chunk.exitCode);
        handleExitChunk(chunk);
        break;
      case "error":
        console.log("Error chunk: ", chunk.message);
        handleErrorChunk(chunk);
        break;
      default:
        console.warn("Unknown chunk type: ", chunk);
        break;
    }
  };

  const handleOutputChunk = (chunk: OutputChunk) => {
    setOutput((prev) => [...prev, chunk.data]);
  };

  const handleExitChunk = (chunk: ExitChunk) => {
    setExitCode(chunk.exitCode);
  };

  const handleErrorChunk = (chunk: ErrorChunk) => {
    setError(chunk);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center bg-sidebar-accent px-4 py-2">
        <span className="text-sm text-muted-foreground">
          {runtime ?? "Select a runtime"}
        </span>
        <button
          onClick={() => handleRunButton()}
          disabled={isRunning}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
        >
          ▶ Run
        </button>
      </div>
      <SyntaxHighlighter
        language={runtimeLanguageMap[runtime]}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>

      {output.length > 0 && (
        <div className="rounded-b-lg">
          <div className="flex justify-between items-center bg-sidebar-accent px-4 py-2">
            <span className="text-sm font-mono text-muted-foreground">
              output
            </span>
            <span className="bg-green-950 text-green-600 text-xs font-mono font-semibold rounded border border-green-600 px-1.5">
              exit {error ? error.exitCode : (exitCode ?? "")}
            </span>
          </div>
          <pre className="mt-0 mb-0">{output}</pre>
        </div>
      )}
    </div>
  );
}
