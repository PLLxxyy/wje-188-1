import { useState, useCallback, useEffect } from 'react'
import Scene from './components/Scene'
import TopBar from './components/TopBar'
import BottomTimeline from './components/BottomTimeline'
import RightPanel from './components/RightPanel'
import DeviceDetail from './components/DeviceDetail'
import { MachineData, machines, timeSlots, Status } from './data/factoryData'

export default function App() {
  const [timelineIdx, setTimelineIdx] = useState(timeSlots.length - 1)
  const [hoveredMachine, setHoveredMachine] = useState<MachineData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [alarmDismissed, setAlarmDismissed] = useState(false)

  const currentSlot = timeSlots[timelineIdx]
  const machineStates: Record<string, Status> = currentSlot?.machineStates ?? {}

  // Check if there are alarm conditions
  const hasAlarms = Object.values(machineStates).some((s) => s === 'red')
  const alarmMachine = machines.find((m) => machineStates[m.id] === 'red')

  // Reset alarm banner when timeline changes
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

  return (
    <div className="app-container">
      {/* Top summary bar */}
      <TopBar />

      {/* 3D Scene */}
      <div className="canvas-wrapper">
        <Scene machineStates={machineStates} onMachineHover={handleMachineHover} />
      </div>

      {/* Right station list */}
      <RightPanel />

      {/* Bottom timeline */}
      <BottomTimeline value={timelineIdx} onChange={setTimelineIdx} />

      {/* Device hover detail */}
      <DeviceDetail machine={hoveredMachine} position={tooltipPos} />

      {/* Alarm banner */}
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
