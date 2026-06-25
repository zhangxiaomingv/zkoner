# GEO Scanner

> AI 可见性分析工具 — 分析你的网站在 AI 爬虫中的优化程度。
>
> https://zkoner.com

## 功能

- **扫描**：抓取网页 + robots.txt + sitemap + llms.txt，40+ 规则检测
- **评分**：6 大类别加权评分，AI 可见性一目了然
- **修复**：自动生成 FAQ、Schema、llms.txt 等可复用模板
- **双语**：中英文界面一键切换

## 架构

```
crawler/       网页抓取引擎
parser/        HTML 解析引擎
scanner/       扫描调度 + hook 接口
rules/         基础检测规则（42 条）
fix-generator/ 修复方案生成
templates/     可复用模板库
history/       扫描历史存储
ruledb/        社区规则注册表
app/           Next.js 前端
```

## 快速开始

```bash
git clone https://github.com/zhangxiaomingv/zkoner.git
cd zkoner
npm install
npm run build
npm start
```

访问 http://localhost:3300

## 技术栈

- Next.js 15, React 19, TypeScript
- Tailwind CSS, shadcn/ui
- Cheerio (HTML 解析)

## 开源协议

AGPL-3.0 — 详见 [LICENSE](LICENSE)

商用许可请联系 zkoner.com

---

*让品牌在 ChatGPT、Claude、DeepSeek 等大模型中被看见。*
