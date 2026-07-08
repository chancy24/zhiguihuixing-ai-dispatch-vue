<template>
  <section class="page-stack agent-workbench">
    <!-- 工作台标题区 -->
    <div class="agent-hero">
      <div class="agent-hero-left">
        <p class="kicker">轨交调度Agent工作台</p>
        <h2>北京地铁10号线 · 调度辅助Agent</h2>
        <p>面向乘务片段划分、应急重排与疲劳风险预警的调度辅助工作台。接入 DeepSeek 大模型进行推理，注入10号线站点、时刻表、乘务员与规则上下文。AI建议仅供辅助，最终方案需由调度员复核确认。</p>
      </div>
      <div class="agent-hero-right">
        <AssetImage asset-key="agentWorkflowBlueWhite" alt="调度Agent工作流示意图" variant="wide" caption="Agent工作流：自然语言输入、规则检索、方案解释、人工确认" />
        <div class="agent-status-card">
          <div class="status-row">
            <span class="status-label">模型接入</span>
            <span class="status-pill" :class="connected ? 'ok' : 'warn'">
              <i class="dot" :class="connected ? 'dot-ok' : 'dot-warn'"></i>
              {{ connected ? 'DeepSeek 已接入' : '本地规则引擎' }}
            </span>
          </div>
          <div class="status-row">
            <span class="status-label">线路</span>
            <span class="status-pill">{{ line.lineName }} · {{ line.totalStations }}站 · {{ line.lineType }}</span>
          </div>
          <div class="status-row">
            <span class="status-label">数据来源</span>
            <span class="status-pill">路演模拟数据 · 不连接真实运营系统</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话工作区 -->
    <div class="agent-chat-grid">
      <!-- 左侧：输入区 -->
      <div class="demo-panel agent-input-panel">
        <div class="demo-header">
          <span class="demo-label">调度员输入</span>
          <span class="status-dot">{{ connected ? '大模型推理' : '规则兜底' }}</span>
        </div>
        <textarea
          v-model="prompt"
          class="demo-input"
          placeholder="描述调度场景，如：2名乘务员请假，请在满足工时和休息约束下重新生成方案。"
          @keydown.enter.meta="send"
          @keydown.ctrl.enter="send"
        ></textarea>
        <div class="quick-prompts">
          <button v-for="item in quickPrompts" :key="item.label" class="ghost-button tiny" @click="usePrompt(item.text)">
            {{ item.label }}
          </button>
        </div>
        <button class="primary-button" :disabled="loading || !prompt.trim()" @click="send">
          {{ loading ? 'Agent 推理中…' : '发送给调度Agent' }}
        </button>
        <button class="ghost-button tiny" style="margin-top:8px;" @click="clearChat">清空对话</button>
        <p class="demo-tip">
          {{ connected ? '当前由 DeepSeek 大模型生成回复，已注入10号线业务上下文。' : '未检测到 DeepSeek 密钥，当前为本地规则引擎兜底响应。配置 .env.local 中的 VITE_DEEPSEEK_API_KEY 后重启即可接入。' }}
          所有建议必须由调度员复核确认。
        </p>
      </div>

      <!-- 右侧：对话历史 -->
      <div class="demo-panel agent-chat-panel">
        <div class="demo-header">
          <span class="demo-label">Agent 对话</span>
          <span class="status-dot">{{ messages.filter(m => m.role === 'assistant').length }} 条回复</span>
        </div>
        <div class="chat-scroll" ref="scrollRef">
          <div v-if="!messages.length" class="empty-state">
            <b>调度Agent待命</b>
            <span>点击左侧"发送给调度Agent"开始对话，或使用快捷问题。</span>
            <span class="muted">支持的场景：乘务员请假替班、片段划分校验、疲劳风险预警、应急重排。</span>
          </div>

          <div v-for="(msg, i) in messages" :key="i" class="chat-msg" :class="msg.role">
            <div class="chat-avatar">{{ msg.role === 'user' ? '调度员' : 'Agent' }}</div>
            <div class="chat-body">
              <div class="chat-meta">
                <b>{{ msg.role === 'user' ? '调度员' : '调度Agent' }}</b>
                <span v-if="msg.role === 'assistant'" class="chat-badge" :class="msg.source === 'deepseek' ? 'badge-ai' : 'badge-local'">
                  {{ msg.source === 'deepseek' ? 'DeepSeek' : '本地规则引擎' }}
                </span>
                <span v-if="msg.latencyMs" class="chat-latency">{{ msg.latencyMs }}ms</span>
              </div>
              <div class="chat-content" v-html="renderMarkdown(msg.content)"></div>
            </div>
          </div>

          <div v-if="loading" class="chat-msg assistant">
            <div class="chat-avatar">Agent</div>
            <div class="chat-body">
              <div class="chat-meta"><b>调度Agent</b><span class="chat-badge badge-ai">推理中</span></div>
              <div class="chat-content typing">
                <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="messages.length" class="dispatcher-confirm" style="margin-top:12px;">
          AI建议仅供辅助，最终方案需由调度员复核确认。本系统为路演演示，不直接写入真实运营系统。
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import AssetImage from '@/components/AssetImage.vue'
import { lineInfo as line } from '@/mock/beijingLine10'
import { chatWithAgent, hasDeepSeekKey, type AgentMessage } from '@/utils/deepseek'

const connected = hasDeepSeekKey()
const prompt = ref('明天早高峰有2名乘务员请假，请在满足工时、休息间隔和岗位衔接约束的前提下，给出替班方案并标注需复核项。')
const loading = ref(false)
const scrollRef = ref<HTMLElement | null>(null)

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  source?: 'deepseek' | 'local-fallback'
  latencyMs?: number
}

const messages = ref<ChatMsg[]>([])
const history = ref<AgentMessage[]>([])

const quickPrompts = [
  { label: '乘务员请假替班', text: '明天早高峰2名乘务员请假，请在满足连续工作≤240min、间休≥25min约束下，给出低风险替班人员名单与复核项。' },
  { label: '片段划分校验', text: '请说明10号线乘务片段划分流程，以及连续工作、间休、出退勤地点的硬约束规则。' },
  { label: '疲劳风险预警', text: '当前哪些乘务员疲劳风险较高？给出处置建议和反向优化排班的思路。' },
  { label: '应急重排流程', text: '列车延误15分钟，请给出应急重排的影响分析与处置流程。' },
  { label: '高峰片段匹配', text: '早晚高峰入库出库车的关系如何匹配？交路集如何从687优化到258？' }
]

function usePrompt(text: string) {
  prompt.value = text
}

async function send() {
  const text = prompt.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  history.value.push({ role: 'user', content: text })
  prompt.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const reply = await chatWithAgent(text, history.value)
    messages.value.push({
      role: 'assistant',
      content: reply.content,
      source: reply.source,
      latencyMs: reply.latencyMs
    })
    history.value.push({ role: 'assistant', content: reply.content })
  } catch {
    messages.value.push({
      role: 'assistant',
      content: 'Agent 推理异常，请稍后重试或检查 DeepSeek 密钥配置。',
      source: 'local-fallback'
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

function clearChat() {
  messages.value = []
  history.value = []
}

async function scrollToBottom() {
  await nextTick()
  if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
}

/** 轻量 Markdown 渲染：转义 + 换行 + 加粗 + 引用块 */
function renderMarkdown(src: string): string {
  const esc = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return esc
    .replace(/【([^】]+)】/g, '<b class="md-h">【$1】</b>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/^&gt; (.*)$/gm, '<span class="md-quote">$1</span>')
    .replace(/\n/g, '<br>')
}
</script>
