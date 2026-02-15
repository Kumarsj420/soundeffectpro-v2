'use client'
import { useEffect, useRef, useState } from 'react'
import { Para } from './Ui'
import Button from './form/Button'

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
        <div className="absolute inset-0 z-30 animate-pulse bg-gray-400 dark:bg-zinc-700 rounded-xl" />
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
      <div className="hidden xl:block fixed right-6 top-28 w-75 z-50">

        {/* Close button */}
        <Button
          variant='outline'
          aria-label="Close ad"
          onClick={() => {
            setDismissed(true)
          }}
          size='auto'
          className="absolute -right-3 top-0 size-8 text-xs
                   hover:scale-105 transition z-33 rounded-full flex justify-center items-center"
        >
          ✕
        </Button>

        {/* Ad container */}
        <div className="w-75 min-h-150 flex justify-center items-center bg-gray-300 dark:bg-zinc-800 rounded-2xl">
          {adElement}
        </div>
      </div>
    )
  }


  if (variant === 'header') {
    return (
      <div className="max-w-7xl m-auto px-5 sm:px-7 mt-3 flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
        <AdWrapper loading={status === 'loading'} height={90}>
          {adElement}
        </AdWrapper>
      </div>
    )
  }


  if (variant === 'post-infeed') {
    return <div className="sm:col-span-full my-8 flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
      <AdWrapper loading={status === 'loading'} height={20}>
        {adElement}
      </AdWrapper>
    </div>
  }

  if (variant === 'multiplex') {
    return (
      <div className="col-span-full my-12 flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
        <Para>You may also like</Para>
        {adElement}
      </div>
    )
  }

  if (variant === 'below-sound-btn') {
    return <div className="flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl mt-4">{adElement}</div>
  }

  if (variant === 'below-popular') {
    return <div className="my-2 mx-auto flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
      <AdWrapper loading={status === 'loading'} height={90}>
        {adElement}
      </AdWrapper>
    </div>
  }

  return adElement
}
