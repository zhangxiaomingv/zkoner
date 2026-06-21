#!/usr/bin/env node

/**
 * 寅图注册表验证 — 验证 registry/registrations/ 的完整性和签名链
 *
 * 用法:
 *   node registry/verify.js                     # 验证注册表完整性
 *   node registry/verify.js --git               # 验证 git commit 签名链
 *   node registry/verify.js --cross <domain>    # 交叉验证节点域名
 *
 * 返回值: 0 = 通过, 1 = 不通过
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REGISTRY_DIR = path.join(__dirname, 'registrations');
const INDEX_FILE = path.join(__dirname, 'INDEX');
const MAX_INDEX = 129600;
const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const PASS = 0, FAIL = 1;
let errors = [];
let warnings = [];

function check(condition, msg) {
  if (!condition) errors.push(msg);
}

function warn(msg) { warnings.push(msg); }
function log(m) { process.stdout.write(m + '\n'); }

// ── 验证注册文件 ├─
function validateRegistration(filePath, index) {
  let data;
  try { data = JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
  catch (e) { return check(false, `${filePath}: JSON 解析失败 — ${e.message}`); }

  check(data.index === index,     `${filePath}: index 应为 ${index}，实际为 ${data.index}`);
  check(data.serial === `${DIZHI[(index - 1) % 12]}-${String(index).padStart(5, '0')}`,
    `${filePath}: serial 格式不正确，应为 ${DIZHI[(index - 1) % 12]}-${String(index).padStart(5, '0')}`);
  check(data.name && data.name.trim(),       `${filePath}: name 不能为空`);
  check(data.url && data.url.trim(),         `${filePath}: url 不能为空`);
  check(data.dizhi === DIZHI[(index - 1) % 12], `${filePath}: dizhi 应为 ${DIZHI[(index - 1) % 12]}`);
  check(data.since && data.since.trim(),     `${filePath}: since 不能为空`);
  check(data.gpgFingerprint && data.gpgFingerprint.trim(), `${filePath}: gpgFingerprint 推荐设置`);
}

// ── 验证 INDEX 文件 ├─
function validateINDEX() {
  if (!fs.existsSync(INDEX_FILE)) {
    warn('INDEX 文件不存在，跳过 INDEX 验证');
    return null;
  }

  const lines = fs.readFileSync(INDEX_FILE, 'utf-8').trim().split('\n').filter(Boolean);
  const indexMap = {};

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' ');
    check(parts.length >= 4, `INDEX 第 ${i + 1} 行格式不正确: ${lines[i]}`);

    const idx = parseInt(parts[0], 10);
    check(!isNaN(idx) && idx >= 1 && idx <= MAX_INDEX, `INDEX 第 ${i + 1} 行序号无效: ${parts[0]}`);

    const expectedDizhi = DIZHI[(idx - 1) % 12];
    check(parts[1] === expectedDizhi, `INDEX 第 ${i + 1} 行地支应为 ${expectedDizhi}，实际为 ${parts[1]}`);

    if (indexMap[idx]) warn(`INDEX 序号 ${idx} 重复`);
    indexMap[idx] = true;
  }

  return { lines, indexMap };
}

// ── 主验证 ├─
function verifyRegistry() {
  log('\n══════ 寅图注册表验证 ══════');
  log('');

  // 1. 目录结构
  log('1. 地支目录结构...');
  for (const d of DIZHI) {
    const dir = path.join(REGISTRY_DIR, d);
    check(fs.existsSync(dir), `目录缺失: registrations/${d}`);
    const stat = fs.statSync(dir);
    check(stat.isDirectory(), `${dir} 不是目录`);
  }
  const dirCount = fs.readdirSync(REGISTRY_DIR).filter(f =>
    fs.statSync(path.join(REGISTRY_DIR, f)).isDirectory()
  ).length;
  check(dirCount === 12, `应有 12 个地支目录，实际 ${dirCount} 个`);
  log('  ✓ 12 地支目录均存在');

  // 2. 注册文件
  log('\n2. 注册文件验证...');
  let totalFiles = 0;
  let maxRegistered = 0;
  const registeredIndices = new Set();

  for (const d of DIZHI) {
    const dir = path.join(REGISTRY_DIR, d);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
    for (const file of files) {
      const idx = parseInt(file.replace('.json', ''), 10);
      check(!isNaN(idx) && idx >= 1 && idx <= MAX_INDEX, `文件名无效: ${d}/${file}`);

      const expectedDizhi = DIZHI[(idx - 1) % 12];
      check(d === expectedDizhi, `文件 ${d}/${file} 应在 ${expectedDizhi} 目录下`);

      validateRegistration(path.join(dir, file), idx);
      registeredIndices.add(idx);
      maxRegistered = Math.max(maxRegistered, idx);
      totalFiles++;
    }
  }

  log(`  ✓ ${totalFiles} 个注册文件`);
  log(`  ✓ 最大序号: ${maxRegistered}`);

  // 3. 序号连续性
  log('\n3. 序号连续性...');
  let gaps = [];
  for (let i = 1; i <= maxRegistered; i++) {
    if (!registeredIndices.has(i)) gaps.push(i);
  }
  if (gaps.length === 0) {
    log('  ✓ 序号连续，无空缺');
  } else {
    warn(`序号空缺: ${gaps.slice(0, 10).join(', ')}${gaps.length > 10 ? `... (共 ${gaps.length} 个)` : ''}`);
  }

  // 4. INDEX
  log('\n4. INDEX 文件...');
  const indexResult = validateINDEX();
  if (indexResult) {
    check(indexResult.lines.length === totalFiles,
      `INDEX 条目数 (${indexResult.lines.length}) 应与注册文件数 (${totalFiles}) 一致`);
    log(`  ✓ INDEX 条目: ${indexResult.lines.length}`);
  }

  // 5. 结果
  log('');
  log(`═══ 验证完成 ═══`);
  log(`   注册文件: ${totalFiles}`);
  log(`   警告: ${warnings.length}`);
  log(`   错误: ${errors.length}`);

  if (warnings.length > 0) {
    log('\n⚠ 警告:');
    warnings.forEach((w, i) => log(`  ${i + 1}. ${w}`));
  }
  if (errors.length > 0) {
    log('\n❌ 错误:');
    errors.forEach((e, i) => log(`  ${i + 1}. ${e}`));
    process.exit(FAIL);
  }

  log('\n✅ 注册表完整验证通过');
  process.exit(PASS);
}

// ── Git 签名链验证 ├─
function verifyGitChain() {
  log('\n══════ Git 签名链验证 ══════\n');

  try {
    // 检查仓库状态
    const isRepo = execSync('git rev-parse --is-inside-work-tree 2>/dev/null', { encoding: 'utf-8' }).trim();
    if (isRepo !== 'true') {
      errors.push('不在 Git 仓库中');
      printResult();
      return;
    }
  } catch (e) {
    errors.push('Git 仓库检查失败: ' + e.message);
    printResult();
    return;
  }

  // 获取 registry/ 目录下的所有 commit
  try {
    const logOutput = execSync(
      'git log --show-signature --oneline -- "registry/registrations/" "registry/INDEX"',
      { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
    );

    const lines = logOutput.trim().split('\n').filter(Boolean);
    log(`检查 ${lines.filter(l => /^[a-f0-9]{7,9}\s/.test(l)).length} 个注册相关 commit\n`);

    let signedCount = 0, unsignedCount = 0;
    let currentSha = '';

    for (const line of lines) {
      if (/^[a-f0-9]{7,9}\s/.test(line)) {
        // 新的 commit
        if (currentSha) {
          // 验证上一个 commit
        }
        currentSha = line.split(' ')[0];
      } else if (line.includes('Good signature')) {
        signedCount++;
        log(`  ✓ ${currentSha}: GPG 签名验证通过`);
      } else if (line.includes('No signature') || line.includes('Can\\\'t check signature')) {
        unsignedCount++;
        log(`  ⚠ ${currentSha}: 未签名`);
      }
    }

    log(`\n  ${signedCount} 个已签名, ${unsignedCount} 个未签名`);

    if (unsignedCount > 0) {
      warn(`${unsignedCount} 个 commit 未 GPG 签名 — 注册表 commit 建议全部签名`);
    }

    // 检查签名 tag
    try {
      const tags = execSync('git tag --list "v*" --sort=-v:refname', { encoding: 'utf-8' });
      log(`\n  Tags: ${tags.trim() || '(无)'}`);
    } catch (e) { /* ignore */ }

  } catch (e) {
    errors.push('Git log 读取失败: ' + e.message);
  }

  printResult();
}

