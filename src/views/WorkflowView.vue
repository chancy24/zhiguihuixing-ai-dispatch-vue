<template>
  <section class="page-stack">
    <div class="workflow-header module-hero">
      <div>
        <p class="kicker">排班工作流 · 北京地铁10号线</p>
        <h2>从时刻表到可复核排班方案</h2>
        <p>从 PR2003.xls 模拟导入，到数据清洗、站名转换、内外环分类、片段划分、规则校验、AI辅助排班、调度员确认与报告导出——完整闭环演示。</p>
        <div class="command-tags">
          <span>导入</span>
          <span>清洗</span>
          <span>校验</span>
          <span>AI建议</span>
          <span>人工确认</span>
        </div>
        <button class="primary-button" @click="runFullFlow">一键完成全流程演示</button>
      </div>
      <AssetImage asset-key="timetableFlow" alt="时刻表到排班方案流程图" variant="wide" caption="全流程闭环：导入、清洗、分类、片段、校验、AI排班、确认报告" />
    </div>

    <!-- 流程步骤条 -->
    <div class="workflow-progress">
      <button
        v-for="(step, index) in steps"
        :key="step.title"
        :class="{ active: current === index, done: step.done }"
        @click="current = index"
      >
        <b>{{ index + 1 }}</b>
        <span>{{ step.title }}</span>
      </button>
    </div>

    <!-- 当前步骤 -->
    <article class="workflow-stage">
      <div class="stage-main">
        <p class="kicker">步骤 {{ current + 1 }} / {{ steps.length }}</p>
        <h3>{{ activeStep.title }}</h3>
        <p>{{ activeStep.description }}</p>
        <div class="stage-actions">
          <button class="ghost-button small" :disabled="current === 0" @click="current--">上一步</button>
          <button class="primary-button small" @click="completeStep">执行本步骤</button>
          <button class="ghost-button small" :disabled="current === steps.length - 1" @click="current++">下一步</button>
        </div>
      </div>

      <div class="stage-result">
        <h3>处理结果</h3>
        <ul class="bullet-list">
          <li v-for="item in activeStep.results" :key="item">{{ item }}</li>
        </ul>
        <!-- 步骤5的规则解释 -->
        <div v-if="current === 4" style="margin-top:12px;padding:10px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;">
          <b style="font-size:13px;">规则校验说明</b>
          <span style="display:block;margin-top:6px;color:#64748b;font-size:12px;line-height:1.6;">
            连续工作上限240分钟 / 最低间休25分钟 / 最高间休150分钟 / 里程上限90km /
            午餐时段11:30-13:30需预留25分钟 / 出退勤地点仅限巴沟、宋家庄、五路、宋场、车道沟、公主坟、首经贸、三元桥、国贸
          </span>
        </div>
      </div>
    </article>

    <!-- 步骤4: 片段表格 -->
    <DataTable v-if="current === 3 || current === 4" :columns="segmentColumns" :rows="segments as any" :row-class="rowClass">
      <template #status="{ row }">
        <StatusBadge :text="row.status" :tone="row.status === '合规' ? 'success' : 'danger'" />
      </template>
      <template #reasons="{ row }">
        <span class="reason-text">{{ row.reasons.length ? row.reasons.join('；') : '无' }}</span>
      </template>
    </DataTable>

    <!-- 步骤5: 排班结果 -->
    <div v-if="current === 5" class="metric-grid four">
      <MetricCard label="方案合规率" :value="`${scheduleResult.complianceRate}%`" hint="硬约束通过率" />
      <MetricCard label="风险人数" :value="scheduleResult.riskCrewCount" hint="高疲劳风险降权处理" />
      <MetricCard label="工作量均衡度" :value="`${scheduleResult.balanceScore}%`" hint="累计工时均衡指标" />
      <MetricCard label="AI建议" value="3条" hint="最终由调度员确认" />
    </div>

    <!-- 步骤6: 确认与导出 -->
    <div v-if="current === 6" class="summary">
      <b>调度员确认与报告导出</b>
      <span>方案已进入确认态，报告可导出 TXT / JSON。当前演示数据仅用于路演，不写入真实运营系统。</span>
      <div class="dispatcher-confirm" style="margin:12px 0;">
        AI建议仅供辅助，最终方案需由调度员复核确认。
      </div>
      <div class="inline-actions">
        <button class="primary-button small" @click="confirmPlan">调度员确认方案</button>
        <button class="ghost-button small" @click="downloadTxtReport">导出TXT报告</button>
        <button class="ghost-button small" @click="downloadJsonReport">导出JSON报告</button>
      </div>
      <strong v-if="workflowConfirmed" style="color:#16a34a;">已记录调度员确认：本次仅为前端模拟操作。</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AssetImage from '@/components/AssetImage.vue'
