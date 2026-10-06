import { useCallback, useEffect, useRef, useState } from 'react'
import { musica } from '../content.js'

/* dois modos, mesma interface pra quem usa:

   1. musica.arquivo existe  -> <audio> local. sem anúncio, sem iframe,
      loop exato e muito mais leve.
   2. arquivo ausente ou com erro -> cai sozinho no embed do YouTube.

   ou seja: basta largar o arquivo na pasta que o site troca de modo sem
   precisar mexer em código.

   o tempo corrente NÃO vira estado: quem desenha a barra lê direto daqui
   e escreve no DOM, senão o app re-renderizaria várias vezes por segundo. */

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

/* o <audio> ganha os mesmos métodos do player do YouTube,
   então o resto do site não precisa saber qual dos dois está tocando */
function adaptar(el) {
  return {
    getCurrentTime: () => el.currentTime || 0,
    getDuration: () => (isFinite(el.duration) ? el.duration : 0),
    seekTo: t => { try { el.currentTime = t } catch { /* ainda sem metadata */ } },
    playVideo: () => { el.play().catch(() => {}) },
    pauseVideo: () => el.pause(),
    getPlayerState: () => (el.paused ? 2 : 1),
    setVolume: v => { el.volume = Math.max(0, Math.min(1, v / 100)) },
    mute: () => { el.muted = true },
    unMute: () => { el.muted = false },
    destroy: () => { el.pause(); el.removeAttribute('src'); el.load() }
  }
}

export function usePlayer() {
  const host = useRef(null)
  const player = useRef(null)
  const [pronto, setPronto] = useState(false)
  const [tocando, setTocando] = useState(false)
  const [vol, setVol] = useState(58)
  const [mudo, setMudo] = useState(false)

  useEffect(() => {
    let vivo = true
    let limparAudio = null

    /* ---- modo youtube (também é o plano B) ---- */
    const montarYouTube = () => {
      carregarApi().then(YT => {
        if (!vivo || !host.current || player.current) return
        player.current = new YT.Player(host.current, {
          videoId: musica.video,
          playerVars: {
            start: musica.start,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0
          },
          events: {
            onReady: e => { e.target.setVolume(58); setPronto(true) },
            onStateChange: e => {
              setTocando(e.data === YT.PlayerState.PLAYING)
              if (e.data === YT.PlayerState.ENDED) {
                e.target.seekTo(musica.start, true)
                e.target.playVideo()
              }
            }
          }
        })
      })
    }

    /* ---- modo arquivo local ---- */
    if (musica.arquivo) {
      const el = new Audio(musica.arquivo)
      el.preload = 'auto'
      el.volume = 0.58
      el.crossOrigin = 'anonymous'

      /* o loop volta pro corte, nunca pro começo do arquivo */
      const fim = () => { el.currentTime = musica.start; el.play().catch(() => {}) }
      const play = () => setTocando(true)
      const pause = () => setTocando(false)
      const pronto2 = () => setPronto(true)

      /* arquivo não existe ou formato não suporta: segue pelo YouTube */
      const falhou = () => {
        console.warn('[trilha] não consegui carregar', musica.arquivo, '— usando o YouTube')
        limparAudio?.()
        limparAudio = null
        player.current = null
        if (vivo) montarYouTube()
      }

      el.addEventListener('ended', fim)
      el.addEventListener('play', play)
      el.addEventListener('pause', pause)
      el.addEventListener('loadedmetadata', pronto2)
      el.addEventListener('canplay', pronto2)
      el.addEventListener('error', falhou)

      player.current = adaptar(el)

      limparAudio = () => {
        el.removeEventListener('ended', fim)
        el.removeEventListener('play', play)
        el.removeEventListener('pause', pause)
        el.removeEventListener('loadedmetadata', pronto2)
        el.removeEventListener('canplay', pronto2)
        el.removeEventListener('error', falhou)
        try { el.pause(); el.removeAttribute('src'); el.load() } catch { /* já foi */ }
      }
    } else {
      montarYouTube()
    }

    return () => {
      vivo = false
      limparAudio?.()
      try { player.current?.destroy?.() } catch { /* já foi */ }
      player.current = null
    }
  }, [])

  const tocar = useCallback(() => {
    const p = player.current
    if (!p || !p.playVideo) return false
    p.seekTo(musica.start, true)
    p.unMute()
    p.playVideo()
    return true
  }, [])

  const alternar = useCallback(() => {
    const p = player.current
    if (!p) return
    if (p.getPlayerState && p.getPlayerState() === 1) p.pauseVideo()
    else p.playVideo()
  }, [])

  const buscar = useCallback(seg => {
    player.current?.seekTo?.(seg, true)
  }, [])

  const mudar = useCallback(v => {
    const p = player.current
    setVol(v)
    if (!p || !p.setVolume) return
    p.setVolume(v)
    if (v === 0) { p.mute(); setMudo(true) }
    else { p.unMute(); setMudo(false) }
  }, [])

  const silenciar = useCallback(() => {
    const p = player.current
    if (!p) return
    setMudo(m => {
      if (m) { p.unMute(); p.setVolume(vol || 58) } else { p.mute() }
      return !m
    })
  }, [vol])

  return { host, api: player, pronto, tocando, vol, mudo, tocar, alternar, buscar, mudar, silenciar }
}
