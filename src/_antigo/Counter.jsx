import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { counter } from '../content.js'

const JUNK = '#%&✕§¤'

export default function Counter() {
  const [text, setText] = useState('000000')
  const value = useRef(4200 + Math.floor(Math.random() * 90000))
  const reduced = useReducedMotion()

  useEffect(() => {
    let timer, glitchTimer

    const tick = () => {
      value.current += Math.floor(Math.random() * 9)
      const clean = String(value.current).padStart(6, '0')
      setText(clean)

      if (!reduced && Math.random() < 0.12) {
        setText(
          clean
            .split('')
            .map(c => (Math.random() < 0.4 ? JUNK[Math.floor(Math.random() * JUNK.length)] : c))
            .join('')
        )
        glitchTimer = setTimeout(() => setText(clean), 90)
      }
      timer = setTimeout(tick, 420 + Math.random() * 900)
    }

    tick()
    return () => { clearTimeout(timer); clearTimeout(glitchTimer) }
  }, [reduced])

  return (
    <section className="counter-section">
      <p className="counter__label">{counter.label}</p>
      <p className="counter">{text}</p>
      <p className="counter__foot">{counter.foot}</p>
    </section>
  )
}
