"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { ScanResult } from "@/types";
import { ScoreGauge } from "@/components/score-gauge";
import { CategoryCard } from "@/components/category-card";
import { FixGenerator } from "@/components/fix-generator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Hash,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useI18n();
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/report/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(t("report.error.not_found"));
          }
          throw new Error(t("report.error.failed"));
        }
        const data = await res.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("report.error.failed"));
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <svg className="h-8 w-8 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-sm text-muted-foreground">{t("report.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("report.error.title")}</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("report.error.back")}
        </Button>
      </div>
    );
  }

  if (!result) return null;

  const scoreLevel =
    result.score >= 80 ? "success" : result.score >= 50 ? "warning" : "danger";

  const passCount = result.rules.filter((r) => r.level === "pass").length;
  const warnCount = result.rules.filter((r) => r.level === "warn").length;
  const failCount = result.rules.filter((r) => r.level === "fail").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("report.back")}
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="truncate max-w-[500px]">{result.url}</span>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(result.timestamp).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" />
              {result.id.slice(0, 8)}...
            </span>
            <Badge
              variant={scoreLevel}
              className="text-xs"
            >
              {result.score}/100
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const el = document.getElementById("fixes-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("report.view_fixes")}
        </Button>
      </div>

      {/* Score Overview */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Gauge */}
        <Card>
          <CardContent className="pt-6">
            <ScoreGauge score={result.score} />
            <div className="mt-4 text-center">
              <p className="text-sm font-medium">{t("report.score_title")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {result.score >= 80
                  ? t("report.score.excellent")
                  : result.score >= 50
                    ? t("report.score.good")
                    : t("report.score.poor")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-success">{passCount}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("report.passed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-warning">{warnCount}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("report.warnings")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-danger">{failCount}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("report.failures")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page Info */}
      {result.pageData.fetchError && (
        <Alert variant="danger">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("report.page_fetch_issue")}</AlertTitle>
          <AlertDescription>
            {result.pageData.fetchError}
          </AlertDescription>
        </Alert>
      )}

      {/* Page Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("report.page_metadata")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">{t("report.title_label")}:</span>{" "}
              {result.pageData.title || <span className="text-danger">{t("report.missing")}</span>}
            </div>
            <div>
              <span className="text-muted-foreground">{t("report.description_label")}:</span>{" "}
              {result.pageData.description?.slice(0, 80) || <span className="text-danger">{t("report.missing")}</span>}
              {result.pageData.description && result.pageData.description.length > 80 ? "..." : ""}
            </div>
            <div>
              <span className="text-muted-foreground">{t("report.h1_label")}:</span>{" "}
              {result.pageData.h1.length || <span className="text-danger">0</span>}
            </div>
            <div>
              <span className="text-muted-foreground">{t("report.word_count")}:</span>{" "}
              {result.pageData.wordCount.toLocaleString()}
            </div>
            <div>
              <span className="text-muted-foreground">{t("report.robots_label")}:</span>{" "}
              {result.pageData.hasRobotsTxt ? (
                <span className="text-success">{t("report.robots_found")}</span>
              ) : (
                <span className="text-danger">{t("report.robots_missing")}</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">{t("report.llms_label")}:</span>{" "}
              {result.pageData.hasLlmstxt ? (
                <span className="text-success">{t("report.llms_found")}</span>
              ) : (
                <span className="text-danger">{t("report.llms_missing")}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Category Results */}
      <div>
        <h2 className="text-xl font-semibold mb-6">{t("report.category_title")}</h2>
        <div className="space-y-4">
          {result.categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>

      {/* All Rules */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {t("report.rules_title", { count: result.rules.length })}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              {result.rules.map((rule) => {
                const levelIcon = {
                  pass: t("report.pass_sign"),
                  warn: t("report.warn_sign"),
                  fail: t("report.fail_sign"),
                }[rule.level];
                const levelColor = {
                  pass: "text-success",
                  warn: "text-warning",
                  fail: "text-danger",
                }[rule.level];

                return (
                  <div
                    key={rule.id}
                    className="flex items-start gap-3 border-b border-border/50 py-3 last:border-0"
                  >
                    <span className={`mt-0.5 font-mono text-sm font-bold ${levelColor}`}>
                      {levelIcon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{rule.name}</span>
                        <Badge
                          variant={
                            rule.level === "pass"
                              ? "success"
                              : rule.level === "warn"
                                ? "warning"
                                : "danger"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {rule.level.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          w{rule.weight}
                        </span>
                      </div>
                      {rule.message && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rule.message}
                        </p>
                      )}
                      {(rule.level === "warn" || rule.level === "fail") && (
                        <details className="mt-1">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            {t("report.fix_recommendation")}
                          </summary>
                          <p className="text-xs text-muted-foreground mt-1 pl-2 border-l-2 border-border">
                            {rule.recommendation}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Auto-Fix Generator */}
      <div id="fixes-section">
        <FixGenerator fixes={result.fixes} url={result.url} />
      </div>
    </div>
  );
}
