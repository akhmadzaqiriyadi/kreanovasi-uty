import { ArrowUpRight, Code2, Cpu, Gauge, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function DxWidget() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-7xl relative z-10 sm:px-6 lg:px-8">
      <div className="glass-panel border-border/30 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative overflow-hidden">
        {/* Soft Background glow inside panel */}
        <div className="absolute top-[-50px] left-[-50px] h-[200px] w-[200px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

        <div className="space-y-6">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary uppercase tracking-wider text-[10px] py-0.5 px-2.5 font-bold"
          >
            Developer Experience (DX)
          </Badge>
          <h3 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            High Fidelity Performance Metrics
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Optimized compiling setup designed to bundle, code-split, and serve
            resources asynchronously. Check the benchmark indicators below.
          </p>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                ✓
              </div>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Turbopack HMR active out-of-the-box
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                ✓
              </div>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Tailwind CSS v4 inline variables configuration
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                ✓
              </div>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                React Compiler automatic memoization active
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="#feedback"
              className={`${buttonVariants({ variant: "link" })} text-primary hover:text-indigo-400 p-0 gap-1.5 inline-flex items-center font-semibold transition-colors`}
            >
              Send us mock feedback <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats Bento Grid Panel */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 dark:hover:border-primary/20 shadow-sm dark:shadow-inner group">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gradient-primary">
              99%
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              LCP Speed Score
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 dark:hover:border-purple-500/20 shadow-sm dark:shadow-inner group">
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-gradient-secondary">
              12ms
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              Cold start speed
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 dark:hover:border-cyan-500/20 shadow-sm dark:shadow-inner group">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-foreground">
              100%
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              Compiler Caching
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 shadow-sm dark:shadow-inner group">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              0ms
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              Hydration Delay
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
