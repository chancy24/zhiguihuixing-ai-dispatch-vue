<template>
  <section class="login-page vibe-login-page">
    <img class="login-bg" :src="getAssetPath('aiCommandCenterPremium')" alt="AI轨交调度指挥中心主视觉" />
    <div class="login-shade"></div>

    <div class="login-panel vibe-login-panel">
      <p class="kicker">TRAE 创造力大赛 · 城市轨交 AI 调度产品原型</p>
      <h1>智轨慧行</h1>
      <h2>AI驱动的城市轨道交通智能调度与乘务排班系统</h2>
      <p>以北京地铁10号线环线排班为演示场景，把时刻表处理、乘务片段划分、规则校验、AI辅助排班、应急重排与疲劳预警整合成一个可讲、可点、可验证的产品工作台。</p>

      <div class="login-command-strip">
        <span>PR2003 时刻表解析</span>
        <span>规则冲突自动识别</span>
        <span>Agent 生成调度建议</span>
        <span>调度员复核确认</span>
      </div>

      <div class="login-metric-row">
        <article>
          <b>45</b>
          <span>10号线站点</span>
        </article>
        <article>
          <b>7</b>
          <span>排班工作流步骤</span>
        </article>
        <article>
          <b>AI</b>
          <span>辅助建议不直控</span>
        </article>
      </div>

      <div class="login-actions">
        <button class="primary-button" @click="$router.push('/app/dashboard')">进入AI调度驾驶舱</button>
        <button class="ghost-button on-dark" @click="$router.push('/app/presentation')">进入路演模式</button>
        <button class="ghost-button on-dark" @click="showSource = true">查看素材与数据来源</button>
      </div>
    </div>

    <aside class="login-visual vibe-login-console">
      <div class="console-topline">
        <span>BEIJING RAIL TRANSIT LINES</span>
        <b>线网态势 / 排班约束 / AI建议</b>
      </div>
      <div class="console-map-window">
        <img :src="getAssetPath('beijingRailTransitConfigMap')" alt="北京轨道交通线路配置图 SVG" />
      </div>
      <div class="console-flow">
        <article><b>01</b><span>导入时刻表</span></article>
        <article><b>02</b><span>生成乘务片段</span></article>
        <article><b>03</b><span>AI重排与预警</span></article>
      </div>
      <div class="login-brief">
        <b>演示场景：北京地铁10号线</b>
        <span>环线 · 全长57.1km · 45座车站 · 内外环乘务轮乘图编制与应急调度演示</span>
      </div>
    </aside>

    <!-- 数据来源弹窗 -->
    <div v-if="showSource" class="source-modal-mask" @click.self="showSource = false">
      <div class="source-modal">
        <button class="close-btn" @click="showSource = false">关闭</button>
        <h2>数据来源说明</h2>
        <p style="color:#64748b;font-size:13px;">页面素材与数据仅用于路演演示，来源见 public/assets/manifest/asset-index.json 与 docs/assets/。</p>
        <h3>素材来源</h3>
        <ul>
          <li>北京轨道交通线路配置图 — SierraQin/metro，CC BY-SA 4.0，本地 SVG 副本。</li>
          <li>AI轨交调度指挥中心主视觉 — OpenAI image generation，本地 PNG 副本。</li>
          <li>北京地铁10号线简化线路图 — 项目自绘 SVG，依据公开站点信息。</li>
          <li>站名转换对照表 — 基于北京地铁公开站点信息整理</li>
        </ul>
        <h3>数据来源</h3>
        <ul>
          <li>站点数据：<a href="https://zh.wikipedia.org/wiki/北京地铁10号线" target="_blank">Wikipedia - 北京地铁10号线</a></li>
          <li>运营信息：<a href="https://www.bjsubway.com/" target="_blank">北京地铁官方网站</a></li>
          <li>轨道交通数据：<a href="https://jtw.beijing.gov.cn/" target="_blank">北京市交通委员会</a></li>
        </ul>
        <h3>免责声明</h3>
        <ul>
          <li>本项目为前端路演演示系统</li>
          <li>所有乘务员数据、时刻表数据均为模拟数据</li>
          <li>不连接真实运营系统，不包含真实个人信息</li>
          <li>AI建议仅供辅助，最终方案需由调度员复核确认</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAssetPath } from '@/data/assets'

const showSource = ref(false)
</script>
