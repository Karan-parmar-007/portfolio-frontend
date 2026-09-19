import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-light-navy border-lightest-navy text-lightest-slate',
          success: 'text-green',
          error: 'text-lightest-slate',
        },
      }}
    />
  )
}
