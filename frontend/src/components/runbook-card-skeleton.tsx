import { Skeleton } from "./ui/skeleton";

export default function RunbookCardSkeleton() {
  return (
    <div className="flex gap-3 items-center ml-5">
      <Skeleton className="w-12 h-10" />
      <div className="flex flex-col gap-3 h-full w-full">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-1/3" />
      </div>
    </div>
  );
}
