# 智轨慧行网页图片素材采集计划

## 目标

为“智轨慧行——城市轨道交通AI智能调度与乘务排班系统”建立本地化网页素材库，让后续页面优化具备真实、克制、蓝白色、轨道交通行业感的视觉基础。

## 素材来源优先级

1. 项目自有资料：PPT、PDF、调研照片、核心代码截图、时刻表截图。
2. 许可明确的公开素材：Wikimedia Commons、OpenStreetMap、公开百科/开放数据资料。
3. AI 生成补充素材：仅用于缺少真实照片时的主视觉或模块配图。
4. 自绘 SVG：用于流程图、规则引擎图、线路示意图等版权安全素材。

## 版权边界

- 不使用商业图库、水印图、版权不明图。
- 不使用真实机构 Logo 作为系统 Logo。
- 不直接在代码里使用外链图片。
- 所有公开素材需要写入 `public/assets/manifest/public-assets.json`。
- 所有项目资料提取素材需要写入 `public/assets/manifest/project-assets.json`。

## 工作流

1. 将资料放入 `docs/source/`。
2. 运行 `node scripts/extractProjectAssets.mjs` 提取 PPT/PDF 页面与图片。
3. 运行 `node scripts/generateFallbackSvgs.mjs` 生成自绘 SVG。
4. 搜集并保存许可明确的公开素材到 `public/assets/real/`。
5. 将 image2 生成素材保存到 `public/assets/generated/image2/`。
6. 运行 `node scripts/buildAssetManifest.mjs` 生成统一索引。

