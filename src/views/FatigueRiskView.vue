<template>
  <section class="page-stack">
    <div class="module-hero">
      <div>
        <p class="kicker">疲劳风险预警 · 安全优先</p>
        <h2>把夜班、间休和周工时转成可干预的风险信号</h2>
        <p>疲劳风险不是单独看一个数，而是把连续工作、近7日夜班、休息间隔和累计工时合在一起评分。高风险人员会在排班和应急重排中被降权。</p>
        <div class="command-tags">
          <span>连续工作</span>
          <span>夜班频次</span>
          <span>休息间隔</span>
          <span>近7日工时</span>
        </div>
      </div>
      <AssetImage asset-key="fatigueRiskDashboard" alt="疲劳风险预警看板" variant="wide" caption="疲劳风险看板：高风险人员、原因和候补池建议" />
    </div>

    <div class="metric-grid four">
      <MetricCard label="高风险人员" :value="highRisk.length" hint="分数大于等于68" />
      <MetricCard label="中风险人员" :value="mediumRisk.length" hint="分数45-67" />
      <MetricCard label="平均疲劳分" :value="avgScore" hint="连续工作、夜班、休息和周工时综合" />
      <MetricCard label="建议候补池" :value="backupCount" hint="低风险可用人员优先候补" />
    </div>

    <DataTable :columns="columns" :rows="riskRows as any">
      <template #score="{ row }">
        <b>{{ row.score }}</b>
      </template>
      <template #level="{ row }">
        <StatusBadge :text="row.level" :tone="row.level === '高' ? 'danger' : row.level === '中' ? 'warning' : 'success'" />
      </template>
      <template #reason="{ row }">
        <span class="reason-text">{{ row.reason }}</span>
      </template>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AssetImage from '@/components/AssetImage.vue'
import MetricCard from '@/components/MetricCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { crewMembers } from '@/mock/crew'
import { calculateFatigueScore, riskLevelFromScore } from '@/utils/scheduling'

const riskRows = computed(() =>
  crewMembers.map((crew) => {
    const score = calculateFatigueScore(crew)
    const reasons = [
      crew.continuousWorkMinutes > 220 ? '连续工作偏长' : '',
      crew.nightShifts7d >= 3 ? '夜班频次偏高' : '',
      crew.restIntervalMinutes < 480 ? '休息间隔不足' : '',
      crew.weeklyWorkMinutes > 2400 ? '近7日工时偏高' : ''
    ].filter(Boolean)
    return {
      ...crew,
      score,
      level: riskLevelFromScore(score),
      reason: reasons.length ? reasons.join('；') : '当前风险较低'
    }
  })
)

const highRisk = computed(() => riskRows.value.filter((row) => row.level === '高'))
const mediumRisk = computed(() => riskRows.value.filter((row) => row.level === '中'))
const avgScore = computed(() => Math.round(riskRows.value.reduce((sum, row) => sum + row.score, 0) / riskRows.value.length))
const backupCount = computed(() => riskRows.value.filter((row) => row.status === '可用' && row.level === '低').length)

const columns = [
  { key: 'name', label: '姓名' },
  { key: 'employeeNo', label: '工号' },
  { key: 'continuousWorkMinutes', label: '连续工作/分钟' },
  { key: 'weeklyWorkMinutes', label: '近7日工时/分钟' },
  { key: 'nightShifts7d', label: '夜班次数' },
  { key: 'restIntervalMinutes', label: '休息间隔/分钟' },
  { key: 'score', label: '疲劳风险分数' },
  { key: 'level', label: '风险等级' },
  { key: 'reason', label: '预警原因' }
]
</script>
