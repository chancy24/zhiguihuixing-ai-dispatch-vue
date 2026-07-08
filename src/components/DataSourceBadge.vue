<template>
  <span class="data-source-badge" :title="tooltip">
    <span v-for="source in sources" :key="source.type" class="dot" :class="source.type"></span>
    {{ summaryText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Source {
  type: string
  label: string
}

const props = defineProps<{
  sources: Source[]
}>()

const summaryText = computed(() =>
  props.sources.map(s => s.label).join(' / ')
)

const tooltip = computed(() =>
  '数据来源：' + props.sources.map(s => `${s.label}（${s.type === 'demo' ? '模拟' : s.type === 'public' ? '公开资料' : s.type === 'engine' ? '规则引擎' : 'AI辅助'}）`).join('、')
)
</script>
