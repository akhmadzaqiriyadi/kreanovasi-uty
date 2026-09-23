"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ArticleShareActionsProps {
  title: string;
  slug: string;
}

export function ArticleShareActions({ title, slug }: ArticleShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/articles/${slug}`;
    }
    return `https://kreanovasi.uty.ac.id/articles/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(
      `${title} - Baca selengkapnya di UTY Creative Hub: ${url}`,
    );
    window.open(
      `https://api.whatsapp.com/send?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareTwitter = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`${title} | UTY Creative Hub`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareLinkedIn = () => {
    const url = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-card border border-border/70">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <Share2 className="h-4 w-4 text-primary" />
        <span>Bagikan Artikel:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="rounded-xl text-xs flex items-center gap-1.5 h-8.5 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30"
        >
          <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareLinkedIn}
          className="rounded-xl text-xs flex items-center gap-1.5 h-8.5 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30"
        >
          <span>LinkedIn</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareTwitter}
          className="rounded-xl text-xs flex items-center gap-1.5 h-8.5"
        >
          <span>X / Twitter</span>
        </Button>

        <Button
          type="button"
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={handleCopyLink}
          className="rounded-xl text-xs flex items-center gap-1.5 h-8.5 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
