import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { dose } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'

/* a mesma dose, sempre. o que cai é você.
   0.68^n: a curva de tolerância, sentida no dedo em vez de lida. */
const rendimento = n => Math.pow(0.68, n)
const MORTO = 0.02

export default function Dose() {
  const [hits, setHits] = useState([])   // histórico de intensidades
  const [glow, setGlow] = useState(0)    // brilho atual do painel
  const [msg, setMsg] = useState('')
  const [negou, setNegou] = useState(false)
  const mortos = useRef(0)
  const fade = useRef(0)

  /* o brilho sempre volta pro escuro. é isso que faz a próxima doer. */
  useEffect(() => {
    if (glow <= 0) return
    cancelAnimationFrame(fade.current)
    const t0 = performance.now()
    const de = glow
    const step = now => {
      const p = Math.min(1, (now - t0) / 620)
      setGlow(de * (1 - p))
      if (p < 1) fade.current = requestAnimationFrame(step)
    }
    fade.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(fade.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits.length])

  const apertar = () => {
    const n = hits.length
    const forca = rendimento(n)

    if (forca < MORTO) {
      mortos.current++
      setMsg(mortos.current > 1 ? dose.deadAgain : dose.dead)
      setHits(h => [...h, 0])
      return
    }

    setHits(h => [...h, forca])
    setGlow(forca)
    const marco = Object.keys(dose.beats).map(Number).find(k => k === n + 1)
    if (marco) setMsg(dose.beats[marco])
    else if (n === 0) setMsg('')
  }

  const ultima = hits.length ? hits[hits.length - 1] : 0
  const pct = Math.round(ultima * 100)
  const morto = hits.length > 0 && rendimento(hits.length) < MORTO

  return (
    <section className="dose">
      <motion.p className="kicker" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {dose.kicker}
      </motion.p>

      <motion.h3 className="dose__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {dose.title}
      </motion.h3>

      <motion.p className="dose__hint" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {dose.hint}
      </motion.p>

      <motion.div
        className="dose__panel"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {/* o painel acende proporcional ao que ainda sobra */}
        <div
          className="dose__lamp"
          style={{ opacity: glow, transform: `scale(${1 + glow * 0.06})` }}
          aria-hidden="true"
        />

        <div className="dose__readout">
          <span className="dose__num">{String(pct).padStart(3, '0')}</span>
          <span className="dose__unit">{dose.meter}</span>
        </div>

        {/* a curva: cada barra é um aperto */}
        <div className="dose__curve" aria-hidden="true">
          {hits.map((h, i) => (
            <span key={i} className="dose__bar" style={{ height: `${Math.max(2, h * 100)}%` }} />
          ))}
        </div>

        <button className={`dose__btn ${morto ? 'is-dead' : ''}`} onClick={apertar}>
          {dose.btn}
        </button>

        <p className="dose__count">{hits.length ? `apertos: ${hits.length}` : ' '}</p>
      </motion.div>

      <p className="dose__msg">{msg || ' '}</p>

      {morto && (
        <motion.button
          className="dose__reset"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setNegou(true)}
        >
          {negou ? dose.resetMsg : dose.reset}
        </motion.button>
      )}
    </section>
  )
}
