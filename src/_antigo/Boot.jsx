import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { boot } from '../content.js'
import { flash, quake } from '../lib/bus.js'

export default function Boot({ onEnter }) {
  const [done, setDone] = useState([])
  const [partial, setPartial] = useState('')
  const [ready, setReady] = useState(false)
  const [label, setLabel] = useState(boot.cta)
  const dodges = useRef(0)
  const timers = useRef([])

  /* escreve linha por linha, letra por letra */
  useEffect(() => {
    let line = 0
    let char = 0
    const push = (fn, ms) => timers.current.push(setTimeout(fn, ms))

    const step = () => {
      if (line >= boot.lines.length) {
        push(() => setReady(true), 420)
        return
      }
      const text = boot.lines[line]
      if (char < text.length) {
        char++
        setPartial(text.slice(0, char))
        push(step, 14 + Math.random() * 26)
      } else {
        setDone(d => [...d, text])
        setPartial('')
        line++
        char = 0
        push(step, 260)
      }
    }
    push(step, 500)

    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [])

  const enter = () => {
    flash()
    quake(1.4)
    setTimeout(onEnter, 260)
  }

  const dodge = () => {
    if (dodges.current >= boot.ctaTaunts.length - 1) return
    setLabel(boot.ctaTaunts[dodges.current])
    dodges.current++
  }

  return (
    <motion.div
      className="boot"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)', scale: 1.06 }}
      transition={{ duration: 0.55, ease: 'easeIn' }}
    >
      <div className="boot__term">
        {done.map((l, i) => (
          <p key={i} className="boot__line">{l}</p>
        ))}
        {partial && <p className="boot__line">{partial}<span className="boot__caret">▋</span></p>}

        {ready && (
          <motion.button
            className="boot__cta"
            onMouseEnter={dodge}
            onClick={enter}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {label}
          </motion.button>
        )}
      </div>

      <p className="boot__foot">{boot.foot}</p>
    </motion.div>
  )
}
