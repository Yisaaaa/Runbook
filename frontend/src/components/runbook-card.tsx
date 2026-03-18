import { BookOpen, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { Runbook } from "@/types/runbook";
import Link from "next/link";

interface RunbookCardProps {
  classname?: string;
  runbookData: Runbook;
}

export default function RunbookCard({
  classname,
  runbookData,
}: RunbookCardProps) {
  const username = useAuthStore((state) => state.user?.username);

  return (
    <Button asChild variant="ghost" className={`${classname}`}>
      <Link
        href={`/dashboard/runbooks/${runbookData.id}`}
        className={`group flex gap-5 p-5 py-10 w-full justify-start`}
      >
        <div className="p-4 bg-muted rounded group-hover:bg-accent transition-colors">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start gap-1">
          <p className="truncate text-base font-medium">{runbookData.title}</p>
          <div className="flex gap-2 text-muted-foreground text-sm">
            <div className="flex gap-2 items-center">
              <Clock />
              <span>
                {formatDistanceToNow(new Date(runbookData.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <span>•</span>
            <div className="truncate">
              Created by:{" "}
              {runbookData.createdBy === username
                ? "You"
                : runbookData.createdBy}
            </div>
          </div>
        </div>
      </Link>
    </Button>
  );
}
