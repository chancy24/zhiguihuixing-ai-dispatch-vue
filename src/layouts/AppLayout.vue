<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand-block" to="/app/dashboard">
        <span class="brand-mark">AI</span>
        <span>
          <b>智轨慧行</b>
          <small>Metro AI Dispatch Suite</small>
        </span>
      </RouterLink>

      <div class="sys-status">
        <span class="sys-status-dot"></span>
        <span class="sys-status-text">系统运行中 · {{ clock }}</span>
      </div>

      <nav class="nav-list" aria-label="系统菜单">
        <template v-for="group in navGroups" :key="group.title">
          <p class="nav-group-title">{{ group.title }}</p>
          <RouterLink v-for="item in group.items" :key="item.path" :to="item.path" class="nav-item">
            <span class="nav-dot"></span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </template>
      </nav>

      <div class="sidebar-note">
        <b>演示版</b>
        <span>北京地铁10号线场景 · 模拟数据 · 规则引擎 · DeepSeek大模型辅助。<br/>AI建议最终由调度员确认。</span>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div>
          <p class="breadcrumb">智轨慧行 / {{ currentTitle }}</p>
          <p class="top-kicker">北京地铁10号线 · AI辅助排班 · 调度员确认</p>
          <h1>{{ currentTitle }}</h1>
        </div>
        <div class="top-actions">
          <DataSourceBadge :sources="currentSources" />
          <RouterLink to="/app/agent" class="primary-button small">调度Agent</RouterLink>
          <RouterLink to="/app/presentation" class="ghost-button small">路演模式</RouterLink>
          <RouterLink to="/login" class="ghost-button small">返回入口</RouterLink>
        </div>
      </header>

      <main class="content">
        <QuickActionBar />
        <RouterView />
      </main>
    </div>

    <QuickDemoPanel />
    <AIAssistantDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AIAssistantDrawer from '@/components/AIAssistantDrawer.vue'
import DataSourceBadge from '@/components/DataSourceBadge.vue'
import QuickActionBar from '@/components/QuickActionBar.vue'
import QuickDemoPanel from '@/components/QuickDemoPanel.vue'

const navGroups = [
  {
    title: '调度管理',
    items: [
      { path: '/app/dashboard', label: '首页驾驶舱' },
      { path: '/app/workflow', label: '排班工作流' },
      { path: '/app/lines', label: '线路基础管理' },
      { path: '/app/timetable', label: '时刻表管理' },
      { path: '/app/segments', label: '乘务片段划分' }
    ]
  },
  {
    title: '智能排班',
    items: [
      { path: '/app/optimizer', label: '智能排班优化' },
      { path: '/app/emergency', label: '应急重排' },
      { path: '/app/fatigue', label: '疲劳风险预警' },
      { path: '/app/agent', label: '调度Agent工作台' }
    ]
  },
  {
    title: '路演与展示',
    items: [
      { path: '/app/report', label: '方案解释报告' },
      { path: '/app/opc', label: 'OPC共创赋能' },
      { path: '/app/presentation', label: '路演模式' }
    ]
  }
]

const titleMap: Record<string, string> = {
  dashboard: '首页驾驶舱',
  workflow: '排班工作流',
  lines: '线路基础管理',
  timetable: '时刻表管理',
  segments: '乘务片段划分',
  optimizer: '智能排班优化',
  emergency: '应急重排',
  fatigue: '疲劳风险预警',
  agent: '调度Agent工作台',
  report: '方案解释报告',
  opc: 'OPC共创赋能',
  presentation: '路演模式'
}

const sourceMap: Record<string, Array<{ type: string; label: string }>> = {
  dashboard: [
    { type: 'demo', label: '演示数据' },
    { type: 'public', label: '北京地铁公开资料' },
    { type: 'engine', label: '项目规则引擎' },
    { type: 'ai', label: 'AI辅助建议' }
  ],
  workflow: [
    { type: 'demo', label: '演示时刻表' },
    { type: 'engine', label: '项目规则引擎' },
    { type: 'ai', label: 'AI辅助建议' }
  ],
  timetable: [
    { type: 'demo', label: '模拟PR2003.xls' },
    { type: 'public', label: '北京地铁公开站点' }
  ],
  segments: [
    { type: 'demo', label: '演示数据' },
    { type: 'engine', label: '项目规则引擎' }
  ],
  optimizer: [
    { type: 'demo', label: '演示数据' },
    { type: 'ai', label: 'AI辅助排班' }
  ],
  emergency: [
    { type: 'demo', label: '模拟事件' },
    { type: 'ai', label: 'AI重排建议' }
  ],
  fatigue: [
    { type: 'demo', label: '模拟数据' },
    { type: 'engine', label: '疲劳评分函数' }
  ],
  agent: [
    { type: 'demo', label: '10号线业务上下文' },
    { type: 'ai', label: 'DeepSeek大模型' }
  ],
  report: [
    { type: 'demo', label: '演示数据' },
    { type: 'ai', label: 'AI辅助建议' }
  ],
  opc: [
    { type: 'public', label: 'OPC公开资料' }
  ],
  presentation: [
    { type: 'demo', label: '演示数据' },
    { type: 'public', label: '北京地铁公开资料' },
    { type: 'ai', label: 'AI辅助建议' }
  ]
}

const route = useRoute()
const currentTitle = computed(() => titleMap[String(route.name)] ?? '智轨慧行')
const currentSources = computed(() => sourceMap[String(route.name)] ?? [
  { type: 'demo', label: '演示数据' },
  { type: 'public', label: '北京地铁公开资料' }
])

const clock = ref('')
let timer: number | undefined
function tick() {
  const d = new Date()
  const p = (x: number) => String(x).padStart(2, '0')
  clock.value = `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
onMounted(() => { tick(); timer = window.setInterval(tick, 1000) })
onUnmounted(() => { if (timer) window.clearInterval(timer) })
</script>
