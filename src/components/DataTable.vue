<template>
  <div class="data-table-shell">
    <div class="table-tools">
      <input v-model="keyword" class="search-input" :placeholder="searchPlaceholder" />
      <select v-model="statusFilter">
        <option value="">全部状态</option>
        <option v-for="item in statusOptions" :key="item" :value="item">{{ item }}</option>
      </select>
      <select v-model="riskFilter">
        <option value="">全部风险</option>
        <option v-for="item in riskOptions" :key="item" :value="item">{{ item }}</option>
      </select>
      <span>{{ filteredRows.length }} / {{ rows.length }} 条</span>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" @click="$emit('sort', column.key)">
              {{ column.label }}
              <span v-if="column.sortable" class="sort-mark">↕</span>
            </th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody v-if="filteredRows.length">
          <template v-for="(row, index) in filteredRows" :key="row.id ?? index">
            <tr :class="rowClass?.(row)" @click="toggleRow(row, index)">
              <td v-for="column in columns" :key="column.key">
                <slot :name="column.key" :row="row">
                  {{ formatCell(row[column.key]) }}
                </slot>
              </td>
              <td>
                <button class="ghost-button tiny" @click.stop="copyRow(row)">复制</button>
              </td>
            </tr>
            <tr v-if="expandedKey === getKey(row, index)" class="detail-row">
              <td :colspan="columns.length + 1">
                <pre>{{ JSON.stringify(row, null, 2) }}</pre>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length + 1">
              <div class="empty-table">没有匹配数据，请调整搜索或筛选条件。</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

const props = withDefaults(defineProps<{
  columns: Column[]
  rows: Record<string, any>[]
  rowClass?: (row: Record<string, any>) => string
  searchPlaceholder?: string
}>(), {
  searchPlaceholder: '搜索表格内容'
})

defineEmits<{
  sort: [key: string]
}>()

const keyword = ref('')
const statusFilter = ref('')
const riskFilter = ref('')
const expandedKey = ref('')

const statusOptions = computed(() => uniqueValues(['status', 'checkStatus', 'state']))
const riskOptions = computed(() => uniqueValues(['level', 'fatigueRisk', 'riskLevel']))

const filteredRows = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  return props.rows.filter((row) => {
    const text = JSON.stringify(row).toLowerCase()
    const status = String(row.status ?? row.checkStatus ?? row.state ?? '')
    const risk = String(row.level ?? row.fatigueRisk ?? row.riskLevel ?? '')
    return (!key || text.includes(key)) && (!statusFilter.value || status === statusFilter.value) && (!riskFilter.value || risk === riskFilter.value)
  })
})

function uniqueValues(keys: string[]) {
  return Array.from(
    new Set(
      props.rows
        .flatMap((row) => keys.map((key) => row[key]))
        .filter((value) => value !== undefined && value !== null && value !== '')
        .map(String)
    )
  )
}

function formatCell(value: unknown) {
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (Array.isArray(value)) return value.join('；')
  return value ?? '-'
}

function getKey(row: Record<string, any>, index: number) {
  return String(row.id ?? index)
}

function toggleRow(row: Record<string, any>, index: number) {
  const key = getKey(row, index)
  expandedKey.value = expandedKey.value === key ? '' : key
}

async function copyRow(row: Record<string, any>) {
  const text = JSON.stringify(row, null, 2)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    document.body.removeChild(area)
  }
}
</script>
