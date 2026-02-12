'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { Para } from './Ui'

interface GoogleAdProps {
  slot: string
  format?: string
  responsive?: boolean
  variant?: 'default' | 'sidebar' | 'post-infeed' | 'multiplex' | 'header' | 'below-sound-btn'
}

export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  variant = 'default'
}: GoogleAdProps) {

  const adRef = useRef<HTMLModElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      ; (window as any).adsbygoogle =
        (window as any).adsbygoogle || []
        ; (window as any).adsbygoogle.push({})
    } catch { }

    const timer = setTimeout(() => {
      if (adRef.current && adRef.current.offsetHeight > 0) {
        setLoaded(true)
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  if (!loaded) return null

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

  // ⭐ Layout variants (no functions crossing boundary)

  if (variant === 'sidebar') {
    return (
      <div className="hidden xl:block fixed right-6 top-28 w-75 z-999">
        <div className="w-75 min-h-150">
          {adElement}
        </div>
      </div>
    )
  }

  if (variant === 'header') {
    return (
      <div className="max-w-7xl m-auto px-5 sm:px-7">
        {adElement}
      </div>
    )
  }

  if (variant === 'post-infeed') {
    return (
      <div className="col-span-1 sm:col-span-2">
        {adElement}
      </div>
    )
  }

  if (variant === 'multiplex') {
    return (
      <div className="col-span-full">
        <Para>
          You may also like
        </Para>

        {adElement}
      </div>
    )
  }

  if (variant === 'below-sound-btn') {
    return (
      <div className="col-span-full">
        <div className="my-8">
          {adElement}
        </div>

        {adElement}
      </div>
    )
  }

  return adElement
}
