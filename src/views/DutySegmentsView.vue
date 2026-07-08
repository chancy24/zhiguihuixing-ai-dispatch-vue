<template>
  <section class="page-stack">
    <div class="module-hero">
      <div>
        <p class="kicker">乘务片段划分 · 规则引擎</p>
        <h2>把复杂排班规则变成可解释的校验结果</h2>
        <p>连续工作、间休、出退勤地点、用餐窗口、里程和内外环顺序会同步校验。页面不只标红异常，还给出可复核的原因，便于调度员快速定位问题。</p>
        <div class="command-tags">
          <span>片段划分</span>
          <span>早白夜班识别</span>
          <span>硬约束校验</span>
          <span>异常原因解释</span>
        </div>
      </div>
      <AssetImage asset-key="schedulingRuleEngine" alt="排班规则引擎示意图" variant="wide" caption="规则引擎：时刻表片段进入工时、间休、地点、里程多维校验" />
    </div>

    <!-- 规则校验范围 -->
    <div class="rule-panel">
      <h3>规则校验范围：</h3>
      <StatusBadge text="连续工作时间 ≤240分钟" tone="info" />
      <StatusBadge text="间休 ≥25分钟 ≤150分钟" tone="info" />
      <StatusBadge text="出退勤地点组合" tone="info" />
      <StatusBadge text="用餐时段(11:30-13:30)" tone="info" />
      <StatusBadge text="里程 ≤90km" tone="info" />
      <StatusBadge text="内外环运行顺序" tone="info" />
    </div>

    <!-- 片段划分与规则校验流程图 -->
    <div class="segment-flow-card">
      <AssetImage asset-key="segmentRuleFlow" alt="乘务片段划分规则校验流程图" variant="wide" caption="时刻表数据 → 片段划分 → 早白夜班识别 → 间休/出退勤校验 → 生成合规结果" />
    </div>

    <div class="toolbar-card">
      <button class="primary-button small" @click="divideSegments">一键划分乘务片段</button>
      <button class="ghost-button small" @click="validateAll">执行规则校验</button>
      <span class="feedback-text">{{ feedback }}</span>
    </div>

    <DataTable :columns="columns" :rows="segments as any" :row-class="rowClass" search-placeholder="搜索片段编号、站点、错误原因">
      <template #shiftType="{ row }">
        <StatusBadge :text="row.shiftType" :tone="row.shiftType === '夜班' ? 'warning' : 'info'" />
      </template>
      <template #status="{ row }">
        <StatusBadge :text="row.status" :tone="row.status === '合规' ? 'success' : row.status === '不合规' ? 'danger' : 'info'" />
      </template>
      <template #reasons="{ row }">
        <span class="reason-text">{{ row.reasons.length ? row.reasons.join('；') : '无' }}</span>
      </template>
    </DataTable>

    <!-- 错误原因说明 -->
    <div class="insight-grid" style="margin-top:4px;">
      <article class="insight-card">
        <b>常见不合规原因</b>
        <span>
          1. 连续工作时间超限（&gt;240分钟）<br/>
          2. 间休不足（&lt;25分钟）<br/>
          3. 午餐时段休息不足25分钟<br/>
          4. 晚餐时段休息不足25分钟<br/>
          5. 出退勤地点组合不合法<br/>
          6. 里程超限（&gt;90km）<br/>
          7. 违反内外环运行顺序
        </span>
      </article>
      <article class="insight-card">
        <b>班次识别规则</b>
        <span>
          早班：04:16 - 07:15 开始<br/>
          夜班：15:46 - 19:37 开始<br/>
          白班：其余时段<br/>
          识别依据：片段开始时间
        </span>
      </article>
      <article class="insight-card">
        <b>合法出退勤地点</b>
        <span>
          巴沟（车辆段连接站）<br/>
          宋家庄（车辆段）<br/>
          五路（车辆段）<br/>
          宋场（车辆段）<br/>
          车道沟（普通站）<br/>
          公主坟、首经贸、国贸、三元桥
        </span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AssetImage from '@/components/AssetImage.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { seedSegments } from '@/mock/schedule'
import { timetableRows } from '@/mock/timetable'
import type { DutySegment } from '@/types/domain'
import { createSegmentsFromTimetable, validateDutySegment } from '@/utils/scheduling'

const segments = ref<DutySegment[]>(seedSegments)
const feedback = ref('当前展示为初始片段，点击按钮可模拟划分与校验。')

const columns = [
  { key: 'id', label: '片段编号' },
  { key: 'serviceNo', label: '服务号' },
  { key: 'shiftType', label: '班次类型' },
  { key: 'signOnStation', label: '出勤地点' },
  { key: 'signOffStation', label: '退勤地点' },
  { key: 'startTime', label: '开始时间' },
  { key: 'endTime', label: '结束时间' },
  { key: 'workMinutes', label: '连续工作/分钟' },
  { key: 'restMinutes', label: '间休/分钟' },
  { key: 'mileageKm', label: '里程/km' },
  { key: 'status', label: '校验状态' },
  { key: 'reasons', label: '错误原因' }
]

function divideSegments() {
  segments.value = createSegmentsFromTimetable(timetableRows)
  feedback.value = `已根据${timetableRows.length}条时刻表记录生成${segments.value.length}个乘务片段。`
}

function validateAll() {
  segments.value = segments.value.map(validateDutySegment)
  const invalid = segments.value.filter(s => s.status === '不合规').length
  feedback.value = `校验完成：发现${invalid}个需要调度员复核的片段，具体错误原因见表格。`
}

function rowClass(row: Record<string, any>) {
  return row.status === '不合规' ? 'danger-row' : ''
}
</script>
