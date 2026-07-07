const TaskSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#4A3F32] dark:bg-[#2B241C]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="skeleton-bar h-4 w-1/3 rounded" />
            <div className="skeleton-bar h-4 w-16 rounded-full" />
          </div>
          <div className="skeleton-bar h-3 w-2/3 rounded" />
          <div className="skeleton-bar h-3 w-24 rounded" />
        </div>

        <div className="flex shrink-0 gap-1">
          <div className="skeleton-bar h-8 w-8 rounded-xl" />
          <div className="skeleton-bar h-8 w-8 rounded-xl" />
          <div className="skeleton-bar h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
