import { motion } from 'framer-motion'
import GlitchText from './GlitchText.jsx'
import { footer, trilha } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'

export default function Footer() {
  return (
    <footer className="footer">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        <GlitchText as="p" lines={footer.big} className="footer__big" />
      </motion.div>

      <motion.p className="footer__small" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {footer.small}
      </motion.p>

      <p className="footer__sig">
        escrito por <span>{footer.sig}</span> · {new Date().getFullYear()}
      </p>

      <p className="footer__track">trilha: {trilha.credit}</p>
    </footer>
  )
}
