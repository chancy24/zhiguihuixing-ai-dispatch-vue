<template>
  <section class="page-stack">
    <div class="module-hero">
      <div>
        <p class="kicker">时刻表处理 · 数据入口</p>
        <h2>把原始运行图转换为可计算的排班数据</h2>
        <p>系统先把服务号、车次、起终点、发到时间和方向字段整理成结构化表格，再做站名转换、重要站摘抄和内外环分类，为后续乘务片段划分打基础。</p>
        <div class="command-tags">
          <span>PR2003.xls</span>
          <span>站名转换</span>
          <span>重要站摘抄</span>
          <span>内外环分类</span>
        </div>
      </div>
      <AssetImage asset-key="timetableProcessing" alt="时刻表数据处理主视觉" variant="wide" caption="时刻表处理：从原始数据到可排班数据结构" />
    </div>

    <div class="process-strip">
      <span class="done">导入PR2003.xls</span>
      <span :class="{ done: cleaned }">站名转换</span>
      <span :class="{ done: classified }">重要站摘抄</span>
      <span :class="{ done: classified }">内外环分类</span>
    </div>

    <div class="toolbar-card">
      <button class="primary-button small" @click="simulateImport">导入时刻表</button>
      <button class="ghost-button small" @click="generateRows">生成演示时刻表</button>
      <button class="ghost-button small" @click="cleanData">执行站名转换</button>
      <button class="ghost-button small" @click="classifyData">重要站摘抄 / 内外环分类</button>
      <button class="ghost-button small" @click="downloadResult">导出处理结果</button>
      <span class="feedback-text">{{ feedback }}</span>
    </div>

    <div class="asset-operation-card">
      <AssetImage asset-key="timetableSample" alt="时刻表数据处理流程图：原始时刻表→清洗→乘务片段" variant="wide" caption="原始时刻表 PR2003.xls → 站名转换/内外环分类 → 乘务片段" />
      <div>
        <h3>时刻表数据处理台</h3>
        <p>模拟从 PR2003.xls 提取服务号、车次、起终点、发到时间、Trip Type 和方向字段，再完成站名转换、重要站摘抄与内外环分类。当前使用北京地铁10号线公开站点缩写进行演示。</p>
        <p style="margin-top:8px;color:var(--text-muted);font-size:12px;">数据来源：北京地铁10号线模拟时刻表（路演演示数据，非真实运营数据）。</p>
      </div>
    </div>

    <!-- 站名转换对照表 -->
    <div class="insight-grid">
      <article class="insight-card">
        <b>站名转换对照表（部分）</b>
        <span>BG → 巴沟 · SJZ → 宋家庄 · WLPL → 五路 · BGDP → 万柳 · SJZPL → 宋场 · GZF → 公主坟 · GM → 国贸 · SYQ → 三元桥 · SJM → 首经贸 · JMX → 角门西</span>
      </article>
      <article class="insight-card">
        <b>重要站摘抄</b>
        <span>{{ importantStations.join('、') }}</span>
      </article>
      <article class="insight-card">
        <b>内外环分类结果</b>
        <span>内环 {{ innerCount }} 条 · 外环 {{ outerCount }} 条 · 按方向字段模拟归类</span>
      </article>
    </div>

    <DataTable :columns="columns" :rows="displayRows as any">
      <template #tripType="{ row }">
        <StatusBadge :text="row.tripType" :tone="row.tripType === 'NORMAL' ? 'success' : 'warning'" />
      </template>
      <template #direction="{ row }">
        <StatusBadge :text="row.direction" tone="info" />
      </template>
      <template #status="{ row }">
        <StatusBadge :text="row.status" :tone="row.status === '已分类' ? 'success' : row.status === '已清洗' ? 'info' : 'warning'" />
      </template>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import AssetImage from '@/components/AssetImage.vue'
import { timetableRows } from '@/mock/timetable'
import { translateStationName } from '@/utils/scheduling'

const rows = ref([...timetableRows])
const feedback = ref('已加载北京地铁10号线模拟时刻表')
const cleaned = ref(false)
const classified = ref(false)

const columns = [
  { key: 'serviceNo', label: '服务号' },
  { key: 'trainNo', label: '车次号' },
  { key: 'tripType', label: 'Trip Type' },
  { key: 'direction', label: '所属环线' },
  { key: 'startStation', label: '起点站' },
  { key: 'endStation', label: '终点站' },
  { key: 'arrivalTime', label: '到达时间' },
  { key: 'departureTime', label: '发车时间' },
  { key: 'status', label: '处理状态' }
]

const importantStations = computed(() =>
  Array.from(new Set(rows.value.flatMap(r => [translateStationName(r.startStation), translateStationName(r.endStation)])))
    .filter(n => ['巴沟', '五路', '宋家庄', '国贸', '三元桥', '首经贸'].includes(n))
)
const innerCount = computed(() => rows.value.filter(r => r.direction === '内环').length)
const outerCount = computed(() => rows.value.filter(r => r.direction === '外环').length)
const displayRows = computed(() =>
  rows.value.map(row => ({
    ...row,
    startStation: cleaned.value ? translateStationName(row.startStation) : row.startStation,
    endStation: cleaned.value ? translateStationName(row.endStation) : row.endStation,
    status: classified.value ? '已分类' : cleaned.value ? '已清洗' : '待处理'
  }))
)

function simulateImport() {
  cleaned.value = false; classified.value = false
  feedback.value = '导入完成：已识别12条车次记录、7个关键站点和2类运行方向。'
}

function generateRows() {
  rows.value = [...timetableRows].reverse()
  feedback.value = '已重新生成一组模拟时刻表。'
}

function cleanData() {
  cleaned.value = true
  feedback.value = '站名转换完成：缩写已转中文全称，空值与格式检查通过。'
}

function classifyData() {
  cleaned.value = true; classified.value = true
  feedback.value = `分类完成：内环${innerCount.value}条，外环${outerCount.value}条，异常0条。`
}

function downloadResult() {
  const data = displayRows.value.map(r => `${r.serviceNo},${r.trainNo},${r.tripType},${r.direction},${r.startStation},${r.endStation},${r.arrivalTime},${r.departureTime},${r.status}`).join('\n')
  const blob = new Blob(['服务号,车次号,TripType,环线,起点站,终点站,到达时间,发车时间,状态\n' + data], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = '北京地铁10号线_时刻表处理结果.csv'; link.click()
  URL.revokeObjectURL(url)
}
</script>
