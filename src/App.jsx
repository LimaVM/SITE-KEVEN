import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Fundo from './components/Fundo.jsx'
import Entrada from './components/Entrada.jsx'
import Cartao from './components/Cartao.jsx'
import Cursor from './components/Cursor.jsx'
import Fps from './components/Fps.jsx'
import Overlays from './components/Overlays.jsx'
import { usePlayer } from './hooks/usePlayer.js'

export default function App() {
  const [aberto, setAberto] = useState(false)
  const player = usePlayer()

  /* o clique em "entrar" é o gesto que libera o áudio no navegador */
  const entrar = () => {
    player.tocar()
    setAberto(true)
  }

  /* o player só existe de verdade quando a API termina de carregar */
  useEffect(() => {
    if (aberto && player.pronto) player.tocar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.pronto])

  return (
    <>
      <Fundo aberto={aberto} />
      <Overlays />
      <Cursor />
      <Fps />

      <div className="yt" aria-hidden="true"><div ref={player.host} /></div>

      <AnimatePresence>
        {!aberto && <Entrada key="entrada" onEnter={entrar} />}
      </AnimatePresence>

      {aberto && <Cartao player={player} />}
    </>
  )
}
