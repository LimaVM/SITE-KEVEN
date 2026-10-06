import { memo, useEffect, useRef, useState } from 'react'

/* cursor próprio.
   regras de fluidez: uma única escrita por quadro, translate3d (camada da GPU)
   e nenhuma consulta ao DOM dentro do pointermove. */
function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!fine) return

    let x = innerWidth / 2, y = innerHeight / 2
    let rx = x, ry = y
    let raf = 0
    let quente = false

    /* o ponteiro só guarda a coordenada. desenhar é trabalho do quadro. */
    const mover = e => { x = e.clientX; y = e.clientY }

    /* o hover vem por delegação: dispara na troca de elemento, não a cada pixel */
    const entrar = e => {
      const alvo = e.target
      const sobre = alvo instanceof Element && !!alvo.closest('a, button, input')
      if (sobre !== quente) {
        quente = sobre
        ring.current?.classList.toggle('hot', sobre)
      }
    }

    const quadro = () => {
      /* o ponto gruda no cursor, o anel persegue com atraso */
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(quadro)
    }

    addEventListener('pointermove', mover, { passive: true })
    addEventListener('pointerover', entrar, { passive: true })
    raf = requestAnimationFrame(quadro)
    document.documentElement.classList.add('has-cursor')

    return () => {
      removeEventListener('pointermove', mover)
      removeEventListener('pointerover', entrar)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [fine])

  if (!fine) return null

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}

export default memo(Cursor)
