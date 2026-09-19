import { createContext, useContext, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

const ease = [0.645, 0.045, 0.355, 1] as const
const StaggerActive = createContext(false)
const ScrollStaggerActive = createContext(false)

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 20,
  x = 0,
  enabled = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  enabled?: boolean
}) {
  const reduced = useReducedMotion()
  if (reduced || !enabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function FadeDown({
  children,
  className,
  delay = 0,
  enabled = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  enabled?: boolean
}) {
  return (
    <FadeIn className={className} delay={delay} y={-10} enabled={enabled}>
      {children}
    </FadeIn>
  )
}

export function Stagger({
  children,
  className,
  delay = 0,
  enabled = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  enabled?: boolean
}) {
  const reduced = useReducedMotion()
  const active = Boolean(enabled && !reduced)

  if (!active) {
    return (
      <StaggerActive.Provider value={false}>
        <div className={className}>{children}</div>
      </StaggerActive.Provider>
    )
  }

  return (
    <StaggerActive.Provider value>
      <motion.div
        className={cn(className)}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    </StaggerActive.Provider>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const active = useContext(StaggerActive)
  if (!active) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollReveal: Reveals elements as they scroll into view (Brittany Chiang style).
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 30,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number | 'some' | 'all'
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollStagger: Staggers children when the parent scrolls into view.
 */
export function ScrollStagger({
  children,
  className,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number | 'some' | 'all'
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <ScrollStaggerActive.Provider value={false}>
        <div className={className}>{children}</div>
      </ScrollStaggerActive.Provider>
    )
  }

  return (
    <ScrollStaggerActive.Provider value>
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    </ScrollStaggerActive.Provider>
  )
}

export function ScrollStaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const active = useContext(ScrollStaggerActive)
  if (!active) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
