<template>
  <section class="page-stack">
    <div class="toolbar-card optimizer-toolbar">
      <div>
        <p class="kicker">智能排班 · 北京地铁10号线</p>
        <h3>智能排班工作台</h3>
        <span class="feedback-text">先生成候选方案，再由调度员选择推荐版本。系统只提供辅助建议，不直接写入真实运营系统。</span>
      </div>
      <div class="optimizer-toolbar-actions">
        <RouterLink to="/app/agent" class="ghost-button small">调度Agent复核</RouterLink>
        <button class="primary-button small" @click="runSchedule">生成候选方案</button>
      </div>
    </div>

    <!-- 调度中心场景图 -->
    <div class="dispatch-scene-card premium-scene-card">
      <AssetImage asset-key="aiCommandCenterPremium" alt="AI轨交调度指挥中心主视觉" variant="wide" caption="AI调度中枢：线路态势、片段匹配、候选方案和调度员确认统一呈现" />
      <div class="scene-overlay-panel">
        <b>候选方案生成逻辑</b>
        <span>先过硬约束，再做资源匹配、疲劳降权和高峰片段覆盖。</span>
        <span>所有输出均为辅助建议，最终由调度员确认。</span>
      </div>
    </div>

    <!-- 三种候选方案 -->
    <div class="scheme-board">
      <button
        v-for="scheme in candidateSchemes"
        :key="scheme.id"
        class="scheme-card"
        :class="{ active: selectedSchemeId === scheme.id }"
        @click="selectedSchemeId = scheme.id"
      >
        <span>{{ scheme.label }}</span>
        <b>{{ scheme.name }}</b>
        <small>{{ scheme.focus }}</small>
        <i>{{ scheme.recommended ? '推荐方案' : '' }}</i>
      </button>
    </div>

    <!-- 方案指标 -->
    <div v-if="selectedScheme" class="metric-grid four">
      <MetricCard label="合规率" :value="`${selectedScheme.metrics.safety}%`" hint="硬约束校验通过率" />
      <MetricCard label="工作量均衡度" :value="`${selectedScheme.metrics.balance}%`" hint="累计工时与班型平衡" />
      <MetricCard label="高风险人员数量" :value="selectedScheme.metrics.safety > 90 ? 1 : 2" hint="疲劳评分≥68分" />
      <MetricCard label="调整片段数" :value="selectedScheme.metrics.efficiency > 90 ? 2 : 3" hint="需调度员确认的片段" />
    </div>

    <!-- 三栏布局：片段 + 资源池 + 候选方案 -->
    <div class="optimizer-grid">
      <section class="panel-card">
        <h3>待排乘务片段</h3>
        <p class="panel-note">系统根据时刻表与规则先划分片段，再进入AI辅助匹配。红色片段需调度员重点复核。</p>
        <div class="list-stack">
          <article v-for="seg in segments" :key="seg.id" class="mini-row">
            <b>{{ seg.id }} · {{ seg.shiftType }}</b>
            <span>{{ seg.signOnStation }} → {{ seg.signOffStation }} · {{ seg.startTime }}-{{ seg.endTime }}</span>
            <em v-if="seg.status === '不合规'">{{ seg.reasons[0] }}</em>
          </article>
        </div>
      </section>

      <section class="panel-card">
        <h3>乘务员资源池</h3>
        <p class="panel-note">候选人员按可用状态、资质、今日工时和疲劳风险综合排序。</p>
        <div class="list-stack">
          <article v-for="crew in crews" :key="crew.id" class="mini-row">
            <b>{{ crew.name }} · {{ crew.employeeNo }}</b>
            <span>{{ crew.status }} · {{ crew.qualification }} · 夜班{{ crew.nightShifts7d }}次 · 风险{{ riskScore(crew) }}分</span>
          </article>
        </div>
      </section>

      <section class="panel-card">
        <h3>{{ selectedScheme?.name || '候选方案' }}</h3>
        <p>{{ selectedScheme?.description }}</p>
        <div class="scheme-metrics">
          <span>效率 {{ selectedScheme?.metrics.efficiency }}%</span>
          <span>安全 {{ selectedScheme?.metrics.safety }}%</span>
          <span>均衡 {{ selectedScheme?.metrics.balance }}%</span>
        </div>
        <div class="list-stack">
          <article v-for="(note, i) in (selectedScheme?.notes || [])" :key="i" class="mini-row">
            <b>{{ note }}</b>
          </article>
        </div>
      </section>
    </div>

    <!-- AI排班结果 -->
    <section class="panel-card">
      <div class="chart-head">
        <div>
          <h3>AI辅助排班结果</h3>
          <span>{{ feedback }}</span>
        </div>
        <span class="status-pill">当前方案：{{ selectedScheme?.name || '未选择' }}</span>
      </div>
      <div v-if="result" class="assignment-grid">
        <article v-for="asgn in result.assignments" :key="asgn.segmentId" class="mini-row">
          <b>{{ asgn.segmentId }} → {{ crewName(asgn.crewId) }}</b>
          <span>{{ asgn.reason }} · 置信度{{ asgn.confidence }}%</span>
          <em v-if="asgn.warning">{{ asgn.warning }}</em>
        </article>
      </div>
      <div v-else class="empty-state">点击"生成候选方案"，查看AI辅助排班结果。</div>
    </section>

    <!-- AI建议 -->
    <div v-if="result" class="summary">
      <b>AI建议说明</b>
      <span v-for="note in result.aiNotes" :key="note">{{ note }}</span>
      <span style="color:#64748b;font-size:12px;">当前选择"{{ selectedScheme?.name }}"，建议先用于路演与场景验证。</span>
    </div>

    <!-- 操作按钮 -->
    <div v-if="result" class="toolbar-card">
      <button class="primary-button small" @click="acceptScheme">采纳该方案</button>
      <button class="ghost-button small" @click="viewDetail">查看方案详情</button>
      <RouterLink to="/app/emergency" class="ghost-button small">进入应急重排</RouterLink>
      <div class="dispatcher-confirm">AI建议仅供辅助，最终方案需由调度员复核确认。</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MetricCard from '@/components/MetricCard.vue'
