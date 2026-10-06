import { useEffect, useState } from 'react'

/* digita, apaga e passa pra próxima frase, pra sempre */
export function useTypedLoop(lines, { type = 66, erase = 32, hold = 2400 } = {}) {
  const [text, setText] = useState('')

  useEffect(() => {
    let li = 0, ci = 0, deleting = false, timer

    const step = () => {
      const cur = lines[li]
      if (!deleting) {
        ci++
        setText(cur.slice(0, ci))
        if (ci === cur.length) {
          deleting = true
          timer = setTimeout(step, hold)
          return
        }
      } else {
        ci--
        setText(cur.slice(0, ci))
        if (ci === 0) {
          deleting = false
          li = (li + 1) % lines.length
        }
      }
      timer = setTimeout(step, deleting ? erase : type + Math.random() * 60)
    }

    timer = setTimeout(step, 400)
    return () => clearTimeout(timer)
  }, [lines, type, erase, hold])

  return text
}
