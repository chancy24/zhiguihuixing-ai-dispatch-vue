<template>
  <div class="chart-card">
    <div class="chart-head">
      <h3>{{ title }}</h3>
      <span>{{ subtitle }}</span>
    </div>
    <svg class="trend-svg" viewBox="0 0 360 160" role="img" aria-label="趋势图">
      <polyline class="grid-line" points="0,132 360,132" />
      <polyline class="grid-line" points="0,92 360,92" />
      <polyline class="grid-line" points="0,52 360,52" />
      <polyline class="trend-line" :points="points" />
      <circle v-for="point in pointList" :key="point.x" :cx="point.x" :cy="point.y" r="4" class="trend-dot" />
    </svg>
    <div class="trend-labels">
      <span v-for="item in data" :key="item.label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle: string
  data: Array<{ label: string; value: number }>
}>()

const pointList = computed(() => {
  const max = Math.max(1, ...props.data.map((item) => item.value))
  const step = 340 / Math.max(props.data.length - 1, 1)
  return props.data.map((item, index) => ({
    x: 10 + index * step,
    y: 136 - (item.value / max) * 104
  }))
})

const points = computed(() => pointList.value.map((point) => `${point.x},${point.y}`).join(' '))
</script>
