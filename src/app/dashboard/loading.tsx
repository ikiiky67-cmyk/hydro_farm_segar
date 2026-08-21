export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title skeleton */}
      <div>
        <div className="h-7 w-40 rounded-lg animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.05))" }} />
        <div className="h-4 w-64 rounded mt-2 animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.03))" }} />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 space-y-3"
            style={{
              background: "var(--t-card-bg, rgba(255,255,255,0.02))",
              borderColor: "var(--t-card-border, rgba(255,255,255,0.06))",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.06))" }} />
              <div className="w-9 h-9 rounded-xl animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.06))" }} />
            </div>
            <div className="h-8 w-32 rounded-lg animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.08))" }} />
            <div className="h-3 w-20 rounded animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.04))" }} />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          className="xl:col-span-2 rounded-2xl border p-5"
          style={{
            background: "var(--t-card-bg, rgba(255,255,255,0.02))",
            borderColor: "var(--t-card-border, rgba(255,255,255,0.06))",
          }}
        >
          <div className="h-5 w-40 rounded mb-6 animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.06))" }} />
          <div className="h-56 rounded-xl animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.03))" }} />
        </div>
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "var(--t-card-bg, rgba(255,255,255,0.02))",
            borderColor: "var(--t-card-border, rgba(255,255,255,0.06))",
          }}
        >
          <div className="h-5 w-32 rounded mb-6 animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.06))" }} />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 flex-1 rounded animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.05))" }} />
                <div className="h-3 w-10 rounded animate-pulse" style={{ background: "var(--t-input-bg, rgba(255,255,255,0.04))" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
