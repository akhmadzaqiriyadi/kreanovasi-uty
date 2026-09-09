import { Cpu, FolderGit2, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-4 py-20 max-w-7xl relative z-10 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5 text-primary mb-3 uppercase tracking-wider text-[10px] py-0.5 px-2.5 font-bold"
        >
          Performance Architecture
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight mb-4 sm:text-4xl">
          Engineered for Modern Web Scaling
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Built for modern performance, skipping legacy constraints to leverage
          cutting-edge compiling runtimes.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Cell 1: Blazing Fast Compiler (Large - col-span-2) */}
        <Card className="glass-card border-border/30 md:col-span-2 overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none" />
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              Bun + Turbopack Compiler Speed
            </CardTitle>
            <CardDescription className="text-xs">
              Install modules and execute script processes at unmatched
              velocities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Forget slow NPM cycles and bloated configurations. Experience
              lightning-fast hot-module reloading (HMR) powered by the Next.js
              Turbopack compiler.
            </p>
            {/* Visual comparison widget */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 space-y-3 font-mono text-xs max-w-lg">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Bun + Turbopack (UCH)
                  </span>
                  <span className="font-bold text-emerald-400">12ms</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[5%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-450 dark:text-zinc-400">
                  <span>Node.js + Webpack (Legacy)</span>
                  <span className="font-bold text-yellow-550 dark:text-yellow-500">
                    820ms
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cell 2: React Compiler (Small - col-span-1) */}
        <Card className="glass-card border-border/30 overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none" />
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              React Compiler
            </CardTitle>
            <CardDescription className="text-xs">
              Zero manual render optimization hooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Say goodbye to writing boilerplate hooks like{" "}
              <code className="text-purple-400">useMemo</code>,{" "}
              <code className="text-purple-400">useCallback</code>, or{" "}
              <code className="text-purple-400">memo</code>. The React Compiler
              caches allocations dynamically to protect performance.
            </p>
          </CardContent>
        </Card>

        {/* Cell 3: Tailwind CSS v4 & shadcn/ui (Small - col-span-1) */}
        <Card className="glass-card border-border/30 overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              Tailwind CSS v4
            </CardTitle>
            <CardDescription className="text-xs">
              CSS-first customized style variables.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Style layouts cleanly with modern{" "}
              <code className="text-cyan-400">oklch</code> syntax configurations
              inside <code className="text-cyan-400">globals.css</code>. Native
              variables mean zero configuration JS files.
            </p>
          </CardContent>
        </Card>

        {/* Cell 4: Modular Features Layout (Large - col-span-2) */}
        <Card className="glass-card border-border/30 md:col-span-2 overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              Modular Folder Architecture
            </CardTitle>
            <CardDescription className="text-xs">
              Structured modules for high-fidelity code scaling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Encapsulate business layers inside domain features:{" "}
              <code className="text-emerald-400">
                src/features/[feature_name]/
              </code>
              . Each module groups its own schemas, components, and types,
              isolating code boundaries.
            </p>
            {/* Folder structure visualization */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-900 font-mono text-[11px] text-zinc-200 max-w-lg space-y-1">
              <div className="text-zinc-100">📁 src / features / auth /</div>
              <div className="pl-4">
                ├── 📁 components /{" "}
                <span className="text-zinc-400"># Auth UIs</span>
              </div>
              <div className="pl-4">
                ├── 📁 hooks /{" "}
                <span className="text-zinc-400"># Custom hooks</span>
              </div>
              <div className="pl-4">
                ├── 📁 schemas /{" "}
                <span className="text-zinc-400"># Zod validation schema</span>
              </div>
              <div className="pl-4">
                └── 📄 index.ts{" "}
                <span className="text-emerald-400 font-semibold">
                  # Explicit boundary exporter
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
