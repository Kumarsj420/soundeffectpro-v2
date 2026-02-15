'use client'
import { useEffect, useRef, useState } from 'react'
import { Para } from './Ui'

interface GoogleAdProps {
  slot: string
  format?: string
  responsive?: boolean
  variant?: 'default' | 'sidebar' | 'post-infeed' | 'multiplex' | 'header' | 'below-sound-btn' | 'below-popular'
}


function AdWrapper({
  children,
  loading,
  height = 90
}: {
  children: React.ReactNode
  loading: boolean
  height?: number
}) {
  return (
    <div className="inline-block relative w-full" style={{ minHeight: height }}>
      {loading && (
        <div className="absolute inset-0 z-30 animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-xl" />
      )}
      {children}
    </div>
  )
}

export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  variant = 'default'
}: GoogleAdProps) {

  const adRef = useRef<HTMLModElement | null>(null)
  const [status, setStatus] = useState<'loading' | 'filled' | 'empty'>('loading');
  const [dismissed, setDismissed] = useState(false)


  useEffect(() => {
    try {
      ; (window as any).adsbygoogle =
        (window as any).adsbygoogle || []
        ; (window as any).adsbygoogle.push({})
    } catch { }

    const timer = setTimeout(() => {
      if (adRef.current) {
        const height = adRef.current.offsetHeight
        if (height === 0) {
          setStatus('empty')
        } else {
          setStatus('filled')
        }
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [])


  if (status === 'empty') return null


  const adElement = (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  )


  if (variant === 'sidebar') {

    if (dismissed) return null

    return (
      <div className="hidden xl:block fixed right-6 top-28 w-[300px] z-50">

        {/* Close button */}
        <button
          aria-label="Close ad"
          onClick={() => {
            setDismissed(true)
            localStorage.setItem('sidebarAdClosed', 'true')
          }}
          className="absolute -left-3 top-0 bg-white dark:bg-zinc-900 
                   border border-gray-300 dark:border-zinc-700
                   rounded-full w-7 h-7 text-xs shadow-md
                   hover:scale-105 transition"
        >
          ✕
        </button>

        {/* Ad container */}
        <div className="w-[300px] min-h-[600px]">
          {adElement}
        </div>
      </div>
    )
  }


  if (variant === 'header') {
    return (
      <div className="max-w-7xl m-auto px-5 sm:px-7 mt-3">
        <AdWrapper loading={status === 'loading'} height={90}>
          {adElement}
        </AdWrapper>
      </div>
    )
  }


  if (variant === 'post-infeed') {
    return <div className="sm:col-span-1 md:col-span-2 my-8 flex justify-center">
      <AdWrapper loading={status === 'loading'} height={20}>
        {adElement}
      </AdWrapper>
    </div>
  }

  if (variant === 'multiplex') {
    return (
      <div className="col-span-full my-12">
        <Para>You may also like</Para>
        {adElement}
      </div>
    )
  }

  if (variant === 'below-sound-btn') {
    return <div className="my-8">{adElement}</div>
  }

  if (variant === 'below-popular') {
    return <div className="my-2 mx-auto">
      <AdWrapper loading={status === 'loading'} height={90}>
        {adElement}
      </AdWrapper>
    </div>
  }

  return adElement
}
