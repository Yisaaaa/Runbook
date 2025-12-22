import RunbookCardSkeleton from "./runbook-card-skeleton";
import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton({ count }: { count: number }) {
  const cards = [];

  for (let i = 0; i < count; i++) {
    cards.push(<RunbookCardSkeleton key={i} />);
  }

  return <div className="flex flex-col gap-7">{cards}</div>;
}
