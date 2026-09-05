import { useEffect, useState } from 'react'
import './header.css'
import { asset } from '../asset'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Propuestas', href: '#propuestas' },
  { label: 'Trayectoria', href: '#trayectoria' },
  { label: 'Contacto', href: '#contacto' },
]

// El header flota sobre secciones que alternan papel claro y war room oscuro,
// así que lee el tono de la que tiene debajo. Converge cambia su data-tone a
// mitad de su propio scroll, por eso se consulta el atributo en cada frame.
function useHeaderTone() {
  const [overLight, setOverLight] = useState(false)

  useEffect(() => {
    let frame = 0
    let zones: { top: number; bottom: number; el: HTMLElement }[] = []

    const measure = () => {
      zones = [...document.querySelectorAll<HTMLElement>('[data-tone]')].map(
        (el) => {
          const rect = el.getBoundingClientRect()
          return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            el,
          }
        },
      )
    }

    const render = () => {
      frame = 0
      const probe = window.scrollY + 52
      const zone = zones.find((z) => probe >= z.top && probe < z.bottom)
      setOverLight(zone?.el.dataset.tone === 'light')
    }

    // Doble rAF a propósito: Converge cambia su data-tone desde su propio
    // manejador de scroll, así que leerlo en el mismo frame es una carrera que
    // no se autocorrige cuando el scroll se detiene.
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(render)
        })
      }
    }

    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return overLight
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overLight = useHeaderTone()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`header ${scrolled ? 'is-scrolled' : ''} ${
        overLight ? 'is-light' : ''
      }`}
    >
      <div className="header-inner">
        <a href="#inicio" className="header-logo">
          <img src={asset('logo-goberna.svg')} alt="Goberna" />
        </a>

        <nav className={`header-nav ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="#contacto" className="header-cta">
            Únete
          </a>
          <button
            type="button"
            className={`header-toggle ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
