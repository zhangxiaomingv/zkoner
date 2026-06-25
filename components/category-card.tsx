"use client";

import type { CategoryResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CategoryCardProps {
  category: CategoryResult;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const levelVariant =
    category.level === "pass"
      ? "success"
      : category.level === "warn"
        ? "warning"
        : "danger";

  const progressVariant =
    category.percentage >= 80
      ? "success"
      : category.percentage >= 50
        ? "warning"
        : "danger";

  const failRules = category.ruleResults.filter((r) => r.level === "fail");
  const warnRules = category.ruleResults.filter((r) => r.level === "warn");
  const passRules = category.ruleResults.filter((r) => r.level === "pass");

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">{t(`category.${category.id}`)}</CardTitle>
            <Badge variant={levelVariant} className="text-[10px] px-1.5 py-0">
              {category.level.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm tabular-nums">
              <span className="text-success">{passRules.length}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-warning">{warnRules.length}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-danger">{failRules.length}</span>
              <span className="text-muted-foreground ml-1">
                {t("cat.pwf")}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[120px]">
              <Progress
                value={category.percentage}
                variant={progressVariant}
                className="h-2 w-20"
              />
              <span
                className="text-sm font-medium tabular-nums"
                style={{
                  color:
                    category.percentage >= 80
                      ? "hsl(var(--success))"
                      : category.percentage >= 50
                        ? "hsl(var(--warning))"
                        : "hsl(var(--danger))",
                }}
              >
                {category.percentage}%
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-2 border-t pt-4">
            {category.ruleResults.map((rule) => {
              const levelIcon = {
                pass: "✓",
                warn: "!",
                fail: "✗",
              }[rule.level];
              const levelColor = {
                pass: "text-success",
                warn: "text-warning",
                fail: "text-danger",
              }[rule.level];

              return (
                <div key={rule.id} className="flex items-start gap-3 py-2">
                  <span
                    className={`mt-0.5 font-mono text-sm font-bold ${levelColor}`}
                  >
                    {levelIcon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm">{rule.name}</span>
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
                    </div>
                    {rule.message && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rule.message}
                      </p>
                    )}
                    {(rule.level === "warn" || rule.level === "fail") && (
                      <details className="mt-1">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          {t("report.how_to_fix")}
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
      )}
    </Card>
  );
}
