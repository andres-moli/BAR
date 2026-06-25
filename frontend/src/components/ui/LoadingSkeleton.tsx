import { classNames } from '@/utils/format';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className, count = 1 }: SkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={classNames('bg-dark-700 rounded-lg animate-pulse', className)}
      />
    ))}
  </>
);

export const CardSkeleton = () => (
  <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-5 space-y-4">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="space-y-3">
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-5">
    <Skeleton className="h-5 w-40 mb-4" />
    <Skeleton className="h-64 w-full" />
  </div>
);
