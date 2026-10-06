import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { on } from '../lib/bus.js'

export default function Overlays() {
  const flashRef = useRef(null)
  const reduced = useReducedMotion()

  /* flash subliminar, disparado pelo barramento ou sozinho, do nada */
  useEffect(() => {
    const fire = () => {
      const el = flashRef.current
      if (!el || reduced) return
      el.classList.remove('on')
      void el.offsetWidth
      el.classList.add('on')
    }

    const offFlash = on('flash', fire)
    const id = setInterval(() => { if (Math.random() < 0.4) fire() }, 9000)

    return () => { offFlash(); clearInterval(id) }
  }, [reduced])

  /* tremor de tela */
  useEffect(() => {
    if (reduced) return
    let t
    const off = on('quake', e => {
      const f = e.detail || 1
      const root = document.getElementById('root')
      if (!root) return
      root.style.setProperty('--quake', f)
      root.classList.add('quaking')
      clearTimeout(t)
      t = setTimeout(() => root.classList.remove('quaking'), 460)
    })

    /* micro-tremor espontâneo */
    const id = setInterval(() => {
      if (document.documentElement.dataset.quiet === 'on') return
      if (Math.random() < 0.07) {
        const root = document.getElementById('root')
        if (!root) return
        root.style.transform = `translate(${(Math.random() - 0.5) * 4}px,${(Math.random() - 0.5) * 4}px)`
        setTimeout(() => { root.style.transform = '' }, 80)
      }
    }, 1400)

    return () => { off(); clearInterval(id); clearTimeout(t) }
  }, [reduced])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="flash" ref={flashRef} aria-hidden="true" />
    </>
  )
}
