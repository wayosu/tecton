export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="flex justify-center">
          <div className="bg-muted h-8 w-24 animate-pulse rounded-md" />
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-9 w-full animate-pulse rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-9 w-full animate-pulse rounded-md" />
          </div>
          <div className="bg-muted h-9 w-full animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
