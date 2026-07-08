import type { Station } from '@/types/domain'

export const stations: Station[] = [
  { id: 'ST-01', name: '巴沟', code: 'BG', type: '折返站', isDutyPoint: true, distanceKm: 0, direction: '内环' },
  { id: 'ST-02', name: '万柳', code: 'WL', type: '普通站', isDutyPoint: false, distanceKm: 1.2, direction: '内环' },
  { id: 'ST-03', name: '五路', code: 'WLPL', type: '换乘站', isDutyPoint: true, distanceKm: 2.8, direction: '内环' },
  { id: 'ST-04', name: '公主坟', code: 'GZF', type: '换乘站', isDutyPoint: true, distanceKm: 4.7, direction: '内环' },
  { id: 'ST-05', name: '首经贸', code: 'SJM', type: '换乘站', isDutyPoint: true, distanceKm: 7.1, direction: '内环' },
  { id: 'ST-06', name: '角门西', code: 'JMX', type: '换乘站', isDutyPoint: false, distanceKm: 9.6, direction: '内环' },
  { id: 'ST-07', name: '宋家庄', code: 'SJZ', type: '折返站', isDutyPoint: true, distanceKm: 12.4, direction: '内环' },
  { id: 'ST-08', name: '国贸', code: 'GM', type: '换乘站', isDutyPoint: true, distanceKm: 15.8, direction: '外环' },
  { id: 'ST-09', name: '三元桥', code: 'SYQ', type: '换乘站', isDutyPoint: true, distanceKm: 18.2, direction: '外环' },
  { id: 'ST-10', name: '太阳宫', code: 'TYG', type: '普通站', isDutyPoint: false, distanceKm: 20.1, direction: '外环' },
  { id: 'ST-11', name: '宋场', code: 'SC', type: '车辆段', isDutyPoint: true, distanceKm: 22.8, direction: '外环' },
  { id: 'ST-12', name: '车道沟', code: 'CDG', type: '普通站', isDutyPoint: false, distanceKm: 25.4, direction: '外环' }
]
