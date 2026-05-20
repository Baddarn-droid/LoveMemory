'use client'

import { useState } from 'react'
import type { CategoryId } from '@/lib/styles'
import { getDefaultClothingChoices } from '@/lib/styles'
import { PortraitCustomizer, type PortraitOptions } from '@/components/PortraitCustomizer'
import { CreateFlow } from '@/components/CreateFlow'

interface StyleCreateSectionProps {
  categoryId: CategoryId
  styleId: string
  styleTitle: string
}

export function StyleCreateSection({ categoryId, styleId, styleTitle }: StyleCreateSectionProps) {
  const [portraitOptions, setPortraitOptions] = useState<PortraitOptions>(() => ({
    petPose: 'standing',
    clothingChoices: getDefaultClothingChoices(categoryId),
    colourOptionId: 'style-default',
  }))

  return (
    <>
      <PortraitCustomizer
        categoryId={categoryId}
        styleTitle={styleTitle}
        options={portraitOptions}
        onChange={setPortraitOptions}
      />
      <CreateFlow categoryId={categoryId} styleId={styleId} portraitOptions={portraitOptions} />
    </>
  )
}
