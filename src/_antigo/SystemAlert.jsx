import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { alerta } from '../content.js'
import { flash, quake } from '../lib/bus.js'

/* popup falso de sistema: aparece uma única vez, no meio da leitura */
export default function SystemAlert() {
  const [open, setOpen] = useState(false)
  const [fired, setFired] = useState(false)

  useEffect(() => {
    if (fired) return

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      if (window.scrollY / max > 0.42) {
        setFired(true)
        setOpen(true)
        flash()
        quake(1.3)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [fired])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sysalert"
          role="dialog"
          aria-label={alerta.title}
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          drag
          dragMomentum={false}
        >
          <div className="sysalert__bar">
            <span className="sysalert__tag">{alerta.tag}</span>
            <button className="sysalert__x" onClick={() => setOpen(false)} aria-label="fechar">✕</button>
          </div>

          <div className="sysalert__body">
            <p className="sysalert__title">⚠ {alerta.title}</p>
            <p className="sysalert__text">{alerta.body}</p>
          </div>

          <div className="sysalert__row">
            <button className="sysalert__btn" onClick={() => setOpen(false)}>{alerta.yes}</button>
            <button className="sysalert__btn sysalert__btn--hot" onClick={() => setOpen(false)}>{alerta.no}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
