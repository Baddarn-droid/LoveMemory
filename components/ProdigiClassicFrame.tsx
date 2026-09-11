'use client'

import type { ReactNode } from 'react'
import { FRAME_FINISH, type FrameColourId } from '@/lib/frameCatalog'

const GRAIN =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.55\'/%3E%3C/svg%3E")'

/** 20mm satin-laminated classic moulding + perspex, no mount (Prodigi GLOBAL-CFP). */
export function ProdigiClassicFrame({
  colour,
  children,
  className = '',
  density = 'gallery',
}: {
  colour: FrameColourId
  children: ReactNode
  className?: string
  density?: 'gallery' | 'compact'
}) {
  const finish = FRAME_FINISH[colour]
  const face = density === 'compact' ? '7.5%' : '5.2%'

  return (
    <div
      className={`relative ${className}`}
      style={{
        background: finish.wood,
        padding: face,
        boxShadow: `
          inset 1.5px 1.5px 0 rgba(255,255,255,0.22),
          inset -2px -2px 0 rgba(0,0,0,0.45),
          0 1px 0 rgba(255,255,255,0.12),
          0 22px 44px rgba(0,0,0,0.48)
        `,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-35"
        style={{
          backgroundImage: `${GRAIN}, repeating-linear-gradient(90deg, transparent 0 2px, rgba(0,0,0,0.07) 2px 3px)`,
        }}
        aria-hidden
      />
      <div
        className="relative"
        style={{
          background: finish.bevel,
          padding: '1.5%',
          boxShadow: `inset 0 0 0 1px ${finish.lip}, inset 0 2px 5px rgba(0,0,0,0.45)`,
        }}
      >
        <div className="relative overflow-hidden bg-[#efe6d4]">
          {children}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(130deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(0,0,0,0.05) 100%)',
              boxShadow: 'inset 0 0 12px rgba(0,0,0,0.12)',
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

export function GalleryWall({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,236,200,0.08), transparent 55%), linear-gradient(180deg, #3a3228 0%, #221c17 55%, #181410 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
    >
      {children}
    </div>
  )
}
