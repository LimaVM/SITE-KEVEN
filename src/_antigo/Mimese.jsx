import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { mimese } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'
import { flash } from '../lib/bus.js'

/* dois objetos idênticos. o único diferencial é quanta gente já quer.
   o selo troca de lado toda vez que você escolhe. */
const NUMEROS = [1284, 3902, 11507, 28340]
const ID = 'obj#4f2a'

export default function Mimese() {
  const [selo, setSelo] = useState(0)      // lado com o selo: 0 ou 1
  const [rodada, setRodada] = useState(0)
  const [seu, setSeu] = useState(null)     // lado que você levou
  const [msg, setMsg] = useState('')
  const revelado = rodada >= 3

  const escolher = lado => {
    if (revelado) return
    setSeu(lado)
    setMsg(mimese.rounds[Math.min(rodada, mimese.rounds.length - 1)])

    /* o selo sempre pula pro que você não levou */
    setTimeout(() => {
      setSelo(1 - lado)
      setRodada(r => {
        const prox = r + 1
        if (prox >= 3) flash()
        return prox
      })
      setSeu(null)
    }, 620)
  }

  const reiniciar = () => {
    setRodada(0); setSelo(0); setSeu(null); setMsg('')
  }

  const Quadro = ({ lado }) => {
    const temSelo = selo === lado && !revelado
    const eSeu = seu === lado
    return (
      <button
        className={`mim__box ${temSelo ? 'is-hot' : ''} ${eSeu ? 'is-mine' : ''} ${revelado ? 'is-bare' : ''}`}
        onClick={() => escolher(lado)}
        disabled={revelado}
      >
        <span className="mim__face" aria-hidden="true" />
        <span className="mim__id">{ID}</span>
        <AnimatePresence>
          {temSelo && (
            <motion.span
              className="mim__badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {mimese.badge(NUMEROS[Math.min(rodada, NUMEROS.length - 1)])}
            </motion.span>
          )}
          {eSeu && (
            <motion.span
              className="mim__mine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              seu
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    )
  }

  return (
    <section className="mim">
      <motion.p className="kicker" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {mimese.kicker}
      </motion.p>

      <motion.h3 className="mim__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {revelado ? mimese.reveal[0] : mimese.title}
      </motion.h3>

      <motion.p className="mim__hint" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {revelado ? mimese.reveal[1] : mimese.hint}
      </motion.p>

      <motion.div className="mim__row" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        <Quadro lado={0} />
        <Quadro lado={1} />
      </motion.div>

      <div className="mim__foot">
        <AnimatePresence mode="wait">
          {revelado ? (
            <motion.p
              key="rev"
              className="mim__reveal"
              initial={{ opacity: 0, y: 16, filter: 'blur(9px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1 }}
            >
              {mimese.revealSub}
            </motion.p>
          ) : (
            <motion.p key={msg} className="mim__msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {msg || ' '}
            </motion.p>
          )}
        </AnimatePresence>

        {revelado && (
          <button className="mim__again" onClick={reiniciar}>{mimese.again}</button>
        )}
      </div>
    </section>
  )
}
