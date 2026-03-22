import { useRunnableBlockQuery } from "@/queries/runbook";
import ReactMarkdown from "react-markdown";
import RunnableCodeBlock from "./runnable-code-block";
import FileCodeBlock from "./file-code-block";

export default function RunbookMarkdown({
  sessionId,
  runbookId,
  content,
  className,
}: {
  sessionId: number | null;
  runbookId: number;
  content: string;
  className?: string;
}) {
  const { data: runnableBlocks } = useRunnableBlockQuery(runbookId);

  if (!runnableBlocks) return null;

  return (
    <div className={`h-full min-h-0 flex flex-col ${className}`}>
      <div className="min-h-0 prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            pre({ children }) {
              const child = Array.isArray(children) ? children[0] : children;

              if (
                (typeof child.props?.className === "string" &&
                  child.props.className.includes("runnable")) ||
                child.props.className.includes("file")
              ) {
                return <>{children}</>;
              }

              return <pre>{children}</pre>;
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const code = String(children)
                .replace(/\r\n/g, "\n")
                .replace(/\s+$/, "")
                .trim();

              const meta = node?.data?.meta?.split(" ");
              const runtime = meta?.[0];
              const filename = meta?.[1];

              if (!runtime) return null;

              if (className?.includes("file")) {
                if (!filename) return null;

                return (
                  <FileCodeBlock
                    runtime={runtime}
                    filename={filename}
                    code={code}
                  />
                );
              }

              const block = runnableBlocks.find((block) => block.code == code);

              if (!block) return null;

              const index = block.index;

              if (className?.includes("runnable")) {
                return (
                  <RunnableCodeBlock
                    sessionId={sessionId}
                    runtime={runtime}
                    code={code}
                    index={index}
                  />
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
    </div>
  );
}
