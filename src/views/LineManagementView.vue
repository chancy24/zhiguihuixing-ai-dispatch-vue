<template>
  <section class="page-stack">
    <div class="toolbar-card">
      <input v-model="keyword" class="search-input" placeholder="查询站点名称、代码或方向" />
      <button class="primary-button small" @click="addStation">新增站点</button>
      <span class="feedback-text">北京地铁10号线 · {{ lineStations.length }}座车站 · 环线 · 全长{{ line.lineLengthKm }}公里</span>
    </div>

    <div class="line-map-card premium-map-card">
      <div class="chart-head">
        <div>
          <h3>北京轨道交通线网总览</h3>
          <span>高密度 SVG 源图用于路演空间感，10号线环线用于本系统排班演示</span>
        </div>
        <span class="status-pill">CC BY-SA 4.0 · 本地副本</span>
      </div>
      <AssetImage asset-key="beijingRailTransitConfigMap" alt="北京轨道交通线路配置图" variant="hero" caption="北京轨道交通线路配置图（SierraQin/metro，CC BY-SA 4.0）" />
    </div>

    <!-- 10号线演示线路图 -->
    <div class="line-map-card">
      <div class="chart-head">
        <div>
          <h3>10号线排班演示线</h3>
          <span>站点、出退勤点和换乘节点作为排班规则校验的基础数据</span>
        </div>
      </div>
      <AssetImage asset-key="line10Map" alt="北京地铁10号线简化线路图" variant="wide" caption="北京地铁10号线简化线路示意图（自绘，依据公开站点信息）" />
      <div class="line-map-legend">
        <span><i class="legend-dot duty"></i>出退勤点</span>
        <span><i class="legend-dot transfer"></i>换乘站</span>
        <span><i class="legend-dot normal"></i>普通站</span>
        <span class="legend-tip">点击下方站点可查看详情</span>
      </div>
    </div>

    <!-- 站点交互：点击高亮 -->
    <div class="station-chips-wrap">
      <p class="kicker">站点联动 · 点击查看详情</p>
      <div class="station-chips">
        <button
          v-for="st in lineStations"
          :key="st.stationId"
          class="station-chip"
          :class="{
            selected: selectedId === st.stationId,
            duty: st.canSignOn,
            transfer: st.transferLines.length > 0
          }"
          @click="selectStation(st.stationId)"
        >
          <span class="seq">{{ st.sequence }}</span>
          <span class="nm">{{ st.name }}</span>
          <span class="cd">{{ st.englishCode }}</span>
        </button>
      </div>
    </div>

    <!-- 选中站点详情 -->
    <div v-if="selected" class="station-detail-grid">
      <article class="insight-card">
        <b>站点信息</b>
        <span>{{ selected.name }}（{{ selected.englishCode }}）· 序号 {{ selected.sequence }} · {{ selected.ringDirection }}</span>
        <span>类型：{{ selected.stationType }}{{ selected.canSignOn ? ' · 出退勤点' : '' }}</span>
        <span>换乘线路：{{ selected.transferLines.length ? selected.transferLines.join('、') : '无（普通站）' }}</span>
        <span v-if="selected.note">备注：{{ selected.note }}</span>
      </article>
      <article class="insight-card">
        <b>运营属性</b>
        <span>出勤：{{ selected.canSignOn ? '✓ 可出勤' : '— 不可出勤' }}</span>
        <span>退勤：{{ selected.canSignOff ? '✓ 可退勤' : '— 不可退勤' }}</span>
        <span>站点ID：{{ selected.stationId }}</span>
        <span class="muted">数据来源：北京地铁10号线公开站点信息（演示数据）</span>
      </article>
    </div>

    <!-- 可编辑站点表（演示CRUD） -->
    <DataTable :columns="columns" :rows="filteredStations as any" @sort="sortBy">
      <template #type="{ row }">
        <StatusBadge :text="row.type" tone="info" />
      </template>
      <template #isDutyPoint="{ row }">
        <StatusBadge :text="row.isDutyPoint ? '出退勤点' : '普通站点'" :tone="row.isDutyPoint ? 'success' : 'info'" />
      </template>
      <template #actions="{ row }">
        <div class="inline-actions">
          <button class="ghost-button tiny" @click="editStation(row.id)">编辑</button>
          <button class="ghost-button tiny danger-text" @click="deleteStation(row.id)">删除</button>
        </div>
      </template>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AssetImage from '@/components/AssetImage.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { stations as stationSeed } from '@/mock/stations'
import { stations as lineStations, lineInfo as line } from '@/mock/beijingLine10'
import type { Station } from '@/types/domain'

const keyword = ref('')
const sortKey = ref<keyof Station>('distanceKm')
const stationList = ref<Station[]>([...stationSeed])
const selectedId = ref(lineStations[0]?.stationId ?? '')

const selected = computed(() => lineStations.find(s => s.stationId === selectedId.value))

const columns = [
  { key: 'name', label: '车站名称', sortable: true },
  { key: 'code', label: '英文缩写', sortable: true },
  { key: 'type', label: '站点类型' },
  { key: 'isDutyPoint', label: '出退勤点' },
  { key: 'distanceKm', label: '站间距/km', sortable: true },
  { key: 'direction', label: '所属方向', sortable: true },
  { key: 'actions', label: '操作' }
]

const filteredStations = computed(() => {
  const key = keyword.value.trim()
  return stationList.value
    .filter((station) => !key || `${station.name}${station.code}${station.direction}${station.type}`.includes(key))
    .sort((a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value]), 'zh-CN', { numeric: true }))
})

function sortBy(key: string) {
  sortKey.value = key as keyof Station
}

function selectStation(id: string) {
  selectedId.value = id
}

function addStation() {
  stationList.value.unshift({
    id: `ST-${Date.now()}`,
    name: '临时折返演示站',
    code: 'TMP',
    type: '折返站',
    isDutyPoint: true,
    distanceKm: 3.2,
    direction: '内环'
  })
}

function editStation(id: string) {
  const station = stationList.value.find((item) => item.id === id)
  if (station) station.type = station.type === '普通站' ? '换乘站' : '普通站'
}

function deleteStation(id: string) {
  stationList.value = stationList.value.filter((station) => station.id !== id)
}
</script>
