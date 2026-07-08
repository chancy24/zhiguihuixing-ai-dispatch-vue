# 智轨慧行 - 城市轨道交通AI智能调度与乘务排班系统

这是一个用于中关村AI北纬社区OPC加速营、全球OPC共创节和比赛路演展示的 Vue 3 + Vite + TypeScript 前端原型项目。

项目定位为“AI化产品原型/MVP演示版”：使用模拟数据、本地状态和前端算法展示城市轨道交通乘务排班、动态重排、疲劳风险预警和排班Agent助手的完整产品逻辑，不接入真实地铁内部数据，不声明已真实部署。

## 运行方法

```bash
npm install
npm run dev
```

默认开发服务端口为：

```text
http://localhost:5176
```

生产构建：

```bash
npm run build
```

GitHub Pages 构建：

```bash
npm run build:pages
```

构建预览：

```bash
npm run preview
```

## GitHub Pages 部署

本项目已适配 GitHub Pages 子路径部署，仓库名为 `zhiguihuixing-ai-dispatch-vue` 时，线上演示入口为：

```text
https://chancy24.github.io/zhiguihuixing-ai-dispatch-vue/app/presentation
```

`npm run build:pages` 会使用 `/zhiguihuixing-ai-dispatch-vue/` 作为 Vite 静态资源基础路径，并生成 `dist/404.html` 作为 Vue Router history 模式的刷新回退页。

## 页面说明

- 登录页 / 项目入口页：项目名称、系统定位、真实图片占位和普通操作/路演模式入口。
- 首页驾驶舱：核心指标、班次分布、内外环分布、疲劳风险趋势、排班效率对比。
- 排班工作流：导入时刻表、数据清洗、内外环分类、片段划分、规则校验、AI排班、确认报告的7步演示流程。
- 线路基础管理：站点查询、新增、编辑、删除、排序和地铁线网可视化。
- 时刻表管理：模拟导入、一键生成时刻表、站名转换、重要站摘抄和内外环分类演示。
- 乘务片段划分：根据时刻表生成片段，并执行连续工作、间休、地点、用餐、里程校验。
- 智能排班优化：展示效率优先、安全优先、均衡推荐三套候选方案，并生成AI辅助排班建议。
- 动态重排与应急调度：模拟请假、客流突增、列车延误事件，展示影响范围、替换人员和确认记录。
- 疲劳风险预警：按连续工作、夜班频次、休息间隔、近7日工时计算风险分数。
- 排班Agent助手：自然语言输入，模拟AI识别异常、约束条件、调整建议和管理建议。
- 方案解释与报告：生成今日排班优化报告，并支持前端导出 TXT / JSON / Markdown。
- OPC赋能展示：展示小团队、AI工具、轨交场景和OPC生态的创业路径。
- 路演模式：提供比赛/答辩现场的一键演示路径。

## 真实图片与素材来源

项目所有图片素材已统一本地化到 `public/assets/real/`，不依赖任何外链图片。当前素材以自绘 SVG 为主（线路图、流程图、示意图），依据北京地铁10号线公开站点信息绘制。

### 现有素材清单

| 文件 | 说明 | 用于页面 |
|---|---|---|
| `line10-map.svg` | 北京地铁10号线简化线路图（环线） | 首页驾驶舱、线路管理、路演 |
| `beijing-subway-map.svg` | 北京地铁线网抽象示意图 | 登录页、路演 |
| `beijing-subway-network.svg` | 线网拓扑图（备用） | 登录页 |
| `line10-platform.svg` | 10号线站台示意图（占位） | 路演、报告 |
| `line10-train.svg` | 10号线列车示意图（占位） | 路演、报告 |
| `dispatch-center-placeholder.svg` | 调度中心/监控大屏示意图 | 首页、智能排班、路演 |
| `timetable-sample.svg` | 时刻表数据处理流程图 | 时刻表管理 |
| `segment-rule-flow.svg` | 乘务片段划分规则校验流程图 | 乘务片段划分 |
| `emergency-impact-range.svg` | 应急重排影响范围图 | 应急重排 |
| `data-source-card.svg` | 数据与素材来源说明卡 | 首页驾驶舱 |

