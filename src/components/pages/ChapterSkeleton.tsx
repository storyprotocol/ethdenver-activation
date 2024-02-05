import { Skeleton } from "@/components/ui/skeleton";

export default function ChapterSkeleton({ length = 3 }: { length?: number }) {
  return Array(length)
    .fill(null)
    .map((_, index) => {
      return (
        <div key={index} className={"my-4 flex flex-col space-y-2"}>
          <Skeleton className={"h-4 w-1/3"} />
          <Skeleton className={"h-24 w-full"} />
        </div>
      );
    });
}
