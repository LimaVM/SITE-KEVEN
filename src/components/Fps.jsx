import { memo, useEffect, useRef, useState } from 'react'

/* medidor. liga com a tecla F ou com ?fps na URL.
   mostra a média do último meio segundo e o pior quadro do período,
   que é o número que importa: é o engasgo que a gente sente. */
function Fps() {
  const [ligado, setLigado] = useState(() =>
    typeof location !== 'undefined' && new URLSearchParams(location.search).has('fps')
  )
  const caixa = useRef(null)

  useEffect(() => {
    const tecla = e => {
      if (e.target.matches?.('input, textarea')) return
      if (e.key === 'f' || e.key === 'F') setLigado(v => !v)
    }
    addEventListener('keydown', tecla)
    return () => removeEventListener('keydown', tecla)
  }, [])

  useEffect(() => {
    if (!ligado) return
    let raf = 0
    let quadros = 0
    let inicio = performance.now()
    let ultimo = inicio
    let pior = Infinity

    const loop = agora => {
      raf = requestAnimationFrame(loop)
      const dt = agora - ultimo
      ultimo = agora
      if (dt > 0) pior = Math.min(pior, 1000 / dt)
      quadros++

      const janela = agora - inicio
      if (janela >= 500) {
        const media = Math.round((quadros * 1000) / janela)
        if (caixa.current) {
          caixa.current.textContent = `${media} fps  ·  pior ${Math.round(pior)}`
          caixa.current.dataset.ok = media >= 100 ? 'sim' : 'nao'
        }
        quadros = 0
        inicio = agora
        pior = Infinity
      }
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ligado])

  if (!ligado) return null
  return <div className="fps" ref={caixa} aria-hidden="true">medindo</div>
}

export default memo(Fps)
