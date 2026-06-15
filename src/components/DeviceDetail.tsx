import { MachineData, Status } from '../data/factoryData'

interface Props {
  machine: MachineData | null
  position: { x: number; y: number } | null
}

const statusLabel: Record<Status, string> = {
  green: '正常运行',
  yellow: '性能预警',
  red: '设备故障',
}

const statusClass: Record<Status, string> = {
  green: 'good',
  yellow: 'warn',
  red: 'bad',
}

export default function DeviceDetail({ machine, position }: Props) {
  if (!machine || !position) return null

  const capacityPct = ((machine.currentOutput / machine.capacity) * 100).toFixed(1)

  return (
    <div
      className="device-detail"
      style={{
        left: Math.min(position.x + 16, window.innerWidth - 260),
        top: Math.min(position.y - 20, window.innerHeight - 280),
      }}
    >
      <div className="device-detail-title">{machine.name}</div>
      <div className="device-detail-row">
        <span className="device-detail-key">运行状态</span>
        <span className={`device-detail-val ${statusClass[machine.status]}`}>
          {statusLabel[machine.status]}
        </span>
      </div>
      <div className="device-detail-row">
        <span className="device-detail-key">运行时长</span>
        <span className="device-detail-val">{machine.runHours.toFixed(1)} 小时</span>
      </div>
      <div className="device-detail-row">
        <span className="device-detail-key">额定产能</span>
        <span className="device-detail-val">{machine.capacity} 件/h</span>
      </div>
      <div className="device-detail-row">
        <span className="device-detail-key">当前产出</span>
        <span className="device-detail-val">{machine.currentOutput} 件</span>
      </div>
      <div className="device-detail-row">
        <span className="device-detail-key">产能利用率</span>
        <span className={`device-detail-val ${Number(capacityPct) > 90 ? 'good' : Number(capacityPct) > 70 ? '' : 'warn'}`}>
          {capacityPct}%
        </span>
      </div>
      {machine.alert && (
        <div className="device-alert">
          <span className="device-alert-icon">&#x26A0;</span>
          {machine.alert}
        </div>
      )}
    </div>
  )
}
