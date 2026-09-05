import { useEffect, useRef, type CSSProperties } from 'react'
import AiCard from './AiCard'
import AlertsCard from './AlertsCard'
import AnalyticsCard from './AnalyticsCard'
import CoreCard from './CoreCard'
import DataCard from './DataCard'
import DecisionsCard from './DecisionsCard'
import KnowledgeCard from './KnowledgeCard'
import OpsCard from './OpsCard'
import './Diagram.css'
import { asset } from '../asset'

const ICONS = {
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18',
  share: 'M7 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM22 6a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM22 18a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM6.8 10.8l10.5-3.6M6.8 13.2l10.5 3.6',
  chat: 'M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z',
  megaphone: 'M4 10v4h3l8 4V6l-8 4H4zM18 9a3 3 0 010 6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  poll: 'M6 20V12M12 20V5M18 20v-6M3 20h18',
  plug: 'M9 3v6M15 3v6M6 9h12v3a6 6 0 01-12 0V9zM12 18v3',
  trend: 'M3 17l5-6 4 3 6-8M15 6h5v5',
  coins: 'M12 8c4.4 0 8-1.1 8-2.5S16.4 3 12 3 4 4.1 4 5.5 7.6 8 12 8zM4 5.5v13C4 19.9 7.6 21 12 21s8-1.1 8-2.5v-13',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 13a1 1 0 100-2 1 1 0 000 2z',
  gauge: 'M4 19a9 9 0 1116 0M12 13l4-4',
  flag: 'M5 21V4M5 4h12l-2.5 4L17 12H5',
  pin: 'M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2 20a7 7 0 0114 0M17 5.2a3.5 3.5 0 010 6.6M18 20h4a5.5 5.5 0 00-4-5.3',
  route: 'M6 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 8v5a5 5 0 005 5h4',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  shield: 'M12 3l8 3v6c0 4.4-3.3 7.8-8 9-4.7-1.2-8-4.6-8-9V6l8-3z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  expand: 'M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  db: 'M12 8c4.4 0 8-1.1 8-2.5S16.4 3 12 3 4 4.1 4 5.5 7.6 8 12 8zM4 5.5v13C4 19.9 7.6 21 12 21s8-1.1 8-2.5v-13M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5',
  home: 'M4 11l8-6.5 8 6.5M6 9.8V20h12V9.8M10 20v-5.5h4V20',
  calendar: 'M4 6h16v14H4zM4 10h16M8.5 3v4M15.5 3v4',
  clipboard: 'M9.5 4.5h5v2.5h-5zM8 5.8H5.5v14.7h13V5.8H16M9 12.5h6M9 16.3h4',
  star: 'M12 3.5l2.6 5.5 6 .8-4.3 4.2 1 6-5.3-2.9-5.3 2.9 1-6L3.4 9.8l6-.8L12 3.5z',
} as const

type IconName = keyof typeof ICONS

