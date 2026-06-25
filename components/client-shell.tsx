"use client";

import { type ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <NavShell>{children}</NavShell>
    </I18nProvider>
  );
}

function NavShell({ children }: { children: ReactNode }) {
  const { t, locale, toggleLocale } = useI18n();

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" y1="8" x2="12" y2="8" />
              <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
              <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
            </svg>
            {t("nav.scanner")}
          </a>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.home")}
            </a>
            <button
              onClick={toggleLocale}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {locale === "zh" ? "English" : "中文"}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>{t("footer.text")}</p>
      </footer>
    </>
  );
}
