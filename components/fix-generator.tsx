"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import type { FixSuggestion } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Check, Lightbulb, Wand2, ChevronDown, ChevronUp, FileCode } from "lucide-react";

interface FixGeneratorProps {
  fixes: FixSuggestion[];
  url: string;
}

const categoryIcons: Record<string, string> = {
  "Query Optimization": "💬",
  "Entity Recognition": "🏷️",
  "GEO": "🌐",
  "Citations": "📚",
};

export function FixGenerator({ fixes, url }: FixGeneratorProps) {
  const { t } = useI18n();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedFix, setExpandedFix] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  if (fixes.length === 0) {
    return (
      <Alert variant="success">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>{t("fix.all_clear_title")}</AlertTitle>
        <AlertDescription>
          {t("fix.all_clear_desc")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t("fix.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("fix.subtitle", { count: fixes.length, url })}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          <Wand2 className="mr-1 h-3 w-3" />
          {t("fix.badge")}
        </Badge>
      </div>

      <div className="space-y-4">
        {fixes.map((fix) => {
          const isExpanded = expandedFix === fix.type;
          const icon = categoryIcons[fix.category] || "📋";

          return (
            <Card key={fix.type}>
              <CardHeader
                className="cursor-pointer select-none py-4"
                onClick={() =>
                  setExpandedFix(isExpanded ? null : fix.type)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <CardTitle className="text-sm">{fix.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {fix.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {fix.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(fix.content, fix.type);
                      }}
                      className="h-8 px-2"
                    >
                      {copiedId === fix.type ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0 pb-4">
                  <div className="relative">
                    <div className="absolute right-3 top-3 z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(fix.content, `${fix.type}-btn`)}
                        className="h-7 text-xs gap-1"
                      >
                        {copiedId === `${fix.type}-btn` ? (
                          <>
                            <Check className="h-3 w-3" /> {t("fix.copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> {t("fix.copy")}
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-xs leading-relaxed scrollbar-thin">
                      <code className="text-foreground/90 whitespace-pre-wrap">
                        {fix.content}
                      </code>
                    </pre>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <FileCode className="h-3.5 w-3.5" />
                    <span dangerouslySetInnerHTML={{ __html: t("fix.code_hint") }} />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>{t("fix.howto_title")}</AlertTitle>
        <AlertDescription>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
            <li>{t("fix.howto_step1")}</li>
            <li>{t("fix.howto_step2")}</li>
            <li dangerouslySetInnerHTML={{ __html: t("fix.howto_step3") }} />
            <li>{t("fix.howto_step4")}</li>
            <li>{t("fix.howto_step5")}</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
