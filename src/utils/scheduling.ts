import { crewMembers } from '@/mock/crew'
import { emergencyEvents } from '@/mock/events'
import { rules } from '@/mock/rules'
import { seedSegments } from '@/mock/schedule'
import { stations } from '@/mock/stations'
import type {
  CrewMember,
  DutySegment,
  EventType,
  RescheduleResult,
  RiskLevel,
  ScheduleResult,
  ShiftType,
  TimetableRow
} from '@/types/domain'

const stationNameMap = new Map(stations.map((station) => [station.code, station.name]))

export function translateStationName(code: string): string {
  const clean = code.trim().toUpperCase()
  return stationNameMap.get(clean) ?? code
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}小时${m.toString().padStart(2, '0')}分钟`
}

export function determineShiftType(startTime: string): ShiftType {
  const minutes = toMinutes(startTime)
  if (minutes >= toMinutes('04:16') && minutes <= toMinutes('07:15')) return '早班'
  if (minutes >= toMinutes('15:46') && minutes <= toMinutes('19:37')) return '夜班'
  return '白班'
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = toMinutes(startTime)
  let end = toMinutes(endTime)
  if (end < start) end += 24 * 60
  return end - start
}

export function calculateRestTime(prevEnd: string, nextStart: string): number {
  const end = toMinutes(prevEnd)
  let start = toMinutes(nextStart)
  if (start < end) start += 24 * 60
  return start - end
}

export function validateDutySegment(segment: DutySegment): DutySegment {
  const reasons: string[] = []

  if (segment.workMinutes > rules.maxContinuousWorkMinutes) {
    reasons.push(`连续工作${formatMinutes(segment.workMinutes)}，超过${formatMinutes(rules.maxContinuousWorkMinutes)}上限`)
  }
  if (segment.restMinutes < rules.minRestMinutes) {
    reasons.push(`间休${formatMinutes(segment.restMinutes)}，低于${formatMinutes(rules.minRestMinutes)}下限`)
  }
  if (segment.restMinutes > rules.maxRestMinutes) {
    reasons.push(`间休${formatMinutes(segment.restMinutes)}，超过${formatMinutes(rules.maxRestMinutes)}上限`)
  }
  if (!rules.legalDutyStations.includes(segment.signOnStation) || !rules.legalDutyStations.includes(segment.signOffStation)) {
    reasons.push('出退勤地点组合不在允许列表内')
  }
  if (segment.shiftType === '白班' && !(segment.startTime <= rules.mealWindowStart && segment.endTime >= rules.mealWindowEnd)) {
    reasons.push('白班片段未覆盖或预留标准用餐时间窗口')
  }
  if (segment.mileageKm > rules.maxMileageKm) {
    reasons.push(`里程${segment.mileageKm}km，超过${rules.maxMileageKm}km限制`)
  }

  return {
    ...segment,
    status: reasons.length ? '不合规' : '合规',
    reasons
  }
}

export function createSegmentsFromTimetable(rows: TimetableRow[]): DutySegment[] {
  return rows.slice(0, 8).map((row, index) => {
    const startTime = row.departureTime
    const duration = 115 + (index % 4) * 38
    const startMinutes = toMinutes(startTime)
    const endMinutes = (startMinutes + duration) % (24 * 60)
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60)
      .toString()
      .padStart(2, '0')}`
    const segment: DutySegment = {
      id: `AUTO-${String(index + 1).padStart(3, '0')}`,
      serviceNo: row.serviceNo,
      shiftType: determineShiftType(startTime),
      signOnStation: translateStationName(row.startStation),
      signOffStation: translateStationName(row.endStation),
      startTime,
      endTime,
      workMinutes: calculateDuration(startTime, endTime),
      restMinutes: 22 + (index % 5) * 9,
      mileageKm: 34 + (index % 6) * 11,
      status: '待校验',
      reasons: []
    }
    return validateDutySegment(segment)
  })
}

export function calculateFatigueScore(crew: CrewMember): number {
  const continuousScore = Math.min(35, Math.round((crew.continuousWorkMinutes / 300) * 35))
  const nightScore = Math.min(25, crew.nightShifts7d * 6)
  const restScore = crew.restIntervalMinutes < 480 ? 25 : crew.restIntervalMinutes < 600 ? 14 : 5
  const weekScore = Math.min(15, Math.round((crew.weeklyWorkMinutes / 3000) * 15))
  return continuousScore + nightScore + restScore + weekScore
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 68) return '高'
  if (score >= 45) return '中'
  return '低'
}

export function generateSchedule(segments: DutySegment[], crews: CrewMember[]): ScheduleResult {
  const availableCrews = crews
    .filter((crew) => crew.status === '可用')
    .sort((a, b) => calculateFatigueScore(a) + a.todayWorkMinutes - (calculateFatigueScore(b) + b.todayWorkMinutes))
  const assignments = segments.map((segment, index) => {
    const candidate = availableCrews[index % availableCrews.length]
    const score = calculateFatigueScore(candidate)
    return {
      segmentId: segment.id,
      crewId: candidate.id,
      confidence: Math.max(76, 96 - Math.floor(score / 4) - (segment.status === '不合规' ? 8 : 0)),
      reason: `优先匹配${candidate.qualification}资质，当前累计工时${formatMinutes(candidate.todayWorkMinutes)}，疲劳风险${riskLevelFromScore(score)}`,
      warning: score >= 68 ? '该人员接近高疲劳风险，建议调度员复核' : undefined
    }
  })

  const compliant = segments.filter((segment) => segment.status !== '不合规').length
  const riskCrewCount = availableCrews.filter((crew) => calculateFatigueScore(crew) >= 68).length

  return {
    assignments,
    complianceRate: Math.round((compliant / Math.max(segments.length, 1)) * 100),
    balanceScore: 86,
    riskCrewCount,
    aiNotes: [
      '优先满足连续工作时间、休息间隔、出退勤地点等硬约束。',
      '对高疲劳风险人员降权，优先使用备班和低累计工时人员。',
      '当前方案为AI辅助建议，最终需由调度员确认后执行。'
    ]
  }
}

export function simulateReschedule(eventType: EventType): RescheduleResult {
  const event = emergencyEvents.find((item) => item.type === eventType) ?? emergencyEvents[0]
  const affectedSegments = eventType === 'leave' ? seedSegments.slice(0, 3) : eventType === 'crowd' ? seedSegments.slice(1, 5) : seedSegments.slice(4, 7)
  const affectedCrew = eventType === 'leave' ? crewMembers.slice(2, 5) : crewMembers.slice(3, 7)
  const replacements = crewMembers.filter((crew) => crew.status === '可用' && calculateFatigueScore(crew) < 60).slice(0, 3)

  return {
    eventTitle: event.title,
    recognized: [
      `已识别事件：${event.description}`,
      `影响范围：${affectedSegments.length}个乘务片段`,
      '约束条件：工时上限、休息间隔、岗位衔接、线路交路'
    ],
    affectedSegments,
    affectedCrew,
    replacements,
    before: affectedSegments.map((segment) => `${segment.id} ${segment.signOnStation}-${segment.signOffStation} 原计划保持不变`),
    after: affectedSegments.map((segment, index) => {
      const crew = replacements[index % replacements.length]
      return `${segment.id} 推荐由${crew.name}接替，复核${segment.startTime}-${segment.endTime}衔接`
    }),
    risks: [
      '1名人员接近连续工作上限，建议安排备用人员进入候补池。',
      '高峰时段交路衔接需由调度员人工复核。',
      '本结果为前端模拟AI辅助建议，不直接写入真实运营系统。'
    ]
  }
}
