import { memo } from 'react'
import { useTypedLoop } from '../hooks/useTypedLoop.js'
import { typed } from '../content.js'

/* isolado de propósito: ele re-renderiza a cada letra,
   e não deve arrastar o cartão inteiro junto. */
function Typed() {
  const frase = useTypedLoop(typed)
  return <p className="card__typed">{frase}</p>
}

export default memo(Typed)
