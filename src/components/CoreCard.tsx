import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './CoreCard.css'

/* ULISES CORE — Correlation Engine */

const CH_W = 152
const CH_H = 66
const RAIL_X = 7

/* Los cuatro verbos del núcleo, en el orden en que ocurren. El pulso los
   recorre en ese orden, igual que el paquete del diagrama recorre el eje.
   En vertical porque en horizontal las etiquetas obligaban a bajar a 6.8px
   y se tocaban entre sí. */
const STAGES = ['Correlaciona', 'Predice', 'Recomienda', 'Actúa']
const STEP = (CH_H - 12) / (STAGES.length - 1)
const sy = (i: number) => 6 + i * STEP

const PIPE = `M ${RAIL_X} ${sy(0)} L ${RAIL_X} ${sy(STAGES.length - 1)}`

const STATS = [
  { label: 'Señales / min', value: '4.2 K' },
  { label: 'Latencia p95', value: '820 ms' },
]

type Props = { className?: string; style?: CSSProperties }

function CoreCard({ className, style }: Props) {
  return (
    <HudCard
      title="Ulises Core"
      subtitle="Correlaciona. Predice. Recomienda. Actúa."
      system="Correlation Engine"
      meta="Todos los frentes · tiempo real"
      width={356}
      height={150}
      className={className}
      style={style}
      dataNode="core"
    >
      <div className="hud-cols">
        <section className="hud-col">
          <h4 className="hud-title">Cadena de proceso</h4>

          <svg
            className="uco-pipe"
            viewBox={`0 0 ${CH_W} ${CH_H}`}
            width={CH_W}
            height={CH_H}
            role="img"
            aria-label="Cadena: correlaciona, predice, recomienda, actúa"
          >
            <path className="uco-rail" d={PIPE} />
            {/* dos trazos con el mismo recorrido: el ancho hace de halo y el
                fino de núcleo, más barato que un filtro de desenfoque */}
            <path className="uco-pulse uco-pulse--halo" d={PIPE} pathLength={100} />
            <path className="uco-pulse" d={PIPE} pathLength={100} />

            {STAGES.map((s, i) => (
              <g
                className="uco-stage"
                key={s}
                style={{ '--d': `${0.12 + i * 0.09}s` } as CSSProperties}
              >
                <circle cx={RAIL_X} cy={sy(i)} r={3.6} />
                <text x={RAIL_X + 11} y={sy(i) + 3}>
                  {s.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>

          <p className="hud-metric">
            <span className="hud-metric-label">Decisiones hoy</span>
            <span className="hud-metric-value">318</span>
          </p>
        </section>

        <section className="hud-col">
          <h4 className="hud-title">Rendimiento</h4>

          <p className="uco-stats">
            {STATS.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b>
                {s.label}
              </span>
            ))}
          </p>
        </section>
      </div>
    </HudCard>
  )
}

export default CoreCard
