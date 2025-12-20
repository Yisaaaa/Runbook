import RunbookCardSkeleton from "./runbook-card-skeleton";
import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton({ count }: { count: number }) {
  const cards = [];

  for (let i = 0; i < count; i++) {
    cards.push(<RunbookCardSkeleton key={i} />);
  }

  return <div className="flex flex-col gap-7">{cards}</div>;

  //   return (
  //   <Button
  //     asChild
  //     variant="ghost"
  //     className="group flex gap-5 p-5 py-10 w-full justify-start"
  //   >
  //     <div>
  //       <div className="p-4 bg-muted rounded group-hover:bg-accent transition-colors">
  //         <BookOpen className="w-5 h-5" />
  //       </div>
  //       <div className="flex flex-col items-start gap-1">
  //         <p className="truncate text-base font-medium">{title}</p>
  //         <div className="flex gap-4 text-muted-foreground text-sm">
  //           <div className="flex gap-2 items-center">
  //             <Clock />
  //             <span>
  //               {formatDistanceToNow(new Date(updatedAt), {
  //                 addSuffix: true,
  //               })}
  //             </span>
  //           </div>
  //           <span>•</span>
  //           <div className="truncate">
  //             Owner: {owner === username ? "You" : username}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </Button>
  // );
}
