import type React from "react";

export default function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
      {/* Background glow effects specific to dashboard */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
        <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[80px]" />
      </div>

      <main className="flex-1 flex flex-col relative z-10">{children}</main>
    </div>
  );
}
