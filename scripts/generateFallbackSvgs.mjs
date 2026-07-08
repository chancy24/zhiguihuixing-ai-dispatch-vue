import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const svgDir = path.join(root, 'public', 'assets', 'generated', 'svg')
fs.mkdirSync(svgDir, { recursive: true })

const palette = {
  bg: '#f7fbff',
  navy: '#12324a',
  blue: '#2f80ed',
  cyan: '#2bc8f0',
  green: '#2eb67d',
  amber: '#f2b84b',
  red: '#e05555',
  line: '#c8d7e6',
  text: '#24445e'
}

writeSvg('line10-system-map.svg', line10Map())
writeSvg('timetable-flow.svg', timetableFlow())
writeSvg('scheduling-rule-engine.svg', ruleEngine())
writeSvg('agent-workflow.svg', agentWorkflow())
writeSvg('project-evidence-wall.svg', evidenceWall())

console.log(`已生成 SVG 素材到 ${path.relative(root, svgDir)}`)

function writeSvg(fileName, content) {
  fs.writeFileSync(path.join(svgDir, fileName), content, 'utf8')
}

function shell(title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f7fbff"/>
      <stop offset="1" stop-color="#e7f2fb"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#12324a" flood-opacity="0.12"/>
    </filter>
    <style>
      .title{font:700 42px 'Microsoft YaHei',Arial,sans-serif;fill:${palette.navy}}
      .label{font:600 24px 'Microsoft YaHei',Arial,sans-serif;fill:${palette.text}}
      .small{font:500 18px 'Microsoft YaHei',Arial,sans-serif;fill:#5f7488}
      .card{fill:#fff;stroke:${palette.line};stroke-width:2;rx:24;filter:url(#shadow)}
      .thin{stroke:${palette.line};stroke-width:2}
    </style>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  ${body}
</svg>`
}

function line10Map() {
  const stations = [
    ['巴沟', 420, 160, 'duty'], ['知春路', 660, 145, 'transfer'], ['三元桥', 1030, 190, 'transfer'],
    ['国贸', 1210, 405, 'transfer'], ['宋家庄', 1010, 700, 'duty'], ['角门西', 750, 730, 'transfer'],
    ['首经贸', 500, 680, 'transfer'], ['六里桥', 335, 520, 'transfer'], ['公主坟', 310, 330, 'transfer'],
    ['车道沟', 360, 230, 'normal'], ['火器营', 270, 175, 'duty']
  ]
  const nodes = stations.map(([name, x, y, type]) => {
    const color = type === 'transfer' ? palette.blue : type === 'duty' ? palette.green : palette.cyan
    const badge = type === 'transfer' ? '换乘' : type === 'duty' ? '出退勤' : '普通'
    return `<g>
      <circle cx="${x}" cy="${y}" r="16" fill="#fff" stroke="${color}" stroke-width="7"/>
      <text x="${x + 22}" y="${y - 4}" class="label">${name}</text>
      <text x="${x + 22}" y="${y + 23}" class="small">${badge}</text>
    </g>`
  }).join('')
  return shell('北京地铁10号线简化环线图', `
    <text x="90" y="95" class="title">北京地铁10号线简化环线图</text>
    <text x="92" y="136" class="small">蓝白风格示意图，不含真实机构 Logo，可用于系统页面高亮站点和区间。</text>
    <path d="M270 175 C440 95 875 105 1055 205 C1290 335 1285 560 1040 705 C850 820 520 775 355 585 C210 420 205 250 270 175Z" fill="none" stroke="${palette.blue}" stroke-width="22" stroke-linecap="round"/>
    <path d="M270 175 C440 95 875 105 1055 205 C1290 335 1285 560 1040 705 C850 820 520 775 355 585 C210 420 205 250 270 175Z" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".86"/>
    ${nodes}
    <g transform="translate(1140 92)">
      <rect class="card" width="330" height="168"/>
      <circle cx="38" cy="45" r="12" fill="#fff" stroke="${palette.cyan}" stroke-width="6"/><text x="62" y="53" class="small">普通站</text>
      <circle cx="38" cy="88" r="12" fill="#fff" stroke="${palette.blue}" stroke-width="6"/><text x="62" y="96" class="small">换乘站</text>
      <circle cx="38" cy="131" r="12" fill="#fff" stroke="${palette.green}" stroke-width="6"/><text x="62" y="139" class="small">出退勤点</text>
    </g>`)
}

function timetableFlow() {
  const steps = ['原始时刻表', '站名转换', '重要站摘抄', '内外环分类', '乘务片段划分', '规则校验']
  return flowSvg('时刻表处理流程', steps, '从运行时刻表到可校验乘务片段的前处理链路。')
}

function agentWorkflow() {
  const steps = ['调度员输入问题', 'Agent识别异常', '查询规则', '生成建议', '调度员确认']
  return flowSvg('排班 Agent 工作流', steps, '自然语言输入只生成辅助建议，最终由调度员确认。')
}

function flowSvg(title, steps, subtitle) {
  const gap = 220
  const startX = 120
  const cards = steps.map((step, i) => {
    const x = startX + i * gap
    return `<g transform="translate(${x},360)">
      <rect class="card" width="185" height="136"/>
      <circle cx="34" cy="38" r="18" fill="${i === steps.length - 1 ? palette.green : palette.cyan}"/>
      <text x="28" y="45" font-size="20" font-weight="700" fill="#fff">${i + 1}</text>
      <text x="24" y="92" class="label">${step}</text>
    </g>${i < steps.length - 1 ? `<path d="M${x + 190} 428 H${x + gap - 14}" fill="none" stroke="${palette.blue}" stroke-width="6" stroke-linecap="round"/><path d="M${x + gap - 28} 414 L${x + gap - 8} 428 L${x + gap - 28} 442" fill="none" stroke="${palette.blue}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}`
  }).join('')
  return shell(title, `
    <text x="90" y="115" class="title">${title}</text>
    <text x="92" y="157" class="small">${subtitle}</text>
    ${cards}
    <rect x="92" y="642" width="1416" height="98" rx="24" fill="#fff" stroke="${palette.line}" stroke-width="2"/>
    <text x="126" y="704" class="label">适用页面：时刻表管理、排班工作流、Agent助手、路演模式</text>`)
}

function ruleEngine() {
  const inputs = [
    ['时刻表数据', 120, 210], ['乘务员数据', 120, 360], ['规则库', 120, 510], ['异常事件', 120, 660]
  ]
  const outputs = [
    ['合规方案', 1185, 270], ['风险提示', 1185, 430], ['人工复核项', 1185, 590]
  ]
  const inputNodes = inputs.map(([text, x, y]) => `<rect class="card" x="${x}" y="${y}" width="260" height="92"/><text x="${x + 34}" y="${y + 58}" class="label">${text}</text><path d="M${x + 265} ${y + 46} H650" stroke="${palette.blue}" stroke-width="5" stroke-linecap="round"/>`).join('')
  const outputNodes = outputs.map(([text, x, y]) => `<path d="M950 450 H${x - 22} V${y + 46} H${x - 6}" fill="none" stroke="${palette.green}" stroke-width="5" stroke-linecap="round"/><rect class="card" x="${x}" y="${y}" width="280" height="96"/><text x="${x + 34}" y="${y + 61}" class="label">${text}</text>`).join('')
  return shell('排班规则引擎示意', `
    <text x="90" y="105" class="title">排班规则引擎示意</text>
    <text x="92" y="147" class="small">输入运营数据与规则，输出可解释的辅助方案。</text>
    ${inputNodes}
    <rect x="650" y="285" width="300" height="330" rx="36" fill="#fff" stroke="${palette.blue}" stroke-width="5" filter="url(#shadow)"/>
    <text x="720" y="430" class="title" font-size="36">规则引擎</text>
    <text x="704" y="482" class="small">工时 / 间休 / 地点 / 用餐 / 里程</text>
    ${outputNodes}`)
}

function evidenceWall() {
  const items = ['项目调研', '源代码', 'PPT材料', '业务流程', '公开资料']
  const cards = items.map((item, i) => {
    const x = 130 + (i % 3) * 430
    const y = 265 + Math.floor(i / 3) * 210
    return `<g transform="translate(${x},${y})">
      <rect class="card" width="340" height="150"/>
      <rect x="28" y="28" width="86" height="86" rx="16" fill="${i % 2 ? '#eaf7ff' : '#edfdf6'}" stroke="${i % 2 ? palette.cyan : palette.green}" stroke-width="3"/>
      <path d="M48 82 H94 M48 58 H96 M48 106 H78" stroke="${i % 2 ? palette.cyan : palette.green}" stroke-width="7" stroke-linecap="round"/>
      <text x="140" y="82" class="label">${item}</text>
      <text x="140" y="118" class="small">可追溯素材</text>
    </g>`
  }).join('')
  return shell('项目基础证据墙', `
    <text x="90" y="105" class="title">项目基础证据墙</text>
    <text x="92" y="147" class="small">把调研、源码、PPT、业务流程和公开资料组织成可说明的证据素材。</text>
    ${cards}`)
}

