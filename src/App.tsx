import { useState, useCallback, useEffect } from 'react'
import Scene from './components/Scene'
import TopBar from './components/TopBar'
import BottomTimeline from './components/BottomTimeline'
import RightPanel from './components/RightPanel'
import DeviceDetail from './components/DeviceDetail'
import { MachineData, machines, timeSlots, Status, MAINTENANCE_THRESHOLD } from './data/factoryData'

export default function App() {
  const [timelineIdx, setTimelineIdx] = useState(timeSlots.length - 1)
  const [hoveredMachine, setHoveredMachine] = useState<MachineData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [alarmDismissed, setAlarmDismissed] = useState(false)
  const [maintenanceReset, setMaintenanceReset] = useState<Record<string, number>>({})

  const currentSlot = timeSlots[timelineIdx]
  const machineStates: Record<string, Status> = currentSlot?.machineStates ?? {}

  const needsMaintenance = useCallback(
    (m: MachineData) => {
      const effectiveHours = maintenanceReset[m.id] !== undefined ? maintenanceReset[m.id] : m.runHours
      return effectiveHours > MAINTENANCE_THRESHOLD
    },
    [maintenanceReset],
  )

  const handleCompleteMaintenance = useCallback((machineId: string) => {
    setMaintenanceReset((prev) => ({ ...prev, [machineId]: 0 }))
  }, [])

  const hasAlarms = Object.values(machineStates).some((s) => s === 'red')
  const alarmMachine = machines.find((m) => machineStates[m.id] === 'red')

  useEffect(() => {
    setAlarmDismissed(false)
  }, [timelineIdx])

  const handleMachineHover = useCallback(
    (machine: MachineData | null, screenPos?: { x: number; y: number }) => {
      setHoveredMachine(machine)
      setTooltipPos(screenPos ?? null)
    },
    [],
  )

  const effectiveMachine = (m: MachineData): MachineData => {
    if (maintenanceReset[m.id] !== undefined) {
      return { ...m, runHours: maintenanceReset[m.id] }
    }
    return m
  }

  return (
    <div className="app-container">
      <TopBar />

      <div className="canvas-wrapper">
        <Scene
          machineStates={machineStates}
          onMachineHover={handleMachineHover}
          needsMaintenance={needsMaintenance}
        />
      </div>

      <RightPanel
        needsMaintenance={needsMaintenance}
        onCompleteMaintenance={handleCompleteMaintenance}
      />

      <BottomTimeline value={timelineIdx} onChange={setTimelineIdx} />

      <DeviceDetail machine={hoveredMachine ? effectiveMachine(hoveredMachine) : null} position={tooltipPos} />

      {hasAlarms && !alarmDismissed && alarmMachine && (
        <div className="alarm-banner">
          <span className="alarm-banner-icon">&#x1F6A8;</span>
          <span className="alarm-banner-text">
            {alarmMachine.name} 发生异常：{alarmMachine.alert ?? '设备故障'}
          </span>
          <button className="alarm-banner-close" onClick={() => setAlarmDismissed(true)}>
            &#x2715;
          </button>
        </div>
      )}
    </div>
  )
}
