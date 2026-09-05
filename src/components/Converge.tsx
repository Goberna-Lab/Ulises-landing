import { useEffect, useRef } from 'react'
import ChaosScatter from './ChaosScatter'
import './Converge.css'
import { asset } from '../asset'


const COUNTERS = [
  { key: 'duro', label: 'Voto duro proyectado', value: 218400 },
  { key: 'blando', label: 'Voto blando', value: 121600 },
  { key: 'flotante', label: 'Flotante por persuadir', value: 72350 },
]

const META = 412350

const DISTRICTS = [
  { name: 'Ancón', cov: 31, d: 'M30 10 L210 10 L200 70 L60 78 Z', lx: 118, ly: 46 },
  { name: 'Puente Piedra', cov: 71, d: 'M60 78 L130 74 L126 150 L44 146 Z', lx: 86, ly: 116 },
  { name: 'Carabayllo', cov: 92, d: 'M130 74 L200 70 L214 140 L196 176 L126 150 Z', lx: 170, ly: 122 },
  { name: 'Comas', cov: 66, d: 'M126 150 L196 176 L188 232 L122 220 Z', lx: 158, ly: 197 },
  { name: 'Los Olivos', cov: 58, d: 'M44 146 L126 150 L122 220 L52 210 Z', lx: 86, ly: 184 },
  { name: 'S. M. de Porres', cov: 54, d: 'M52 210 L122 220 L116 300 L40 288 Z', lx: 82, ly: 256 },
  { name: 'Independencia', cov: 43, d: 'M122 220 L188 232 L176 296 L116 300 Z', lx: 150, ly: 262 },
]

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

const range = (value: number, from: number, to: number) =>
  clamp01((value - from) / (to - from))

const easeOut = (value: number) => 1 - (1 - value) ** 3

const format = (value: number) => Math.round(value).toLocaleString('en-US')

function useConvergeScrub() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) {
      return
    }

    const setProgress = (p: number) => {
      const set = (name: string, value: number) =>
        stage.style.setProperty(name, String(value))

      // Fase 1-2: caos, convergencia y barrido a war room
      // La pregunta entra antes que nada y se apaga justo cuando las piezas
      // convergen: es el hueco que ocupaban seis tarjetas flotando sin decir
      // qué cuesta tenerlas separadas.
      set('--ask', range(p, 0.005, 0.035))
      // ya no mueve las tarjetas (eso lo hace GSAP): solo apaga la pregunta
      // cuando el caos vuelve al núcleo, en el mismo tramo 0.17-0.26
      set('--gather', range(p, 0.17, 0.24))
      const wipe = range(p, 0.2, 0.32)
      set('--wipe', wipe)
      sectionRef.current?.setAttribute(
        'data-tone',
        wipe > 0.5 ? 'dark' : 'light',
      )
      set('--reveal', range(p, 0.28, 0.4))
      set('--reveal-out', range(p, 0.44, 0.5))
      // Fase 3: nodos de dominio, core y conectores
      set('--arch', easeOut(range(p, 0.48, 0.63)))
      set('--flow', range(p, 0.58, 0.72))
      set('--arch-out', range(p, 0.72, 0.79))
      // Fase 4: war room
      set('--room', easeOut(range(p, 0.74, 0.87)))
      const data = range(p, 0.8, 0.97)
      set('--data', data)
      // El CTA solo existe cuando el war room ya está en pantalla: oculto de
      // verdad (visibility) y no solo transparente, para que no quede un
      // enlace invisible en el orden de tabulación.
      stage.dataset.cta = data > 0.55 ? 'on' : 'off'

      const eased = easeOut(data)
      const numbers = numbersRef.current
      COUNTERS.forEach((counter) => {
        const node = numbers.get(counter.key)
        if (node) {
          node.textContent = format(counter.value * eased)
        }
      })
      const meta = numbers.get('meta')
      if (meta) {
        meta.textContent = format(META * eased)
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }

    let frame = 0

    const render = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) {
        return
      }

      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      setProgress(travel > 0 ? clamp01(-rect.top / travel) : 0)
    }

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(render)
      }
    }

    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  const bindNumber = (key: string) => (node: HTMLElement | null) => {
    if (node) {
      numbersRef.current.set(key, node)
    } else {
      numbersRef.current.delete(key)
    }
  }

  return { sectionRef, stageRef, bindNumber }
}

