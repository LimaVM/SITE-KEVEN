import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { manifesto } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'
import { flash, quake } from '../lib/bus.js'

export default function StaticSection() {
  const [label, setLabel] = useState(manifesto.btn)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(false)
  const dodges = useRef(0)

  const dodge = () => {
    if (caught || dodges.current >= 4) return
    setPos({ x: (Math.random() - 0.5) * 260, y: (Math.random() - 0.5) * 120 })
    setLabel(manifesto.btnTaunts[dodges.current % manifesto.btnTaunts.length])
    dodges.current++
  }

  const click = () => {
    setCaught(true)
    setLabel(manifesto.btnDone)
    setPos({ x: 0, y: 0 })
    flash()
    quake(1.2)
    document.documentElement.classList.add('inverted')
    setTimeout(() => document.documentElement.classList.remove('inverted'), 1200)
    setTimeout(() => {
      document.getElementById('o-teste')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 1500)
  }

  return (
    <section className="static-section">
      <motion.figure
        className="static-wrap"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <img src="./assets/estatica.svg" alt="" className="static-img" />
        <span className="static-noise" />
        <figcaption className="static-cap">{manifesto.caption}</figcaption>
      </motion.figure>

      <motion.div
        className="manifesto"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <p className="kicker">{manifesto.kicker}</p>

        <h2 className="wobble">
          {manifesto.title.map((l, i) => (
            <span key={i}>{l}{i < manifesto.title.length - 1 && <br />}</span>
          ))}
        </h2>

        <p className="manifesto__body">{manifesto.body}</p>

        <motion.button
          className={`cursed-btn ${caught ? 'caught' : ''}`}
          onMouseEnter={dodge}
          onClick={click}
          animate={pos}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          {label}
        </motion.button>
      </motion.div>
    </section>
  )
}
