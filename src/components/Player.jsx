import { memo, useEffect, useRef } from 'react'
import Icone from './Icones.jsx'
import { musica } from '../content.js'

const tempo = s => {
  if (!s || !isFinite(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function Player({ api, tocando, vol, mudo, alternar, buscar, mudar, silenciar }) {
  const barra = useRef(null)
  const preenche = useRef(null)
  const bolinha = useRef(null)
  const tAtual = useRef(null)
  const tTotal = useRef(null)
  const arrastando = useRef(false)

  /* a barra anda escrevendo direto no DOM: sem estado, sem re-render */
  useEffect(() => {
    if (!tocando) return
    let raf = 0
    let ultimo = 0

    const quadro = agora => {
      raf = requestAnimationFrame(quadro)
      if (agora - ultimo < 200) return   // 5x por segundo basta pra uma barra
      ultimo = agora
      if (arrastando.current) return

      const p = api.current
      if (!p || !p.getCurrentTime) return
      const atual = p.getCurrentTime() || 0
      const dur = p.getDuration() || 0
      if (!dur) return

      const pct = Math.min(100, (atual / dur) * 100)
      if (preenche.current) preenche.current.style.width = `${pct}%`
      if (bolinha.current) bolinha.current.style.left = `${pct}%`
      if (tAtual.current) tAtual.current.textContent = tempo(atual)
      if (tTotal.current) tTotal.current.textContent = tempo(dur)
    }

    raf = requestAnimationFrame(quadro)
    return () => cancelAnimationFrame(raf)
  }, [tocando, api])

  const clicar = e => {
    const p = api.current
    const dur = p?.getDuration?.() || 0
    if (!dur) return
    const r = barra.current.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))

    /* pinta na hora e segura o relógio por um instante, pra não pular de volta */
    arrastando.current = true
    if (preenche.current) preenche.current.style.width = `${frac * 100}%`
    if (bolinha.current) bolinha.current.style.left = `${frac * 100}%`
    buscar(frac * dur)
    setTimeout(() => { arrastando.current = false }, 260)
  }

  return (
    <div className="player">
      <div className="player__topo">
        <img className="player__capa" src={musica.capa} alt="" width="120" height="90" loading="lazy" />

        <div className="player__info">
          <p className="player__titulo">{musica.titulo}</p>
          <p className="player__artista">{musica.artista}</p>
        </div>

        <button className="player__play" onClick={alternar} aria-label={tocando ? 'pausar' : 'tocar'}>
          <Icone nome={tocando ? 'pause' : 'play'} size={17} />
        </button>
      </div>

      <div className="player__barra" ref={barra} onClick={clicar}>
        <span className="player__preenche" ref={preenche} />
        <span className="player__bolinha" ref={bolinha} />
      </div>

      <div className="player__rodape">
        <span className="player__t" ref={tAtual}>0:24</span>

        <span className="player__vol-wrap">
          <button className="player__mudo" onClick={silenciar} aria-label={mudo ? 'ligar som' : 'mudo'}>
            <Icone nome={mudo ? 'mudo' : 'som'} size={14} />
          </button>
          <input
            className="player__vol"
            type="range"
            min="0"
            max="100"
            value={mudo ? 0 : vol}
            onChange={e => mudar(Number(e.target.value))}
            aria-label="volume"
          />
        </span>

        <span className="player__t" ref={tTotal}>0:00</span>
      </div>
    </div>
  )
}

export default memo(Player)
