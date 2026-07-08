import { assetLabels, getAssetPath, type AssetKey } from '@/data/assets'

/** 返回素材本地路径 */
export function imageFallback(key: AssetKey): string {
  return getAssetPath(key)
}

/** 返回素材中文标签（占位 fallback 时展示） */
export function assetLabel(key: AssetKey): string {
  return assetLabels[key] ?? '素材占位'
}
