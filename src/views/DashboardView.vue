<template>
  <section class="page-stack">
    <!-- 顶部运营概览 -->
    <div class="operation-hero command-hero">
      <div>
        <p class="kicker">今日运营概览 · 北京地铁10号线</p>
        <h2>AI调度驾驶舱</h2>
        <p>以“线网态势、乘务资源、规则冲突、疲劳风险、AI建议”为一屏核心，让评委一眼看懂：智轨慧行不是概念海报，而是可操作的轨交排班决策工作台。</p>
        <div class="command-tags">
          <span>模拟工作日</span>
          <span>规则引擎在线</span>
          <span>AI建议待复核</span>
          <span>不连接真实运营系统</span>
        </div>
        <div class="hero-actions-row">
          <RouterLink to="/app/agent" class="primary-button small">调度Agent工作台</RouterLink>
          <RouterLink to="/app/workflow" class="ghost-button small">打开排班工作流</RouterLink>
          <RouterLink to="/app/presentation" class="ghost-button small">进入路演模式</RouterLink>
        </div>
      </div>
      <AssetImage asset-key="aiCommandCenterPremium" alt="AI轨交调度指挥中心主视觉" variant="hero" caption="AI调度指挥中心主视觉（本地生成素材）" />
    </div>

    <!-- 指标卡片 -->
    <div class="metric-grid">
      <MetricCard label="今日待排片段" :value="segments.length" hint="覆盖10号线内外环" />
      <MetricCard label="已完成片段划分" :value="completedCount" :hint="'合规率 ' + complianceRate + '%'" />
      <MetricCard label="待处理冲突" :value="conflicts" hint="工时、间休、地点、里程" />
      <MetricCard label="高风险人员" :value="highRiskCount" hint="疲劳评分≥68分" />
      <MetricCard label="应急事件" :value="0" hint="当前无活跃事件" />
      <MetricCard label="AI建议待确认" :value="3" hint="排班、重排、风险各1项" />
    </div>

    <!-- 线路图 + 待办 -->
    <div class="dashboard-grid cockpit-grid">
      <section class="metro-card network-preview-card">
        <div class="chart-head">
          <div>
            <h3>线网与10号线场景</h3>
            <span>公开 SVG 线网作为真实空间背景，10号线用于排班流程演示</span>
          </div>
          <RouterLink to="/app/lines" class="ghost-button tiny">查看线路</RouterLink>
        </div>
        <div class="network-preview">
          <img :src="getAssetPath('beijingRailTransitConfigMap')" alt="北京轨道交通线路配置图" />
        </div>
      </section>
      <section class="panel-card mission-card">
        <h3>今日待办事项</h3>
        <div class="list-stack">
          <article v-for="(item, i) in todoItems" :key="i" class="mini-row">
            <b>{{ item.title }}</b>
            <span>{{ item.desc }}</span>
          </article>
        </div>
      </section>
    </div>

    <!-- 图表 + 日志 -->
    <div class="dashboard-grid">
      <BarChart title="早班/白班/夜班任务分布" subtitle="根据开始时间自动识别" :data="shiftData" />
      <BarChart title="内环/外环任务分布" subtitle="时刻表方向字段统计" :data="directionData" />
      <LineTrend title="近7日疲劳风险趋势" subtitle="风险分数越高越需复核" :data="riskTrend" />
      <section class="panel-card">
        <h3>最近操作日志</h3>
        <div class="list-stack">
          <article v-for="(log, i) in operationLogs" :key="i" class="mini-row">
            <b>{{ log.time }} {{ log.action }}</b>
            <span>{{ log.result }}</span>
          </article>
        </div>
      </section>
    </div>

    <!-- 风险分布 -->
    <section class="panel-card">
      <h3>风险分布</h3>
      <div class="list-stack">
        <article v-for="(risk, i) in riskItems" :key="i" class="mini-row">
          <b>{{ risk.tag }}</b>
          <span>{{ risk.detail }}</span>
        </article>
      </div>
    </section>

    <!-- 数据来源说明 -->
    <div class="source-strip">
      <AssetImage asset-key="dataSourceCard" alt="数据与素材来源说明" variant="compact" />
      <div class="source-strip-text">
        <b>数据与素材来源</b>
        <span>线路/站点数据：北京地铁10号线公开信息 · 时刻表/乘务员：路演模拟数据 · AI建议：DeepSeek 大模型（需调度员复核）</span>
        <span class="muted">路演演示用，不连接真实运营系统。完整来源清单见 public/assets/real/source-manifest.json</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '@/components/BarChart.vue'
import LineTrend from '@/components/LineTrend.vue'
import MetricCard from '@/components/MetricCard.vue'
import AssetImage from '@/components/AssetImage.vue'
import { getAssetPath } from '@/data/assets'
import { crewMembers } from '@/mock/crew'
import { seedSegments } from '@/mock/schedule'
import { timetableRows } from '@/mock/timetable'
import { calculateFatigueScore, validateDutySegment } from '@/utils/scheduling'

const segments = seedSegments.map(validateDutySegment)
const conflicts = computed(() => segments.filter(s => s.status === '不合规').length)
const completedCount = computed(() => segments.filter(s => s.status === '合规').length)
const complianceRate = computed(() => Math.round((completedCount.value / segments.length) * 100))
const highRiskCount = computed(() => crewMembers.filter(c => calculateFatigueScore(c) >= 68).length)

const shiftData = ['早班', '白班', '夜班'].map(label => ({
  label,
  value: segments.filter(s => s.shiftType === label).length
}))

const directionData = ['内环', '外环'].map(label => ({
  label,
  value: timetableRows.filter(r => r.direction === label).length
}))

const riskTrend = [
  { label: 'D-6', value: 12 }, { label: 'D-5', value: 10 },
  { label: 'D-4', value: 15 }, { label: 'D-3', value: 18 },
  { label: 'D-2', value: 14 }, { label: 'D-1', value: 11 },
  { label: '今日', value: highRiskCount.value + 13 }
]

const todoItems = [
  { title: '复核不合规片段', desc: '3个片段存在间休不足、里程超限、午餐休息不足——需要调度员逐项确认。' },
  { title: '关注高风险人员', desc: '赵静近7日夜班4次、休息间隔仅6.5小时，建议降低后续夜班安排。' },
  { title: '应急重排影响确认', desc: '本次重排影响早高峰3个片段，建议优先使用低风险备用人员。' }
]

const operationLogs = [
  { time: '09:30', action: '导入时刻表', result: '成功导入PR2003格式，12条记录' },
  { time: '09:32', action: '站名转换', result: 'BG→巴沟，SJZ→宋家庄，WLPL→五路' },
  { time: '09:35', action: '内外环分类', result: '内环6条，外环6条，异常0条' },
  { time: '09:38', action: '乘务片段划分', result: '生成7个核心乘务片段' },
  { time: '09:40', action: '规则校验', result: '发现3处规则风险，需调度员复核' }
]

const riskItems = [
  { tag: '疲劳风险：赵静（CR-05）', detail: '连续工作接近上限，夜班次数偏高。建议：降低后续夜班安排，优先使用备班人员。' },
  { tag: '间休风险：AUTO-003片段', detail: '与下一片段间休仅22分钟，低于25分钟最低标准。建议：调整交路或补充备用人员。' },
  { tag: '里程风险：AUTO-005片段', detail: '累计里程89km，接近90km上限。建议：拆分片段或更换短交路。' }
]
</script>
