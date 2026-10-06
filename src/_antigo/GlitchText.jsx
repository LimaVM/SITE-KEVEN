/* texto com franja cromática: as cópias ficam atrás e vazam nas bordas */
export default function GlitchText({ lines, as: Tag = 'h1', className = '' }) {
  const arr = Array.isArray(lines) ? lines : [lines]
  return (
    <Tag className={`glitch ${className}`} data-text={arr.join('\n')}>
      {arr.map((l, i) => (
        <span key={i}>
          {l}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  )
}
