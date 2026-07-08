<template>
  <span class="status-badge" :class="`status-${tone}`">{{ text }}</span>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  tone: 'success' | 'warning' | 'danger' | 'info'
}>()
</script>
