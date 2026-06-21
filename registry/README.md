# 寅图注册表 — GitHub Registry

> 大道至简：用 Git 替代区块链，用 GPG 签名替代共识机制，用 Fork 替代分布节点。

## 为什么

传统区块链方案需要多节点共识、智能合约、代币经济——复杂且昂贵。
这个注册表只用 Git 的三个特性：

| 区块链特性 | GitHub Registry 替代方案 |
|-----------|------------------------|
| 不可篡改的历史 | Git commit 形成哈希链，任何修改都有记录 |
| 身份验证 | GPG 签名 commit，数学验证你是谁 |
| 多节点共识 | 任何人都可以 fork 仓库，作为独立见证 |
| 时间戳 | commit 时间戳 + OpenTimestamps（可选）|

## 目录结构

```
registry/
├── registrations/            # 注册文件（按地支分目录）
│   ├── 子/                   # 地支 子
│   │   ├── 00001.json        # 节点 #1
│   │   └── ...
│   ├── 丑/                   # 地支 丑
│   ├── 寅/                   # 地支 寅
│   ├── ...                   # 12 地支
│   └── 亥/
├── batches/                  # 批次快照（对应 signed tag）
│   └── v1.0.json
├── INDEX                     # 完整排序索引（供程序快速读取）
├── verify.js                 # 注册表专用验证脚本
└── checksums.sha256          # 校验清单
```

## 注册文件格式

每个节点一个 JSON 文件，命名格式：`{5位序号}.json`

```json
{
  "serial": "子-00001",
  "index": 1,
  "name": "张明夷",
  "url": "https://zkoner.com",
  "dizhi": "子",
  "gpgFingerprint": "D2CF37B8CA48772814B3F9023B6E2C5DC1D86108",
  "since": "2026-05-26",
  "statement": "一句话定位"
}
```

## 归位流程

```
1. 准备好了 →
   你的域名部署了 schema.json + timeline.json

2. 提交注册 →
   Fork 本仓库
   或提 Issue 告知你的域名
   或联系维护者代为提交
   维护者验证域名文件后，生成注册文件并 commit

3. 合并（GPG 签名必须）→
   每个注册 commit 必须 GPG 签名
   签名 tag 定期打批次快照

4. 归位确认 →
   你将序号填入自己的 schema.json
   任何人都可以克隆验证
```

## 验证方式

```bash
# 1. 克隆注册表
git clone https://github.com/zhangxiaomingv/zkoner.git
cd zkoner/registry

# 2. 检查所有 commit 是否 GPG 签名
git log --show-signature

# 3. 验证注册文件完整性
node verify.js

# 4. （可选）检查签名 tag
git tag --verify v1.0
```

## 与 tu.json 的关系

`tu.json` 不再包含完整节点列表，而是指向这个注册表：

```json
{
  "chainId": "zkoner-2026",
  "chainRoot": "https://zkoner.com",
  "registry": "https://github.com/zhangxiaomingv/zkoner/tree/main/registry",
  "maxIndex": 384
}
```

## 设计原则

1. **一个 commit = 一个节点注册** — 每个提交只有一个注册文件，历史清晰
2. **GPG 签名是共识** — 不依赖多数节点投票，依赖密码学签名
3. **Fork 即见证** — 每个人都可以 fork 仓库，你的 fork 就是你的见证
4. **批次即 checkpoint** — 定期打签名 tag，作为时间段快照
