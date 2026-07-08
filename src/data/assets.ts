/**
 * 智轨慧行网页素材注册表
 * 所有页面后续应优先从本文件取素材路径与来源说明，避免散落硬编码。
 */

export const projectAssets = {
  slideCover: '/assets/project/slides/slide-cover.png',
  slideIndustryBackground: '/assets/project/slides/slide-industry-background.png',
  slideProjectBackground: '/assets/project/slides/slide-project-background.png',
  slideFieldResearch: '/assets/project/slides/slide-field-research.png',
  slidePolicySupport: '/assets/project/slides/slide-policy-support.png',
  slideProductArchitecture: '/assets/project/slides/slide-product-architecture.png',
  slideBusinessModel: '/assets/project/slides/slide-business-model.png',
  coreCodePage01: '/assets/project/evidence/core-code-page-01.png',
  coreCodePage02: '/assets/project/evidence/core-code-page-02.png'
} as const

export const publicAssets = {
  beijingRailTransitConfigMap: '/assets/real/subway/beijing-rail-transit-config-sierraqin.svg',
  line10MapPublic: '/assets/real/line10/line10-map-public.svg',
  line10MapReference: '/assets/real/line10/line10-map-reference.jpeg',
  line10Train01: '/assets/real/train/line10-train-01.jpg',
  line10StationPlatform01: '/assets/real/station/line10-station-platform-01.jpg',
  line10StationPlatform02: '/assets/real/station/line10-station-platform-02.jpg'
} as const

export const generatedAssets = {
  aiCommandCenterPremium: '/assets/generated/image2/ai-command-center-premium-v2.png',
  heroMetroDispatch: '/assets/generated/image2/hero-metro-dispatch-blue-white.png',
  dispatchCenterBlueWhite: '/assets/generated/image2/dispatch-center-blue-white.png',
  timetableProcessing: '/assets/generated/image2/timetable-processing.png',
  crewSchedulingWorkbench: '/assets/generated/image2/crew-scheduling-workbench.png',
  emergencyReschedule: '/assets/generated/image2/emergency-reschedule.png',
  fatigueRiskDashboard: '/assets/generated/image2/fatigue-risk-dashboard.png',
  opcCoCreationEcosystem: '/assets/generated/image2/opc-co-creation-ecosystem.png',
  agentWorkflowBlueWhite: '/assets/generated/image2/agent-workflow-blue-white.png'
} as const

export const assetFallbacks = {
  line10SystemMap: '/assets/generated/svg/line10-system-map.svg',
  timetableFlow: '/assets/generated/svg/timetable-flow.svg',
  schedulingRuleEngine: '/assets/generated/svg/scheduling-rule-engine.svg',
  agentWorkflow: '/assets/generated/svg/agent-workflow.svg',
  projectEvidenceWall: '/assets/generated/svg/project-evidence-wall.svg'
} as const

/**
 * 兼容旧页面的 realAssets 键名。
 * 缺失真实照片时，可使用 generated/image2 或 generated/svg 做视觉 fallback。
 */
export const realAssets = {
  metroStation: generatedAssets.heroMetroDispatch,
  dispatchCenter: generatedAssets.dispatchCenterBlueWhite,
  timetableSheet: generatedAssets.timetableProcessing,
  teamResearch: projectAssets.slideFieldResearch,
  metroLineMap: assetFallbacks.line10SystemMap,
  beijingSubwayMap: '/assets/real/beijing-subway-map.svg',
  beijingSubwayNetwork: '/assets/real/beijing-subway-network.svg',
  line10Map: assetFallbacks.line10SystemMap,
  line10Platform: '/assets/real/line10-platform.svg',
  line10Train: publicAssets.line10Train01,
  timetableSample: '/assets/real/timetable-sample.svg',
  segmentRuleFlow: '/assets/real/segment-rule-flow.svg',
  emergencyImpact: '/assets/real/emergency-impact-range.svg',
  dataSourceCard: '/assets/real/data-source-card.svg'
} as const

export const assetRegistry = {
  ...projectAssets,
  ...publicAssets,
  ...generatedAssets,
  ...assetFallbacks,
  ...realAssets
} as const

export type AssetKey = keyof typeof assetRegistry