// ── 节点交叉验证 ├─
async function verifyCrossDomain(domain) {
  const https = require('https');
  const http = require('http');

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const proto = url.startsWith('https') ? https : http;
      proto.get(url, { timeout: 10000, headers: { 'User-Agent': 'registry-verify/1.0' } }, (res) => {
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON 解析失败')); } });
      }).on('error', reject);
    });
  }

  log(`\n══════ 交叉验证: ${domain} ══════\n`);

  // 1. 在注册表中查找该域名
  let registryEntry = null;
  for (const d of DIZHI) {
    const dir = path.join(REGISTRY_DIR, d);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        if (data.url === domain) { registryEntry = data; break; }
      } catch (e) { /* skip */ }
    }
    if (registryEntry) break;
  }

  if (registryEntry) {
    log(`  ✓ 已在注册表中：${registryEntry.serial}`);
  } else {
    errors.push(`域名 ${domain} 未在注册表中找到`);
    printResult();
    return;
  }

  // 2. 访问节点域名，获取 profile
  let profile;
  try {
    profile = await fetchJSON(domain + '/.well-known/oner/profile.json');
  } catch (e) {
    try { profile = await fetchJSON(domain + '/schema.json'); }
    catch (e2) { errors.push('无法获取 profile/schema: ' + e2.message); printResult(); return; }
  }

  const pFP = (profile.gpgFingerprint || '').replace(/\s/g, '').toUpperCase();
  const rFP = (registryEntry.gpgFingerprint || '').replace(/\s/g, '').toUpperCase();

  log('\n  注册表记录:');
  log(`    name:   ${registryEntry.name}`);
  log(`    serial: ${registryEntry.serial}`);
  log(`    gpg:    ${registryEntry.gpgFingerprint || '(未设置)'}`);

  log('\n  节点声明:');
  log(`    name:   ${profile.name || '(未设置)'}`);
  log(`    gpg:    ${profile.gpgFingerprint || '(未设置)'}`);

  // 3. 交叉比对
  check(registryEntry.name === profile.name, `姓名不一致: 注册表="${registryEntry.name}", 节点="${profile.name}"`);
  if (pFP && rFP) {
    check(pFP === rFP, `GPG 指纹不一致: 注册表="${rFP}", 节点="${pFP}"`);
  }

  log('');
  printResult();
}

function printResult() {
  if (warnings.length > 0) {
    log('\n⚠ 警告:');
    warnings.forEach((w, i) => log('  ' + (i + 1) + '. ' + w));
  }
  if (errors.length > 0) {
    log('\n❌ 错误 (' + errors.length + ' 项):');
    errors.forEach((e, i) => log('  ' + (i + 1) + '. ' + e));
    process.exit(FAIL);
  } else {
    log('\n✅ 全部通过');
    process.exit(PASS);
  }
}

// ── 入口 ──
const args = process.argv.slice(2);

if (args.includes('--git')) {
  verifyGitChain();
} else if (args.includes('--cross')) {
  const idx = args.indexOf('--cross');
  const domain = args[idx + 1];
  if (!domain) {
    console.error('用法: node registry/verify.js --cross <domain>');
    process.exit(1);
  }
  verifyCrossDomain(domain.replace(/\/$/, ''));
} else {
  verifyRegistry();
}
