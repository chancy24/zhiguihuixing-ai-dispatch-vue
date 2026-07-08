import type { RuleSet } from '@/types/domain'

export const rules: RuleSet = {
  maxContinuousWorkMinutes: 240,
  minRestMinutes: 25,
  maxRestMinutes: 150,
  maxMileageKm: 90,
  mealWindowStart: '11:30',
  mealWindowEnd: '13:30',
  legalDutyStations: ['巴沟', '五路', '公主坟', '首经贸', '宋家庄', '国贸', '三元桥', '宋场']
}
