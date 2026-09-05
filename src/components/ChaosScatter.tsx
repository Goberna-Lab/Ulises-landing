import { useRef, type ReactElement, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ChaosScatter.css'
import { asset } from '../asset'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* ---------------------------------------------------------------------------
   FASE 1 — La mesa de inteligencia

   Scroll 0: la escena está vacía. Primero aparece la pregunta sola, luego el
   núcleo, y después las fuentes entran UNA A UNA en orden narrativo: lo que
   llega crudo, la percepción pública, la comunicación, el territorio, el
   dataset estructurado y, al final, las actas como capa de validación. Cada
   una tira una línea hacia el centro. Al final todo converge al núcleo.

   La escena NO se fija aquí: `.converge-stage` ya es `position: sticky` y ese
   es el pin. ScrollTrigger solo hace `scrub`; poner `pin: true` añadiría un
   segundo mecanismo de fijado peleando con el sticky.

   Dos capas por fuente: el <li> lleva la transform del scroll y el panel
   interior una deriva propia en bucle. Si ambas escribieran sobre el mismo
   elemento, la última en correr pisaría a la otra.
--------------------------------------------------------------------------- */

type Origin = 'digital' | 'territorial' | 'dataset'

type Source = {
  id: string
  tag: string
  meta: string
  origin: Origin
  x: number // vw desde el centro
  y: number // vh desde el centro
  r: number // deg
  s: number // escala en reposo: da jerarquía sin cambiar el ancho
}

/* El orden del array ES el orden de aparición. */
const SOURCES: Source[] = [
  { id: 'chat', tag: 'Ingesta / chat‑feed', meta: '3 activos', origin: 'digital', x: -30, y: -25, r: -2.5, s: 1 },
  { id: 'social', tag: 'Social_listening', meta: 'en vivo', origin: 'digital', x: 32, y: -26, r: 2, s: 0.95 },
  { id: 'sms', tag: 'Comunicación / sms‑feed', meta: '2 vías', origin: 'digital', x: -32, y: 23, r: 2.5, s: 0.95 },
  { id: 'mapa', tag: 'Territorio / campo', meta: '7 zonas', origin: 'territorial', x: -34, y: -1, r: -1.5, s: 1 },
  { id: 'dataset', tag: 'Fuentes / dataset', meta: 'JNE · INEI', origin: 'dataset', x: 33, y: 2, r: -2, s: 0.95 },
  { id: 'actas', tag: 'Actas / evidencia', meta: 'validado', origin: 'territorial', x: 29, y: 27, r: 2, s: 0.95 },
]

/* La línea se detiene antes de llegar: un trazo completo cruzaría el titular. */
const LINK_FROM = 0.84
const LINK_TO = 0.54

/* ---------- miniaturas ---------- */

const bar = (w: number, key?: string | number) => (
  <span className="mini-bar" key={key} style={{ width: `${w}%` }} />
)

function MiniChat() {
  const rows = [
    { who: 'M. R.', at: '09:41', w: [74, 46] },
    { who: 'J. C.', at: '09:42', w: [58] },
    { who: 'A. Q.', at: '09:44', w: [66, 38] },
  ]
  return (
    <div className="mini mini-chat">
      {rows.map((row) => (
        <div className="mini-msg" key={row.who}>
          <span className="mini-av" />
          <span className="mini-bubble">
            <span className="mini-msg-head">
              <b>{row.who}</b>
              <i>{row.at}</i>
            </span>
            {row.w.map((w, i) => bar(w, i))}
          </span>
        </div>
      ))}
    </div>
  )
}

function MiniSocial() {
  return (
    <div className="mini mini-social">
      <div className="mini-post">
        <span className="mini-av" />
        <span className="mini-post-body">
          {bar(52, 'a')}
          {bar(88, 'b')}
          {bar(70, 'c')}
        </span>
      </div>
      <div className="mini-react">
        <span>412 reacciones</span>
        <span>96 com.</span>
      </div>
    </div>
  )
}

function MiniSms() {
  return (
    <div className="mini mini-sms">
      <span className="mini-sms-row is-out">
        {bar(100, 'o1')}
        <i className="mini-tick">✓✓</i>
      </span>
      <span className="mini-sms-row is-in">{bar(70, 'i1')}</span>
      <span className="mini-sms-row is-out">
        {bar(82, 'o2')}
        <i className="mini-tick">✓✓</i>
      </span>
    </div>
  )
}

/* Zonas abstractas: sugieren un sector, no son fronteras reales de ningún
   distrito. */
const ZONES = [
  { d: 'M6,8 L64,5 L74,26 L52,40 L14,34 Z', hot: false },
  { d: 'M76,6 L146,10 L150,44 L100,52 L78,28 Z', hot: true },
  { d: 'M10,38 L50,44 L56,74 L16,70 Z', hot: false },
  { d: 'M60,46 L104,56 L110,78 L62,76 Z', hot: true },
  { d: 'M114,52 L152,50 L150,78 L116,80 Z', hot: false },
]
const PINS = [
  { x: 112, y: 26 },
  { x: 88, y: 64 },
  { x: 34, y: 22 },
  { x: 132, y: 66 },
]

function MiniMap() {
  return (
    <div className="mini mini-map">
      <svg viewBox="0 0 158 86" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {ZONES.map((z, i) => (
          <path key={i} className="mini-zone" data-hot={z.hot || undefined} d={z.d} />
        ))}
        {PINS.map((p, i) => (
          <circle key={i} className="mini-pin" cx={p.x} cy={p.y} r={2.4} />
        ))}
      </svg>
      <span className="mini-note">Mz. F · Lt. 12</span>
    </div>
  )
}

const ROWS = [
  ['08:40', 'AN-031', '1,204'],
  ['08:52', 'CB-092', '3,880'],
  ['09:07', 'CO-066', '2,415'],
]

function MiniDataset() {
  return (
    <div className="mini mini-table">
      <span className="mini-tr is-head">
        <b>ts</b>
        <b>zona</b>
        <b>reg</b>
      </span>
      {ROWS.map((r) => (
        <span className="mini-tr" key={r[1]}>
          <i>{r[0]}</i>
          <i>{r[1]}</i>
          <i>{r[2]}</i>
        </span>
      ))}
    </div>
  )
}

/* Marcos de documento, no fotografías inventadas: la trama diagonal deja claro
   que es un hueco de evidencia, no una imagen real. */
function MiniActas() {
  return (
    <div className="mini mini-actas">
      {['acta_12-03', 'acta_12-04', 'acta_12-05'].map((name, i) => (
        <span className="mini-doc" key={name} data-stamped={i === 0 || undefined}>
          <span className="mini-doc-sheet" />
          <span className="mini-doc-name">{name}</span>
        </span>
      ))}
    </div>
  )
}

const VISUALS: Record<string, () => ReactElement> = {
  chat: MiniChat,
  social: MiniSocial,
  sms: MiniSms,
  mapa: MiniMap,
  dataset: MiniDataset,
  actas: MiniActas,
}

type Props = {
  /** sección que define el recorrido del scroll; por defecto, la más cercana */
  trigger?: RefObject<HTMLElement | null>
}

function ChaosScatter({ trigger }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scene = root.current
      if (!scene) return

      const nodes = gsap.utils.toArray<HTMLElement>('.cs-node', scene)
      const panels = gsap.utils.toArray<HTMLElement>('.cs-panel', scene)
      const links = gsap.utils.toArray<SVGPathElement>('.cs-link', scene)
      const core = scene.querySelector<HTMLElement>('.cs-core-in')
      const section = trigger?.current ?? scene.closest('section')
      if (!section || !core || !nodes.length) return

      /* En pantallas estrechas los paneles se acercan al centro; el valor se
         recalcula en cada refresh gracias a `invalidateOnRefresh`. */
      const spread = () => (window.innerWidth < 1180 ? 0.8 : 1)
      const toX = (i: number) => () => (SOURCES[i].x * spread() * window.innerWidth) / 100
      const toY = (i: number) => () => (SOURCES[i].y * spread() * window.innerHeight) / 100

      const hidden = { x: 0, y: 0, rotate: 0, scale: 0.88, autoAlpha: 0 }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(core, { autoAlpha: 1, scale: 1 })
        gsap.set(links, { autoAlpha: 1, strokeDashoffset: 0 })
        nodes.forEach((node, i) => {
          gsap.set(node, {
            x: toX(i)(),
            y: toY(i)(),
            rotate: SOURCES[i].r,
            scale: SOURCES[i].s,
            autoAlpha: 1,
          })
        })
        return
      }

      gsap.set(nodes, hidden)
      gsap.set(core, { autoAlpha: 0, scale: 0.8 })
      gsap.set(links, { autoAlpha: 0, strokeDashoffset: 1 })

      /* Deriva continua, ajena al scroll: la mesa respira cuando el usuario se
         detiene. Va en la capa interior. */
      const drift = panels.map((panel, i) =>
        gsap.to(panel, {
          y: i % 2 ? 4 : -4,
          duration: 3.8 + i * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.25,
        }),
      )

      /* Un solo timeline con el ScrollTrigger en el padre. Un trigger por tween
         haría que se pisaran entre sí. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      /* Tween vacío de duración 1: fija el total del timeline, así cada posición
         equivale a una fracción del scroll de la sección y encaja con las fases
         2-4, que se calculan igual. */
      tl.to({}, { duration: 1 }, 0)

      // el núcleo se materializa bajo la pregunta, ya visible
      tl.fromTo(
        core,
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 0.02, ease: 'power2.out' },
        0.035,
      )

      // y las fuentes entran una a una, cada cual tirando su línea al centro
      const START = 0.055
      const STEP = 0.018

      nodes.forEach((node, i) => {
        const at = START + i * STEP
        tl.fromTo(
          node,
          hidden,
          {
            x: toX(i),
            y: toY(i),
            rotate: SOURCES[i].r,
            scale: SOURCES[i].s,
            autoAlpha: 1,
            duration: 0.03,
            ease: 'power2.out',
          },
          at,
        ).fromTo(
          links[i],
          { autoAlpha: 0, strokeDashoffset: 1 },
          { autoAlpha: 1, strokeDashoffset: 0, duration: 0.024, ease: 'none' },
          at + 0.014,
        )
      })

      // todo converge al núcleo antes de que el barrido tape la escena
      tl.to(links, { autoAlpha: 0, duration: 0.03, ease: 'power1.in' }, 0.172)
        .to(
          nodes,
          { ...hidden, duration: 0.055, ease: 'power2.in', stagger: { each: 0.006, from: 'edges' } },
          0.178,
        )
        .to(core, { autoAlpha: 0, scale: 0.85, duration: 0.04, ease: 'power2.in' }, 0.225)

      return () => {
        drift.forEach((t) => t.kill())
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: root, dependencies: [] },
  )

  return (
    <div className="cs-scene" ref={root}>
      {/* viewBox en porcentajes: con preserveAspectRatio="none" cada unidad
          equivale a 1vw/1vh, que es como se posicionan los paneles */}
      <svg className="cs-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {SOURCES.map((s) => (
          <path
            key={s.id}
            className="cs-link"
            data-origin={s.origin}
            pathLength={1}
            d={`M ${50 + s.x * LINK_FROM} ${50 + s.y * LINK_FROM} L ${50 + s.x * LINK_TO} ${50 + s.y * LINK_TO}`}
          />
        ))}
      </svg>

      <div className="cs-core-in">
        <img className="cs-core" src={asset('logo-goberna.svg')} alt="" />
      </div>

      <ul className="cs-nodes">
        {SOURCES.map((source) => {
          const Visual = VISUALS[source.id]
          return (
            <li key={source.id} className="cs-node" data-origin={source.origin}>
              <div className="cs-panel">
                <header className="cs-panel-head">
                  <span className="cs-signal" />
                  <span className="cs-tag">{source.tag}</span>
                  <span className="cs-meta">{source.meta}</span>
                </header>
                <div className="cs-panel-body">
                  <Visual />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChaosScatter
