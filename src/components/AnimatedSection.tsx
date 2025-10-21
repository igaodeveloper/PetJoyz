import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  stagger?: boolean
}

export default function AnimatedSection({ children, className = '', stagger = true }: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>
  }

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={stagger ? staggerContainer : undefined}
    >
      {children}
    </motion.section>
  )
}
