import { timeSlots } from '../data/factoryData'

interface Props {
  value: number
  onChange: (v: number) => void
}

export default function BottomTimeline({ value, onChange }: Props) {
  const currentSlot = timeSlots[value]

  return (
    <div className="bottom-timeline">
      <div className="timeline-header">
        <div className="timeline-title">产线状态回放</div>
        <div className="timeline-time">{currentSlot?.label ?? ''}</div>
      </div>
      <div className="timeline-slider-wrap">
        <input
          className="timeline-slider"
          type="range"
          min={0}
          max={timeSlots.length - 1}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className="timeline-marks">
        {timeSlots.map((s) => (
          <span className="timeline-mark" key={s.label}>{s.label}</span>
        ))}
      </div>
    </div>
  )
}
