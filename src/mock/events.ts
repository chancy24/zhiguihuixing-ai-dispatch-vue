import type { EmergencyEvent } from '@/types/domain'

export const emergencyEvents: EmergencyEvent[] = [
  { type: 'leave', title: '2名乘务员请假', description: '早高峰前两名值乘人员临时请假，需快速重排关键片段。', severity: '高' },
  { type: 'crowd', title: '早高峰客流突增', description: '国贸、三元桥换乘压力上升，建议补强高峰片段和候补池。', severity: '中' },
  { type: 'delay', title: '列车延误15分钟', description: '外环列车延误导致片段衔接风险升高，需要调整后续出退勤安排。', severity: '中' }
]