export const assetLabels: Record<AssetKey, string> = {
  slideCover: '项目路演封面页',
  slideIndustryBackground: '行业背景页素材',
  slideProjectBackground: '项目背景页素材',
  slideFieldResearch: '项目调研基础素材',
  slidePolicySupport: '政策支持素材',
  slideProductArchitecture: '产品架构素材',
  slideBusinessModel: '商业模式素材',
  coreCodePage01: '核心代码证据截图 1',
  coreCodePage02: '核心代码证据截图 2',
  beijingRailTransitConfigMap: '北京轨道交通线路配置 SVG 源图',
  line10MapPublic: '北京地铁10号线公开SVG线路图',
  line10MapReference: '北京地铁10号线车厢线路图参考',
  line10Train01: '北京地铁10号线列车公开图',
  line10StationPlatform01: '北京地铁10号线角门西站台公开图',
  line10StationPlatform02: '北京地铁10号线六里桥站台公开图',
  aiCommandCenterPremium: 'AI轨交调度指挥中心主视觉',
  heroMetroDispatch: '登录页蓝白调度主视觉',
  dispatchCenterBlueWhite: '调度中心蓝白场景图',
  timetableProcessing: '时刻表数据处理图',
  crewSchedulingWorkbench: '乘务排班工作台图',
  emergencyReschedule: '应急重排场景图',
  fatigueRiskDashboard: '疲劳风险预警看板图',
  opcCoCreationEcosystem: 'OPC共创生态图',
  agentWorkflowBlueWhite: 'Agent工作流补充图',
  line10SystemMap: '10号线简化环线 SVG',
  timetableFlow: '时刻表处理流程 SVG',
  schedulingRuleEngine: '排班规则引擎 SVG',
  agentWorkflow: 'Agent工作流 SVG',
  projectEvidenceWall: '项目基础证据墙 SVG',
  metroStation: '地铁站台 / 列车主视觉',
  dispatchCenter: '调度中心 / 运营监控大屏',
  timetableSheet: '运行时刻表 / Excel 截图',
  teamResearch: '团队调研 / 项目资料',
  metroLineMap: '轨道线路图 / 抽象线网图',
  beijingSubwayMap: '北京地铁线网抽象示意图',
  beijingSubwayNetwork: '北京地铁线网拓扑图',
  line10Map: '北京地铁10号线简化线路图',
  line10Platform: '10号线站台示意图',
  line10Train: '北京地铁10号线列车素材',
  timetableSample: '时刻表数据处理流程图',
  segmentRuleFlow: '乘务片段划分规则校验流程',
  emergencyImpact: '应急重排影响范围图',
  dataSourceCard: '数据与素材来源说明'
}

export const assetSources: Partial<Record<AssetKey, string>> = {
  beijingRailTransitConfigMap: 'SierraQin/metro MTR2.svg, CC BY-SA 4.0',
  line10MapPublic: 'Wikimedia Commons, CC BY-SA 3.0',
  line10MapReference: 'Wikimedia Commons, CC BY-SA 3.0',
  line10Train01: 'Wikimedia Commons, CC BY-SA 3.0',
  line10StationPlatform01: 'Wikimedia Commons source-only, fallback used if local file missing',
  line10StationPlatform02: 'Wikimedia Commons source-only, fallback used if local file missing',
  aiCommandCenterPremium: 'OpenAI image generation, project-local copy',
  heroMetroDispatch: 'OpenAI image generation, project-local copy',
  dispatchCenterBlueWhite: 'OpenAI image generation, project-local copy',
  timetableProcessing: 'OpenAI image generation, project-local copy',
  crewSchedulingWorkbench: 'OpenAI image generation, project-local copy',
  emergencyReschedule: 'OpenAI image generation, project-local copy',
  fatigueRiskDashboard: 'OpenAI image generation, project-local copy',
  opcCoCreationEcosystem: 'OpenAI image generation, project-local copy',
  agentWorkflowBlueWhite: 'OpenAI image generation, project-local copy',
  line10SystemMap: 'Project self-drawn SVG',
  timetableFlow: 'Project self-drawn SVG',
  schedulingRuleEngine: 'Project self-drawn SVG',
  agentWorkflow: 'Project self-drawn SVG',
  projectEvidenceWall: 'Project self-drawn SVG'
}

export const assetPathFallbacks: Partial<Record<AssetKey, AssetKey>> = {
  line10StationPlatform01: 'heroMetroDispatch',
  line10StationPlatform02: 'line10Platform'
}

export function getAssetPath(key: AssetKey, fallback: AssetKey = 'line10SystemMap') {
  const fallbackKey = assetPathFallbacks[key]
  if (fallbackKey) {
    return assetRegistry[fallbackKey] ?? assetRegistry[fallback]
  }

  return assetRegistry[key] ?? assetRegistry[fallback]
}

export function getAssetSource(key: AssetKey) {
  return assetSources[key] ?? 'Project local asset; verify manifest for detailed source note'
}

export function imageFallback(key: AssetKey) {
  return getAssetPath(key)
}
