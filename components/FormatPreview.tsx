'use client'

import { ProdigiClassicFrame } from '@/components/ProdigiClassicFrame'
import type { FrameColourId } from '@/lib/frameCatalog'

export function FormatPreview({
  src,
  variant,
  frameColour = 'gold',
  size = 'card',
  aspect = '5 / 7',
}: {
  src: string
  variant: 'download' | 'print' | 'framed'
  frameColour?: FrameColourId
  size?: 'card' | 'hero'
  aspect?: string
}) {
  if (variant === 'download') {
    return (
      <div className={size === 'hero' ? 'w-full' : 'mb-5 flex justify-center'}>
        <img src={src} alt="" className="h-36 w-36 rounded-lg object-contain shadow-lg" />
      </div>
    )
  }

  if (variant === 'print') {
    return (
      <div className={size === 'hero' ? 'w-full' : 'mb-5 flex justify-center'}>
        <div className={`bg-[#efe6d4] shadow-xl ${size === 'hero' ? 'p-3 sm:p-4' : 'p-2'}`}>
          <img
            src={src}
            alt=""
            className={size === 'hero' ? 'w-full object-contain' : 'h-32 w-32 object-contain'}
            style={size === 'hero' ? { aspectRatio: aspect } : undefined}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={size === 'hero' ? 'w-full' : 'mb-5 flex justify-center'}>
      <ProdigiClassicFrame colour={frameColour} className={size === 'card' ? 'w-32' : 'w-full'}>
        <img
          src={src}
          alt=""
          className="w-full object-cover"
          style={{ aspectRatio: aspect, background: '#efe6d4' }}
        />
      </ProdigiClassicFrame>
    </div>
  )
}
