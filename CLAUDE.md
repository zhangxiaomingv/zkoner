# zkoner — GEO Scanner

> https://zkoner.com — AI 可见性分析工具

## 项目模式

开源核心（AGPL）+ 闭源付费插件（Cal.com 模式）

| 层 | 目录 | 说明 |
|:---|:---|:---|
| **开源** | `crawler/`, `parser/`, `scanner/`, `rules/`, `fix-generator/`, `templates/`, `history/`, `ruledb/` | 核心引擎 + 社区规则 |
| **闭源** | `zkoner-pro/`（单独仓库） | AI 评分引擎、高级 ruledb |

## 架构

```
crawler/       网页抓取（fetch + robots/sitemap/llms）
parser/        HTML 解析（cheerio → PageData）
scanner/       扫描调度（编排全流程 + hook 接口）
rules/         基础检测规则（6 类 42 条）
fix-generator/ 修复方案生成
templates/     可复用模板（FAQ/Schema/llms.txt）
history/       扫描历史存储（内存，可替换为数据库）
ruledb/        社区规则注册表
```

## Hook 接口（scanner/index.ts）

闭源插件通过 `registerScanHooks()` 注入：
- `beforeScore` — 替换默认评分为 AI 增强评分
- `afterScan` — 扫描完成回调

## 部署

```bash
pm2 start npm --name geo-scanner -- start    # 启动
pm2 restart geo-scanner                       # 重启
pm2 logs geo-scanner                          # 日志
```

Cloudflare Tunnel → zkoner.com
