export default function PublicLoading() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--pub-bg, #0a0a0a)" }}
    >
      {/* Navbar skeleton */}
      <div className="h-16 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">
          <div className="h-5 w-36 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="flex gap-6">
            <div className="h-4 w-16 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-4 w-16 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-4 w-20 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="mx-auto h-8 w-64 rounded-full animate-pulse" style={{ background: "rgba(16,185,129,0.08)" }} />
          <div className="space-y-3">
            <div className="mx-auto h-12 w-full max-w-lg rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="mx-auto h-12 w-3/4 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="mx-auto h-5 w-96 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          <div className="flex gap-3 justify-center pt-4">
            <div className="h-12 w-40 rounded-2xl animate-pulse" style={{ background: "rgba(16,185,129,0.15)" }} />
            <div className="h-12 w-48 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
