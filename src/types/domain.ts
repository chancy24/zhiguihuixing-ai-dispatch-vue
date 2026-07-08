export type Direction = '内环' | '外环'
export type StationType = '普通站' | '换乘站' | '车辆段' | '折返站'
export type DateType = '工作日' | '节假日'
export type TripType = 'PULLOUT' | 'NORMAL' | 'PULLIN'
export type ShiftType = '早班' | '白班' | '夜班'
export type CheckStatus = '合规' | '不合规' | '待校验'
export type RiskLevel = '低' | '中' | '高'
export type CrewStatus = '可用' | '休息' | '请假' | '培训'
export type EventType = 'leave' | 'crowd' | 'delay'

export interface Station {
  id: string
  name: string
  code: string
  type: StationType
  isDutyPoint: boolean
  distanceKm: number
  direction: Direction
}

export interface TimetableRow {
  id: string
  serviceNo: string
  trainNo: string
  startStation: string
  endStation: string
  arrivalTime: string
  departureTime: string
  tripType: TripType
  direction: Direction
  dateType: DateType
}

export interface DutySegment {
  id: string
  serviceNo: string
  shiftType: ShiftType
  signOnStation: string
  signOffStation: string
  startTime: string
  endTime: string
  workMinutes: number
  restMinutes: number
  mileageKm: number
  status: CheckStatus
  reasons: string[]
}

export interface CrewMember {
  id: string
  name: string
  employeeNo: string
  team: string
  status: CrewStatus
  qualification: string
  todayWorkMinutes: number
  nightShifts7d: number
  continuousWorkMinutes: number
  restIntervalMinutes: number
  weeklyWorkMinutes: number
  fatigueRisk: RiskLevel
}

export interface RuleSet {
  maxContinuousWorkMinutes: number
  minRestMinutes: number
  maxRestMinutes: number
  maxMileageKm: number
  mealWindowStart: string
  mealWindowEnd: string
  legalDutyStations: string[]
}

export interface Assignment {
  segmentId: string
  crewId: string
  confidence: number
  reason: string
  warning?: string
}

export interface ScheduleResult {
  assignments: Assignment[]
  complianceRate: number
  balanceScore: number
  riskCrewCount: number
  aiNotes: string[]
}

export interface EmergencyEvent {
  type: EventType
  title: string
  description: string
  severity: RiskLevel
}

export interface RescheduleResult {
  eventTitle: string
  recognized: string[]
  affectedSegments: DutySegment[]
  affectedCrew: CrewMember[]
  replacements: CrewMember[]
  before: string[]
  after: string[]
  risks: string[]
}