function Icon({ name }: { name: IconName }) {
  return (
    <svg className="dg-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

type RailItem = { label: string; icon: IconName }

const DIGITAL_SOURCES: RailItem[] = [
  { label: 'Web & Noticias', icon: 'globe' },
  { label: 'Redes Sociales', icon: 'share' },
  { label: 'Mensajería', icon: 'chat' },
  { label: 'Publicidad Digital', icon: 'megaphone' },
  { label: 'Email & CRM', icon: 'mail' },
  { label: 'Encuestas', icon: 'poll' },
  { label: 'APIs & Sistemas', icon: 'plug' },
]

const TERRITORIAL_SOURCES: RailItem[] = [
  { label: 'Brigadas de campo', icon: 'users' },
  { label: 'Casa por casa', icon: 'home' },
  { label: 'Mítines y eventos', icon: 'calendar' },
  { label: 'Líderes locales', icon: 'star' },
  { label: 'Padrón y actas', icon: 'clipboard' },
]

const RESULTS: RailItem[] = [
  { label: 'Análisis de varianza', icon: 'trend' },
  { label: 'COGS & eficiencia', icon: 'coins' },
  { label: 'Impacto territorial', icon: 'target' },
  { label: 'Desempeño en tiempo real', icon: 'gauge' },
  { label: 'Control & gobernanza', icon: 'flag' },
]


const HERMES_CHIPS: RailItem[] = [
  { label: 'Redes y conversaciones', icon: 'chat' },
  { label: 'Audiencias', icon: 'users' },
  { label: 'Contenido y narrativa', icon: 'poll' },
  { label: 'Reputación', icon: 'shield' },
  { label: 'Campañas', icon: 'megaphone' },
  { label: 'Insights', icon: 'trend' },
]

const TERRITORIUM_CHIPS: RailItem[] = [
  { label: 'Mapeo y geografía', icon: 'pin' },
  { label: 'Sectores y zonas', icon: 'grid' },
  { label: 'Equipos y brigadas', icon: 'users' },
  { label: 'Rutas y visitas', icon: 'route' },
  { label: 'Cobertura e impacto', icon: 'target' },
  { label: 'Resultados y reportes', icon: 'trend' },
]

const FOUNDATIONS: { label: string; note: string; icon: IconName }[] = [
  { label: 'Datos unificados', note: 'Una sola fuente de verdad.', icon: 'db' },
  { label: 'Seguridad', note: 'Infraestructura robusta y protegida.', icon: 'shield' },
  { label: 'Tiempo real', note: 'Información y decisiones al instante.', icon: 'bolt' },
  { label: 'Escalable', note: 'Crece contigo y con tu campaña.', icon: 'expand' },
  { label: 'Visión 360°', note: 'Del dato a la acción, sin fricciones.', icon: 'eye' },
]

/* ---------------------------------------------------------------------------
   GEOMETRÍA
   Todo vive en un lienzo de BODY_W x BODY_H px y el SVG usa ese mismo viewBox,
   así 1 unidad = 1 px y los cables caen exactos sobre tarjetas y rieles.
--------------------------------------------------------------------------- */

const BODY_W = 1340
const BODY_H = 520

const ORIGIN_X = 670
const ORIGIN_Y = 100
const HALF_W = 152
const HALF_H = 76

/* Las tarjetas llevan alto fijo: si dependiera del texto, una nota de 1 o 2
   líneas descentraría la tarjeta y los cables llegarían torcidos. */
const MODULE_HALF_W = 71
const MODULE_HALF_H = 43
const CORE_HALF_W = 100
const CORE_HALF_H = 47

const isoX = (col: number, row: number) => ORIGIN_X + (col - row) * HALF_W
const isoY = (col: number, row: number) => ORIGIN_Y + (col + row) * HALF_H

/* Data unificada, Ulises Core y Decisiones comparten esta Y: es el eje por
   donde corre todo el flujo. */
const AXIS_Y = isoY(1, 1)
const IN_ANCHOR_X = isoX(0, 2) - MODULE_HALF_W - 4
const OUT_ANCHOR_X = isoX(2, 0) + MODULE_HALF_W + 4

/* Puertos: la columna donde nacen y mueren los cables junto a cada riel.
   El riel de salida lleva etiquetas más largas, así que su puerto queda más
   adentro; a cambio abre un abanico más corto y ambos lados conservan la
   misma proporción alto/ancho de curva. */
const PORT_IN_X = 170
const PORT_OUT_X = 1128

const PITCH = 32
const BLOCK_GAP = 64

const DIGITAL_SPAN = (DIGITAL_SOURCES.length - 1) * PITCH
const TERRITORIAL_SPAN = (TERRITORIAL_SOURCES.length - 1) * PITCH
const IN_SPAN = DIGITAL_SPAN + BLOCK_GAP + TERRITORIAL_SPAN
const IN_TOP = AXIS_Y - IN_SPAN / 2

const DIGITAL_Y = DIGITAL_SOURCES.map((_, i) => IN_TOP + i * PITCH)
const TERRITORIAL_Y = TERRITORIAL_SOURCES.map(
  (_, i) => IN_TOP + DIGITAL_SPAN + BLOCK_GAP + i * PITCH,
)
const TERRITORIAL_TITLE_Y = (DIGITAL_Y[DIGITAL_Y.length - 1] + TERRITORIAL_Y[0]) / 2

const RESULT_PITCH = 60
const RESULT_SPAN = (RESULTS.length - 1) * RESULT_PITCH
const RESULT_Y = RESULTS.map((_, i) => AXIS_Y - RESULT_SPAN / 2 + i * RESULT_PITCH)

const inWire = (y: number) => {
  const bend = (IN_ANCHOR_X - PORT_IN_X) * 0.5
  return `M ${PORT_IN_X} ${y} C ${PORT_IN_X + bend} ${y} ${IN_ANCHOR_X - bend} ${AXIS_Y} ${IN_ANCHOR_X} ${AXIS_Y}`
}

const outWire = (y: number) => {
  const bend = (PORT_OUT_X - OUT_ANCHOR_X) * 0.5
  return `M ${OUT_ANCHOR_X} ${AXIS_Y} C ${OUT_ANCHOR_X + bend} ${AXIS_Y} ${PORT_OUT_X - bend} ${y} ${PORT_OUT_X} ${y}`
}

/* Espina interna: los únicos tramos entre tarjetas que quedan a la vista.
   Se dibujan en el sentido del flujo para que el paquete viaje correcto. */
const SPINE_IN = `M ${isoX(0, 2) + MODULE_HALF_W + 6} ${AXIS_Y} L ${ORIGIN_X - CORE_HALF_W - 6} ${AXIS_Y}`
const SPINE_AI = `M ${ORIGIN_X} ${isoY(0, 0) + MODULE_HALF_H + 6} L ${ORIGIN_X} ${AXIS_Y - CORE_HALF_H - 6}`
const SPINE_OUT = `M ${ORIGIN_X + CORE_HALF_W + 6} ${AXIS_Y} L ${isoX(2, 0) - MODULE_HALF_W - 6} ${AXIS_Y}`

/* ---------------------------------------------------------------------------
   SIMULACIÓN
   Un solo ciclo de 7s. Cada animación dura exactamente el ciclo y su fase se
   fija con animation-delay, así los tiempos no se desincronizan nunca: el
   paquete entra en un nodo justo cuando arranca el tramo siguiente.
--------------------------------------------------------------------------- */

const T = {
  sources: 0, // 0.00 -> 1.40  las 12 fuentes emiten hacia Data unificada
  entry: 1.3, // 1.30          Data unificada acusa la llegada
  toCore: 1.45, // 1.45 -> 2.36  dato unificado y AI/ML entran al núcleo a la vez
  core: 2.3, // 2.30 -> 3.70  el núcleo correlaciona
  toExit: 3.0, // 3.00 -> 3.91  el núcleo entrega a Decisiones
  exit: 3.85, // 3.85          Decisiones acusa la llegada
  results: 4.0, // 4.00 -> 5.40  Decisiones alimenta los resultados
  land: 5.3, // 5.30          los resultados se encienden
}

/* La fase viaja como custom property: animation-delay no se hereda, pero una
   variable sí, y así los ::before/::after de cada nodo entran en el mismo
   compás que su cable. */
/* La posición viaja como custom property, no como `left`/`top` en línea: un
   estilo en línea no se puede sobreescribir desde una media query, y en móvil
   necesitamos que las tarjetas dejen de estar posicionadas y fluyan. */
const at = (x: number | null, y: number) => {
  const vars: Record<string, string> = { '--y': `${y}px` }
  if (x !== null) vars['--x'] = `${x}px`
  return vars as CSSProperties
}

const phase = (seconds: number) => ({ '--phase': `${seconds}s` }) as CSSProperties

function Diagram() {
  const bodyRef = useRef<HTMLDivElement>(null)

  /* La simulación solo corre con la sección a la vista. */
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-live', entry.isIntersecting),
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const renderRailItem = (item: RailItem, y: number, seconds: number, tone: string) => (
    <div
      className={`dg-rail-item dg-rail-item--${tone}`}
      key={item.label}
      style={{ ...at(null, y), ...phase(seconds) }}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </div>
  )

  return (
    <section className="diagram" id="sistema" data-tone="light">
      <div className="diagram-scroll">
        <div className="diagram-canvas">
          <header className="dg-head">
            <img className="dg-mark" src={asset('logo-goberna.svg')} alt="" />
            <h2 className="dg-wordmark">Ulises</h2>
            <p className="dg-kicker">Intelligence Operating System</p>
            <p className="dg-tagline">Una sola inteligencia. Todos los frentes.</p>
          </header>

          <div className="dg-flow">
            <span>Datos</span>
            <i />
            <span>Inteligencia</span>
            <i />
            <span className="is-action">Acción</span>
          </div>

          <div className="dg-body" ref={bodyRef}>
            <svg className="dg-wires" viewBox={`0 0 ${BODY_W} ${BODY_H}`} aria-hidden="true">
              {DIGITAL_Y.map((y, i) => (
                <g key={`dig-${i}`} className="dg-line dg-line--digital">
                  <path className="dg-wire" d={inWire(y)} />
                  <path
                    className="dg-packet"
                    d={inWire(y)}
                    pathLength={100}
                    style={phase(T.sources + i * 0.035)}
                  />
                </g>
              ))}
              {TERRITORIAL_Y.map((y, i) => (
                <g key={`ter-${i}`} className="dg-line dg-line--territorial">
                  <path className="dg-wire" d={inWire(y)} />
                  <path
                    className="dg-packet"
                    d={inWire(y)}
                    pathLength={100}
                    style={phase(T.sources + i * 0.035)}
                  />
                </g>
              ))}
              {RESULT_Y.map((y, i) => (
                <g key={`res-${i}`} className="dg-line dg-line--outcome">
                  <path className="dg-wire" d={outWire(y)} />
                  <path
                    className="dg-packet"
                    d={outWire(y)}
                    pathLength={100}
                    style={phase(T.results + i * 0.035)}
                  />
                </g>
              ))}

              {DIGITAL_Y.map((y) => (
                <circle key={`pd-${y}`} className="dg-node dg-node--digital" cx={PORT_IN_X} cy={y} r={2.5} />
              ))}
              {TERRITORIAL_Y.map((y) => (
                <circle key={`pt-${y}`} className="dg-node dg-node--territorial" cx={PORT_IN_X} cy={y} r={2.5} />
              ))}
              {RESULT_Y.map((y) => (
                <circle key={`pr-${y}`} className="dg-node dg-node--outcome" cx={PORT_OUT_X} cy={y} r={2.5} />
              ))}

              {/* punto de fusión: los dos frentes se vuelven un solo dato */}
              <circle className="dg-merge" cx={IN_ANCHOR_X} cy={AXIS_Y} r={4} style={phase(T.entry)} />
            </svg>

            <div className="dg-rail dg-rail--in">
              <p className="dg-rail-title dg-rail-title--digital">Fuentes digitales</p>
              {DIGITAL_SOURCES.map((item, i) => renderRailItem(item, DIGITAL_Y[i], T.sources, 'digital'))}

              <p
                className="dg-rail-title dg-rail-title--territorial"
                style={at(null, TERRITORIAL_TITLE_Y)}
              >
                Fuentes territoriales
              </p>
              {TERRITORIAL_SOURCES.map((item, i) =>
                renderRailItem(item, TERRITORIAL_Y[i], T.sources, 'territorial'),
              )}
            </div>

            <div className="dg-core">
              <div className="dg-plate dg-plate--3" />
              <div className="dg-plate dg-plate--2" />
              <div className="dg-plate dg-plate--1" />

              <svg className="dg-spine" viewBox={`0 0 ${BODY_W} ${BODY_H}`} aria-hidden="true">
                <g className="dg-line dg-line--unified">
                  <path className="dg-wire" d={SPINE_IN} />
                  <path className="dg-packet dg-packet--short" d={SPINE_IN} pathLength={100} style={phase(T.toCore)} />
                </g>
                <g className="dg-line dg-line--unified">
                  <path className="dg-wire" d={SPINE_AI} />
                  <path className="dg-packet dg-packet--short" d={SPINE_AI} pathLength={100} style={phase(T.toCore)} />
                </g>
                <g className="dg-line dg-line--outcome">
                  <path className="dg-wire" d={SPINE_OUT} />
                  <path className="dg-packet dg-packet--short" d={SPINE_OUT} pathLength={100} style={phase(T.toExit)} />
                </g>
              </svg>

              <AnalyticsCard
                className="dg-module"
                style={{ ...at(isoX(0, 1), isoY(0, 1)) }}
              />
              <AiCard
                className="dg-module"
                style={{
                  ...at(isoX(0, 0), isoY(0, 0)),
                  ...phase(T.toCore),
                }}
              />
              <KnowledgeCard
                className="dg-module"
                style={{ ...at(isoX(1, 2), isoY(1, 2)) }}
              />
              <OpsCard
                className="dg-module"
                style={{ ...at(isoX(2, 1), isoY(2, 1)) }}
              />
              <DecisionsCard
                className="dg-module"
                style={{
                  ...at(isoX(2, 0), isoY(2, 0)),
                  ...phase(T.exit),
                }}
              />

              <AlertsCard
                className="dg-module"
                style={{ ...at(isoX(1, 0), isoY(1, 0)) }}
              />
              <DataCard
                className="dg-module"
                style={{
                  ...at(isoX(0, 2), isoY(0, 2)),
                  ...phase(T.entry),
                }}
              />
              <CoreCard
                className="dg-module dg-module--core"
                style={{ ...at(isoX(1, 1), isoY(1, 1)), ...phase(T.core) }}
              />
            </div>

            <div className="dg-rail dg-rail--out">
              <p className="dg-rail-title dg-rail-title--outcome">Resultados</p>
              {RESULTS.map((item, i) => renderRailItem(item, RESULT_Y[i], T.land, 'outcome'))}
            </div>
          </div>

          <div className="dg-domains">
            <section className="dg-domain dg-domain--digital">
              <span className="dg-domain-icon">
                <Icon name="chat" />
              </span>
              <h3>Hermes</h3>
              <p className="dg-domain-kicker">Dominio digital</p>
              <p className="dg-domain-note">Inteligencia y operación del frente digital.</p>
              <ul className="dg-chips">
                {HERMES_CHIPS.map((chip) => (
                  <li key={chip.label}>
                    <Icon name={chip.icon} />
                    <span>{chip.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="dg-domain dg-domain--territorial">
              <span className="dg-domain-icon">
                <Icon name="pin" />
              </span>
              <h3>Centurion + Territorium</h3>
              <p className="dg-domain-kicker">Dominio territorial</p>
              <p className="dg-domain-note">Inteligencia y operación del frente territorial.</p>
              <ul className="dg-chips">
                {TERRITORIUM_CHIPS.map((chip) => (
                  <li key={chip.label}>
                    <Icon name={chip.icon} />
                    <span>{chip.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <ul className="dg-foundations">
            {FOUNDATIONS.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} />
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Diagram
