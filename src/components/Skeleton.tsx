export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-16 rounded-full" />
          <div className="skeleton h-8 w-16 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-11 flex-1" />
          <div className="skeleton h-11 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="skeleton h-8 w-1/2" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="skeleton h-72 w-full" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-2/3" />
          <div className="flex gap-2">
            <div className="skeleton h-10 w-20 rounded-full" />
            <div className="skeleton h-10 w-20 rounded-full" />
          </div>
          <div className="skeleton h-40 w-full" />
          <div className="skeleton h-12 w-40" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <div className="skeleton h-8 w-1/3" />
      <div className="skeleton h-96 w-full" />
    </div>
  );
}
