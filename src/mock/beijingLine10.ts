/**
 * 北京地铁10号线演示数据
 * 数据来源：北京地铁公开站点信息 + 模拟时刻表与乘务数据
 * 用途：路演演示，不连接真实运营系统
 */

export const lineInfo = {
  lineName: '北京地铁10号线',
  lineType: '环线',
  lineLengthKm: 57.1,
  totalStations: 45,
  operatingCompany: '北京市地铁运营有限公司运营三分公司',
  scenario: '乘务轮乘图编制、乘务片段划分、应急重排、疲劳风险预警',
  keyStations: ['巴沟', '宋家庄', '五路', '万柳', '公主坟', '国贸', '三元桥', '知春路', '首经贸', '角门西'],
  ringLengthKm: 57.1,
  operatingHours: '04:30 - 00:30',
  depotStations: ['巴沟', '宋家庄', '五路', '宋场'],
  signOnOffPoints: ['巴沟', '宋家庄', '五路', '宋场', '车道沟']
}

/** 公开数据来源与免责说明 */
export const publicDataNotes = {
  lineInfo: '线路基本信息（长度、车站数、运营时间）参考北京地铁公开资料。',
  stations: '站点名称与顺序为公开知识，站点属性（出退勤点、车辆段）为演示模拟。',
  timetable: '系统时刻表与车次号为路演模拟数据，运营时间参考公开信息。',
  crew: '乘务员姓名、工号、工时均为模拟数据，不涉及真实个人信息。',
  deployment: '正式部署需接入运营单位授权数据，不连接真实运营系统。',
  sources: [
    { title: '北京地铁10号线 - Wikipedia', url: 'https://zh.wikipedia.org/wiki/北京地铁10号线' },
    { title: '北京地铁官方网站', url: 'https://www.bjsubway.com/' },
    { title: '北京市交通委员会', url: 'https://jtw.beijing.gov.cn/' }
  ]
}

export interface Line10Station {
  stationId: string
  name: string
  englishName?: string
  shortCode?: string
  englishCode: string
  sequence: number
  ringDirection: '内环' | '外环'
  stationType: '普通站' | '换乘站' | '车辆段' | '折返站' | '出退勤点'
  canSignOn: boolean
  canSignOff: boolean
  transferLines: string[]
  note: string
}

