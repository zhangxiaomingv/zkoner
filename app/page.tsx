"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSearch, Globe, FileSearch, Gauge, ListChecks, Wrench } from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!url.trim()) {
        setError(t("form.error.required"));
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Scan failed");
        }

        router.push(`/report/${data.id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Scan failed — please try again",
        );
        setLoading(false);
      }
    },
    [url, router, t],
  );

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t("hero.subtitle") }}
        />
      </section>

      {/* Scan Form */}
      <section className="mx-auto max-w-2xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">{t("form.title")}</CardTitle>
            <CardDescription>
              {t("form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("form.placeholder")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("form.button.scanning")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ScanSearch className="h-4 w-4" />
                    {t("form.button.start")}
                  </span>
                )}
              </Button>
            </form>
            {error && (
              <p className="mt-3 text-sm text-danger">{error}</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* TLDR / Key Takeaways — for AI visibility */}
      <section className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-6 py-5">
          <h2 className="text-sm font-semibold text-primary mb-3">
            ⚡ TL;DR — {t("hero.title")}
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>{t("cat.geo")}</strong> — {t("cat.geo.desc")}</li>
            <li><strong>{t("cat.technical")}</strong> — {t("cat.technical.desc")}</li>
            <li><strong>{t("cat.ai-bot")}</strong> — {t("cat.ai-bot.desc")}</li>
            <li><strong>{t("cat.entity")}</strong> — {t("cat.entity.desc")}</li>
            <li><strong>{t("cat.query")}</strong> — {t("cat.query.desc")}</li>
            <li><strong>{t("cat.citations")}</strong> — {t("cat.citations.desc")}</li>
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t("questions.categories")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Gauge, nameKey: "cat.technical", descKey: "cat.technical.desc" },
            { icon: ListChecks, nameKey: "cat.ai-bot", descKey: "cat.ai-bot.desc" },
            { icon: Globe, nameKey: "cat.entity", descKey: "cat.entity.desc" },
            { icon: FileSearch, nameKey: "cat.query", descKey: "cat.query.desc" },
            { icon: Wrench, nameKey: "cat.citations", descKey: "cat.citations.desc" },
            { icon: ScanSearch, nameKey: "cat.geo", descKey: "cat.geo.desc" },
          ].map((item) => (
            <Card key={item.nameKey}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">{t(item.nameKey)}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {t(item.descKey)}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ — for GEO optimization */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold text-center">
          {t("hero.title")} — FAQ
        </h2>
        <div className="space-y-4">
          {[
            { q: "What is ZKONER?", a: "ZKONER (Zone + Key + Oner) is an AI visibility analyzer that helps you become a key entity that AI recognizes in your field. Our GEO Scanner analyzes your website across 40+ rules and provides actionable fixes." },
            { q: "How does the GEO Scanner work?", a: "Enter your URL, and we crawl your page, robots.txt, sitemap, and llms.txt. We then analyze 42 rules across 6 categories (Technical, AI Bot Access, Entity Recognition, Query Optimization, Citations, GEO) and generate a score with specific fix suggestions." },
            { q: "What is GEO (Generative Engine Optimization)?", a: "GEO is the practice of optimizing your online presence so that AI models like ChatGPT, Claude, and DeepSeek accurately recognize and recommend your brand. Unlike SEO which optimizes for search engines, GEO optimizes for AI." },
            { q: "Is ZKONER free?", a: "Yes, the basic scan is completely free. Enter any URL and get an instant AI visibility score with improvement suggestions." },
            { q: "How can I improve my GEO score?", a: "Use our auto-generated fixes which include FAQ sections, JSON-LD schema markup, llms.txt files, question-format headings, reference sections, and more. Each fix comes with copy-ready templates." },
          ].map((item, i) => (
            <details key={i} className="group rounded-lg border border-border p-4">
              <summary className="cursor-pointer text-sm font-medium list-none flex items-center justify-between">
                {item.q}
                <span className="text-muted-foreground group-open:hidden">+</span>
                <span className="text-muted-foreground hidden group-open:inline">−</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Author / Founder */}
      <section className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-semibold">About ZKONER</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Built by <strong>张明夷 (Zhang Mingyi)</strong> — GEO researcher and AI visibility advocate.
          ZKONER is an open-source project (AGPL) available on GitHub.
        </p>
        <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
          <a href="https://github.com/zhangxiaomingv/zkoner" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline underline-offset-2">GitHub</a>
          <span>·</span>
          <span>zkoner.com</span>
        </div>
      </section>
    </div>
  );
}
