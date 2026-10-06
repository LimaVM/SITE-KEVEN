import { memo, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { on } from '../lib/bus.js'

/* a camada suja por cima de tudo: grão, scanline, vinheta,
   flash subliminar e o micro tremor que faz a tela nunca ficar parada. */
function Overlays() {
  const flashRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const fire = () => {
      const el = flashRef.current
      if (!el || reduced) return
      el.classList.remove('on')
      void el.offsetWidth
      el.classList.add('on')
    }
    const off = on('flash', fire)
    const id = setInterval(() => { if (Math.random() < 0.35) fire() }, 7000)
    return () => { off(); clearInterval(id) }
  }, [reduced])

  /* tremor: por evento ou sozinho, do nada */
  useEffect(() => {
    if (reduced) return
    let t
    const root = () => document.getElementById('root')

    const off = on('quake', e => {
      const el = root()
      if (!el) return
      el.style.setProperty('--quake', e.detail || 1)
      el.classList.add('quaking')
      clearTimeout(t)
      t = setTimeout(() => el.classList.remove('quaking'), 460)
    })

    const id = setInterval(() => {
      if (Math.random() > 0.09) return
      const el = root()
      if (!el) return
      el.style.transform = `translate3d(${(Math.random() - 0.5) * 4}px,${(Math.random() - 0.5) * 3}px,0)`
      setTimeout(() => { el.style.transform = '' }, 70)
    }, 1600)

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

export default memo(Overlays)
