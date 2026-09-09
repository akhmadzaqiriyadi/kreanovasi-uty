export const dynamic = "force-dynamic";

export default async function TestLoadingPage() {
  // Await a 1500ms delay to ensure loading.tsx displays
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
      <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
        <h1 id="loaded-heading" className="text-2xl font-bold text-foreground">
          Loaded Content Successfully
        </h1>
        <p className="text-muted-foreground text-sm">
          This content was loaded after a simulated slow connection.
        </p>
      </div>
    </div>
  );
}
