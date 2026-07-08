# 智轨慧行项目开发规范

本项目是“智轨慧行——城市轨道交通AI智能调度与乘务排班系统”的 Vue 3 + Vite + TypeScript 前端 MVP。

## 工作前必须阅读

每次进入本项目开发前，应先阅读：

- `docs/skills/product-positioning.md`
- `docs/skills/rail-scheduling-domain.md`
- `docs/skills/ui-style.md`
- `docs/skills/interaction-efficiency.md`
- `docs/skills/demo-script.md`

## 开发边界

- 当前系统是 AI 化 MVP 演示版，不接入真实地铁内部系统。
- 所有 AI 结果均表达为“辅助建议”，最终由调度员确认。
- 不使用外部网络图片，不使用真实机构 Logo，不放置扫码入口。
- 不删除已有页面和功能，优先在现有结构上增强真实业务流程。
- 视觉风格应保持轨道交通运营管理后台质感，避免过度 AI 炫酷装饰。

## 验证要求

修改后尽量执行：

```bash
npm run build
```

如涉及交互流程，至少本地打开关键页面检查是否空白、是否可点击、是否有结果反馈。
