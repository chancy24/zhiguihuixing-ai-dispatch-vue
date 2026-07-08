/**
 * DeepSeek 调度 Agent 服务
 *
 * 通过 DeepSeek Chat Completions API（OpenAI 兼容协议）为
 * "北京地铁10号线乘务排班调度Agent工作台"提供大模型推理能力。
 *
 * 安全说明：
 * - 密钥从 import.meta.env.VITE_DEEPSEEK_API_KEY 读取（写在 .env.local，已 gitignore）。
 * - 浏览器直连会暴露密钥，仅用于本地路演演示；正式部署需改为后端代理转发。
 * - 当密钥缺失或请求失败时，自动降级到本地规则引擎（buildLocalReply），保证演示不中断。
 */
import { lineInfo, stations, timetableSamples, crewSamples, incidentSamples } from '@/mock/beijingLine10'

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined
const BASE_URL = (import.meta.env.VITE_DEEPSEEK_BASE_URL as string) || 'https://api.deepseek.com'
const MODEL = (import.meta.env.VITE_DEEPSEEK_MODEL as string) || 'deepseek-chat'

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AgentReply {
  content: string
  source: 'deepseek' | 'local-fallback'
  usage?: { prompt_tokens?: number; completion_tokens?: number }
  latencyMs: number
}

/** 是否已配置真实 API 密钥 */
export function hasDeepSeekKey(): boolean {
  return Boolean(API_KEY && API_KEY.startsWith('sk-'))
}

/** 构造系统提示词：注入10号线业务上下文，约束为调度辅助角色 */
function buildSystemPrompt(): string {
  const transferStations = stations.filter(s => s.transferLines.length).map(s => `${s.name}(${s.transferLines.join('/')})`).join('、')
  const signOnOff = stations.filter(s => s.canSignOn).map(s => s.name).join('、')
  const crewSummary = crewSamples.map(c => `${c.name}(${c.crewId},${c.qualification},疲劳${c.fatigueLevel},今日${c.todayWorkMinutes}min)`).join('；')
  const incidents = incidentSamples.map(i => `${i.title}[${i.severity}]`).join('；')

  return `你是"智轨慧行"北京地铁10号线乘务排班调度辅助Agent，服务于北京市地铁运营有限公司运营三分公司。

【线路背景】
- 线路：${lineInfo.lineName}（${lineInfo.lineType}），全长${lineInfo.lineLengthKm}公里，${lineInfo.totalStations}座车站，运营时间${lineInfo.operatingHours}。
- 运营单位：${lineInfo.operatingCompany}
- 演示场景：${lineInfo.scenario}

【关键业务数据（路演模拟）】
- 出退勤点：${signOnOff}
- 主要换乘站：${transferStations}
- 模拟时刻表：共${timetableSamples.length}条车次，含PULLOUT/NORMAL/PULLIN三类、内外环、工作日/节假日。
- 在岗乘务员：${crewSummary}
- 模拟应急事件：${incidents}

【硬性约束规则】
- 连续工作时长 ≤ 240分钟；单日累计工时 ≤ 480分钟；单次间休 ≥ 25分钟且 ≤ 150分钟；单日里程 ≤ 90公里。
- 出退勤必须为指定出退勤点；夜班7天内不超过规定次数。
- 片段需识别早班/白班/夜班；间休、出退勤地点需校验通过。

【你的职责】
1. 解读调度员的问题，给出乘务片段划分、排班优化、应急重排、疲劳风险预警的专业建议。
2. 回答须具体、可操作，引用站点名、车次号、乘务员工号等真实字段。
3. 涉及安全/合规边界时，必须明确标注"需调度员复核确认"。
4. 严禁编造未提供的数据；如信息不足，请说明需要哪些输入。
5. 回答用中文，结构清晰，适当使用要点列表，控制在400字以内。

【免责声明】本系统为路演演示，所有数据均为模拟数据，不连接真实运营系统。AI建议仅供辅助，最终方案需由调度员复核确认。`
}

/** 调用 DeepSeek 接口；失败时降级到本地规则引擎 */
export async function chatWithAgent(
  userMessage: string,
  history: AgentMessage[] = []
): Promise<AgentReply> {
  const start = performance.now()

  if (!hasDeepSeekKey()) {
    const content = buildLocalReply(userMessage)
    return { content, source: 'local-fallback', latencyMs: Math.round(performance.now() - start) }
  }

  const messages: AgentMessage[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...history.slice(-6),
    { role: 'user', content: userMessage }
  ]

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 800,
        stream: false
      })
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`DeepSeek ${res.status}: ${errText.slice(0, 120)}`)
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content ?? ''
    if (!content) throw new Error('DeepSeek 返回空内容')

    return {
      content,
      source: 'deepseek',
      usage: data?.usage,
      latencyMs: Math.round(performance.now() - start)
    }
  } catch (e) {
    const content = buildLocalReply(userMessage) + `\n\n> ⚠ DeepSeek 接口调用失败，已切换本地规则引擎兜底。错误：${(e as Error).message}`
    return { content, source: 'local-fallback', latencyMs: Math.round(performance.now() - start) }
  }
}

