import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './KnowledgeCard.css'
import { asset } from '../asset'

/* CONOCIMIENTO — Knowledge Base */

const CH_W = 152
const CH_H = 72
const CX = 47
const CY = 41

/* Nodos alrededor del logo. Las etiquetas van al lado del punto, no encima,
   para que ninguna caiga sobre una línea. */
const NODES = [
  { label: 'Seguridad', x: 103, y: 12, anchor: 'start' as const },
  { label: 'Obras', x: 116, y: 35, anchor: 'start' as const },
  { label: 'Educación', x: 110, y: 58, anchor: 'start' as const },
  { label: 'Salud', x: 78, y: 74, anchor: 'start' as const },
  /* rotulado hacia la izquierda: con la etiqueta a la derecha chocaba con
     la de Seguridad */
  { label: 'Gasto', x: 61, y: 9, anchor: 'end' as const },
]

const TOPICS = [
  {
    kind: 'ok' as const,
    title: 'Argumentos efectivos',
    claim: 'Inseguridad ciudadana',
    answer: 'Plan Control Territorial Ulises',
  },
  {
    kind: 'alert' as const,
    title: 'Alertas de crisis',
    claim: 'Gasto de campaña',
    answer: 'Respuesta certificada · Acta JNE-0045',
  },
]

type Props = { className?: string; style?: CSSProperties }

function KnowledgeCard({ className, style }: Props) {
  return (
    <HudCard
      title="Conocimiento"
      subtitle="Memoria institucional"
      system="Knowledge Base"
      meta="Actas / JNE / INEI / Memoria operativa"
      width={356}
      height={141}
      className={className}
      style={style}
    >
      <div className="ukb-body">
        <section className="ukb-panel ukb-panel--map">
          <h4 className="hud-title">Mapa de argumentos</h4>

          <div className="ukb-map">
            <svg
              className="ukb-graph"
              viewBox={`0 0 ${CH_W} ${CH_H}`}
              width={CH_W}
              height={CH_H}
              role="img"
              aria-label="Mapa mental de argumentos conectados al núcleo de campaña"
            >
              {NODES.map((n, i) => (
                <line
                  key={`l-${n.label}`}
                  className="ukb-edge"
                  x1={CX}
                  y1={CY}
                  x2={n.x}
                  y2={n.y}
                  pathLength={100}
                  style={{ '--d': `${0.12 + i * 0.07}s` } as CSSProperties}
                />
              ))}
              {NODES.map((n, i) => (
                <g
                  className="ukb-node"
                  key={n.label}
                  style={{ '--d': `${0.42 + i * 0.07}s` } as CSSProperties}
                >
                  <circle cx={n.x} cy={n.y} r={2.6} />
                  <text
                    x={n.anchor === 'end' ? n.x - 6 : n.x + 6}
                    y={n.y + 3}
                    textAnchor={n.anchor}
                  >
                    {n.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>

            {/* el logo va como <img> encima y no dentro del SVG: así no depende
                de cómo el navegador anide un SVG externo */}
            <img
              className="ukb-mark"
              src={asset('logo-goberna.svg')}
              alt=""
              style={{ left: `${CX}px`, top: `${CY}px` }}
            />
          </div>
        </section>

        <section className="ukb-panel">
          <ul className="ukb-topics">
            {TOPICS.map((t, i) => (
              <li
                key={t.title}
                data-kind={t.kind}
                style={{ '--d': `${0.2 + i * 0.12}s` } as CSSProperties}
              >
                <span className="ukb-kind">{t.title}</span>
                <span className="ukb-claim">{t.claim}</span>
                <span className="ukb-answer">{t.answer}</span>
              </li>
            ))}
          </ul>

        </section>
      </div>
    </HudCard>
  )
}

export default KnowledgeCard
