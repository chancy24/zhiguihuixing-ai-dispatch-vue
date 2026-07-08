<template>
  <article class="metric-card">
    <span class="metric-label">{{ label }}</span>
    <strong>{{ value }}</strong>
    <small>{{ hint }}</small>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint: string
}>()
</script>
