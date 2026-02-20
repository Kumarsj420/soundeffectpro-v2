'use client'
import { useEffect, useRef, useState } from 'react'
import { Para } from './Ui'
import Button from './form/Button'

interface GoogleAdProps {
  slot: string
  format?: string
  responsive?: boolean
  variant?:
    | 'default'
    | 'sidebar'
    | 'post-infeed'
    | 'multiplex'
    | 'header'
    | 'below-sound-btn'
    | 'below-popular'
}

const SIDEBAR_STORAGE_KEY = 'sidebar_ad_closed'

export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  variant = 'default'
}: GoogleAdProps) {

  const adRef = useRef<HTMLModElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const pushedRef = useRef(false)

  /* ---------------------------------------
     Fix 1: Proper Intersection Observer
  ---------------------------------------- */
  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  /* ---------------------------------------
     Fix 2: Push Ad ONLY after <ins> exists
  ---------------------------------------- */
  useEffect(() => {
    if (!visible) return
    if (!adRef.current) return
    if (pushedRef.current) return

    try {
      ; (window as any).adsbygoogle =
        (window as any).adsbygoogle || []
      ; (window as any).adsbygoogle.push({})
      pushedRef.current = true
    } catch { }
  }, [visible])

  /* ---------------------------------------
     Sidebar 24h Expiry
  ---------------------------------------- */
  useEffect(() => {
    if (variant !== 'sidebar') return

    const closedAt = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (!closedAt) return

    const hoursPassed = (Date.now() - Number(closedAt)) / 36e5
    if (hoursPassed < 24) setDismissed(true)
  }, [variant])

  const closeSidebar = () => {
    setDismissed(true)
    localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      Date.now().toString()
    )
  }

  const baseAd = (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout-key="-gw-1+2a-9x+5c"
      data-full-width-responsive={responsive.toString()}
    />
  )

  /* ===================== VARIANTS ====================== */

  if (variant === 'sidebar') {
    if (dismissed) return null

    return (
      <div className="hidden xl:block w-75" ref={wrapperRef}>
        <div className="sticky top-40">

          <Button
            variant="outline"
            aria-label="Close ad"
            onClick={closeSidebar}
            size="auto"
            className="absolute -right-3 -top-3 size-8 text-xs rounded-full z-30"
          >
            ✕
          </Button>

          <div className="w-75 h-150 flex justify-center items-center bg-gray-300 dark:bg-zinc-800 rounded-2xl">
            {visible && baseAd}
          </div>

        </div>
      </div>
    )
  }

  if (variant === 'header') {
    return (
      <div
        ref={wrapperRef}
        className="max-w-7xl m-auto px-5 sm:px-7 mt-3 min-h-62.5 bg-gray-300 dark:bg-zinc-800 rounded-2xl flex justify-center items-center"
      >
        {visible && baseAd}
      </div>
    )
  }

  if (variant === 'post-infeed') {
    return (
      <div
        ref={wrapperRef}
        className="my-8 min-h-70 col-span-full flex justify-center items-center bg-gray-300 dark:bg-zinc-800 rounded-2xl"
      >
        {visible && baseAd}
      </div>
    )
  }

  if (variant === 'multiplex') {
    return (
      <div
        ref={wrapperRef}
        className="col-span-full min-h-62.5 my-12 bg-gray-300 dark:bg-zinc-800 rounded-2xl p-4"
      >
        <Para>You may also like</Para>
        {visible && baseAd}
      </div>
    )
  }

  if (variant === 'below-popular') {
    return (
      <div
        ref={wrapperRef}
        className="my-4 min-h-62.5 bg-gray-300 dark:bg-zinc-800 rounded-2xl flex items-center justify-center"
      >
        {visible && baseAd}
      </div>
    )
  }

  if (variant === 'below-sound-btn') {
    return (
      <div
        ref={wrapperRef}
        className="mt-4 min-h-62.5 bg-gray-300 dark:bg-zinc-800 rounded-2xl flex items-center justify-center"
      >
        {visible && baseAd}
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className="min-h-50 flex justify-center items-center bg-gray-300 dark:bg-zinc-800 rounded-2xl"
    >
      {visible && baseAd}
    </div>
  )
}