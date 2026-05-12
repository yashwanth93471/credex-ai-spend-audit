export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-zinc-200 border-t-blue-600 ${sizeClasses[size]}`}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-zinc-600">Loading your audit...</p>
      </div>
    </div>
  );
}
