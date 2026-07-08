<template>
  <section class="page-stack presentation-page">
    <div class="presentation-hero premium-presentation-hero">
      <div>
        <p class="kicker">路演模式 · 北京地铁10号线场景</p>
        <h2>5分钟讲清一个可运行的 AI 调度产品</h2>
        <p>从“线网复杂、规则复杂、临时变化复杂”切入，用一条演示路径串联：时刻表导入、片段划分、规则冲突、AI候选方案、应急重排、Agent解释和报告输出。</p>
        <div class="presentation-hero-actions">
          <RouterLink to="/app/workflow" class="primary-button">从排班工作流开始</RouterLink>
          <RouterLink to="/app/dashboard" class="ghost-button small">返回驾驶舱</RouterLink>
        </div>
      </div>
      <AssetImage asset-key="aiCommandCenterPremium" alt="AI轨交调度指挥中心主视觉" variant="hero" caption="路演主视觉：AI轨交调度指挥中心" />
    </div>

    <!-- 路演步骤卡片 -->
    <div class="presentation-grid">
      <RouterLink v-for="item in flow" :key="item.path" :to="item.path" class="presentation-card">
        <span>{{ item.step }}</span>
        <b>{{ item.title }}</b>
        <p>{{ item.text }}</p>
      </RouterLink>
    </div>

    <!-- 北京地铁10号线示意图 -->
    <section class="metro-card premium-map-card" style="margin-top:8px;">
      <div class="chart-head">
        <div>
          <h3>真实线网复杂度</h3>
          <span>展示项目为什么需要从规则化工具升级为 AI 辅助调度系统</span>
        </div>
      </div>
      <div class="network-preview large">
        <img src="/assets/real/subway/beijing-rail-transit-config-sierraqin.svg" alt="北京轨道交通线路配置图" />
      </div>
    </section>

    <!-- 一键演示按钮 -->
    <section class="panel-card" style="text-align:center;">
      <h3>现场演示控制台</h3>
      <p style="color:#64748b;font-size:14px;margin:8px 0 16px;">点击下方按钮，模拟完整业务流程演示</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
        <button class="primary-button small" @click="demoStep('import')">导入时刻表</button>
        <button class="primary-button small" @click="demoStep('segments')">划分乘务片段</button>
        <button class="primary-button small" @click="demoStep('validate')">发现规则风险</button>
        <button class="primary-button small" @click="demoStep('schedule')">生成AI排班方案</button>
        <button class="primary-button small" @click="demoStep('emergency')">模拟应急重排</button>
        <button class="primary-button small" @click="demoStep('report')">生成报告</button>
      </div>
      <div class="dispatcher-confirm" style="margin-top:16px;display:inline-block;">
        AI建议仅供辅助，最终方案需由调度员复核确认。
      </div>
    </section>

    <!-- 路演结构说明 -->
    <section class="panel-card">
      <h3>路演演示结构</h3>
      <div class="list-stack">
        <article class="mini-row"><b>1. 项目定位</b><span>面向城市轨道交通乘务排班与应急调度的AI辅助系统——解决"规则复杂、人工排班耗时、应急响应慢"的痛点。</span></article>
        <article class="mini-row"><b>2. 北京地铁10号线场景</b><span>以北京地铁10号线（环线·57.1km·45站）为真实场景，展示内外环乘务轮乘图编制完整流程。</span></article>
        <article class="mini-row"><b>3. 原有规则化系统基础</b><span>基于PR2003.xls时刻表格式，展示站名转换、重要站摘抄、内外环分类、片段划分和多维规则校验。</span></article>
        <article class="mini-row"><b>4. AI化升级方向</b><span>在规则引擎基础上叠加AI辅助排班、动态重排、疲劳风险预警和结构化Agent助手。</span></article>
        <article class="mini-row"><b>5. 一键演示业务流程</b><span>导入→清洗→分类→片段→校验→排班→重排→报告，全流程在前端一键跑通。</span></article>
        <article class="mini-row"><b>6. OPC共创模式赋能</b><span>小团队×AI工具×产业场景×OPC生态，从可演示MVP到行业可复制产品的四阶段升级路径。</span></article>
        <article class="mini-row"><b>7. 未来拓展价值</b><span>从轨交扩展到公交、铁路、医疗、制造等强约束排班场景——跨行业排班优化平台。</span></article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AssetImage from '@/components/AssetImage.vue'

const router = useRouter()

function toast(msg: string) {
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); return c
  })()
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg
  container.appendChild(el); setTimeout(() => el.remove(), 2500)
}

const flow = [
  { step: '01', title: '登录进入系统', text: '了解系统定位为AI辅助排班MVP演示版。', path: '/login' },
  { step: '02', title: '首页驾驶舱', text: '看今日任务、冲突、风险和数据来源。', path: '/app/dashboard' },
  { step: '03', title: '时刻表处理', text: '演示站名转换、重要站摘抄、内外环分类。', path: '/app/timetable' },
  { step: '04', title: '片段划分校验', text: '展示间休不足、工时超限等具体错误原因。', path: '/app/segments' },
  { step: '05', title: '智能排班', text: '对比效率、安全、均衡三套候选方案。', path: '/app/optimizer' },
  { step: '06', title: '应急重排', text: '模拟2名乘务员请假后的替换建议。', path: '/app/emergency' },
  { step: '07', title: 'Agent助手', text: '结构化输出异常识别、约束和推荐操作。', path: '/app/agent' },
  { step: '08', title: '报告与OPC', text: '导出报告并说明OPC四阶段验证路径。', path: '/app/report' }
]

async function demoStep(type: string) {
  const steps: Record<string, { msg: string; path: string }> = {
    import: { msg: '正在导入北京地铁10号线时刻表...', path: '/app/timetable' },
    segments: { msg: '正在根据时刻表生成乘务片段...', path: '/app/segments' },
    validate: { msg: '正在执行规则校验...', path: '/app/segments' },
    schedule: { msg: '正在生成AI辅助排班方案...', path: '/app/optimizer' },
    emergency: { msg: '正在模拟应急重排...', path: '/app/emergency' },
    report: { msg: '正在生成管理报告...', path: '/app/report' }
  }
  const step = steps[type]
  if (!step) return
  toast(step.msg)
  await new Promise(r => setTimeout(r, 350))
  router.push(step.path)
}
</script>
