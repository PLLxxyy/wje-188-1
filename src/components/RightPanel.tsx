import { operators, Status } from '../data/factoryData'

const statusLabels: Record<Status, string> = {
  green: '正常',
  yellow: '预警',
  red: '故障',
}

export default function RightPanel() {
  return (
    <div className="right-panel">
      {operators.map((op) => (
        <div
          key={op.stationId}
          className={`station-card${op.status === 'red' ? ' alarm' : ''}`}
        >
          <div className="station-name">
            <span className={`station-dot ${op.status}`} />
            {op.stationName}
          </div>
          <div className="station-info">
            操作员：<span>{op.operator}</span>
          </div>
          <div className="station-info">
            当前工序：<span>{op.process}</span>
          </div>
          <div className="station-info">
            状态：<span style={{ color: op.status === 'red' ? '#ef5350' : op.status === 'yellow' ? '#ffb74d' : '#4caf50' }}>
              {statusLabels[op.status]}
            </span>
          </div>
          <div className="station-count">{op.count.toLocaleString()}</div>
          {op.alert && (
            <div className="station-info" style={{ color: '#ff8a80', marginTop: 2 }}>
              {op.alert}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
