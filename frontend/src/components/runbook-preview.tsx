import RunbookMarkdown from "./runbook-markdown";

type RunbookPreviewType = {
  className?: string;
  content: string;
  runbookId: number | null;
};

export default function RunbookPreviewPage({
  className,
  content,
  runbookId,
}: RunbookPreviewType) {
  return (
    <div
      className={`${className} prose prose-invert max-w-none h-[calc(100vh-250px)] overflow-auto p-4`}
    >
      <RunbookMarkdown
        sessionId={null}
        runbookId={runbookId}
        content={content}
      />
    </div>
  );
}
