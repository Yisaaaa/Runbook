import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";

interface RunbookCardProps {
  classname?: string;
  title: string;
  updatedAt: string;
  owner: string;
}

export default function RunbookCard({
  classname,
  title,
  updatedAt,
  owner,
}: RunbookCardProps) {
  return (
    <Button variant="ghost">
      <div className="gap-3">
        <BookOpen className="w-5 h-5" />
        <span className="text truncate">{title}</span>
      </div>
      <div>...</div>
    </Button>
  );
}
