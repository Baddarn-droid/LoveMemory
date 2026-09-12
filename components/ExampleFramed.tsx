'use client'

import Image from 'next/image'
import { ProdigiClassicFrame } from '@/components/ProdigiClassicFrame'
import type { FrameColourId } from '@/lib/frameCatalog'

export function ExampleFramed({
  src,
  alt,
  colour,
  sizes,
  density = 'gallery',
  fit = 'cover',
}: {
  src: string
  alt: string
  colour: FrameColourId
  sizes: string
  density?: 'gallery' | 'compact'
  fit?: 'cover' | 'contain'
}) {
  return (
    <ProdigiClassicFrame colour={colour} density={density} className="w-full">
      <div className="relative aspect-[5/7] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className={fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center'}
          sizes={sizes}
        />
      </div>
    </ProdigiClassicFrame>
  )
}
