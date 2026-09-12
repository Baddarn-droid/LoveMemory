'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ProdigiClassicFrame } from '@/components/ProdigiClassicFrame'
import type { FrameColourId } from '@/lib/frameCatalog'

export function StyleThumb({
  src,
  alt,
  colour = 'gold',
  fit = 'cover',
}: {
  src: string
  alt: string
  colour?: FrameColourId
  fit?: 'cover' | 'contain'
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-[5/7] w-full items-center justify-center bg-[#efe6d4]/10 text-xs text-white/30">
        Preview
      </div>
    )
  }

  return (
    <ProdigiClassicFrame colour={colour} density="compact" className="w-full">
      <div className="relative aspect-[5/7] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className={`${fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center'} transition duration-500 group-hover:scale-[1.02]`}
          sizes="(max-width: 640px) 40vw, 180px"
          onError={() => setFailed(true)}
        />
      </div>
    </ProdigiClassicFrame>
  )
}
