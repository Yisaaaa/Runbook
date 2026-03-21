import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { runtimeLanguageMap } from "@/contants";

type FileCodeBlock = {
  runtime: string;
  filename: string;
  code: string;
};

export default function FileCodeBlock({
  runtime,
  filename,
  code,
}: FileCodeBlock) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center bg-sidebar-accent px-4 py-2">
        <span className="text-sm text-muted-foreground">{runtime}</span>
        <span className="text-sm text-muted-foreground">{filename}</span>
      </div>
      <SyntaxHighlighter
        language={runtimeLanguageMap[runtime || ""]}
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
