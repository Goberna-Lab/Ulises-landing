import type { CSSProperties, ReactNode } from 'react'
import './HudCard.css'

/* ---------------------------------------------------------------------------
   Chasis compartido de las tarjetas del rombo.

   Reposo: tarjeta de arquitectura, idéntica al resto del diagrama.
   Interacción: se abre un panel por encima, centrado sobre la tarjeta, sin
   tocar el layout — la tarjeta nunca cambia de tamaño, así que abrirlo no
   reflowea el rombo isométrico ni desplaza a sus vecinas.

   El panel desborda la tarjeta, pero al ser descendiente mantiene su :hover:
   el puntero puede entrar al panel sin que se cierre.
--------------------------------------------------------------------------- */

type Props = {
  title: string
  subtitle: string
  /** nombre del subsistema, al pie a la izquierda */
  system: string
  /** telemetría del pie, a la derecha */
  meta?: string
  width: number
  height: number
  /** permite montarla como `.dg-module` dentro del diagrama isométrico */
  className?: string
  style?: CSSProperties
  /** nodo de la simulación del diagrama, para que la tarjeta acuse el paquete */
  dataNode?: string
  children: ReactNode
}

function HudCard({
  title,
  subtitle,
  system,
  meta,
  width,
  height,
  className = '',
  style,
  dataNode,
  children,
}: Props) {
  return (
    <article
      className={`hudc ${className}`.trim()}
      style={{ ...style, '--hud-w': `${width}px`, '--hud-h': `${height}px` } as CSSProperties}
      data-node={dataNode}
      tabIndex={0}
    >
      <div className="hudc-face">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="hudc-panel">
        <svg
          className="hudc-corners"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 10 L0 0 L10 0M90 0 L100 0 L100 10" />
        </svg>

        <div className="hudc-body">{children}</div>

        <p className="hudc-sys">
          <span>{system}</span>
          {meta ? <span className="hudc-meta">{meta}</span> : null}
        </p>
      </div>
    </article>
  )
}

export default HudCard
