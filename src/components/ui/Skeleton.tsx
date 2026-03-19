import { cn } from '@/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white/5',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/3 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

export function TrackSkeleton() {
  return (
    <div className="w-[300px] space-y-4">
      <Skeleton className="aspect-square w-full rounded-[24px]" />
      <div className="space-y-2 px-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
