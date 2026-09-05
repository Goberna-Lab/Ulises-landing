import { useState, type CSSProperties } from 'react'
import HudCard from './HudCard'
import './DecisionsCard.css'

/* DECISIONES — Decision Support Engine */

const MX_W = 152
const MX_H = 86
const PAD = 10 // margen interno del plano, para que los puntos no toquen el eje

/* Matriz de priorización. `u` = urgencia (0-1), `i` = impacto (0-1).
   El cuadrante sale de esos dos valores, no está escrito a mano: si mañana
   cambia la data, el tema se mueve solo de cuadrante. */
type Item = {
  id: string
  tag: string
  u: number
  i: number
  action: string
}

const ITEMS: Item[] = [
  {
    id: 'seguridad',
    tag: '#Seguridad',
    u: 0.82,
    i: 0.78,
    action: 'Atacar voto blando en Comas.',
  },
  {
    id: 'obras',
    tag: '#Obras',
    u: 0.72,
    i: 0.3,
    action: 'Consolidar voto duro en San Martín de Porres.',
  },
  {
    id: 'educacion',
    tag: '#Educación',
    u: 0.28,
    i: 0.8,
    action: 'Mantener presencia, sin recursos adicionales.',
  },
]

const QUADRANTS = [
  { id: 'crecer', label: 'Crecer', u: 1, i: 1 },
  { id: 'defender', label: 'Defender', u: 1, i: 0 },
  { id: 'sostener', label: 'Sostener', u: 0, i: 1 },
  { id: 'observar', label: 'Observar', u: 0, i: 0 },
]

const mx = (u: number) => PAD + u * (MX_W - PAD * 2)
const my = (i: number) => MX_H - PAD - i * (MX_H - PAD * 2)

/* El umbral es 0.5 en los dos ejes, que es justo donde se dibujan: si no,
   un tema puede caer visualmente en un cuadrante y clasificarse en otro. */
const quadrantOf = (it: Item) =>
  it.u >= 0.5 ? (it.i >= 0.5 ? 'crecer' : 'defender') : it.i >= 0.5 ? 'sostener' : 'observar'

type Props = { className?: string; style?: CSSProperties }

function DecisionsCard({ className, style }: Props) {
  const [active, setActive] = useState<string>(ITEMS[0].id)

  return (
    <HudCard
      title="Decisiones"
      subtitle="Estrategia y prioridades"
      system="Decision Support Engine"
      meta="AI · Analytics · Alertas"
      width={356}
      height={168}
      className={className}
      style={style}
      dataNode="exit"
    >
      <div className="ude-body">
        <section className="ude-panel">
          <h4 className="hud-title">Urgencia × impacto</h4>

          <svg
            className="ude-matrix"
            viewBox={`0 0 ${MX_W} ${MX_H}`}
            width={MX_W}
            height={MX_H}
            role="img"
            aria-label="Matriz de urgencia frente a impacto con los temas clave situados"
          >
            <line className="ude-axis" x1={MX_W / 2} y1={2} x2={MX_W / 2} y2={MX_H - 2} />
            <line className="ude-axis" x1={2} y1={MX_H / 2} x2={MX_W - 2} y2={MX_H / 2} />

            {QUADRANTS.map((q) => (
              <text
                key={q.id}
                className="ude-quad"
                data-quad={q.id}
                x={q.u ? MX_W - 4 : 4}
                y={q.i ? 10 : MX_H - 3}
                textAnchor={q.u ? 'end' : 'start'}
              >
                {q.label.toUpperCase()}
              </text>
            ))}

            {ITEMS.map((it, n) => {
              const quad = quadrantOf(it)
              return (
                <g
                  className="ude-item"
                  key={it.id}
                  data-quad={quad}
                  data-active={active === it.id || undefined}
                  style={{ '--d': `${0.2 + n * 0.11}s` } as CSSProperties}
                >
                  <circle className="ude-halo" cx={mx(it.u)} cy={my(it.i)} r={9} />
                  <circle className="ude-pt" cx={mx(it.u)} cy={my(it.i)} r={4} />
                  <text className="ude-pt-label" x={mx(it.u)} y={my(it.i) + 13} textAnchor="middle">
                    {it.tag}
                  </text>
                </g>
              )
            })}
          </svg>

        </section>

        <section className="ude-panel">
          <h4 className="hud-title">Prioridades</h4>
          <ul className="ude-feed">
            {ITEMS.filter((it) => it.u >= 0.5).map((it, n) => {
              const quad = quadrantOf(it)
              return (
                <li
                  key={it.id}
                  data-quad={quad}
                  data-active={active === it.id || undefined}
                  style={{ '--d': `${0.28 + n * 0.11}s` } as CSSProperties}
                  onMouseEnter={() => setActive(it.id)}
                >
                  <span className="ude-head">
                    <span className="ude-quad-name">{quad}</span>
                    <span className="ude-tag">{it.tag}</span>
                  </span>
                  <span className="ude-action">{it.action}</span>
                </li>
              )
            })}
          </ul>

          <p className="ude-exec">
            <span className="ude-exec-line">
              <b>Ruta a la Victoria v4.1</b> · 70% de recursos en Lima Norte.
            </span>
          </p>
        </section>
      </div>
    </HudCard>
  )
}

export default DecisionsCard
