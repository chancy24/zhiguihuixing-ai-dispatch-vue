<template>
  <section class="page-stack">
    <div class="opc-hero opc-visual-hero">
      <AssetImage asset-key="opcCoCreationEcosystem" alt="OPC共创生态示意图" variant="wide" caption="OPC共创生态：小团队、AI工具、场景验证和产业资源协同" />
      <div>
        <p class="kicker">OPC共创赋能</p>
        <h2>OPC共创模式下的AI化升级路径</h2>
        <p>项目依托"小团队 + AI工具 + 场景验证 + 产业资源"路径，先把可演示、可解释、可验证的MVP做扎实，再逐步走向真实规则库接入与行业复制。</p>
      </div>
    </div>

    <div class="card-grid opc-keywords">
      <article v-for="item in opcItems" :key="item.title" class="card">
        <div class="card-num">{{ item.no }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>

    <div class="opc-matrix">
      <article v-for="item in resourceMatrix" :key="item.resource" class="matrix-card">
        <b>{{ item.resource }}</b>
        <span>{{ item.value }}</span>
      </article>
    </div>

    <div class="asset-operation-card">
      <AssetImage asset-key="agentWorkflow" alt="OPC资源到项目升级路径" variant="compact" caption="资源输入到产品升级路径" />
      <div>
        <h3>OPC资源与项目升级路径</h3>
        <p>路演展示、创业辅导、弹性算力、AI工具链、高校资源、产业方和轨交应用场景，都可以转化为"规则库完善、Agent工程化、场景试点和商业合作"的下一阶段输入。</p>
      </div>
    </div>

    <div class="timeline roadmap-opc">
      <article v-for="phase in phases" :key="phase.title">
        <span>{{ phase.time }}</span>
        <b>{{ phase.title }}</b>
        <p>{{ phase.text }}</p>
      </article>
    </div>

    <p class="final-slogan compact-slogan">小团队 × AI工具 × 产业场景 × OPC生态 = 新一代交通智能调度创业样板</p>
  </section>
</template>

<script setup lang="ts">
import AssetImage from '@/components/AssetImage.vue'

const opcItems = [
  { no: '01', title: '轻量启动', text: '完成可演示MVP，跑通导入、清洗、片段划分、校验、AI建议和报告导出。' },
  { no: '02', title: '敏捷试错', text: '快速测试排班Agent、动态重排、疲劳预警等模块，验证AI排班与重排能力。' },
  { no: '03', title: '工具赋能', text: '接入算力、Agent、大模型与数据工具，提升AI辅助决策质量。' },
  { no: '04', title: '生态链接', text: '对接轨交、公交、铁路、医疗、制造等场景，拓展行业应用价值。' }
]

const resourceMatrix = [
  { resource: '空间支持', value: '路演展示、团队办公、创业交流' },
  { resource: '服务支持', value: '创业辅导、政策咨询、产品打磨、路演优化' },
  { resource: '工具支持', value: '弹性算力、AI工具链、Agent能力、模型开发' },
  { resource: '生态支持', value: '高校资源、产业方、投资机构、轨交应用场景' },
  { resource: '技术支持', value: '算法建模、数据治理、大模型应用、AI工程化' },
  { resource: '产业支持', value: '地铁场景验证、跨行业排班迁移、客户资源链接' }
]

const phases = [
  { time: '第1阶段', title: '轻量启动，完成可演示MVP', text: '跑通导入、清洗、片段划分、校验、AI建议和报告导出，形成可路演演示的闭环系统。' },
  { time: '第2阶段', title: '敏捷试错，验证AI排班与重排能力', text: '沉淀可配置规则库、版本对比和调度员确认流程，快速测试排班Agent核心能力。' },
  { time: '第3阶段', title: '工具赋能，接入算力与数据工具', text: '接入弹性算力、Agent工具链、大模型能力，在脱敏数据和非生产环境中验证。' },
  { time: '第4阶段', title: '生态链接，拓展行业应用场景', text: '从轨交扩展到公交、铁路、医疗、制造等强约束排班场景，形成可复制产品能力。' }
]
</script>
