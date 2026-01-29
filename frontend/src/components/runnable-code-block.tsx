import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { runtimeLanguageMap } from "@/contants";

type RunnableCodeBlock = {
  runtime: string;
  code: string;
  index: number | null;
};

export default function RunnableCodeBlock({
  runtime,
  code,
  index,
}: RunnableCodeBlock) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center bg-sidebar-accent px-4 py-2">
        <span className="text-sm text-muted-foreground">
          {runtime ?? "Select a runtime"}
        </span>
        <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
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
    </div>
  );
}
