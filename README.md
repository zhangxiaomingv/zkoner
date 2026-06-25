# ZKONER

> **Zone + Key + Oner** — become a key entity that AI recognizes in your field.
>
> 成为某个领域被 AI 识别的关键实体。
>
> https://zkoner.com

## Features

- **Scan** — crawl page + robots.txt + sitemap + llms.txt, 42 rules across 6 categories
- **Score** — weighted GEO score with animated gauge
- **Fix** — auto-generate FAQ, schema markup, llms.txt, and more
- **Bilingual** — English / Chinese UI, switch with one click

## Architecture

```
crawler/       Web page fetcher (HTML + robots + sitemap + llms)
parser/        HTML parser (cheerio → structured PageData)
scanner/       Scan orchestrator with hook system
rules/         Base detection rules (6 categories, 42 rules)
fix-generator/ Fix suggestion generator
templates/     Reusable templates (FAQ, Schema, llms.txt, etc.)
history/       Scan history storage (in-memory, swappable)
ruledb/        Community rule registry
app/           Next.js frontend
```

## Quick Start

```bash
git clone https://github.com/zhangxiaomingv/zkoner.git
cd zkoner
npm install
npm run build
npm start
```

Open http://localhost:3300

## Tech Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS, shadcn/ui
- Cheerio (HTML parsing)

## License

AGPL-3.0 — see [LICENSE](LICENSE)

Commercial license: zkoner.com

## 项目模式

Open-core (AGPL) + premium plugin. The `scanner/` module exposes `registerScanHooks()` for closed-source AI scoring engine.

---

*Make your brand visible in ChatGPT, Claude, DeepSeek, and beyond.*