/**
 * 本地规则引擎兜底回复（无密钥或接口失败时使用）
 * 基于关键词匹配，给出贴合业务的模拟建议，仍标注需调度员复核。
 */
function buildLocalReply(message: string): string {
  const m = message.toLowerCase()

  if (/请假|缺人|缺席|替/.test(message)) {
    const incident = incidentSamples.find(i => i.type === '乘务员请假')
    const backups = crewSamples.filter(c => c.available && c.fatigueLevel !== '高')
    return `【应急重排建议 · 乘务员请假】

1. 影响识别：${incident?.title ?? '2名乘务员请假'}，影响早高峰3个内环片段（AUTO-001/003/005）。
2. 候选替补（按疲劳风险升序）：
${backups.slice(0, 3).map(c => `   - ${c.name}(${c.crewId})，${c.qualification}，今日工时${c.todayWorkMinutes}min，疲劳${c.fatigueLevel}`).join('\n')}
3. 校验要点：替补后需复核连续工作≤240min、间休≥25min、出退勤点为巴沟/宋家庄。
4. 间休不足时，建议启用备班人员（如${crewSamples.find(c => c.team.includes('备班'))?.name ?? '孙越'}）。

⚠ 需调度员复核确认后执行。本建议由本地规则引擎生成（DeepSeek 未接入）。`
  }

  if (/片段|划分|交路/.test(message)) {
    return `【乘务片段划分建议】

1. 基于${timetableSamples.length}条时刻表车次，按PULLOUT→NORMAL→PULLIN衔接切分，预估生成约7个乘务片段。
2. 班型识别：按片段起始时间划分早班(04:30-09:00)/白班(09:00-19:00)/夜班(19:00-00:30)。
3. 规则校验范围：连续工作≤240min、间休25-150min、里程≤90km、出退勤点校验。
4. 高峰片段：匹配早晚高峰入库/出库车，参考Dijkstra算法优化交路集（10号线交路集可从687降至258）。

⚠ 校验不通过片段将标记"不合规"并附原因，需调度员复核后调整交路或补充备用人员。`
  }

  if (/疲劳|风险|预警/.test(message)) {
    const high = crewSamples.filter(c => c.fatigueLevel === '高')
    return `【疲劳风险预警】

1. 当前高风险人员：${high.map(c => `${c.name}(${c.crewId},今日${c.todayWorkMinutes}min,近7日夜班${c.nightShiftCount7d}次)`).join('；') || '暂无'}。
2. 风险阈值：连续工作接近240min、夜班7天内超限、间休<25min 触发预警。
3. 建议后续片段优先使用疲劳风险"低"的备班人员，并对高风险人员安排补休。
4. 反向优化：将疲劳约束纳入排班算法（BO-GRU模型预测，RMSE 11.2ms），从源头规避风险场景。

⚠ AI建议仅供辅助，最终方案需由调度员复核确认。`
  }

  if (/重排|应急|故障|延误/.test(message)) {
    return `【应急重排流程】

1. 事件识别 → 2. 影响范围分析（受影响片段/人员） → 3. 候选替补匹配 → 4. 约束重校验 → 5. 调度员确认 → 6. 方案落地与交接记录。
- 应急场景下系统可在5分钟内生成最优调整方案，平均故障恢复时间缩短约42.7%。
- 受影响片段高亮于10号线环线影响范围图，替补方向以备班人员优先。

⚠ 需调度员复核确认本次重排方案。`
  }

  return `【调度辅助】

针对您的问题"${message.slice(0, 40)}"，结合北京地铁10号线${lineInfo.totalStations}站环线场景，可从以下方面处理：
- 乘务片段划分与规则校验（连续工作/间休/里程/出退勤点）
- 应急重排与替补匹配
- 疲劳风险预警与工作量均衡

请具体说明：是片段划分、应急重排、还是疲劳预警？我可给出更聚焦的建议。

⚠ AI建议仅供辅助，最终方案需由调度员复核确认。（当前为本地规则引擎响应，接入DeepSeek后将由大模型生成）`
}
