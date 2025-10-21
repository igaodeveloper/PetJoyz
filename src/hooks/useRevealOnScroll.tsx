import { useEffect } from 'react'
import { useAnimation, AnimationControls } from 'framer-motion'

export function useRevealOnScroll(ref: React.RefObject<HTMLElement>, threshold = 0.15) {
  const controls: AnimationControls = useAnimation()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [ref, controls, threshold])

  return controls
}
