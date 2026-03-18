import { useRunnableBlockQuery } from "@/queries/runbook";
import ReactMarkdown from "react-markdown";
import RunnableCodeBlock from "./runnable-code-block";
import FileCodeBlock from "./file-code-block";

export default function RunbookMarkdown({
  runbookId,
  content,
  className,
}: {
  runbookId: number | null;
  content: string;
  className?: string;
}) {
  const { data: runnableBlocks } = useRunnableBlockQuery(runbookId);

  console.log(runnableBlocks);
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
              const index = runnableBlocks?.find(
                (block) => block.code == code,
              )?.index;

              const meta = node?.data?.meta?.split(" ");
              const runtime = meta?.[0];
              const filename = meta?.[1];

              if (className?.includes("runnable")) {
                return (
                  <RunnableCodeBlock
                    runtime={runtime ?? ""}
                    code={code}
                    index={index}
                  />
                );
              }

              if (className?.includes("file")) {
                return (
                  <FileCodeBlock
                    runtime={runtime}
                    filename={filename}
                    code={code}
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
