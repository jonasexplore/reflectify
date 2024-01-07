import { Skeleton } from "@/components/ui/skeleton";

export const BoardLoaderSkeleton = () => {
  return (
    <div className="h-full flex gap-2">
      <Skeleton className="flex flex-col gap-2 w-full bg-container rounded-xl p-2 h-full" />
      <Skeleton className="flex flex-col gap-2 w-full bg-container rounded-xl p-2 h-full" />
      <Skeleton className="flex flex-col gap-2 w-full bg-container rounded-xl p-2 h-full" />
      <Skeleton className="flex items-center rounded-xl mx-2 w-72" />
    </div>
  );
};
