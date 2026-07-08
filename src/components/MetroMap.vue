<template>
  <div class="metro-card">
    <div class="metro-track">
      <div
        v-for="(station, index) in stations"
        :key="station.id"
        class="metro-node"
        :class="{ duty: station.isDutyPoint }"
        :style="{ left: `${8 + index * (84 / Math.max(stations.length - 1, 1))}%`, top: index % 2 ? '58%' : '36%' }"
      >
        <span></span>
        <b>{{ station.name }}</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Station } from '@/types/domain'

defineProps<{
  stations: Station[]
}>()
</script>
