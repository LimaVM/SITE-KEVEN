/* variantes compartilhadas de animação */
export const reveal = {
  hidden: { opacity: 0, y: 34, filter: 'blur(7px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: [0.2, 0.7, 0.2, 1] }
  }
}

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } }
})

export const viewport = { once: true, amount: 0.25 }
