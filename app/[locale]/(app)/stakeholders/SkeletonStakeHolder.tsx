"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonStakeHolder = () => {
  return (
    <Skeleton className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton
          className={`w-12 h-12 rounded-xl  flex items-center justify-center font-bold text-lg`}
        />
        <div>
          <Skeleton className="h-4 w-80 font-bold text-slate-900" />
          <Skeleton className="mt-2 h-2 w-60 font-bold text-slate-900" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <Skeleton className="mt-2 h-2 w-60 font-bold text-slate-900" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <Skeleton className="mt-2 h-2 w-60 font-bold text-slate-900" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <Skeleton className="mt-2 h-2 w-60 font-bold text-slate-900" />
        </div>
      </div>
      <Skeleton className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors" />
    </Skeleton>
  );
};
