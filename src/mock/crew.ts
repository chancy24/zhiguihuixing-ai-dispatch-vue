import type { CrewMember } from '@/types/domain'

export const crewMembers: CrewMember[] = [
  { id: 'CR-01', name: '张晨', employeeNo: 'D10012', team: '10号线一组', status: '可用', qualification: '内外环主值乘', todayWorkMinutes: 180, nightShifts7d: 1, continuousWorkMinutes: 120, restIntervalMinutes: 720, weeklyWorkMinutes: 1980, fatigueRisk: '低' },
  { id: 'CR-02', name: '李雯', employeeNo: 'D10028', team: '10号线一组', status: '可用', qualification: '早高峰强化', todayWorkMinutes: 210, nightShifts7d: 2, continuousWorkMinutes: 150, restIntervalMinutes: 660, weeklyWorkMinutes: 2200, fatigueRisk: '低' },
  { id: 'CR-03', name: '周远', employeeNo: 'D10043', team: '10号线二组', status: '请假', qualification: '内环', todayWorkMinutes: 0, nightShifts7d: 1, continuousWorkMinutes: 0, restIntervalMinutes: 900, weeklyWorkMinutes: 1740, fatigueRisk: '低' },
  { id: 'CR-04', name: '王祺', employeeNo: 'D10059', team: '10号线二组', status: '可用', qualification: '外环', todayWorkMinutes: 260, nightShifts7d: 3, continuousWorkMinutes: 220, restIntervalMinutes: 460, weeklyWorkMinutes: 2460, fatigueRisk: '中' },
  { id: 'CR-05', name: '赵静', employeeNo: 'D10066', team: '10号线三组', status: '可用', qualification: '内外环主值乘', todayWorkMinutes: 300, nightShifts7d: 4, continuousWorkMinutes: 280, restIntervalMinutes: 390, weeklyWorkMinutes: 2680, fatigueRisk: '高' },
  { id: 'CR-06', name: '刘航', employeeNo: 'D10071', team: '10号线三组', status: '培训', qualification: '候补', todayWorkMinutes: 90, nightShifts7d: 0, continuousWorkMinutes: 60, restIntervalMinutes: 840, weeklyWorkMinutes: 1560, fatigueRisk: '低' },
  { id: 'CR-07', name: '陈明', employeeNo: 'D10086', team: '10号线四组', status: '可用', qualification: '外环', todayWorkMinutes: 240, nightShifts7d: 2, continuousWorkMinutes: 190, restIntervalMinutes: 520, weeklyWorkMinutes: 2320, fatigueRisk: '中' },
  { id: 'CR-08', name: '何雨', employeeNo: 'D10097', team: '10号线四组', status: '可用', qualification: '内环', todayWorkMinutes: 160, nightShifts7d: 0, continuousWorkMinutes: 100, restIntervalMinutes: 760, weeklyWorkMinutes: 1840, fatigueRisk: '低' },
  { id: 'CR-09', name: '孙越', employeeNo: 'D10105', team: '10号线备班', status: '可用', qualification: '内外环主值乘', todayWorkMinutes: 80, nightShifts7d: 1, continuousWorkMinutes: 40, restIntervalMinutes: 920, weeklyWorkMinutes: 1420, fatigueRisk: '低' },
  { id: 'CR-10', name: '马宁', employeeNo: 'D10116', team: '10号线备班', status: '休息', qualification: '候补', todayWorkMinutes: 0, nightShifts7d: 2, continuousWorkMinutes: 0, restIntervalMinutes: 1020, weeklyWorkMinutes: 1880, fatigueRisk: '低' }
]
