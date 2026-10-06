import { marquee } from '../content.js'

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span>{marquee}</span>
        <span>{marquee}</span>
      </div>
    </div>
  )
}