import MetricCard from '@/components/MetricCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { crewMembers } from '@/mock/crew'
import { timetableRows } from '@/mock/timetable'
import { createSegmentsFromTimetable, generateSchedule } from '@/utils/scheduling'

const current = ref(0)
const segments = ref(createSegmentsFromTimetable(timetableRows))
const scheduleResult = computed(() => generateSchedule(segments.value, crewMembers))
const workflowConfirmed = ref(false)

const steps = ref([
  { title: '导入时刻表', done: false, description: '模拟导入 PR2003.xls / GTFS / CSV 格式时刻表数据。', results: ['已加载北京地铁10号线模拟时刻表，共12条记录。'] },
  { title: '数据清洗', done: false, description: '提取重要列、站名转换（缩写→中文全称）、空值检查、时间格式校验。', results: ['站名转换完成：BG→巴沟，SJZ→宋家庄，WLPL→五路，SJZPL→宋场。', '空值与格式检查通过。'] },
  { title: '内外环分类', done: false, description: '根据服务号或方向字段识别内环/外环车次。', results: ['内环 6 条，外环 6 条，异常 0 条。分类完成。'] },
  { title: '乘务片段划分', done: false, description: '根据服务号、车次、起终点、发到时间生成乘务片段，自动识别早班/白班/夜班。', results: ['已生成7个乘务片段，覆盖早班、白班、夜班。'] },
  { title: '规则校验', done: false, description: '校验连续工作时长、间休时长、出退勤地点组合、用餐时间和里程限制。', results: ['合规4个，不合规3个。不合规原因：间休不足、里程超限、午餐休息不足。'] },
  { title: 'AI辅助排班', done: false, description: '将片段列表与乘务员资源池匹配，优先满足硬约束，再平衡工作量与疲劳风险。', results: ['方案合规率85%，高风险人员已降权处理。', '需调度员复核高峰交路衔接和备用人员池。'] },
  { title: '确认与报告', done: false, description: '调度员确认方案、复核风险项、导出管理报告。', results: ['报告可导出TXT/JSON格式。', 'AI建议仅供辅助，最终方案需由调度员复核确认。'] }
])

const activeStep = computed(() => steps.value[current.value])

const segmentColumns = [
  { key: 'id', label: '片段编号' },
  { key: 'serviceNo', label: '服务号' },
  { key: 'shiftType', label: '班次' },
  { key: 'signOnStation', label: '出勤地点' },
  { key: 'signOffStation', label: '退勤地点' },
  { key: 'workMinutes', label: '工时/分钟' },
  { key: 'restMinutes', label: '间休/分钟' },
  { key: 'status', label: '校验状态' },
  { key: 'reasons', label: '错误原因' }
]

function toast(msg: string) {
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div')
    c.className = 'toast-container'
    document.body.appendChild(c)
    return c
  })()
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = msg
  container.appendChild(el)
  setTimeout(() => el.remove(), 2500)
}

function completeStep() {
  steps.value[current.value].done = true
  if (current.value < steps.value.length - 1) current.value += 1
}

async function runFullFlow() {
  const messages = [
    '已完成站名转换',
    '已完成内外环分类',
    '已生成乘务片段',
    '发现3处规则风险',
    '已生成AI辅助排班方案',
    '报告已生成'
  ]
  for (let i = 0; i < steps.value.length; i++) {
    steps.value[i].done = true
    current.value = i
    if (i < messages.length) toast(messages[i])
    await new Promise(r => setTimeout(r, 600))
  }
  toast('全流程演示完成——请调度员复核最终方案')
}

function rowClass(row: Record<string, any>) {
  return row.status === '不合规' ? 'danger-row' : ''
}

function confirmPlan() {
  workflowConfirmed.value = true
  toast('已记录调度员确认')
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function downloadTxtReport() {
  downloadFile(
    '智轨慧行_排班报告_北京地铁10号线.txt',
    '智轨慧行排班报告\n线路：北京地铁10号线（环线）\n场景：乘务轮乘图编制演示\n\n已完成：导入时刻表 → 数据清洗 → 内外环分类 → 片段划分 → 规则校验 → AI辅助排班 → 调度员确认\n\nAI建议仅供辅助，最终方案需由调度员复核确认。',
    'text/plain;charset=utf-8'
  )
}

function downloadJsonReport() {
  downloadFile(
    '智轨慧行_排班报告_北京地铁10号线.json',
    JSON.stringify({ project: '智轨慧行', line: '北京地铁10号线', lineType: '环线', steps: steps.value.map(s => ({ title: s.title, done: s.done })), confirmed: workflowConfirmed.value, disclaimer: 'AI建议仅供辅助，最终方案需由调度员复核确认。', generatedAt: new Date().toISOString() }, null, 2),
    'application/json;charset=utf-8'
  )
}
</script>