function Converge() {
  const { sectionRef, stageRef, bindNumber } = useConvergeScrub()

  return (
    <section className="converge" ref={sectionRef} data-tone="light">
      <div className="converge-stage" ref={stageRef}>

        <ChaosScatter trigger={sectionRef} />

        <div className="chaos-ask">
          <p className="chaos-ask-q">¿Cuántos votos tienes hoy?</p>
          <span className="chaos-ask-slot" aria-hidden="true" />
          <p className="chaos-ask-note">
            Seis fuentes. Tres equipos. Ninguna respuesta.
          </p>
        </div>


        <div className="converge-veil" />

        <div className="converge-resolved">
          <img className="converge-mark" src={asset('logo-goberna.svg')} alt="" />
          <h2 className="converge-title">
            Ahora viven en <em>uno</em>
          </h2>
          <p className="converge-note">
            Un solo sistema. Una sola cifra. Un solo cuarto de guerra.
          </p>
        </div>

        {/* Fase 3 — arquitectura */}
        <div className="arch">
          <div className="arch-node arch-node--digital">
            <span className="arch-tag">Dominio digital</span>
            <strong>Hermes</strong>
            <span className="arch-note">WhatsApp · Facebook · SMS</span>
            <span className="arch-note">Bandeja unificada</span>
          </div>

          <span className="arch-link arch-link--left" aria-hidden="true" />

          <div className="arch-core">
            <img src={asset('logo-goberna.svg')} alt="" />
            <strong>Ulises Core</strong>
            <span>Correlaciona · Predice · Actúa</span>
          </div>

          <span className="arch-link arch-link--right" aria-hidden="true" />

          <div className="arch-node arch-node--territorial">
            <span className="arch-tag">Dominio territorial</span>
            <strong>Centurion + Territorium</strong>
            <span className="arch-note">Cuadernos · Actas · Padrón</span>
            <span className="arch-note">App de campo · Cartografía</span>
          </div>

          <p className="arch-meta">
            Sistema operativo · Lima Norte · Padrón 1,008,190
          </p>
        </div>

        {/* Fase 4 — war room */}
        <div className="room-wrap">
        <div className="room">
          <header className="room-head">
            <span className="room-title">Ulises · Cuarto de guerra</span>
            <span className="room-live">En vivo</span>
          </header>

          <div className="room-grid">
            <div className="room-figures">
              <p className="room-kicker">Meta calculada · 1.ª vuelta</p>
              <p className="room-meta" ref={bindNumber('meta')}>
                0
              </p>
              <p className="room-sub">40.9 % del padrón · Lima Norte</p>

              <ul className="room-breakdown">
                {COUNTERS.map((counter) => (
                  <li key={counter.key}>
                    <span className="room-bar">
                      <i
                        style={
                          {
                            '--w': `${(counter.value / META) * 100}%`,
                          } as React.CSSProperties
                        }
                      />
                    </span>
                    <span className="room-value" ref={bindNumber(counter.key)}>
                      0
                    </span>
                    <span className="room-label">{counter.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="room-map">
              <p className="room-kicker">Meta territorial por distrito</p>
              <svg viewBox="0 0 260 320" aria-hidden="true">
                {DISTRICTS.map((district) => (
                  <path
                    key={district.name}
                    className="district"
                    d={district.d}
                    style={
                      { '--cov': district.cov / 100 } as React.CSSProperties
                    }
                  />
                ))}
                {DISTRICTS.map((district) => (
                  <text
                    key={`${district.name}-label`}
                    className={`district-label ${
                      district.cov >= 60 ? 'is-dark' : 'is-light'
                    }`}
                    x={district.lx}
                    y={district.ly}
                  >
                    {district.cov}%
                  </text>
                ))}
              </svg>
              <p className="room-legend">
                <span>Ancón 31%</span>
                <span>Carabayllo 92%</span>
              </p>
            </div>
          </div>

          <footer className="room-foot">
            Fuente: Censo INEI 2017 · Corte horario: tiempo real · Cifra
            certificada en acta al cierre
          </footer>
        </div>

        <div className="room-claim">
          <h2>
            Control total de tu <em>operación</em>
          </h2>
          <p>Dónde crecer. Dónde defender.</p>
        </div>

        <div className="room-cta">
          <a href="#contacto">Ver Ulises con tu padrón</a>
          <span>Demo sobre tus distritos · sin compromiso</span>
        </div>
        </div>
      </div>
    </section>
  )
}

export default Converge
