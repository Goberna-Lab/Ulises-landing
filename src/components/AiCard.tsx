import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './AiCard.css'

/* AI / ML — Predictive AI Engine */

const CH_W = 152
const CH_H = 62

/* Nube de puntos determinista: con Math.random cambiaría en cada render y el
   scatter “bailaría” al reabrir el panel. LCG sembrado, calculado una vez. */
function cluster(seed: number, cx: number, cy: number, rx: number, ry: number, n: number) {
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  return Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand())
    return { x: +(cx + Math.cos(a) * rx * r).toFixed(1), y: +(cy + Math.sin(a) * ry * r).toFixed(1) }
  })
}

const SEGMENTS = [
  { id: 'base', priority: false, points: cluster(7, 34, 40, 22, 13, 20) },
  { id: 'opuesto', priority: false, points: cluster(23, 120, 25, 19, 11, 16) },
  /* el segmento que importa: votante flotante */
  { id: 'flotante', priority: true, points: cluster(91, 80, 37, 16, 10, 13) },
]

const FLOAT_RING = { cx: 80, cy: 37, rx: 22, ry: 15 }

const RECOMMENDATIONS = [
  'Brigada #7 → Ancón, área flotante B1.',
  '#Seguridad en TikTok → mujeres 25-35.',
]

type Props = { className?: string; style?: CSSProperties }

function AiCard({ className, style }: Props) {
  let seq = 0

  return (
    <HudCard
      title="AI / ML"
      subtitle="Predice y recomienda"
      system="Predictive AI Engine"
      meta="Ajuste 4h · Confidence 92%"
      width={356}
      height={146}
      className={className}
      style={style}
      dataNode="ai"
    >
      <div className="uai-body">
        <section className="uai-panel">
          <h4 className="hud-title">Electorado</h4>

          <svg
            className="uai-scatter"
            viewBox={`0 0 ${CH_W} ${CH_H}`}
            width={CH_W}
            height={CH_H}
            role="img"
            aria-label="Clúster del electorado con el segmento de votante flotante resaltado"
          >
            <ellipse
              className="uai-ring"
              cx={FLOAT_RING.cx}
              cy={FLOAT_RING.cy}
              rx={FLOAT_RING.rx}
              ry={FLOAT_RING.ry}
              pathLength={100}
            />
            {SEGMENTS.map((seg) =>
              seg.points.map((p, i) => {
                const delay = 0.06 + (seq++ % 24) * 0.016
                return (
                  <circle
                    key={`${seg.id}-${i}`}
                    className="uai-pt"
                    data-priority={seg.priority || undefined}
                    cx={p.x}
                    cy={p.y}
                    r={seg.priority ? 2.6 : 2}
                    style={{ '--d': `${delay}s` } as CSSProperties}
                  />
                )
              }),
            )}
            <text className="uai-ring-label" x={FLOAT_RING.cx} y={FLOAT_RING.cy - FLOAT_RING.ry - 4}>
              FLOTANTE
            </text>
          </svg>

          <p className="hud-metric">
            <span className="hud-metric-label">Proyección de voto</span>
            <span className="hud-metric-value">+2.1%</span>
          </p>
        </section>

        <section className="uai-panel">
          <h4 className="hud-title">Recomendaciones</h4>
          <ol className="uai-feed">
            {RECOMMENDATIONS.map((text, i) => (
              <li key={text} style={{ '--d': `${0.45 + i * 0.12}s` } as CSSProperties}>
                <span className="uai-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="uai-text">{text}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </HudCard>
  )
}

export default AiCard
