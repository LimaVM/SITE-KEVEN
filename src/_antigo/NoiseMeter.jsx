import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const BARS = 7

export default function NoiseMeter({ mode }) {
  const wrap = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const bars = wrap.current?.querySelectorAll('i')
    if (!bars) return

    let energy = 0.1
    let lastX = 0, lastY = 0, lastScroll = window.scrollY
    let raf = 0

    const add = v => { energy = Math.min(1, energy + v) }

    const onMove = e => {
      const d = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      lastX = e.clientX; lastY = e.clientY
      add(Math.min(0.3, d / 900))
    }
    const onTouch = () => add(0.12)
    const onScroll = () => {
      const d = Math.abs(window.scrollY - lastScroll)
      lastScroll = window.scrollY
      add(Math.min(0.35, d / 700))
    }

    const loop = () => {
      const floor = mode === 'ansia' ? 0.72 : 0
      energy = Math.max(floor, energy * 0.93)
      bars.forEach((b, i) => {
        const wave = Math.sin(Date.now() / (170 + i * 45) + i) * 0.5 + 0.5
        b.style.height = Math.min(100, 8 + energy * wave * 92) + '%'
      })
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced, mode])

  return (
    <div className="meter" ref={wrap} aria-hidden="true">
      <div className="meter__bars">
        {Array.from({ length: BARS }).map((_, i) => <i key={i} />)}
      </div>
      <p className="meter__label">nível de desejo</p>
    </div>
  )
}
