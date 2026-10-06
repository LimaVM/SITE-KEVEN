/* barramento de eventos: qualquer componente grita, os overlays respondem */
const bus = new EventTarget()

export const emit = (name, detail) =>
  bus.dispatchEvent(new CustomEvent(name, { detail }))

export const on = (name, fn) => {
  bus.addEventListener(name, fn)
  return () => bus.removeEventListener(name, fn)
}

/* atalhos usados pelo site inteiro */
export const flash = () => emit('flash')
export const quake = (force = 1) => emit('quake', force)
