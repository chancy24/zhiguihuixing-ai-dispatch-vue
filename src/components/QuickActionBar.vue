<template>
  <div class="quick-action-bar" v-if="actions.length">
    <span class="label">快速操作：</span>
    <button v-for="action in actions" :key="action.label" @click="action.handler">
      {{ action.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function toast(msg: string) {
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = msg
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div')
    c.className = 'toast-container'
    document.body.appendChild(c)
    return c
  })()
  container.appendChild(el)
  setTimeout(() => el.remove(), 2500)
}

const allActions: Record<string, Array<{ label: string; handler: () => void }>> = {
  dashboard: [
    { label: '调度Agent', handler: () => router.push('/app/agent') },
    { label: '运行完整流程', handler: () => router.push('/app/workflow') },
    { label: '模拟应急事件', handler: () => router.push('/app/emergency') },
    { label: '进入路演模式', handler: () => router.push('/app/presentation') }
  ],
  workflow: [
    { label: '一键跑完全流程', handler: () => toast('已完成：导入→清洗→分类→片段→校验→排班→报告，详见下方步骤') },
    { label: '调度Agent复核', handler: () => router.push('/app/agent') }
  ],
  timetable: [
    { label: '调度Agent', handler: () => router.push('/app/agent') },
    { label: '查看数据处理流程', handler: () => toast('已展示原始时刻表→清洗→乘务片段流程图') }
  ],
  segments: [
    { label: '调度Agent', handler: () => router.push('/app/agent') },
    { label: '查看规则校验流程', handler: () => toast('已展示片段划分→班型识别→间休/出退勤校验流程') }
  ],
  optimizer: [
    { label: '调度Agent', handler: () => router.push('/app/agent') },
    { label: '生成候选方案', handler: () => toast('已生成效率/安全/均衡三套候选方案，请查看方案对比') }
  ],
  emergency: [
    { label: '调度Agent', handler: () => router.push('/app/agent') },
    { label: '模拟乘务员请假', handler: () => toast('已模拟2名乘务员请假，影响范围已高亮') },
    { label: '模拟客流突增', handler: () => toast('已模拟早高峰客流突增30%') }
  ],
  agent: [
    { label: '示例：请假替班', handler: () => toast('已填入示例问题，点击发送给调度Agent') }
  ],
  report: [
    { label: '导出报告', handler: () => toast('报告已导出（TXT/JSON/Markdown）') }
  ],
  opc: [],
  presentation: [],
  lines: [
    { label: '调度Agent', handler: () => router.push('/app/agent') }
  ],
  fatigue: [
    { label: '调度Agent', handler: () => router.push('/app/agent') }
  ]
}

const actions = computed(() => allActions[String(route.name)] ?? [
  { label: '生成演示数据', handler: () => toast('演示数据已刷新') }
])
</script>
