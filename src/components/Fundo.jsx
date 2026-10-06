import { memo, useEffect, useRef } from 'react'
import { cartao } from '../content.js'

/* poeira lenta caindo atrás do cartão */
function usarPoeira(ativo) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0, h = 0
    let pontos = []

    const medir = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      w = cv.width = innerWidth * dpr
      h = cv.height = innerHeight * dpr
      cv.style.width = innerWidth + 'px'
      cv.style.height = innerHeight + 'px'
      const total = Math.round((innerWidth * innerHeight) / 42000)
      pontos = Array.from({ length: total }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.4) * dpr,
        v: (Math.random() * 0.22 + 0.06) * dpr,
        d: Math.random() * 0.3 - 0.15,
        o: Math.random() * 0.4 + 0.12
      }))
    }

    const quadro = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pontos) {
        p.y += p.v
        p.x += p.d
        if (p.y > h) { p.y = -6; p.x = Math.random() * w }
        ctx.globalAlpha = p.o
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(quadro)
    }

    const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches
    const rodar = () => {
      cancelAnimationFrame(raf)
      if (!reduz && ativo && !document.hidden) raf = requestAnimationFrame(quadro)
    }

    medir()
    rodar()
    addEventListener('resize', medir)
    document.addEventListener('visibilitychange', rodar)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', medir)
      document.removeEventListener('visibilitychange', rodar)
    }
  }, [ativo])
  return ref
}

function Fundo({ aberto }) {
  const poeira = usarPoeira(aberto)

  return (
    <div className={`fundo ${aberto ? 'aberto' : ''}`} aria-hidden="true">
      <img className="fundo__img" src={cartao.avatar} alt="" />
      <div className="fundo__tinta" />
      <canvas className="fundo__poeira" ref={poeira} />
    </div>
  )
}

export default memo(Fundo)
