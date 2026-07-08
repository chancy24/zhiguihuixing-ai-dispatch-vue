<template>
  <aside class="quick-demo-panel" :class="{ collapsed }">
    <button class="quick-toggle" @click="collapsed = !collapsed">{{ collapsed ? '快捷操作' : '收起' }}</button>
    <div v-if="!collapsed" class="quick-content">
      <b>快速操作</b>
      <button v-for="action in actions" :key="action.label" @click="run(action)">
        {{ action.label }}
      </button>
      <span v-if="toast">{{ toast }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const collapsed = ref(true)
const toast = ref('')

const actions = [
  { label: '生成演示数据', path: '/app/timetable', note: '已进入时刻表处理台。' },
  { label: '划分乘务片段', path: '/app/segments', note: '已进入片段划分页。' },
  { label: '执行规则校验', path: '/app/segments', note: '重点查看红色不合规片段。' },
  { label: 'AI辅助排班', path: '/app/optimizer', note: '已进入候选方案对比页。' },
  { label: '模拟应急重排', path: '/app/emergency', note: '已进入应急重排页。' },
  { label: '生成报告', path: '/app/report', note: '已进入报告页。' }
]

function run(action: { path: string; note: string }) {
  router.push(action.path)
  toast.value = action.note
  window.setTimeout(() => { toast.value = '' }, 2600)
}
</script>
