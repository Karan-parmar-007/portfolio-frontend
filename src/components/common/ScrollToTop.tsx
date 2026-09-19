import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25 }}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-lg border border-green/40 bg-navy/90 text-green shadow-lg shadow-navy-shadow backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-green hover:bg-green-tint hover:shadow-green/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green md:right-10"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
