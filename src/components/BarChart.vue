<template>
  <div class="chart-card">
    <div class="chart-head">
      <h3>{{ title }}</h3>
      <span>{{ subtitle }}</span>
    </div>
    <div class="bar-list">
      <div v-for="item in data" :key="item.label" class="bar-row">
        <span>{{ item.label }}</span>
        <div class="bar-track">
          <i :style="{ width: `${Math.min(item.value, maxValue) / maxValue * 100}%` }"></i>
        </div>
        <b>{{ item.value }}</b>
      </div>
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

const maxValue = computed(() => Math.max(1, ...props.data.map((item) => item.value)))
</script>
