import { useEffect, useRef, useState } from 'react'
import { trilha } from '../content.js'

/* trilha via player oficial do YouTube, invisível.
   nada é baixado: o áudio toca do próprio embed, começando no segundo 24. */
const VIDEO = '5EpyN_6dqyk'
const START = 24

/* volume por estado do site: o som é mais um jeito de reagir */
const VOL = { neutro: 52, ansia: 78, tedio: 20 }
const VOL_QUIET = 6

let apiPromise = null
function carregarApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise(resolve => {
    if (window.YT && window.YT.Player) return resolve(window.YT)
    const antes = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof antes === 'function') antes()
      resolve(window.YT)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiPromise
}

export default function Trilha({ active, mode }) {
  const [ligado, setLigado] = useState(true)
  const [tocando, setTocando] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)
  const [quiet, setQuiet] = useState(false)
  const player = useRef(null)
  const caixa = useRef(null)

  /* monta o player uma vez, já com o corte em 0:24 */
  useEffect(() => {
    let vivo = true
    carregarApi().then(YT => {
      if (!vivo || !caixa.current || player.current) return
      player.current = new YT.Player(caixa.current, {
        videoId: VIDEO,
        playerVars: {
          start: START,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: e => { e.target.setVolume(VOL.neutro); e.target.mute() },
          onStateChange: e => {
            setTocando(e.data === YT.PlayerState.PLAYING)
            /* no fim volta pro corte, nunca pro começo */
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(START, true)
              e.target.playVideo()
            }
          }
        }
      })
    })
    return () => {
      vivo = false
      try { player.current?.destroy() } catch { /* já foi */ }
      player.current = null
    }
  }, [])

  /* entrou no site: o gesto do botão "entrar" é o que libera o áudio */
  useEffect(() => {
    if (!active) return
    let tentativa
    const tocar = () => {
      const p = player.current
      if (!p || !p.playVideo) { tentativa = setTimeout(tocar, 300); return }
      p.seekTo(START, true)
      if (ligado) p.unMute()
      p.playVideo()
      /* se o navegador barrar, o botão do canto avisa */
      tentativa = setTimeout(() => {
        try {
          if (p.getPlayerState && p.getPlayerState() !== 1) setBloqueado(true)
        } catch { /* player ainda acordando */ }
      }, 1400)
    }
    tocar()
    return () => clearTimeout(tentativa)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  /* o modo escolhido e o teste do silêncio mexem no volume */
  useEffect(() => {
    const p = player.current
    if (!p || !p.setVolume) return
    const alvo = quiet ? VOL_QUIET : (VOL[mode] ?? VOL.neutro)
    p.setVolume(alvo)
  }, [mode, quiet])

  /* data-quiet é escrito pelo teste dos 10 segundos */
  useEffect(() => {
    const ler = () => setQuiet(document.documentElement.dataset.quiet === 'on')
    ler()
    const obs = new MutationObserver(ler)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-quiet'] })
    return () => obs.disconnect()
  }, [])

  const alternar = () => {
    const p = player.current
    if (!p) return
    const prox = !ligado
    setLigado(prox)
    setBloqueado(false)
    if (prox) {
      p.unMute()
      if (p.getPlayerState && p.getPlayerState() !== 1) { p.seekTo(START, true); p.playVideo() }
    } else {
      p.mute()
    }
  }

  const aceso = ligado && tocando && !bloqueado

  return (
    <>
      <div className="trilha__frame" aria-hidden="true"><div ref={caixa} /></div>

      {active && (
        <button
          className={`som ${aceso ? 'on' : ''} ${bloqueado ? 'blocked' : ''}`}
          onClick={alternar}
          title={trilha.credit}
        >
          <span className="som__bars" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <span className="som__label">
            {bloqueado ? trilha.blocked : ligado ? trilha.on : trilha.off}
          </span>
        </button>
      )}
    </>
  )
}
