import { AnimatePresence, motion } from 'framer-motion'
import { choice } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'
import { flash, quake } from '../lib/bus.js'

export default function Choice({ mode, onChoose }) {
  const pick = next => {
    onChoose(next)
    if (next === 'ansia') { flash(); quake(1.6) }
  }

  const reply = mode === 'ansia' ? choice.loudReply : mode === 'tedio' ? choice.quietReply : null

  return (
    <section className="choice">
      <motion.p className="kicker" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {choice.kicker}
      </motion.p>

      <motion.h3 className="choice__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {choice.title}
      </motion.h3>

      <motion.div className="choice__row" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        <button
          className={`choice__btn choice__btn--loud ${mode === 'ansia' ? 'on' : ''}`}
          onClick={() => pick('ansia')}
        >
          {choice.loud}
        </button>
        <button
          className={`choice__btn choice__btn--quiet ${mode === 'tedio' ? 'on' : ''}`}
          onClick={() => pick('tedio')}
        >
          {choice.quiet}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {reply && (
          <motion.p
            key={mode}
            className={`choice__reply choice__reply--${mode}`}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            {reply.map((l, i) => (
              <span key={i}>{l}{i < reply.length - 1 && <br />}</span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
