import { motion } from 'framer-motion'
import GlitchText from './GlitchText.jsx'
import { useTypedLoop } from '../hooks/useTypedLoop.js'
import { hero } from '../content.js'

export default function Hero() {
  const typed = useTypedLoop(hero.typed)

  return (
    <section className="hero">
      <motion.figure
        className="hero__portrait"
        initial={{ opacity: 0, scale: 1.14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="hero__portrait-frame">
          <img src={hero.portrait.src} alt={hero.portrait.alt} width="265" height="265" />
          {/* cópia deslocada, o fantasma que treme por cima do rosto */}
          <img src={hero.portrait.src} alt="" aria-hidden="true" className="hero__portrait-ghost" />
        </div>
        <figcaption className="hero__portrait-tag">{hero.portrait.tag}</figcaption>
      </motion.figure>

      <motion.p
        className="hero__kicker"
        initial={{ opacity: 0, letterSpacing: '18px' }}
        animate={{ opacity: 0.85, letterSpacing: '6px' }}
        transition={{ duration: 1.1, delay: 0.55 }}
      >
        {hero.kicker}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.75, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <GlitchText lines={hero.title} className="hero__title" />
      </motion.div>

      <motion.p
        className="hero__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {typed}
      </motion.p>

      <p className="hero__scroll">{hero.scroll}</p>
    </section>
  )
}
