import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './AlertsCard.css'

/* ALERTAS — Threat & Opportunity Monitor */

const CH_W = 152
const CH_H = 48
const BASE = 40 // línea de suelo del histograma

type Level = 'alta' | 'media' | 'oport'

/* Volumen de alertas por franja en las últimas 24h. El color es el nivel más
   alto que se disparó en esa franja. */
const BANDS: { v: number; level: Level }[] = [
  { v: 2, level: 'media' },
  { v: 1, level: 'oport' },
  { v: 3, level: 'media' },
  { v: 2, level: 'oport' },
  { v: 5, level: 'alta' },
  { v: 4, level: 'alta' },
  { v: 2, level: 'media' },
  { v: 6, level: 'alta' },
  { v: 3, level: 'oport' },
  { v: 2, level: 'media' },
  { v: 4, level: 'alta' },
  { v: 3, level: 'media' },
]
const PEAK = 6

const ALERTS: { level: Level; label: string; text: string }[] = [
  {
    level: 'alta',
    label: 'Alta',
    text: 'Menciones negativas +38% en Comas, últimas 6 h.',
  },
  {
    level: 'oport',
    label: 'Oportunidad',
    text: '#Seguridad gana tracción sin inversión en TikTok.',
  },
]

const BW = (CH_W - 2) / BANDS.length

type Props = { className?: string; style?: CSSProperties }

function AlertsCard({ className, style }: Props) {
  return (
    <HudCard
      title="Alertas"
      subtitle="Riesgos y oportunidades"
      system="Threat & Opportunity Monitor"
      meta="Ventana 24h · umbral 3σ"
      width={356}
      height={146}
      className={className}
      style={style}
    >
      <div className="hud-cols">
        <section className="hud-col">
          <h4 className="hud-title">Últimas 24 h</h4>

          <svg
            className="ual-bands"
            viewBox={`0 0 ${CH_W} ${CH_H}`}
            width={CH_W}
            height={CH_H}
            role="img"
            aria-label="Volumen de alertas por franja en las últimas 24 horas"
          >
            <line className="ual-base" x1={0} y1={BASE} x2={CH_W} y2={BASE} />
            {BANDS.map((b, i) => {
              const h = (b.v / PEAK) * 32
              return (
                <rect
                  key={i}
                  className="ual-band"
                  data-level={b.level}
                  x={1 + i * BW}
                  y={BASE - h}
                  width={BW - 3}
                  height={h}
                  style={{ '--d': `${0.08 + i * 0.025}s` } as CSSProperties}
                />
              )
            })}
            <text className="ual-axis" x={0} y={CH_H - 1}>
              -24H
            </text>
            <text className="ual-axis" x={CH_W} y={CH_H - 1} textAnchor="end">
              AHORA
            </text>
          </svg>

          <p className="hud-metric">
            <span className="hud-metric-label">Alertas abiertas</span>
            <span className="hud-metric-value ual-open">7</span>
          </p>
        </section>

        <section className="hud-col">
          <h4 className="hud-title">Cola de atención</h4>
          <ul className="hud-feed">
            {ALERTS.map((a, i) => (
              <li
                key={a.text}
                data-level={a.level}
                style={{ '--d': `${0.24 + i * 0.1}s` } as CSSProperties}
              >
                <span className="hud-row">
                  <span className="hud-label ual-level">{a.label}</span>
                </span>
                <span className="hud-text">{a.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </HudCard>
  )
}

export default AlertsCard
