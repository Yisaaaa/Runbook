import ReactMarkdown from "react-markdown";

export default function RunbookPreviewPage({
  className,
  content,
}: {
  className?: string;
  content: string;
}) {
  return (
    <div
      className={`${className} prose prose-invert max-w-none h-[calc(100vh-250px)] overflow-auto p-4`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
