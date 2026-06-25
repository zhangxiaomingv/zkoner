"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const { t } = useI18n();
  const circleRef = useRef<SVGCircleElement>(null);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#16a34a";
    if (s >= 50) return "#ea580c";
    return "#dc2626";
  };

  const getLabel = (s: number) => {
    if (s >= 90) return t("gauge.excellent");
    if (s >= 80) return t("gauge.great");
    if (s >= 65) return t("gauge.good");
    if (s >= 50) return t("gauge.fair");
    if (s >= 30) return t("gauge.poor");
    return t("gauge.critical");
  };

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
      requestAnimationFrame(() => {
        if (circleRef.current) {
          circleRef.current.style.transition =
            "stroke-dashoffset 1s ease-out";
          circleRef.current.style.strokeDashoffset = `${offset}`;
        }
      });
    }
  }, [offset, circumference]);

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
        />
        {/* Center text */}
        <text
          x="60"
          y="54"
          textAnchor="middle"
          className="text-3xl font-bold"
          fill="currentColor"
          fontSize="28"
          fontWeight="700"
        >
          {score}
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
        >
          {t("gauge.out_of")}
        </text>
      </svg>
      <span
        className="mt-2 text-sm font-medium"
        style={{ color: getColor(score) }}
      >
        {getLabel(score)}
      </span>
    </div>
  );
}
