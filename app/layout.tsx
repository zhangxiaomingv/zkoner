import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/client-shell";

export const metadata: Metadata = {
  title: "GEO Scanner — AI Visibility Analyzer / AI 可见性分析器",
  description:
    "Analyze your website's AI visibility. Scan for GEO optimization, AI crawler access, and structured data completeness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
