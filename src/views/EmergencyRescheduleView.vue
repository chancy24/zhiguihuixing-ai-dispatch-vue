<template>
  <section class="page-stack">
    <!-- 影响范围图 -->
    <div class="impact-map-card">
      <AssetImage asset-key="emergencyImpact" alt="北京地铁10号线应急重排影响范围图" variant="hero" caption="事件触发后高亮受影响站点与替补建议方向（基于10号线环线）" />
    </div>

    <!-- 三栏应急操作台 -->
    <div class="emergency-board">
      <!-- 左侧：事件输入 -->
      <section class="panel-card">
        <p class="kicker">调度事件输入</p>
        <h3>选择应急事件</h3>
        <div class="event-list">
          <button
            v-for="event in emergencyEvents"
            :key="event.type"
            class="event-button compact"
            :class="{ active: selectedEvent === event.type }"
            @click="trigger(event.type)"
          >
            <b>{{ event.title }}</b>
            <span>{{ event.description }}</span>
          </button>
        </div>
        <textarea v-model="dispatcherNote" class="demo-input compact-input" placeholder="调度员备注..."></textarea>
      </section>

      <!-- 中间：影响分析 -->
      <section class="panel-card">
        <p class="kicker">影响分析</p>
        <h3>影响范围</h3>
        <ul class="bullet-list">
          <li v-for="item in result.recognized" :key="item">{{ item }}</li>
        </ul>
        <div class="impact-strip">
          <span>影响片段 {{ result.affectedSegments.length }}</span>
          <span>涉及人员 {{ result.affectedCrew.length }}</span>
          <span>推荐替补 {{ result.replacements.length }}</span>
        </div>
        <div v-if="result.risks.length" style="margin-top:12px;">
          <b style="font-size:13px;">约束风险</b>
          <ul class="bullet-list">
            <li v-for="risk in result.risks" :key="risk">{{ risk }}</li>
          </ul>
        </div>
      </section>

      <!-- 右侧：重排建议 -->
      <section class="panel-card">
        <p class="kicker">重排建议</p>
        <h3>AI替换建议</h3>
        <div class="list-stack">
          <article v-for="item in result.after" :key="item" class="mini-row">
            <b>{{ item }}</b>
          </article>
        </div>
      </section>
    </div>

    <!-- 受影响人员 + 替换建议 -->
    <div class="reschedule-grid">
      <section class="panel-card">
        <h3>受影响乘务员</h3>
        <div class="list-stack">
          <article v-for="crew in result.affectedCrew" :key="crew.id" class="mini-row">
            <b>{{ crew.name }} · {{ crew.employeeNo }}</b>
            <span>{{ crew.team }} · {{ crew.status }} · 疲劳风险{{ crew.fatigueRisk }}</span>
          </article>
        </div>
      </section>

      <section class="panel-card">
        <h3>推荐替换人员</h3>
        <div class="list-stack">
          <article v-for="crew in result.replacements" :key="crew.id" class="mini-row">
            <b>{{ crew.name }} · {{ crew.qualification }}</b>
            <span>今日工时{{ crew.todayWorkMinutes }}分钟 · 夜班{{ crew.nightShifts7d }}次 · 间休{{ crew.restIntervalMinutes }}分钟</span>
          </article>
        </div>
      </section>

      <section class="panel-card warning-summary">
        <h3>人工确认项</h3>
        <ul class="bullet-list">
          <li>确认替换片段是否覆盖关键岗位</li>
          <li>确认备用人员是否可到岗</li>
          <li>确认后再进入报告与交接记录</li>
        </ul>
        <button class="primary-button small" @click="confirmPlan" style="margin-top:12px;">调度员确认本次重排</button>
      </section>
    </div>

    <!-- 重排前后对比 -->
    <div class="compare-card">
      <div>
        <h3>重排前</h3>
        <p v-for="item in result.before" :key="item">{{ item }}</p>
      </div>
      <div>
        <h3>重排后</h3>
        <p v-for="item in result.after" :key="item">{{ item }}</p>
      </div>
    </div>

    <!-- 确认记录 -->
    <section class="panel-card">
      <h3>调度员确认记录</h3>
      <div v-if="confirmationRecords.length" class="list-stack">
        <article v-for="(rec, i) in confirmationRecords" :key="i" class="mini-row">
          <b>{{ rec }}</b>
          <span>记录仅保存在前端演示状态中，用于说明"AI建议 + 人工确认"的安全边界。</span>
        </article>
      </div>
      <div v-else class="empty-state">尚未确认任何重排方案。</div>
      <div class="dispatcher-confirm" style="margin-top:12px;">AI建议仅供辅助，最终方案需由调度员复核确认。</div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AssetImage from '@/components/AssetImage.vue'
import { emergencyEvents } from '@/mock/events'
import type { EventType } from '@/types/domain'
import { simulateReschedule } from '@/utils/scheduling'

const selectedEvent = ref<EventType>('leave')
const dispatcherNote = ref('明天早高峰有2名乘务员请假，请在满足工时和休息约束的前提下重新生成排班方案。')
const confirmationRecords = ref<string[]>([])
const result = computed(() => simulateReschedule(selectedEvent.value))

function toast(msg: string) {
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); return c
  })()
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg
  container.appendChild(el); setTimeout(() => el.remove(), 2500)
}

function trigger(type: EventType) {
  selectedEvent.value = type
  const event = emergencyEvents.find(e => e.type === type)
  dispatcherNote.value = event ? `${event.title}：${event.description}` : dispatcherNote.value
  toast(`已触发：${event?.title || '应急事件'}`)
}

function confirmPlan() {
  const event = emergencyEvents.find(e => e.type === selectedEvent.value)
  confirmationRecords.value.unshift(`${new Date().toLocaleTimeString()} 已确认：${event?.title ?? '调度事件'} —— 调度员已复核`)
  toast('已记录调度员确认')
}
</script>
