import { useState, type CSSProperties } from 'react'
import HudCard from './HudCard'
import './AnalyticsCard.css'

/* ANALYTICS — Listening & Sentiment Engine */

type Tone = 'pos' | 'neu' | 'neg'

/* Las tres series suman 100 en cada punto: es un reparto de sentimiento, no
   tres métricas sueltas. El último valor es el que se rotula. */
const SERIES: { label: string; tone: Tone; points: number[] }[] = [
  { label: 'Positivo', tone: 'pos', points: [41, 44, 43, 47, 49, 48, 52, 55, 54, 56, 57, 58] },
  { label: 'Neutro', tone: 'neu', points: [36, 34, 35, 33, 31, 32, 30, 29, 29, 28, 27, 27] },
  { label: 'Negativo', tone: 'neg', points: [23, 22, 22, 20, 20, 20, 18, 16, 17, 16, 16, 15] },
]

const TOPICS = [
  { id: 'seguridad', tag: '#SEGURIDAD', traction: 64 },
  { id: 'educacion', tag: '#EDUCACION', traction: 41 },
  { id: 'obras', tag: '#OBRAS_LIMA', traction: 18 },
]

/* ---- geometría del gráfico, en unidades = px para que el texto salga nítido ---- */
const CH_W = 152
const CH_H = 62
const X0 = 3
const X1 = 76
const Y0 = 6
const Y1 = 54
const TOP = 64 // techo de la escala; deja aire sobre el 58

const px = (i: number, n: number) => X0 + (i * (X1 - X0)) / (n - 1)
const py = (v: number) => Y1 - (v / TOP) * (Y1 - Y0)

const linePath = (points: number[]) =>
  points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i, points.length).toFixed(1)} ${py(v).toFixed(1)}`)
    .join(' ')

type Props = { className?: string; style?: CSSProperties }

function AnalyticsCard({ className, style }: Props) {
  const [active, setActive] = useState<string>(TOPICS[0].id)

  return (
    <HudCard
      title="Analytics"
      subtitle="Patrones y tendencias"
      system="Listening & Sentiment Engine"
      width={356}
      height={124}
      className={className}
      style={style}
    >
      <div className="uac-body">
        <section className="uac-panel">
          <h4 className="hud-title">Sentimiento</h4>
          <svg
            className="uac-chart"
            viewBox={`0 0 ${CH_W} ${CH_H}`}
            width={CH_W}
            height={CH_H}
            role="img"
            aria-label="Evolución del sentimiento: positivo 58%, neutro 27%, negativo 15%"
          >
            {SERIES.map((s, i) => {
              const last = s.points[s.points.length - 1]
              const y = py(last)
              return (
                <g className="uac-serie" data-tone={s.tone} key={s.tone}>
                  <path
                    className="uac-line"
                    d={linePath(s.points)}
                    pathLength={100}
                    style={{ '--d': `${0.1 + i * 0.1}s` } as CSSProperties}
                  />
                  <circle className="uac-dot" cx={X1} cy={y} r={2.2} />
                  <text className="uac-serie-label" x={X1 + 9} y={y + 3}>
                    {s.label.toUpperCase()} {last}%
                  </text>
                </g>
              )
            })}
          </svg>
        </section>

        <section className="uac-panel">
          <h4 className="hud-title">Temas clave</h4>
          <ul className="uac-topics">
            {TOPICS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="uac-topic"
                  aria-pressed={active === t.id}
                  onMouseEnter={() => setActive(t.id)}
                  onFocus={() => setActive(t.id)}
                  onClick={() => setActive(t.id)}
                >
                  <span className="uac-topic-head">
                    <span className="uac-tag">{t.tag}</span>
                    <span className="uac-traction">+{t.traction}%</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </HudCard>
  )
}

export default AnalyticsCard
