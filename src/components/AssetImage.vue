<template>
  <div class="asset-frame" :class="`asset-${variant}`">
    <img
      v-if="showImage"
      :src="imageFallback(assetKey)"
      :alt="alt"
      @error="showImage = false"
    />
    <div v-else class="asset-fallback">
      <span class="fallback-line"></span>
      <span class="fallback-line short"></span>
      <b>{{ assetLabel(assetKey) }}</b>
      <small>素材缺失 · 将图片放入 public/assets/real/ 后自动显示</small>
    </div>
    <span v-if="caption" class="asset-caption">{{ caption }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AssetKey } from '@/data/assets'
import { assetLabel, imageFallback } from '@/utils/imageFallback'

const props = withDefaults(
  defineProps<{
    assetKey: AssetKey
    alt: string
    variant?: 'wide' | 'compact' | 'hero'
    caption?: string
  }>(),
  {
    variant: 'wide',
    caption: ''
  }
)

const showImage = ref(true)

watch(
  () => props.assetKey,
  () => {
    showImage.value = true
  }
)
</script>
