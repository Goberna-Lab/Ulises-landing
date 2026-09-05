import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import { asset } from '../asset'

const WORDS = ['Ulises', 'Goberna', 'Hermes']
const TYPING_SPEED = 85
const DELETING_SPEED = 45
const PAUSE_DURATION = 1800

const CONTENT_LIFT_PX = 90
const CONTENT_FADE_RATE = 1.15

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? words[0]
      : '',
  )
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const currentWord = words[wordIndex]

    if (!isDeleting && text === currentWord) {
      const pause = setTimeout(() => setIsDeleting(true), PAUSE_DURATION)
      return () => clearTimeout(pause)
    }

    if (isDeleting && text === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(
      () => {
        setText((prev) =>
          isDeleting
            ? currentWord.slice(0, prev.length - 1)
            : currentWord.slice(0, prev.length + 1),
        )
      },
      isDeleting ? DELETING_SPEED : TYPING_SPEED,
    )

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words])

  return text
}

function useParallax() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let frame = 0

    const render = () => {
      frame = 0
      const content = contentRef.current
      if (!content) {
        return
      }

      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      content.style.transform = `translate3d(0, ${-progress * CONTENT_LIFT_PX}px, 0)`
      content.style.opacity = String(Math.max(1 - progress * CONTENT_FADE_RATE, 0))
    }

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(render)
      }
    }

    render()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return { contentRef }
}

function Hero() {
  const typedText = useTypewriter(WORDS)
  const { contentRef } = useParallax()

  return (
    <section className="hero" data-tone="dark">
      <video
        className="hero-video"
        src={asset('spot-ulises.mp4')}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="hero-content" ref={contentRef}>
        <h1 aria-label={WORDS.join(', ')}>
          <span aria-hidden="true">{typedText}</span>
          <span className="hero-cursor" aria-hidden="true" />
        </h1>
      </div>
    </section>
  )
}

export default Hero