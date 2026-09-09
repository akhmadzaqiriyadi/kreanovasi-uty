import { ArrowRight, Code2, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-24 pb-20 text-center max-w-7xl relative z-10 sm:px-6 lg:px-8">
      {/* Animated Creator Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10 text-xs font-semibold text-primary mb-8 animate-fade-in backdrop-blur-sm shadow-sm">
        <Badge
          variant="outline"
          className="border-primary/30 text-[9px] py-0.5 px-2 bg-background/50 font-bold uppercase tracking-wider"
        >
          v0.1.0
        </Badge>
        <span className="font-medium tracking-tight">
          UCH Web App • Built with Next.js 16 & Bun
        </span>
      </div>

      {/* Hero Headlines */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.08] text-center">
        The Speed of{" "}
        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Bun
        </span>{" "}
        meets the power of{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Next.js 16
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
        Launch your next project with a state-of-the-art open-source template
        meticulously optimized for speed, pre-configured with Tailwind v4, the
        React Compiler, and premium developer aesthetics.
      </p>

      {/* Hero Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
        <Link
          href="#feedback"
          className={`${buttonVariants({ size: "lg" })} h-12 px-8 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 glow-hover flex items-center justify-center gap-2`}
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="#features"
          className={`${buttonVariants({ size: "lg", variant: "outline" })} h-12 px-8 border-border/50 bg-background/40 hover:bg-accent backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2`}
        >
          Explore Features
        </Link>
      </div>

      {/* High Fidelity Split Code/Terminal Dashboard Mockup */}
      <div className="relative mx-auto max-w-5xl rounded-2xl border border-border/30 p-2 sm:p-3 bg-zinc-950/40 backdrop-blur-xl shadow-2xl shadow-primary/5">
        {/* Soft Background glow behind the container */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/10 via-purple-500/10 to-transparent blur-md opacity-75 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-3 px-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/30" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/30" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/30" />
          </div>
          <div className="text-[10px] text-zinc-300 font-mono bg-zinc-900/80 py-1 px-4 rounded-full border border-zinc-700/40 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            uchwebapp --turbopack
          </div>
          <div className="w-12" />
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {/* Panel 1: Mock Editor */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-inner min-h-[220px]">
            <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-900 pb-2 mb-3">
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>src/app/page.tsx</span>
            </div>
            <p className="text-zinc-600">
              import &#123; Zap &#125; from "lucide-react";
            </p>
            <p className="text-zinc-600">
              import &#123; Badge &#125; from "@/components/ui/badge";
            </p>
            <p className="text-zinc-400 mt-2">
              export default function{" "}
              <span className="text-yellow-400">Home</span>() &#123;
            </p>
            <p className="text-zinc-400">&nbsp;&nbsp;return (</p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;
              <span className="text-purple-400">div</span> className="
              <span className="text-emerald-400">bg-grid-mesh</span>"&gt;
            </p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
              <span className="text-yellow-400">HeroSection</span>
            </p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author="
              <span className="text-emerald-400">jekz</span>"
            </p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;license="
              <span className="text-emerald-400">MIT</span>"
            </p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;
            </p>
            <p className="text-zinc-400">
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
              <span className="text-purple-400">div</span>&gt;
            </p>
            <p className="text-zinc-400">&nbsp;&nbsp;);</p>
            <p className="text-zinc-400">&#125;</p>
          </div>

          {/* Panel 2: Live Compiler Output */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-inner min-h-[220px]">
            <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-900 pb-2 mb-3">
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>terminal</span>
            </div>
            <p className="text-zinc-500"># Compiling project scripts...</p>
            <p className="text-purple-400">bun run dev</p>
            <p className="text-emerald-400">✓ Ready in 12ms (Turbopack)</p>
            <p className="text-zinc-300">▲ Next.js 16.2.10 | Bun 1.3.8</p>
            <p className="text-zinc-500"># React Compiler optimizations:</p>
            <p className="text-emerald-400">✓ Compiled in 24ms (206 modules)</p>
            <p className="text-zinc-400">
              │ ✓ page.tsx: memoized (4 components)
            </p>
            <p className="text-zinc-400">│ ✓ navbar.tsx: memoized (2 hooks)</p>
            <p className="text-emerald-400">└ Optimization Coverage: 100%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
