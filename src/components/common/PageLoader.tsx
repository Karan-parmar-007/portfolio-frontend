import { motion } from 'motion/react'

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6 h-16 w-16">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-green"
        >
          <motion.path
            d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0.3, pathLength: 0 }}
            animate={{ opacity: [0.3, 1, 0.3], pathLength: [0, 1, 0] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.text
            x="36"
            y="66"
            fill="currentColor"
            fontSize="50"
            fontWeight="400"
            letterSpacing="4.16666603"
            fontFamily="system-ui, sans-serif"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          >
            K
          </motion.text>
        </svg>
      </div>
      <motion.p
        className="font-mono text-sm text-slate"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  )
}
