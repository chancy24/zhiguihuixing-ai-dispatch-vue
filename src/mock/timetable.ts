import type { TimetableRow } from '@/types/domain'

export const timetableRows: TimetableRow[] = [
  { id: 'TT-001', serviceNo: 'S1001', trainNo: '10-041', startStation: 'BG', endStation: 'SJZ', arrivalTime: '04:16', departureTime: '04:22', tripType: 'PULLOUT', direction: '内环', dateType: '工作日' },
  { id: 'TT-002', serviceNo: 'S1002', trainNo: '10-052', startStation: 'WLPL', endStation: 'GM', arrivalTime: '05:08', departureTime: '05:13', tripType: 'NORMAL', direction: '内环', dateType: '工作日' },
  { id: 'TT-003', serviceNo: 'S1003', trainNo: '10-066', startStation: 'GZF', endStation: 'SYQ', arrivalTime: '06:32', departureTime: '06:36', tripType: 'NORMAL', direction: '内环', dateType: '工作日' },
  { id: 'TT-004', serviceNo: 'S1004', trainNo: '10-081', startStation: 'SJZ', endStation: 'BG', arrivalTime: '07:10', departureTime: '07:15', tripType: 'NORMAL', direction: '外环', dateType: '工作日' },
  { id: 'TT-005', serviceNo: 'S1005', trainNo: '10-109', startStation: 'GM', endStation: 'SJM', arrivalTime: '10:28', departureTime: '10:33', tripType: 'NORMAL', direction: '外环', dateType: '工作日' },
  { id: 'TT-006', serviceNo: 'S1006', trainNo: '10-138', startStation: 'SYQ', endStation: 'JMX', arrivalTime: '12:45', departureTime: '12:52', tripType: 'NORMAL', direction: '外环', dateType: '工作日' },
  { id: 'TT-007', serviceNo: 'S1007', trainNo: '10-176', startStation: 'SJM', endStation: 'SC', arrivalTime: '15:46', departureTime: '15:53', tripType: 'NORMAL', direction: '内环', dateType: '工作日' },
  { id: 'TT-008', serviceNo: 'S1008', trainNo: '10-196', startStation: 'SJZ', endStation: 'WLPL', arrivalTime: '17:20', departureTime: '17:26', tripType: 'NORMAL', direction: '外环', dateType: '工作日' },
  { id: 'TT-009', serviceNo: 'S1009', trainNo: '10-221', startStation: 'GM', endStation: 'BG', arrivalTime: '19:30', departureTime: '19:37', tripType: 'NORMAL', direction: '外环', dateType: '工作日' },
  { id: 'TT-010', serviceNo: 'S1010', trainNo: '10-244', startStation: 'SYQ', endStation: 'SC', arrivalTime: '22:15', departureTime: '22:22', tripType: 'PULLIN', direction: '外环', dateType: '工作日' },
  { id: 'TT-011', serviceNo: 'S1011', trainNo: '10-258', startStation: 'BG', endStation: 'GM', arrivalTime: '23:30', departureTime: '23:36', tripType: 'PULLIN', direction: '内环', dateType: '工作日' },
  { id: 'TT-012', serviceNo: 'S1012', trainNo: '10-301', startStation: 'WL', endStation: 'SJZ', arrivalTime: '00:18', departureTime: '00:24', tripType: 'PULLIN', direction: '内环', dateType: '节假日' }
]
