import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './DataCard.css'

/* DATA UNIFICADA — Data Fabric */

const CH_W = 152
const CH_H = 58

/* Los dos frentes entran por la izquierda y salen fundidos por la derecha.
   Los caudales son proporcionales al volumen de cada fuente. */
const IN_DIGITAL = { y: 14, w: 8 }
const IN_TERR = { y: 44, w: 6 }
const OUT_Y = 29
const OUT_W = IN_DIGITAL.w + IN_TERR.w

const merge = (from: { y: number; w: number }) =>
  `M 4 ${from.y} C 52 ${from.y} 66 ${OUT_Y} 116 ${OUT_Y}`

const SOURCES = [
  { id: 'digital', label: 'Digital', volume: '842 K', share: 62 },
  { id: 'territorial', label: 'Territorial', volume: '516 K', share: 38 },
]

type Props = { className?: string; style?: CSSProperties }

function DataCard({ className, style }: Props) {
  return (
    <HudCard
      title="Data unificada"
      subtitle="Digital + territorial"
      system="Data Fabric"
      meta="Padrón JNE / INEI 2017"
      width={356}
      height={142}
      className={className}
      style={style}
      dataNode="entry"
    >
      <div className="hud-cols">
        <section className="hud-col">
          <h4 className="hud-title">Fusión de frentes</h4>

          <svg
            className="uda-merge"
            viewBox={`0 0 ${CH_W} ${CH_H}`}
            width={CH_W}
            height={CH_H}
            role="img"
            aria-label="Los frentes digital y territorial se funden en un solo registro"
          >
            <path
              className="uda-flow"
              data-src="digital"
              d={merge(IN_DIGITAL)}
              style={{ strokeWidth: IN_DIGITAL.w, '--d': '0.1s' } as CSSProperties}
            />
            <path
              className="uda-flow"
              data-src="territorial"
              d={merge(IN_TERR)}
              style={{ strokeWidth: IN_TERR.w, '--d': '0.22s' } as CSSProperties}
            />
            <rect
              className="uda-out"
              x={116}
              y={OUT_Y - OUT_W / 2}
              width={32}
              height={OUT_W}
              rx={OUT_W / 2}
            />
            <text className="uda-cap" x={4} y={IN_DIGITAL.y - 9}>
              DIGITAL
            </text>
            <text className="uda-cap" x={4} y={IN_TERR.y + 11}>
              TERRITORIAL
            </text>
          </svg>

          <p className="hud-metric">
            <span className="hud-metric-label">Registros</span>
            <span className="hud-metric-value">1.36 M</span>
          </p>
        </section>

        <section className="hud-col">
          <h4 className="hud-title">Ingesta</h4>
          <ul className="hud-feed">
            {SOURCES.map((s, i) => (
              <li
                key={s.id}
                data-src={s.id}
                style={{ '--d': `${0.26 + i * 0.1}s` } as CSSProperties}
              >
                <span className="hud-row">
                  <span className="hud-label">{s.label}</span>
                  <span className="uda-vol">{s.volume}</span>
                </span>
                <span className="uda-bar">
                  <span
                    className="uda-bar-fill"
                    style={{ '--t': `${s.share}%` } as CSSProperties}
                  />
                </span>
              </li>
            ))}
          </ul>

        </section>
      </div>
    </HudCard>
  )
}

export default DataCard
