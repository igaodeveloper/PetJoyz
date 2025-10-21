import { Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  out: { opacity: 0, y: -10, transition: { duration: 0.35, ease: 'easeIn' } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
}

export const pop: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.18 } },
  tap: { scale: 0.98, transition: { duration: 0.06 } },
}

export const buttonElevate: Variants = {
  rest: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', scale: 1 },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(16,24,40,0.12)',
    transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] },
  },
  tap: { y: -1, scale: 0.995, transition: { duration: 0.06 } },
}

export const headerUnderline: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: (w = '100%') => ({ width: w, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } }),
}

export const reducedMotion = {
  reduced: { transition: { duration: 0 } },
}

export default {};