export const stations: Line10Station[] = [
  { stationId: 'L10-01', name: '巴沟', englishCode: 'BG', sequence: 1, ringDirection: '内环', stationType: '出退勤点', canSignOn: true, canSignOff: true, transferLines: [], note: '车辆段连接站，主要出退勤点' },
  { stationId: 'L10-02', name: '车道沟', englishCode: 'CDG', sequence: 2, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-03', name: '长春桥', englishCode: 'CCQ', sequence: 3, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-04', name: '火器营', englishCode: 'HQY', sequence: 4, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-05', name: '万柳', englishCode: 'BGDP', sequence: 5, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '原名巴沟村停车场附近' },
  { stationId: 'L10-06', name: '苏州街', englishCode: 'SZJ', sequence: 6, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['16号线'], note: '' },
  { stationId: 'L10-07', name: '海淀黄庄', englishCode: 'HDHZ', sequence: 7, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['4号线'], note: '' },
  { stationId: 'L10-08', name: '知春里', englishCode: 'ZCL', sequence: 8, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-09', name: '知春路', englishCode: 'ZCLU', sequence: 9, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['13号线'], note: '重点站' },
  { stationId: 'L10-10', name: '西土城', englishCode: 'XTC', sequence: 10, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['昌平线'], note: '' },
  { stationId: 'L10-11', name: '牡丹园', englishCode: 'MDY', sequence: 11, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['19号线'], note: '' },
  { stationId: 'L10-12', name: '健德门', englishCode: 'JDM', sequence: 12, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-13', name: '北土城', englishCode: 'BTC', sequence: 13, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['8号线'], note: '' },
  { stationId: 'L10-14', name: '安贞门', englishCode: 'AZM', sequence: 14, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-15', name: '惠新西街南口', englishCode: 'HXXJNK', sequence: 15, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['5号线'], note: '' },
  { stationId: 'L10-16', name: '芍药居', englishCode: 'SYJ', sequence: 16, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['13号线'], note: '' },
  { stationId: 'L10-17', name: '太阳宫', englishCode: 'TYG', sequence: 17, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['17号线'], note: '' },
  { stationId: 'L10-18', name: '三元桥', englishCode: 'SYQ', sequence: 18, ringDirection: '内环', stationType: '换乘站', canSignOn: true, canSignOff: true, transferLines: ['机场线'], note: '重点站，出退勤点' },
  { stationId: 'L10-19', name: '亮马桥', englishCode: 'LMQ', sequence: 19, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-20', name: '农业展览馆', englishCode: 'NYZLG', sequence: 20, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-21', name: '团结湖', englishCode: 'TJH', sequence: 21, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-22', name: '呼家楼', englishCode: 'HJL', sequence: 22, ringDirection: '内环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['6号线'], note: '' },
  { stationId: 'L10-23', name: '金台夕照', englishCode: 'JTXZ', sequence: 23, ringDirection: '内环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-24', name: '国贸', englishCode: 'GM', sequence: 24, ringDirection: '内环', stationType: '换乘站', canSignOn: true, canSignOff: true, transferLines: ['1号线'], note: '重点站，出退勤点' },
  { stationId: 'L10-25', name: '双井', englishCode: 'SJING', sequence: 25, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['7号线'], note: '' },
  { stationId: 'L10-26', name: '劲松', englishCode: 'JS', sequence: 26, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-27', name: '潘家园', englishCode: 'PJY', sequence: 27, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-28', name: '十里河', englishCode: 'SLH', sequence: 28, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['14号线', '17号线'], note: '' },
  { stationId: 'L10-29', name: '分钟寺', englishCode: 'FZS', sequence: 29, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-30', name: '成寿寺', englishCode: 'CSS', sequence: 30, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-31', name: '宋家庄', englishCode: 'SJZ', sequence: 31, ringDirection: '外环', stationType: '出退勤点', canSignOn: true, canSignOff: true, transferLines: ['5号线', '亦庄线'], note: '重点站，车辆段，主要出退勤点' },
  { stationId: 'L10-32', name: '石榴庄', englishCode: 'SLZ', sequence: 32, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-33', name: '大红门', englishCode: 'DHM', sequence: 33, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['8号线'], note: '' },
  { stationId: 'L10-34', name: '角门东', englishCode: 'JMD', sequence: 34, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-35', name: '角门西', englishCode: 'JMX', sequence: 35, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['4号线'], note: '重点站' },
  { stationId: 'L10-36', name: '草桥', englishCode: 'CQ', sequence: 36, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['大兴机场线', '19号线'], note: '' },
  { stationId: 'L10-37', name: '纪家庙', englishCode: 'JJM', sequence: 37, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-38', name: '首经贸', englishCode: 'SJM', sequence: 38, ringDirection: '外环', stationType: '换乘站', canSignOn: true, canSignOff: true, transferLines: ['房山线'], note: '重点站，出退勤点' },
  { stationId: 'L10-39', name: '丰台站', englishCode: 'FTZ', sequence: 39, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['16号线'], note: '' },
  { stationId: 'L10-40', name: '泥洼', englishCode: 'NW', sequence: 40, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-41', name: '西局', englishCode: 'XJ', sequence: 41, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['14号线'], note: '' },
  { stationId: 'L10-42', name: '六里桥', englishCode: 'LLQ', sequence: 42, ringDirection: '外环', stationType: '换乘站', canSignOn: false, canSignOff: false, transferLines: ['9号线'], note: '' },
  { stationId: 'L10-43', name: '莲花桥', englishCode: 'LHQ', sequence: 43, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' },
  { stationId: 'L10-44', name: '公主坟', englishCode: 'GZF', sequence: 44, ringDirection: '外环', stationType: '换乘站', canSignOn: true, canSignOff: true, transferLines: ['1号线'], note: '重点站，出退勤点' },
  { stationId: 'L10-45', name: '西钓鱼台', englishCode: 'XDYT', sequence: 45, ringDirection: '外环', stationType: '普通站', canSignOn: false, canSignOff: false, transferLines: [], note: '' }
]

export interface TimetableSample {
  serviceNo: string
  tripNo: string
  startStation: string
  endStation: string
  arrivalTime: string
  departureTime: string
  tripType: 'PULLOUT' | 'NORMAL' | 'PULLIN'
  ringDirection: '内环' | '外环'
  dayType: '工作日' | '节假日'
}

export const timetableSamples: TimetableSample[] = [
  { serviceNo: 'S1001', tripNo: '10-041', startStation: '巴沟', endStation: '宋家庄', arrivalTime: '04:16', departureTime: '04:22', tripType: 'PULLOUT', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1002', tripNo: '10-052', startStation: '五路', endStation: '国贸', arrivalTime: '05:08', departureTime: '05:13', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1003', tripNo: '10-066', startStation: '公主坟', endStation: '三元桥', arrivalTime: '06:32', departureTime: '06:36', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1004', tripNo: '10-081', startStation: '宋家庄', endStation: '巴沟', arrivalTime: '07:10', departureTime: '07:15', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1005', tripNo: '10-109', startStation: '国贸', endStation: '首经贸', arrivalTime: '10:28', departureTime: '10:33', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1006', tripNo: '10-138', startStation: '三元桥', endStation: '角门西', arrivalTime: '12:45', departureTime: '12:52', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1007', tripNo: '10-176', startStation: '首经贸', endStation: '宋场', arrivalTime: '15:46', departureTime: '15:53', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1008', tripNo: '10-196', startStation: '宋家庄', endStation: '五路', arrivalTime: '17:20', departureTime: '17:26', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1009', tripNo: '10-221', startStation: '国贸', endStation: '巴沟', arrivalTime: '19:30', departureTime: '19:37', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1010', tripNo: '10-244', startStation: '三元桥', endStation: '宋场', arrivalTime: '22:15', departureTime: '22:22', tripType: 'PULLIN', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1011', tripNo: '10-258', startStation: '巴沟', endStation: '国贸', arrivalTime: '23:30', departureTime: '23:36', tripType: 'PULLIN', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1012', tripNo: '10-301', startStation: '万柳', endStation: '宋家庄', arrivalTime: '00:18', departureTime: '00:24', tripType: 'PULLIN', ringDirection: '内环', dayType: '节假日' },
  { serviceNo: 'S1013', tripNo: '10-042', startStation: '五路', endStation: '巴沟', arrivalTime: '05:45', departureTime: '05:50', tripType: 'PULLOUT', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1014', tripNo: '10-088', startStation: '巴沟', endStation: '公主坟', arrivalTime: '07:40', departureTime: '07:45', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1015', tripNo: '10-115', startStation: '国贸', endStation: '宋家庄', arrivalTime: '08:55', departureTime: '09:00', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1016', tripNo: '10-142', startStation: '宋家庄', endStation: '三元桥', arrivalTime: '11:20', departureTime: '11:26', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1017', tripNo: '10-167', startStation: '首经贸', endStation: '国贸', arrivalTime: '14:10', departureTime: '14:16', tripType: 'NORMAL', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1018', tripNo: '10-200', startStation: '巴沟', endStation: '角门西', arrivalTime: '18:30', departureTime: '18:36', tripType: 'NORMAL', ringDirection: '内环', dayType: '工作日' },
  { serviceNo: 'S1019', tripNo: '10-231', startStation: '公主坟', endStation: '宋场', arrivalTime: '20:45', departureTime: '20:52', tripType: 'PULLIN', ringDirection: '外环', dayType: '工作日' },
  { serviceNo: 'S1020', tripNo: '10-256', startStation: '三元桥', endStation: '巴沟', arrivalTime: '21:55', departureTime: '22:01', tripType: 'NORMAL', ringDirection: '内环', dayType: '节假日' }
]

export interface CrewSample {
  crewId: string
  name: string
  team: string
  qualification: string
  available: boolean
  todayWorkMinutes: number
  nightShiftCount7d: number
  restHours: number
  fatigueLevel: string
}

export const crewSamples: CrewSample[] = [
  { crewId: 'CR-01', name: '张晨', team: '10号线一组', qualification: '内外环主值乘', available: true, todayWorkMinutes: 180, nightShiftCount7d: 1, restHours: 12, fatigueLevel: '低' },
  { crewId: 'CR-02', name: '李雯', team: '10号线一组', qualification: '早高峰强化', available: true, todayWorkMinutes: 210, nightShiftCount7d: 2, restHours: 11, fatigueLevel: '低' },
  { crewId: 'CR-03', name: '周远', team: '10号线二组', qualification: '内环', available: false, todayWorkMinutes: 0, nightShiftCount7d: 1, restHours: 15, fatigueLevel: '低' },
  { crewId: 'CR-04', name: '王祺', team: '10号线二组', qualification: '外环', available: true, todayWorkMinutes: 260, nightShiftCount7d: 3, restHours: 7.7, fatigueLevel: '中' },
  { crewId: 'CR-05', name: '赵静', team: '10号线三组', qualification: '内外环主值乘', available: true, todayWorkMinutes: 300, nightShiftCount7d: 4, restHours: 6.5, fatigueLevel: '高' },
  { crewId: 'CR-06', name: '刘航', team: '10号线三组', qualification: '候补', available: false, todayWorkMinutes: 90, nightShiftCount7d: 0, restHours: 14, fatigueLevel: '低' },
  { crewId: 'CR-07', name: '陈明', team: '10号线四组', qualification: '外环', available: true, todayWorkMinutes: 240, nightShiftCount7d: 2, restHours: 8.7, fatigueLevel: '中' },
  { crewId: 'CR-08', name: '何雨', team: '10号线四组', qualification: '内环', available: true, todayWorkMinutes: 160, nightShiftCount7d: 0, restHours: 12.7, fatigueLevel: '低' },
  { crewId: 'CR-09', name: '孙越', team: '10号线备班', qualification: '内外环主值乘', available: true, todayWorkMinutes: 80, nightShiftCount7d: 1, restHours: 15.3, fatigueLevel: '低' },
  { crewId: 'CR-10', name: '马宁', team: '10号线备班', qualification: '候补', available: false, todayWorkMinutes: 0, nightShiftCount7d: 2, restHours: 17, fatigueLevel: '低' }
]

export const incidentSamples = [
  {
    id: 'INC-01',
    type: '乘务员请假',
    title: '2名乘务员临时请假',
    description: '周远（内环）请假，刘航（候补）培训中不可用。早高峰3个内环片段需要重新分配。',
    severity: '高',
    affectedSegments: ['AUTO-001', 'AUTO-003', 'AUTO-005'],
    affectedCrew: ['CR-03', 'CR-06']
  },
  {
    id: 'INC-02',
    type: '客流突增',
    title: '早高峰客流突增',
    description: '07:00-09:00 国贸站、三元桥站进站客流超出日常30%，需要增加早高峰备班覆盖。',
    severity: '中',
    affectedSegments: ['AUTO-003', 'AUTO-004'],
    affectedStations: ['国贸', '三元桥', '呼家楼']
  },
  {
    id: 'INC-03',
    type: '列车延误',
    title: '列车延误15分钟',
    description: '10-081次列车在外环巴沟-公主坟区间信号故障延误约15分钟，影响后续交路衔接。',
    severity: '中',
    affectedSegments: ['AUTO-004', 'AUTO-005', 'AUTO-006'],
    delayMinutes: 15
  },
  {
    id: 'INC-04',
    type: '间休不足',
    title: '某片段间休不足',
    description: 'AUTO-003与AUTO-004之间预计间休仅22分钟，低于最低25分钟要求。需要调整交路或启用备班。',
    severity: '低',
    affectedSegments: ['AUTO-003', 'AUTO-004'],
    shortfallMinutes: 3
  },
  {
    id: 'INC-05',
    type: '工时预警',
    title: '某人员连续工作接近上限',
    description: '赵静（CR-05）今日累计工时已达300分钟，接近240分钟续工作上限。建议后续片段优先使用备班人员。',
    severity: '高',
    affectedCrew: ['CR-05'],
    currentMinutes: 300,
    limitMinutes: 240
  }
]

/** PR2003.xls 模拟站名转换表 */
export const stationCodeMap: Record<string, string> = {
  'BG': '巴沟',
  'CDG': '车道沟',
  'CCQ': '长春桥',
  'HQY': '火器营',
  'BGDP': '万柳',
  'SZJ': '苏州街',
  'HDHZ': '海淀黄庄',
  'ZCL': '知春里',
  'ZCLU': '知春路',
  'XTC': '西土城',
  'MDY': '牡丹园',
  'JDM': '健德门',
  'BTC': '北土城',
  'AZM': '安贞门',
  'HXXJNK': '惠新西街南口',
  'SYJ': '芍药居',
  'TYG': '太阳宫',
  'SYQ': '三元桥',
  'LMQ': '亮马桥',
  'NYZLG': '农业展览馆',
  'TJH': '团结湖',
  'HJL': '呼家楼',
  'JTXZ': '金台夕照',
  'GM': '国贸',
  'SJING': '双井',
  'JS': '劲松',
  'PJY': '潘家园',
  'SLH': '十里河',
  'FZS': '分钟寺',
  'CSS': '成寿寺',
  'SJZ': '宋家庄',
  'SLZ': '石榴庄',
  'DHM': '大红门',
  'JMD': '角门东',
  'JMX': '角门西',
  'CQ': '草桥',
  'JJM': '纪家庙',
  'SJM': '首经贸',
  'FTZ': '丰台站',
  'NW': '泥洼',
  'XJ': '西局',
  'LLQ': '六里桥',
  'LHQ': '莲花桥',
  'GZF': '公主坟',
  'XDYT': '西钓鱼台',
  'WLPL': '五路',
  'SJZPL': '宋场',
  'WL': '万柳',
  'SC': '宋场'
}
