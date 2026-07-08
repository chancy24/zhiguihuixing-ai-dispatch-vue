<template>
  <section class="page-stack">
    <div class="module-hero">
      <div>
        <p class="kicker">方案解释 · 管理闭环</p>
        <h2>把 AI 建议沉淀为可交付、可复盘的调度报告</h2>
        <p>报告页不是简单导出文件，而是把今日概况、冲突原因、风险人员、AI依据和管理建议固定下来，方便现场讲解“调度员确认”和“事后复盘”。</p>
        <div class="command-tags">
          <span>冲突原因</span>
          <span>风险人员</span>
          <span>优化依据</span>
          <span>导出报告</span>
        </div>
      </div>
      <AssetImage asset-key="projectEvidenceWall" alt="项目基础证据墙" variant="wide" caption="报告闭环：规则证据、AI解释、管理建议、复盘归档" />
    </div>

    <div class="toolbar-card report-toolbar">
      <div>
        <p class="kicker">管理报告 · 北京地铁10号线</p>
        <h3>方案解释与管理报告</h3>
        <span class="feedback-text">报告由模拟排班结果生成，用于说明AI建议依据、冲突原因和人工复核事项。</span>
      </div>
      <div class="inline-actions">
        <button class="primary-button small" @click="downloadTxt">导出TXT</button>
        <button class="ghost-button small" @click="downloadJson">导出JSON</button>
        <button class="ghost-button small" @click="downloadMarkdown">导出Markdown</button>
      </div>
    </div>

    <div class="metric-grid four">
      <MetricCard label="报告章节" :value="reportSections.length" hint="概况、冲突、风险、建议" />
      <MetricCard label="待复核项" value="3项" hint="高峰衔接、疲劳人员、备用池" />
      <MetricCard label="导出格式" value="3种" hint="TXT / JSON / Markdown" />
      <MetricCard label="安全边界" value="人工确认" hint="AI不直接写入真实系统" />
    </div>

    <article class="report-card">
      <h2>智轨慧行 · 北京地铁10号线排班优化报告</h2>
      <p class="report-lead">本报告用于路演演示，基于前端模拟数据生成，展示"规则校验 + AI辅助建议 + 调度员确认 + 管理报告"的产品闭环。线路：北京地铁10号线（环线）· 场景：乘务轮乘图编制与应急调度演示。</p>
      <section v-for="section in reportSections" :key="section.title">
        <h3>{{ section.title }}</h3>
        <ul>
          <li v-for="(item, i) in section.items" :key="i">{{ item }}</li>
        </ul>
      </section>
      <div class="dispatcher-confirm" style="margin-top:20px;">
        本报告由前端模拟数据生成，用于路演演示。AI建议仅供辅助，最终方案需由调度员复核确认。不连接真实运营系统。
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import MetricCard from '@/components/MetricCard.vue'
import AssetImage from '@/components/AssetImage.vue'

const reportSections = [
  { title: '今日排班概况', items: ['模拟生成42项排班任务，形成7个核心乘务片段，覆盖北京地铁10号线内外环。', '当前方案合规率目标为85%以上，仍需调度员复核3个异常片段。'] },
  { title: '主要冲突', items: ['AUTO-002片段：连续工作时间230分钟，接近240分钟上限。', 'AUTO-005片段：累计里程89km，接近90km上限，建议拆分或更换短交路。', 'AUTO-003片段：间休仅22分钟，低于25分钟最低标准，需补充备用人员或调整退勤点。'] },
  { title: '已解决问题', items: ['完成站名转换：BG→巴沟、SJZ→宋家庄、WLPL→五路、SJZPL→宋场。', '完成内外环分类：内环6条、外环6条。', '动态重排模块可模拟乘务员请假、客流突增和列车延误三种场景。'] },
  { title: '风险人员', items: ['赵静（CR-05）近7日夜班4次、休息间隔仅6.5小时，建议降低后续夜班安排。', '王祺（CR-04）间休7.7小时偏短，建议安排更长间休。', '建议启用备班人员孙越（CR-09）作为早高峰补充。'] },
  { title: 'AI辅助优化依据', items: ['优先满足硬约束：连续工作时间≤240分钟、间休≥25分钟、里程≤90km。', '对高疲劳风险人员（评分≥68）降低分配权重，优先使用备班与低累计工时人员。', '出退勤地点限制：仅限巴沟/宋家庄/五路/宋场/车道沟/公主坟/首经贸/国贸/三元桥。'] },
  { title: '管理建议', items: ['建立候补池，覆盖早高峰与突发缺勤场景。', '将AI建议作为辅助决策依据，最终由值班主任或调度员确认。', '后续可接入真实规则库、权限审计和版本回滚机制。', '建议每日生成排班合规报告，记录调度员确认与例外审批。'] }
]

function buildText() {
  return reportSections.map(s => `${s.title}\n${s.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')
}

function buildMarkdown() {
  return `# 智轨慧行 · 北京地铁10号线排班优化报告\n\n${reportSections.map(s => `## ${s.title}\n${s.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}\n\n> 本报告由前端模拟数据生成，用于路演演示。AI建议仅供辅助，最终方案需由调度员复核确认。`
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = filename; link.click()
  URL.revokeObjectURL(url)
}

function downloadTxt() { download('智轨慧行_北京地铁10号线_排班报告.txt', buildText(), 'text/plain;charset=utf-8') }
function downloadJson() { download('智轨慧行_北京地铁10号线_排班报告.json', JSON.stringify(reportSections, null, 2), 'application/json;charset=utf-8') }
function downloadMarkdown() { download('智轨慧行_北京地铁10号线_排班报告.md', buildMarkdown(), 'text/markdown;charset=utf-8') }
</script>
