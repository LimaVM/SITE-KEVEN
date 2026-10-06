import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { exitIntent } from '../content.js'
import { flash } from '../lib/bus.js'

/* mouse saindo pra cima da janela = tentativa de fuga */
export default function ExitIntent() {
  const [show, setShow] = useState(false)
  const [used, setUsed] = useState(false)

  useEffect(() => {
    if (used) return
    const onOut = e => {
      if (e.clientY <= 0 && !e.relatedTarget) {
        setUsed(true)
        setShow(true)
        flash()
        setTimeout(() => setShow(false), 3600)
      }
    }
    document.addEventListener('mouseout', onOut)
    return () => document.removeEventListener('mouseout', onOut)
  }, [used])

  /* e o título da aba entrega você quando some */
  useEffect(() => {
    const real = document.title
    const onVis = () => {
      document.title = document.hidden ? 'o pêndulo continua aqui.' : real
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); document.title = real }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
          {exitIntent}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
