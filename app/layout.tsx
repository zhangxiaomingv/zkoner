import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/client-shell";

export const metadata: Metadata = {
  title: "ZKONER — GEO Scanner | AI 可见性分析器",
  description:
    "Zone + Key + Oner — become a key entity that AI recognizes in your field. Analyze your website's AI visibility with GEO Scanner.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ZKONER",
              url: "https://zkoner.com",
              logo: "https://zkoner.com/logo.png",
              description:
                "Zone + Key + Oner — become a key entity that AI recognizes in your field.",
            }),
          }}
        />
      </head>
      <body className="min-h-screen">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
