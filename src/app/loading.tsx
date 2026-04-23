export default function Loading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center px-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/30" />
        Loading
      </div>
    </div>
  );
}
