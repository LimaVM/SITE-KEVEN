import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { esteira } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'

/* você avança. a meta avança junto, na mesma velocidade.
   a distância nunca muda: é a régua do site inteiro. */
const GAP = 40          // a distância que nunca encolhe
const VEL = 46          // unidades por segundo enquanto segura

export default function Esteira() {
  const [dist, setDist] = useState(0)
  const [correndo, setCorrendo] = useState(false)
  const [msg, setMsg] = useState('')
  const [parou, setParou] = useState(false)
  const raf = useRef(0)
  const last = useRef(0)
  const distRef = useRef(0)
  const marcos = useRef(new Set())

  const step = useCallback(now => {
    const dt = (now - last.current) / 1000
    last.current = now
    const prox = distRef.current + VEL * dt
    distRef.current = prox
    setDist(prox)

    for (const k of Object.keys(esteira.marks)) {
      const alvo = Number(k)
      if (prox >= alvo && !marcos.current.has(alvo)) {
        marcos.current.add(alvo)
        setMsg(esteira.marks[alvo])
      }
    }
    raf.current = requestAnimationFrame(step)
  }, [])

  const comecar = e => {
    e.preventDefault()
    if (parou) return
    setCorrendo(true)
    last.current = performance.now()
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(step)
  }

  const soltar = () => {
    cancelAnimationFrame(raf.current)
    setCorrendo(false)
  }

  const parar = () => {
    cancelAnimationFrame(raf.current)
    setCorrendo(false)
    setParou(true)
    setMsg('')
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const andou = Math.floor(dist)
  const offset = -(dist % 48)

  return (
    <section className="est">
      <motion.p className="kicker" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {esteira.kicker}
      </motion.p>

      <motion.h3 className="est__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {esteira.title}
      </motion.h3>

      <motion.p className="est__hint" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {esteira.hint}
      </motion.p>

      <motion.div
        className={`est__track ${correndo ? 'is-running' : ''}`}
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {/* o chão corre pra trás: a única coisa que realmente se move */}
        <div className="est__ground" style={{ transform: `translateX(${offset}px)` }} aria-hidden="true" />

        <span className="est__you" aria-hidden="true">
          <i />
          <b>{esteira.you}</b>
        </span>

        <span className="est__goal" aria-hidden="true">
          <i />
          <b>{esteira.goal}</b>
        </span>
      </motion.div>

      <div className="est__stats">
        <span>andou <b>{andou}</b></span>
        <span className="est__gap">{esteira.dist} <b>{GAP}</b></span>
      </div>

      <div className="est__ctrl">
        <button
          className={`est__push ${correndo ? 'on' : ''}`}
          onPointerDown={comecar}
          onPointerUp={soltar}
          onPointerLeave={soltar}
          onPointerCancel={soltar}
          onContextMenu={e => e.preventDefault()}
          disabled={parou}
        >
          {esteira.push}
        </button>

        {andou > 60 && !parou && (
          <button className="est__stop" onClick={parar}>{esteira.stop}</button>
        )}
      </div>

      {parou ? (
        <motion.p
          className="est__stopped"
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1 }}
        >
          {esteira.stopped.map((l, i) => (
            <span key={i}>{l}{i < esteira.stopped.length - 1 && <br />}</span>
          ))}
        </motion.p>
      ) : (
        <p className="est__msg">{msg || ' '}</p>
      )}
    </section>
  )
}
