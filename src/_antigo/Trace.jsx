import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { trace } from '../content.js'
import { reveal, viewport } from '../lib/motion.js'

function detectDevice() {
  const ua = navigator.userAgent

  let os = 'sistema desconhecido'
  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11'
  else if (/Windows/.test(ua)) os = 'Windows'
  else if (/Android ([\d.]+)/.test(ua)) os = 'Android ' + RegExp.$1
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Linux/.test(ua)) os = 'Linux'

  let browser = 'navegador desconhecido'
  if (/Edg\//.test(ua)) browser = 'Microsoft Edge'
  else if (/OPR\//.test(ua)) browser = 'Opera'
  else if (/Chrome\//.test(ua)) browser = 'Google Chrome'
  else if (/Firefox\//.test(ua)) browser = 'Firefox'
  else if (/Safari\//.test(ua)) browser = 'Safari'

  let model = 'Computador / Desktop'
  if (/Android/.test(ua)) {
    const mm = ua.match(/;\s?([^;]+)\sBuild/) || ua.match(/Android[^;]+;\s?([^;)]+)\)/)
    model = mm ? mm[1].trim() : 'Android'
  } else if (/iPhone/.test(ua)) model = 'iPhone'
  else if (/iPad/.test(ua)) model = 'iPad'

  return {
    tipo: /Mobi|Android|iPhone|iPad/.test(ua) ? 'Celular / Mobile' : 'Computador',
    aparelho: model,
    os,
    browser,
    tela: `${screen.width}x${screen.height} px`,
    idioma: navigator.language || '?',
    fuso: Intl.DateTimeFormat().resolvedOptions().timeZone || '?',
    nucleos: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' núcleos' : '?'
  }
}

async function buildRows() {
  const d = detectDevice()

  let bateria = null
  try {
    if (navigator.getBattery) {
      const b = await navigator.getBattery()
      bateria = Math.round(b.level * 100) + '%' + (b.charging ? ' (carregando)' : '')
    }
  } catch { /* nem todo navegador entrega */ }

  let net = { ip: 'oculto', cidade: '?', regiao: '?', pais: '?', isp: '?' }
  try {
    const r = await fetch('https://ipwho.is/')
    const j = await r.json()
    if (j && j.success !== false) {
      net = {
        ip: j.ip || 'oculto',
        cidade: j.city || '?',
        regiao: j.region || '?',
        pais: (j.country || '?') + (j.flag?.emoji ? ' ' + j.flag.emoji : ''),
        isp: j.connection?.isp || j.connection?.org || '?'
      }
    }
  } catch { /* sem rede, segue o baile */ }

  return [
    ['alvo sintonizado', 'OK', 'hot'],
    ['tipo de acesso', d.tipo],
    ['aparelho', d.aparelho],
    ['sistema', d.os],
    ['navegador', d.browser],
    ['tela', d.tela],
    ['idioma', d.idioma],
    ['fuso horário', d.fuso],
    ['processador', d.nucleos],
    ...(bateria ? [['bateria', bateria]] : []),
    ['endereço IP', net.ip, 'hot'],
    ['cidade', net.cidade],
    ['região', net.regiao],
    ['país', net.pais],
    ['provedor', net.isp],
    ['', ''],
    ['e você ainda acha', 'que está sozinho?', 'hot']
  ]
}

export default function Trace() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!inView) return
    let alive = true
    let timer

    buildRows().then(all => {
      if (!alive) return
      let i = 0
      const write = () => {
        if (!alive || i >= all.length) return
        setRows(r => [...r, all[i]])
        i++
        timer = setTimeout(write, 220 + Math.random() * 180)
      }
      write()
    })

    return () => { alive = false; clearTimeout(timer) }
  }, [inView])

  return (
    <section className="trace" ref={ref}>
      <motion.p className="trace__warn" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {trace.warn}
      </motion.p>

      <motion.p className="trace__title" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {trace.title}
      </motion.p>

      <motion.div
        className="trace__terminal"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {rows.length === 0 && (
          <p className="trace__line">
            <span className="t-key">&gt; sintonizando</span>
            <span className="t-dots">_</span>
          </p>
        )}

        {rows.map(([k, v, flag], i) => (
          <p className="trace__line" key={i}>
            {k === '' && v === '' ? ' ' : (
              <>
                <span className="t-key">&gt; {k}{v ? ':' : ''}</span>{' '}
                {v && <span className={flag === 'hot' ? 't-hot' : 't-val'}>{v}</span>}
              </>
            )}
          </p>
        ))}
      </motion.div>

      <motion.p className="trace__foot" variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        {trace.foot} <em>{trace.footEm}</em>
      </motion.p>
    </section>
  )
}
