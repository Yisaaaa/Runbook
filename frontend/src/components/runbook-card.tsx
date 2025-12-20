import { BookOpen, Clock, Link } from "lucide-react";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";

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
  const username = useAuthStore((state) => state.user?.username);

  return (
    <Button
      asChild
      variant="ghost"
      className="group flex gap-5 p-5 py-10 w-full justify-start"
    >
      <div>
        <div className="p-4 bg-muted rounded group-hover:bg-accent transition-colors">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start gap-1">
          <p className="truncate text-base font-medium">{title}</p>
          <div className="flex gap-4 text-muted-foreground text-sm">
            <div className="flex gap-2 items-center">
              <Clock />
              <span>
                {formatDistanceToNow(new Date(updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <span>•</span>
            <div className="truncate">
              Owner: {owner === username ? "You" : username}
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
}
