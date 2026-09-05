import type { CSSProperties } from 'react'
import HudCard from './HudCard'
import './OpsCard.css'

/* COORDINACIÓN — Ops Coordination */

const MAP_W = 152
const MAP_H = 66

/* Mosaico esquemático de Lima Norte: mantiene la posición relativa de los
   ocho distritos (Ancón al norte, Carabayllo al este, SMP al suroeste), no
   sus fronteras reales. No sirve para nada geográfico. */
const DISTRICTS: { id: string; points: string; team?: 'a1' | 'b3' }[] = [
  { id: 'ancon', points: '5,4 61,3 72,14 54,26 23,29 4,19', team: 'b3' },
  { id: 'santa-rosa', points: '5,30 24,30 25,38 6,38' },
  { id: 'carabayllo', points: '75,6 141,9 144,40 110,48 85,36 72,16', team: 'a1' },
  { id: 'puente-piedra', points: '27,32 69,29 80,38 71,50 33,48' },
  { id: 'comas', points: '86,50 112,50 133,43 136,63 104,70 88,62' },
  { id: 'los-olivos', points: '54,52 83,50 86,63 61,65' },
  { id: 'smp', points: '10,42 52,50 58,67 31,75 8,63' },
  { id: 'independencia', points: '88,63 102,71 100,76 85,73' },
]

/* Las brigadas recorren estas rutas: un punto de luz viaja por cada una. */
const ROUTES = [
  { team: 'a1' as const, d: 'M 81 25 C 94 16 112 14 127 21 S 138 32 140 35' },
  { team: 'b3' as const, d: 'M 10 17 C 21 8 37 5 50 8 S 64 14 67 17' },
]

/* brigadas en posición, sin ruta activa */
const IDLE_UNITS = [
  { x: 48, y: 40 },
  { x: 69, y: 57 },
  { x: 32, y: 62 },
  { x: 110, y: 57 },
]

const BRIGADES = [
  {
    id: 'a1',
    name: 'Brigada A1',
    route: 'Ruta Carabayllo-02',
    progress: 85,
    status: 'Sincronizado',
  },
  {
    id: 'b3',
    name: 'Brigada B3',
    route: 'Ruta Ancón-04',
    progress: 62,
    status: 'Ruta asignada',
  },
]

type Props = { className?: string; style?: CSSProperties }

function OpsCard({ className, style }: Props) {
  return (
    <HudCard
      title="Coordinación"
      subtitle="Equipos y tareas"
      system="Ops Coordination"
      meta="Puerta a puerta · App de campo"
      width={356}
      height={150}
      className={className}
      style={style}
    >
      <div className="uop-body">
        <section className="uop-panel">
          <h4 className="hud-title">Lima Norte · brigadas</h4>

          <svg
            className="uop-map"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            width={MAP_W}
            height={MAP_H}
            role="img"
            aria-label="Minimapa de Lima Norte con las brigadas A1 y B3 en ruta"
          >
            {DISTRICTS.map((d, i) => (
              <polygon
                key={d.id}
                className="uop-district"
                data-team={d.team}
                points={d.points}
                style={{ '--d': `${0.05 + i * 0.035}s` } as CSSProperties}
              />
            ))}

            {IDLE_UNITS.map((u, i) => (
              <circle
                key={`u-${i}`}
                className="uop-unit"
                cx={u.x}
                cy={u.y}
                r={1.6}
                style={{ '--d': `${0.4 + i * 0.05}s` } as CSSProperties}
              />
            ))}

            {ROUTES.map((r) => (
              <g className="uop-route" data-team={r.team} key={r.team}>
                <path className="uop-route-line" d={r.d} />
                {/* dos trazos con el mismo recorrido: el ancho hace de halo y
                    el fino de núcleo, más barato que un filtro de desenfoque */}
                <path className="uop-blip uop-blip--halo" d={r.d} pathLength={100} />
                <path className="uop-blip" d={r.d} pathLength={100} />
              </g>
            ))}
          </svg>

          <p className="hud-metric">
            <span className="hud-metric-label">Cobertura hoy</span>
            <span className="hud-metric-value">92.5%</span>
          </p>
        </section>

        <section className="uop-panel">
          <h4 className="hud-title">Desempeño</h4>
          <ul className="uop-feed">
            {BRIGADES.map((b, i) => (
              <li
                key={b.id}
                data-team={b.id}
                style={{ '--d': `${0.3 + i * 0.12}s` } as CSSProperties}
              >
                <span className="uop-brigade">
                  <span className="uop-name">{b.name}</span>
                  <span className="uop-status">{b.status}</span>
                </span>
                <span className="uop-route-name">
                  {b.route}
                  <b>{b.progress}%</b>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </HudCard>
  )
}

export default OpsCard
