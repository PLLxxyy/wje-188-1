// ── Types ──────────────────────────────────────────────────────────────────
export type Status = 'green' | 'yellow' | 'red'

export interface MachineData {
  id: string
  name: string
  type: 'conveyor' | 'robot' | 'cnc' | 'press' | 'welder' | 'inspector' | 'packer'
  position: [number, number, number]
  rotation?: number
  runHours: number
  capacity: number     // 件/小时
  currentOutput: number
  status: Status
  alert?: string
}

export interface OperatorData {
  stationId: string
  stationName: string
  operator: string
  process: string
  count: number
  status: Status
  alert?: string
}

export interface TimeSlotData {
  label: string            // e.g. "08:00"
  machineStates: Record<string, Status>
}

// ── Machines ───────────────────────────────────────────────────────────────
export const machines: MachineData[] = [
  {
    id: 'm1',
    name: '上料传送带',
    type: 'conveyor',
    position: [-8, 0, 0],
    runHours: 6.5,
    capacity: 1200,
    currentOutput: 1180,
    status: 'green',
  },
  {
    id: 'm2',
    name: 'CNC加工中心-A',
    type: 'cnc',
    position: [-4.5, 0.8, 0],
    runHours: 5.8,
    capacity: 320,
    currentOutput: 305,
    status: 'green',
  },
  {
    id: 'm3',
    name: '冲压机-01',
    type: 'press',
    position: [-1.5, 0.8, 0],
    runHours: 6.2,
    capacity: 480,
    currentOutput: 410,
    status: 'yellow',
    alert: '模具温度偏高，建议检查冷却系统',
  },
  {
    id: 'm4',
    name: '焊接机械臂-Alpha',
    type: 'welder',
    position: [1.5, 1.4, 0],
    runHours: 4.1,
    capacity: 260,
    currentOutput: 255,
    status: 'green',
  },
  {
    id: 'm5',
    name: 'CNC加工中心-B',
    type: 'cnc',
    position: [4.5, 0.8, 0],
    runHours: 3.2,
    capacity: 300,
    currentOutput: 180,
    status: 'red',
    alert: '主轴振动异常，已触发停机保护',
  },
  {
    id: 'm6',
    name: '质检视觉系统',
    type: 'inspector',
    position: [7, 0.6, 0],
    runHours: 6.5,
    capacity: 900,
    currentOutput: 870,
    status: 'green',
  },
  {
    id: 'm7',
    name: '成品包装机',
    type: 'packer',
    position: [10, 0.5, 0],
    runHours: 6.0,
    capacity: 600,
    currentOutput: 540,
    status: 'green',
  },
]

// ── Operators ──────────────────────────────────────────────────────────────
export const operators: OperatorData[] = [
  { stationId: 'm1', stationName: '上料传送带', operator: '王建国', process: '原料投放与初检', count: 1180, status: 'green' },
  { stationId: 'm2', stationName: 'CNC加工中心-A', operator: '李志强', process: '精密切削加工', count: 305, status: 'green' },
  { stationId: 'm3', stationName: '冲压机-01', operator: '张海波', process: '板材冲压成型', count: 410, status: 'yellow', alert: '模具温度偏高' },
  { stationId: 'm4', stationName: '焊接机械臂-Alpha', operator: '刘明远', process: '自动焊接组装', count: 255, status: 'green' },
  { stationId: 'm5', stationName: 'CNC加工中心-B', operator: '陈晓峰', process: '二次精加工', count: 180, status: 'red', alert: '主轴振动异常' },
  { stationId: 'm6', stationName: '质检视觉系统', operator: '赵雪婷', process: '自动光学检测', count: 870, status: 'green' },
  { stationId: 'm7', stationName: '成品包装机', operator: '孙国华', process: '自动封装贴标', count: 540, status: 'green' },
]

// ── Timeline Slots (past 8 hours) ─────────────────────────────────────────
function buildTimeSlots(): TimeSlotData[] {
  const statuses: Status[][] = [
    // 08:00 - all green, fresh start
    ['green', 'green', 'green', 'green', 'green', 'green', 'green'],
    // 09:00
    ['green', 'green', 'green', 'green', 'green', 'green', 'green'],
    // 10:00 - m3 starts warming
    ['green', 'green', 'yellow', 'green', 'green', 'green', 'green'],
    // 11:00 - m5 degrades
    ['green', 'green', 'yellow', 'green', 'yellow', 'green', 'green'],
    // 12:00 - lunch partial
    ['green', 'green', 'yellow', 'green', 'red', 'green', 'green'],
    // 13:00
    ['green', 'green', 'yellow', 'green', 'red', 'green', 'green'],
    // 14:00 - brief recovery attempt
    ['green', 'green', 'green', 'green', 'yellow', 'green', 'green'],
    // 15:00 - current state
    ['green', 'green', 'yellow', 'green', 'red', 'green', 'green'],
  ]
  return statuses.map((states, i) => ({
    label: `${(8 + i).toString().padStart(2, '0')}:00`,
    machineStates: Object.fromEntries(machines.map((m, j) => [m.id, states[j]])),
  }))
}

export const timeSlots: TimeSlotData[] = buildTimeSlots()

// ── Top-bar summary (current snapshot + fluctuation) ──────────────────────
export interface SummaryData {
  totalOutput: number
  goodRate: number         // 0–100
  onlineRate: number       // 0–100
  energyKwh: number
}

export function getSummary(): SummaryData {
  return {
    totalOutput: 3740,
    goodRate: 98.6,
    onlineRate: 85.7,
    energyKwh: 1428,
  }
}
