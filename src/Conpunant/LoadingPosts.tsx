export default function LoadingPosts({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface card overflow-hidden p-5">
          <div className="flex items-center gap-3">
            <div className="skeleton h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-3.5 w-28 rounded-full" />
              <div className="skeleton h-3 w-20 rounded-full" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-4/5 rounded-full" />
          </div>
          <div className="skeleton mt-4 h-44 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
