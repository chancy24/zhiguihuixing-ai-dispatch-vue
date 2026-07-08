# 智轨慧行网页图片素材库总览

本素材库服务于“智轨慧行——城市轨道交通AI智能调度与乘务排班系统”的 Vue 原型后续页面优化。当前目标是先准备可本地运行、可追溯、可替换的网页资产，不直接修改业务页面。

## 目录结构

```text
public/assets/project/      从项目 PDF、路演材料、核心代码展示中提取的页面截图
public/assets/real/         可公开使用或项目本地真实素材，以及旧版 SVG 占位图
public/assets/generated/    image2 生成图与项目自绘 SVG fallback
public/assets/manifest/     项目、公开、生成、综合资产清单
docs/source/                原始 PDF 资料副本
docs/assets/                素材采集计划、生成提示词、使用指南和本总览
scripts/                    素材提取、SVG 生成、综合 manifest 构建脚本
```

## 当前资产数量

- 项目资料截图：36 张，其中路演/OPC 页面 24 张，核心代码证据页 12 张。
- image2 生成图：9 张，覆盖新版 AI 调度指挥中心主视觉、登录主视觉、调度中心、时刻表处理、排班工作台、应急重排、疲劳预警、OPC生态和 Agent 工作流。
- 自绘 SVG fallback：5 张，覆盖 10 号线环线图、时刻表流程、规则引擎、Agent 工作流和项目证据墙。
- 公开素材登记：9 条，其中 4 条已下载到本地，3 条作为来源参考或后续替换项，2 条站台图因源站限流暂未下载并已配置本地 fallback。

## 前端引用入口

统一从 `src/data/assets.ts` 引用素材，不建议在页面里散落硬编码路径。

```ts
import { getAssetPath } from '@/data/assets'

const hero = getAssetPath('heroMetroDispatch')
```

已知未下载的公开站台图：

- `line10StationPlatform01`：运行时 fallback 到 `heroMetroDispatch`。
- `line10StationPlatform02`：运行时 fallback 到 `line10Platform`。

新版视觉重点素材：

- `aiCommandCenterPremium`：登录页、首页、排班页和路演模式的高质 AI 调度指挥中心主视觉。
- `beijingRailTransitConfigMap`：北京轨道交通线路配置 SVG 源图，来自 SierraQin/metro，CC BY-SA 4.0。

## 可运行脚本

```bash
node scripts/extractProjectAssets.mjs
node scripts/generateFallbackSvgs.mjs
node scripts/buildAssetManifest.mjs
npm run build
```

## 使用原则

- 首页、登录页、路演模式优先使用 `generated/image2` 中的蓝白科技主视觉。
- 线路、时刻表、规则解释优先使用自绘 SVG，避免外部授权风险。
- 项目 PDF 提取页适合作为“项目基础、调研、已有材料、代码证据”卡片，不建议直接作为大幅背景。
- Wikimedia Commons 素材使用时需要在说明页、关于页或评审材料中保留来源与许可说明。
- 如后续替换为团队自有调研照片，只需要覆盖 `public/assets/real/` 中对应文件，并同步更新 manifest。