完整来源清单（含 sourceTitle/sourceUrl/licenseNote/usedInPage）见 `public/assets/real/source-manifest.json`。

### 如何替换为真实调研照片

1. 将真实照片放入 `public/assets/real/`，建议命名：`line10-train.jpg`、`line10-platform.jpg`、`dispatch-center.jpg`、`timetable-sheet.jpg`
2. 在 `src/data/assets.ts` 中将对应 key 的路径指向 `.jpg` 文件
3. AssetImage 组件会自动加载，缺失时 fallback 到自绘 SVG 占位，不会空白报错

### 素材来源与免责声明

- 线路/站点数据：北京地铁10号线公开站点信息（参考 Wikipedia、北京地铁官方网站、北京市交通委员会）
- 时刻表/乘务员/片段数据：均为路演模拟数据，不连接真实运营系统，不包含真实个人信息
- AI建议：由 DeepSeek 大模型生成，仅供调度员复核参考，不直接写入真实运营系统

> **重要**：路演展示素材仅用于项目演示，正式商用需替换为自有授权素材或运营单位授权资料。请勿上传真实机构 Logo、二维码、敏感内部数据或未经授权素材。

## DeepSeek 调度Agent接入

本项目排班Agent助手（`/app/agent`）已接入 DeepSeek 大模型，提供真实AI推理能力。

### 配置

1. 在项目根目录创建 `.env.local`（已 gitignore，不会提交）：

```text
VITE_DEEPSEEK_API_KEY=sk-你的密钥
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
VITE_DEEPSEEK_MODEL=deepseek-chat
```

2. 重启开发服务器（`npm run dev`）使环境变量生效
3. 访问"排班Agent助手"页面即可与大模型对话

### 安全说明

- ⚠ 浏览器直连 DeepSeek 会暴露 API 密钥，**仅用于本地路演演示**
- 正式部署必须改为后端代理转发，密钥存放在服务端
- 演示结束后请在 DeepSeek 平台轮换/吊销密钥
- 无密钥或接口失败时，系统自动降级到本地规则引擎（`src/utils/deepseek.ts` 的 `buildLocalReply`），保证演示不中断

## 项目技能文档

本项目已补充可给AI开发助手读取的项目技能说明：

- `AGENTS.md`
- `docs/skills/product-positioning.md`
- `docs/skills/rail-scheduling-domain.md`
- `docs/skills/ui-style.md`
- `docs/skills/interaction-efficiency.md`
- `docs/skills/demo-script.md`

这些文件用于约束后续迭代：保持轨交排班业务定位、真实运营后台视觉、路演讲解顺序和“AI建议必须人工确认”的安全边界。

## 目录结构

```text
zhiguihuixing-ai-dispatch-vue/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  src/
    main.ts
    App.vue
    components/
    layouts/
    mock/
    router/
    styles/
    types/
    utils/
    views/
```

## 核心前端算法

核心算法位于 `src/utils/scheduling.ts`：

- `translateStationName(code)`：站点英文缩写转换为中文站名。
- `determineShiftType(startTime)`：根据开始时间识别早班、白班、夜班。
- `calculateDuration(startTime, endTime)`：计算持续时间，支持跨天。
- `calculateRestTime(prevEnd, nextStart)`：计算片段之间间休时间，支持跨天。
- `validateDutySegment(segment)`：校验连续工作、间休、地点、用餐、里程规则。
- `calculateFatigueScore(crew)`：计算疲劳风险分数。
- `generateSchedule(segments, crews)`：模拟生成AI辅助排班方案。
- `simulateReschedule(eventType)`：模拟突发事件后的动态重排方案。

## 后续AI化方向

- 接入真实排班规则库和可配置约束引擎。
- 使用大模型构建排班Agent，支持自然语言查询、冲突解释和报告生成。
- 增加后端 API、数据库、权限体系和操作审计。
- 接入示例客流预测模型，辅助高峰人力需求评估。
- 建立调度员确认、版本对比、方案回滚和候补池管理流程。
- 从轨道交通拓展到公交、铁路、医疗、制造等多班次强约束排班场景。
