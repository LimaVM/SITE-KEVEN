import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { entrada } from '../content.js'

export default function Entrada({ onEnter }) {
  const [texto, setTexto] = useState(entrada.call)

  /* o sinal falha de vez em quando e a chamada sai corrompida */
  useEffect(() => {
    let t
    const ciclo = () => {
      const sujo = entrada.glitch[Math.floor(Math.random() * entrada.glitch.length)]
      if (sujo !== entrada.call) {
        setTexto(sujo)
        setTimeout(() => setTexto(entrada.call), 70 + Math.random() * 90)
      }
      t = setTimeout(ciclo, 900 + Math.random() * 2600)
    }
    t = setTimeout(ciclo, 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.button
      className="entrada"
      onClick={onEnter}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.07, filter: 'blur(16px)' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <span className="entrada__call" data-text={texto}>{texto}</span>
    </motion.button>
  )
}
