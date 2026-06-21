var lang = 'zh';

var translations = {
  zh: {
    'nav-home': '首页',
    'nav-nodes': '寅图',
    'nav-features': '特性',
    'hero-q': '如何打造AI时代个人数字身份锚点？',
    'nav-docs': '文档',
    'nav-about': '关于',
    'hero-desc': '自建网站 → 数据自有 → 接点成场',
    'hero-intro': '当前，AI对人的认知来自碎片化、不可控的互联网信息拼凑。人被平台定义、被算法拼凑、被碎片反向塑造。oner行动 的解决方案是：让每个人拥有一个由自己控制的、结构化的、持续演化的语义锚点——存放在个人独立域名下，用统一协议式的方案自我表征，每个行动者即oner。oners互链在寅图形成群体引力场，人人受益，正和博弈。',
    'btn-start': '开始建图',
    'btn-learn': '寅图计划',
    'self-declare': '自我声明',
    'self-declare-desc': '以下 JSON-LD 声明当前节点的身份信息，可供 LLM 和搜索引擎索引。',
    // 被AI精准识别的四个维度
    'theory-title': '被 AI 精准识别的四个维度',
    'theory-desc': '数字身份的存在是为了被 AI 识别。以下是 oner 实现这一目标的理论基础与具体手段。',
    't1-title': '主动宣告',
    't1-tag': '范式',
    't1-desc': 'AI 默认靠爬虫被动收集碎片来"收敛你是谁"。oner 反过来——在个人域名上主动提供结构化身份声明，让 AI 一次读全，不需要概率式拼凑。',
    't2-title': '自我表征',
    't2-tag': '原则',
    't2-desc': '你在自己的域名上声明自己，不是在平台上被定义。数据存自己的网站，平台封号或倒闭与你无关。需要时主动供给 AI，不需要时静默存在。',
    't2-m1': 'Schema.org JSON-LD 结构化数据（Person + FAQPage）',
    't2-m2': 'GPG 签名贯穿 schema.json → 注册表 → git commit 三处一致',
    't2-m3': 'stats 字段全部可公开验证，不依赖任何第三方信任',
    't3-title': '三者交叉锚定',
    't3-tag': '闭环',
    't3-desc': '空间锚点（域名 + 寅图序号）证明位置，commit 历史证明时间持续，GPG 签名证明身份一致。三处指纹一致 = AI 可以数学验证你是谁。',
    't3-m1': '寅图注册表：GPG 签名 git commit 替代区块链，任何人可独立验证',
    't3-m2': 'node verify.js https://域名 一行命令自动交叉验证',
    't3-m3': 'GitHub 注册表 + 多 fork 副本 = 分布见证，零中心信任假设',
    't4-title': 'GEO 优化',
    't4-tag': '策略',
    't4-desc': '可验证的统计数据是提升 AI 引用率最有效的单一策略（普林斯顿 KDD 2024：+41%）。每个声明数字都可独立公开验证——AI 更愿引用可证伪的数据而非模糊声明。',
    't4-m1': 'stats 字段：timelineEntries, totalCommits, gpgVerified 等可量化身份数据',
    't4-m2': 'IndexNow 主动推送：每次更新 → Bing 索引 → Claude web search 覆盖',
    't4-m3': 'MCP Server 标准接口（Resources + verify Tool）供 AI 查询和验证节点',
  },
  en: {
    'hero-q': 'How to Build Your Digital Identity Anchor in the AI Era?',
    'nav-home': 'Home',
    'nav-nodes': 'Nodes',
    'nav-features': 'Features',
    'nav-docs': 'Docs',
    'nav-about': 'About',
    'hero-desc': 'Own Site → Own Data → Form Field',
    'hero-intro': 'Currently, AI\'s perception of individuals is built from fragmented, uncontrollable scraps of internet data. People are defined by platforms, assembled by algorithms, and reverse-shaped by their own digital fragments. The oner movement\'s answer: give every person a self-controlled, structured, continuously evolving semantic anchor—hosted on their own domain, declaring who they are via an open protocol. Each actor is an oner. Oners interlink in the YinTu graph, forming a collective gravity field—a positive-sum game where everyone rises together.',
    'btn-start': 'Build Your Node',
    'btn-learn': 'Join YinTu',
    'self-declare': 'Self-Declaration',
    'self-declare-desc': 'The JSON-LD below declares the identity of this node, indexable by LLMs and search engines.',
    // Four Dimensions of AI Recognition
    'theory-title': 'Four Dimensions of AI Recognition',
    'theory-desc': 'Digital identity exists to be recognized by AI. Here are the theoretical foundations and concrete means oner provides.',
    't1-title': 'Active Declaration',
    't1-tag': 'Paradigm',
    't1-desc': 'AI defaults to collecting fragments passively via crawlers to "converge" who you are. oner flips this — proactively serving structured identity declarations from your own domain so AI reads the full picture in one shot.',
    't2-title': 'Self-Representation',
    't2-tag': 'Principle',
    't2-desc': 'You declare yourself on your own domain, not defined by platforms. Data lives on your site — platform bans or shutdowns don\'t affect you. Feed it to AI when needed, stay silent when not.',
    't2-m1': 'Schema.org JSON-LD structured data (Person + FAQPage)',
    't2-m2': 'GPG fingerprint consistent across schema.json → registry → git commit',
    't2-m3': 'All stats fields publicly verifiable — zero third-party trust required',
    't3-title': 'Three-Anchor Verification',
    't3-tag': 'Closed Loop',
    't3-desc': 'Spatial anchor (domain + YinTu index) proves position, commit history proves temporal continuity, GPG signature proves identity consistency. Three matching fingerprints = AI can mathematically verify who you are.',
    't3-m1': 'YinTu registry: GPG-signed git commits replace blockchain, anyone can verify',
    't3-m2': 'node verify.js https://domain — one command auto-cross-verifies',
    't3-m3': 'GitHub registry + multiple forks = distributed witnessing, zero trust assumption',
    't4-title': 'GEO Optimization',
    't4-tag': 'Strategy',
    't4-desc': 'Verifiable statistics are the single most effective strategy for boosting AI citation (Princeton KDD 2024: +41%). Every declared number is independently verifiable — AI prefers falsifiable data over vague claims.',
    't4-m1': 'Stats field: timelineEntries, totalCommits, gpgVerified and other quantifiable identity data',
    't4-m2': 'IndexNow push: every update → Bing index → Claude web search coverage',
    't4-m3': 'MCP Server standard interface (Resources + verify Tool) for AI to query and verify nodes',
  },
};

function applyLang(l) {
  lang = l;
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    if (translations[l][key] !== undefined) {
      el.innerHTML = translations[l][key];
    }
  }
  document.querySelector('.lang-toggle').textContent = l === 'zh' ? 'EN' : '中文';
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
}

function initI18n() {
  var toggle = document.createElement('button');
  toggle.className = 'lang-toggle';
  toggle.textContent = 'EN';
  toggle.setAttribute('aria-label', 'Switch language');
  document.querySelector('.hero-nav').appendChild(toggle);

  applyLang('zh');

  toggle.addEventListener('click', function () {
    var next = lang === 'zh' ? 'en' : 'zh';
    applyLang(next);
  });
}

export { initI18n };