import AssetImage from '@/components/AssetImage.vue'
import { crewMembers } from '@/mock/crew'
import { seedSegments } from '@/mock/schedule'
import type { CrewMember, ScheduleResult } from '@/types/domain'
import { calculateFatigueScore, generateSchedule, validateDutySegment } from '@/utils/scheduling'

const segments = seedSegments.map(validateDutySegment)
const crews = crewMembers
const result = ref<ScheduleResult | null>(null)
const feedback = ref('待生成：系统将优先满足硬约束，再平衡工作量、疲劳风险和应急冗余。')
const selectedSchemeId = ref('balanced')

function toast(msg: string) {
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); return c
  })()
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg
  container.appendChild(el); setTimeout(() => el.remove(), 2500)
}

const candidateSchemes = [
  {
    id: 'efficiency', label: '方案A', name: '效率优先', focus: '快速覆盖所有片段，缩短人工调整时间',
    recommended: false, description: '适合临近发车、人工复核时间有限的场景，优先形成可执行初稿。',
    metrics: { efficiency: 94, safety: 82, balance: 79 },
    notes: ['缩短人工反复调整时间', '优先覆盖关键岗位', '部分人员工时需调度员复核']
  },
  {
    id: 'safety', label: '方案B', name: '安全优先', focus: '降低疲劳与超限风险，保障运营安全',
    recommended: false, description: '适合夜班、连续高峰或安全要求更高的运营日，优先规避高风险人员。',
    metrics: { efficiency: 82, safety: 96, balance: 86 },
    notes: ['高疲劳风险人员降权', '建议补充备用人员池', '适合安全复核演示']
  },
  {
    id: 'balanced', label: '方案C', name: '均衡推荐', focus: '效率、安全与均衡折中',
    recommended: true, description: '适合作为路演默认方案，既能解释规则，又能展示AI优化思路。',
    metrics: { efficiency: 90, safety: 91, balance: 89 },
    notes: ['效率与合规性较为均衡', '保留调度员确认环节', '便于生成管理报告']
  }
]

const selectedScheme = computed(() => candidateSchemes.find(s => s.id === selectedSchemeId.value) ?? candidateSchemes[2])

function runSchedule() {
  result.value = generateSchedule(segments, crews)
  feedback.value = 'AI辅助排班方案已生成：请复核高峰交路衔接、疲劳风险和备用人员池。'
  toast('已生成效率/安全/均衡三套候选方案')
}

function acceptScheme() {
  toast(`已采纳"${selectedScheme.value?.name}"方案，请进入调度员确认环节。`)
}

function viewDetail() {
  const summary = result.value ? `合规率${result.value.complianceRate}%，风险${result.value.riskCrewCount}人，均衡${result.value.balanceScore}%` : ''
  toast(`方案详情：${summary}`)
}

function crewName(id: string) { return crews.find(c => c.id === id)?.name ?? id }
function riskScore(crew: CrewMember) { return calculateFatigueScore(crew) }
</script>
