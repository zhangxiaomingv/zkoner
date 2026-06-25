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

      {/* How it works */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t("how.title")}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Globe className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{t("how.step1.title")}</CardTitle>
              <CardDescription>
                {t("how.step1.desc")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <FileSearch className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{t("how.step2.title")}</CardTitle>
              <CardDescription>
                {t("how.step2.desc")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Wrench className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{t("how.step3.title")}</CardTitle>
              <CardDescription>
                {t("how.step3.desc")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t("categories.title")}</h2>
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
    </div>
  );
}
