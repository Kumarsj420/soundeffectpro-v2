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
  height = 90
}: {
  children: React.ReactNode
  height?: number
}) {
  return (
    <div className="inline-block relative w-full" style={{ minHeight: height }}>
      <div className="absolute inset-0 z-30 animate-pulse bg-gray-400 dark:bg-zinc-700 rounded-xl" />
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

  useEffect(() => {
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, [slot]);


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



  if (variant === 'header') {
    return (
      <div className="max-w-7xl m-auto px-5 sm:px-7 mt-3 flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
        <AdWrapper height={90}>
          {adElement}
        </AdWrapper>
      </div>
    )
  }


  if (variant === 'post-infeed') {
    return <div className="sm:col-span-full my-8 flex justify-center items-center min-h-55 bg-gray-300 dark:bg-zinc-800 rounded-2xl">
      <AdWrapper height={20}>
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
      <AdWrapper height={90}>
        {adElement}
      </AdWrapper>
    </div>
  }

  return adElement
}