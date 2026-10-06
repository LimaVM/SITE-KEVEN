import { useEffect, useState } from 'react'

const pad = n => String(n).padStart(2, '0')

export default function BroadcastBar({ mode }) {
  const [clock, setClock] = useState('--:--:--')
  const [signal, setSignal] = useState(0)
  const [read, setRead] = useState(0)

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSignal(58 + Math.floor(Math.random() * 40)), 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setRead(max > 0 ? Math.round((window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const status =
    mode === 'ansia' ? 'DESEJO EM ALTA' :
    mode === 'tedio' ? 'NADA NOVO' :
    'DESEJO ATIVO'

  return (
    <div className="broadcast" aria-hidden="true">
      <span className="broadcast__dot" />
      <span>{status}</span>
      <span className="broadcast__sep broadcast__sep--sig">/</span>
      <span className="broadcast__signal">SINAL {pad(signal)}%</span>
      <span className="broadcast__sep">/</span>
      <span>{clock}</span>
      <span className="broadcast__sep broadcast__hide">/</span>
      <span className="broadcast__hide">leitura {read}%</span>
      <span className="broadcast__bar" style={{ width: `${read}%` }} />
    </div>
  )
}
