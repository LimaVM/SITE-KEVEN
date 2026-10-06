import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { silence } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'
import { flash } from '../lib/bus.js'

const R = 54
const CIRC = 2 * Math.PI * R
const GOAL = 10000

export default function SilenceTest() {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [passed, setPassed] = useState(false)
  const [msg, setMsg] = useState('')
  const [left, setLeft] = useState(null)

  const start = useRef(0)
  const raf = useRef(0)
  const attempts = useRef(0)

  /* enquanto segura, o site inteiro se acalma */
  useEffect(() => {
    document.documentElement.dataset.quiet = holding ? 'on' : 'off'
  }, [holding])

  const abort = useCallback(reason => {
    if (!start.current) return
    cancelAnimationFrame(raf.current)
    start.current = 0
    setHolding(false)
    setProgress(0)
    setLeft(null)
    setMsg(reason || silence.fails[attempts.current % silence.fails.length])
    attempts.current++
  }, [])

  const succeed = useCallback(() => {
    cancelAnimationFrame(raf.current)
    start.current = 0
    setHolding(false)
    setPassed(true)
    setProgress(1)
    setLeft(null)
    setMsg(silence.win)
    flash()
  }, [])

  const step = useCallback(now => {
    const elapsed = now - start.current
    const p = Math.min(1, elapsed / GOAL)
    setProgress(p)
    setLeft(Math.max(0, Math.ceil((GOAL - elapsed) / 1000)))
    if (p >= 1) { succeed(); return }
    raf.current = requestAnimationFrame(step)
  }, [succeed])

  const begin = e => {
    if (passed) return
    e.preventDefault()
    start.current = performance.now()
    setHolding(true)
    setMsg(silence.holding)
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(step)
  }

  /* rolar a tela ou trocar de aba também reprova, é o ponto do teste */
  useEffect(() => {
    const onScroll = () => { if (start.current) abort('você rolou a tela. reflexo, né?') }
    const onHide = () => {
      if (document.hidden && start.current) abort('você trocou de aba. exatamente isso.')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onHide)
      cancelAnimationFrame(raf.current)
      document.documentElement.dataset.quiet = 'off'
    }
  }, [abort])

  return (
    <section className="silence" id="o-teste">
      <motion.p className="kicker" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {silence.kicker}
      </motion.p>

      <motion.h3 className="silence__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {silence.title.map((l, i) => (
          <span key={i}>{l}{i < silence.title.length - 1 && <br />}</span>
        ))}
      </motion.h3>

      <motion.p className="silence__hint" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {silence.hint}
      </motion.p>

      <button
        className={`silence__btn ${holding ? 'holding' : ''} ${passed ? 'done' : ''}`}
        onPointerDown={begin}
        onPointerUp={() => abort()}
        onPointerLeave={() => abort('saiu do botão. conta como fuga.')}
        onPointerCancel={() => abort()}
        onContextMenu={e => e.preventDefault()}
      >
        <svg className="silence__ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="ring-bg" cx="60" cy="60" r={R} />
          <circle
            className="ring-fg"
            cx="60" cy="60" r={R}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
          />
        </svg>
        <span className="silence__label">
          {passed ? 'pronto' : left !== null ? left : silence.hold}
        </span>
      </button>

      <p className="silence__msg">{msg || ' '}</p>

      <AnimatePresence>
        {passed && (
          <motion.p
            className="silence__reward"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4 }}
          >
            {silence.reward.map((l, i) => (
              <span key={i}>{l}{i < silence.reward.length - 1 && <br />}</span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
