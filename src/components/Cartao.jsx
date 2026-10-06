import { memo, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Icone from './Icones.jsx'
import Player from './Player.jsx'
import Typed from './Typed.jsx'
import { cartao, links, views } from '../content.js'
import { flash } from '../lib/bus.js'

/* visitas deste navegador. sem servidor, sem número inventado. */
function usarVisitas() {
  const [n, setN] = useState(1)
  useEffect(() => {
    try {
      const atual = Number(localStorage.getItem('kv.visitas') || 0) + 1
      localStorage.setItem('kv.visitas', String(atual))
      setN(atual)
    } catch { /* navegador sem storage, fica em 1 */ }
  }, [])
  return n
}

function Cartao({ player }) {
  const visitas = usarVisitas()

  /* o cartão inclina de leve seguindo o mouse */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], ['7deg', '-7deg']), { stiffness: 140, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], ['-9deg', '9deg']), { stiffness: 140, damping: 18 })

  const mover = e => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const sair = () => { mx.set(0); my.set(0) }

  return (
    <div className="palco" onMouseMove={mover} onMouseLeave={sair}>
      <motion.article
        className="card"
        style={{ rotateX: rx, rotateY: ry }}
        initial={{ opacity: 0, y: 28, filter: 'blur(18px)', scale: 0.95 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <span className="card__views" title={views.label}>
          <Icone nome="olho" size={13} />
          {visitas}
        </span>

        <div className="card__avatar">
          <span className="card__ring" aria-hidden="true" />
          <img src={cartao.avatar} alt={cartao.handle} width="265" height="265" />
          {/* o fantasma: a mesma cara meio quadro atrás */}
          <img src={cartao.avatar} alt="" aria-hidden="true" className="card__ghost" />
        </div>

        <h1 className="card__handle glitch" data-text={cartao.handle} onMouseEnter={flash}>
          {cartao.handle}
        </h1>

        <p className="card__bio">{cartao.bio}</p>
        <Typed />

        <nav className="card__links">
          {links.map(l => (
            <a
              key={l.id}
              href={l.url}
              className="card__link"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={l.nome}
              title={l.nome}
            >
              <Icone nome={l.id} size={19} />
            </a>
          ))}
        </nav>

        <Player {...player} />

        <p className="card__sig">{cartao.sig}</p>
      </motion.article>
    </div>
  )
}

export default memo(Cartao)
