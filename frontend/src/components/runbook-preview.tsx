import ReactMarkdown from "react-markdown";
import RunnableCodeBlock from "./runnable-code-block";
import { useRunnableBlockQuery } from "@/queries/runbook";

type RunbookPreviewType = {
  runbookId: number | null;
  content: string;
  runtime?: string;
  className?: string;
};

export default function RunbookPreviewPage({
  className,
  content,
  runtime,
  runbookId,
}: RunbookPreviewType) {
  const {
    data: runnableBlocks,
    isLoading,
    isError,
    error,
  } = useRunnableBlockQuery(runbookId);

  console.log(runnableBlocks);

  return (
    <div
      className={`${className} prose prose-invert max-w-none h-[calc(100vh-250px)] overflow-auto p-4`}
    >
      <ReactMarkdown
        components={{
          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children;

            if (
              typeof child.props?.className === "string" &&
              child.props.className.includes("runnable")
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

            const isRunnable = className?.includes("runnable");
            if (isRunnable) {
              return (
                <RunnableCodeBlock
                  runtime={runtime ?? ""}
                  code={code}
                  index={index ?? null}
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
  );
}
