import type { DutySegment } from '@/types/domain'

export const seedSegments: DutySegment[] = [
  { id: 'DS-001', serviceNo: 'S1001', shiftType: '早班', signOnStation: '巴沟', signOffStation: '宋家庄', startTime: '04:16', endTime: '06:50', workMinutes: 154, restMinutes: 36, mileageKm: 42, status: '待校验', reasons: [] },
  { id: 'DS-002', serviceNo: 'S1003', shiftType: '早班', signOnStation: '公主坟', signOffStation: '三元桥', startTime: '06:32', endTime: '09:18', workMinutes: 166, restMinutes: 28, mileageKm: 48, status: '待校验', reasons: [] },
  { id: 'DS-003', serviceNo: 'S1005', shiftType: '白班', signOnStation: '国贸', signOffStation: '首经贸', startTime: '10:28', endTime: '13:08', workMinutes: 160, restMinutes: 42, mileageKm: 35, status: '待校验', reasons: [] },
  { id: 'DS-004', serviceNo: 'S1006', shiftType: '白班', signOnStation: '三元桥', signOffStation: '角门西', startTime: '12:45', endTime: '16:52', workMinutes: 247, restMinutes: 22, mileageKm: 92, status: '待校验', reasons: [] },
  { id: 'DS-005', serviceNo: 'S1007', shiftType: '夜班', signOnStation: '首经贸', signOffStation: '宋场', startTime: '15:46', endTime: '19:37', workMinutes: 231, restMinutes: 44, mileageKm: 56, status: '待校验', reasons: [] },
  { id: 'DS-006', serviceNo: 'S1009', shiftType: '夜班', signOnStation: '国贸', signOffStation: '巴沟', startTime: '19:30', endTime: '23:20', workMinutes: 230, restMinutes: 31, mileageKm: 64, status: '待校验', reasons: [] },
  { id: 'DS-007', serviceNo: 'S1011', shiftType: '白班', signOnStation: '万柳', signOffStation: '国贸', startTime: '23:30', endTime: '01:35', workMinutes: 125, restMinutes: 35, mileageKm: 38, status: '待校验', reasons: [] }
]
