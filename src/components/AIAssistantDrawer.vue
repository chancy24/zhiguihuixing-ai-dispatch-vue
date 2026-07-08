<template>
  <div>
    <button class="ai-float-button" @click="open = true">调度助手</button>
    <div v-if="open" class="drawer-mask" @click.self="open = false">
      <aside class="ai-drawer">
        <header>
          <div>
            <p class="top-kicker">轨交调度Agent</p>
            <h3>调度辅助工作台</h3>
          </div>
          <button class="ghost-button tiny" @click="open = false">关闭</button>
        </header>

        <div class="context-box">
          <b>当前页面</b>
          <span>{{ currentTitle }}</span>
        </div>

        <div class="assistant-answer">
          <article v-for="block in suggestions" :key="block.title">
            <b>{{ block.title }}</b>
            <p>{{ block.text }}</p>
          </article>
        </div>

        <textarea v-model="question" class="demo-input" rows="4"></textarea>
        <button class="primary-button small" @click="reply">生成调度建议</button>
        <p v-if="customReply" class="assistant-custom">{{ customReply }}</p>

        <div class="dispatcher-confirm" style="margin-top:8px;">
          AI建议仅供辅助，最终方案需由调度员复核确认。
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const question = ref('请根据当前页面提示下一步操作和需要调度员复核的风险。')
const customReply = ref('')

const titles: Record<string, string> = {
  dashboard: '首页驾驶舱',
  workflow: '排班工作流',
  timetable: '时刻表管理',
  segments: '乘务片段划分',
  optimizer: '智能排班',
  emergency: '应急重排',
  report: '方案解释报告',
  opc: 'OPC共创赋能',
  presentation: '路演模式',
  lines: '线路基础管理',
  fatigue: '疲劳风险预警'
}

const currentTitle = computed(() => titles[String(route.name)] ?? '业务页面')

const suggestions = computed(() => {
  const name = String(route.name)
  if (name === 'timetable') {
    return [
      { title: '异常识别', text: '优先检查站名缩写、空值和跨天时间格式。' },
      { title: '推荐操作', text: '先执行站名转换，再做重要站摘抄和内外环分类。' },
      { title: '调度员确认', text: '转换结果应抽查关键站，如 BG→巴沟、SJZ→宋家庄、WLPL→五路。' }
    ]
  }
  if (name === 'segments') {
    return [
      { title: '异常识别', text: '重点查看间休不足、连续工作超限、出退勤地点组合不合法和午餐休息不足。' },
      { title: '推荐操作', text: '对红色片段展开详情，确认是否需要拆分片段或调整出退勤站。' },
      { title: '调度员确认', text: '规则校验结果仅供参考，规则边界与例外情况仍需调度员复核。' }
    ]
  }
  if (name === 'optimizer') {
    return [
      { title: '异常识别', text: '高疲劳风险人员应降权，连续夜班人员不宜优先分配。' },
      { title: '推荐操作', text: '对比效率优先、安全优先、均衡推荐三套候选方案。' },
      { title: '调度员确认', text: '推荐方案需检查高峰关键岗位连续覆盖和备用人员池。' }
    ]
  }
  if (name === 'emergency') {
    return [
      { title: '异常识别', text: '分析受影响片段、涉及乘务员和可用替补资源。' },
      { title: '推荐操作', text: '优先使用备班人员中的低风险人员。' },
      { title: '调度员确认', text: '确认前需复核交路衔接、休息间隔和替换人员资质。' }
    ]
  }
  if (name === 'report') {
    return [
      { title: '汇报建议', text: '先讲排班概况，再讲冲突、已解决问题、风险人员和管理建议。' },
      { title: '导出建议', text: 'TXT适合复制到汇报稿，Markdown适合整理成项目文档。' },
      { title: '调度员确认', text: '报告中的风险人员名单应在正式展示前再次核对。' }
    ]
  }
  return [
    { title: '下一步建议', text: '建议按排班工作流顺序：导入→清洗→分类→片段划分→规则校验→AI辅助排班→确认与报告。' },
    { title: '风险提示', text: '当前为模拟数据，所有AI建议都应视为辅助参考。' },
    { title: '调度员确认', text: '最终方案由调度员确认，不直接替代真实调度系统。' }
  ]
})

function reply() {
  customReply.value = `已结合"${currentTitle.value}"生成建议：先完成当前步骤的批量操作，再查看状态标签和错误原因，最后由调度员确认后进入下一步。`
}
</script>
