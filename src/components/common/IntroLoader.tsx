import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/**
 * Hexagon intro loader from old website with Brittany Chiang #020c1b dark background.
 */
export function IntroLoader({
  onLoadComplete,
  letter = 'K',
}: {
  onLoadComplete: () => void
  letter?: string
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimationComplete(true), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animationComplete) return
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false)
      onLoadComplete()
    }, 400)
    return () => window.clearTimeout(hideTimer)
  }, [animationComplete, onLoadComplete])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.645, 0.045, 0.355, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020c1b]"
        >
          <div className="relative h-24 w-24">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <motion.path
                d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
                stroke="#64FFDA"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4, ease: 'easeInOut' }}
              >
                <text
                  x="36"
                  y="66"
                  fill="#64FFDA"
                  fontSize="50"
                  fontWeight="400"
                  letterSpacing="4.16666603"
                  fontFamily="system-ui, Calibre-Medium, Calibre, sans-serif"
                >
                  {letter.slice(0, 1).toUpperCase()}
                </text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
