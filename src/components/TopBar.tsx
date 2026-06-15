import { useState, useEffect, useRef } from 'react'
import { getSummary, SummaryData } from '../data/factoryData'

export default function TopBar() {
  const [data, setData] = useState<SummaryData>(getSummary)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData((prev) => ({
        totalOutput: prev.totalOutput + Math.floor(Math.random() * 5),
        goodRate: Math.min(100, Math.max(95, prev.goodRate + (Math.random() - 0.5) * 0.2)),
        onlineRate: Math.min(100, Math.max(70, prev.onlineRate + (Math.random() - 0.48) * 0.3)),
        energyKwh: +(prev.energyKwh + Math.random() * 0.5).toFixed(1),
      }))
    }, 1500)
    return () => clearInterval(intervalRef.current)
  }, [])

  const rateClass = (v: number, warn: number, bad: number) =>
    v < bad ? 'danger' : v < warn ? 'warning' : ''

  return (
    <div className="top-bar">
      <div className="top-bar-card">
        <div className="top-bar-label">今日产量</div>
        <div className="top-bar-value">
          {data.totalOutput.toLocaleString()}
          <span className="top-bar-unit">件</span>
        </div>
      </div>
      <div className="top-bar-card">
        <div className="top-bar-label">良品率</div>
        <div className={`top-bar-value ${rateClass(data.goodRate, 97, 95)}`}>
          {data.goodRate.toFixed(1)}
          <span className="top-bar-unit">%</span>
        </div>
      </div>
      <div className="top-bar-card">
        <div className="top-bar-label">设备在线率</div>
        <div className={`top-bar-value ${rateClass(data.onlineRate, 90, 80)}`}>
          {data.onlineRate.toFixed(1)}
          <span className="top-bar-unit">%</span>
        </div>
      </div>
      <div className="top-bar-card">
        <div className="top-bar-label">累计能耗</div>
        <div className="top-bar-value">
          {data.energyKwh.toFixed(0)}
          <span className="top-bar-unit">kWh</span>
        </div>
      </div>
    </div>
  )
}
