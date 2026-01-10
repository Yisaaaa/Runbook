import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function RunbookPreviewPage({
  className,
  content,
  runtime,
}: {
  className?: string;
  content: string;
  runtime?: string;
}) {
  runtime = runtime ?? "";
  const runtimeLanguageMap: Record<string, string> = {
    python: "python",
    nodejs: "javascript",
    golang: "go",
    bash: "bash",
  };

  return (
    <div
      className={`${className} prose prose-invert max-w-none h-[calc(100vh-250px)] overflow-auto p-4`}
    >
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const code = String(children).replace(/\n$/, "");
            const isRunnable = className?.includes("runnable");
            console.log(props);
            if (isRunnable) {
              return (
                <div className="my-4 rounded-lg overflow-hidden border border-border">
                  <div className="flex justify-between items-center bg-sidebar-accent px-4 py-2">
                    <span className="text-sm text-muted-foreground">
                      {runtime ?? "Select a runtime"}
                    </span>
                    {isRunnable && (
                      <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
                        ▶ Run
                      </button>
                    )}
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

            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
