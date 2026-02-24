'use client'

import { useState, useEffect } from 'react'
import { SubStyleSelector } from '@/components/SubStyleSelector'
import { CreateFlow } from '@/components/CreateFlow'
import { CLOTHING_OPTIONS } from '@/lib/styles'
import type { CategoryId } from '@/lib/styles'
import type { RenaissanceSubStyle } from '@/lib/styles'

export type PetPose = 'standing' | 'laying'

interface RenaissanceFlowProps {
  categoryId: CategoryId
  styleId: string
  subStyles: RenaissanceSubStyle[]
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${
        selected
          ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </button>
  )
}

export function RenaissanceFlow({ categoryId, styleId, subStyles }: RenaissanceFlowProps) {
  const [selectedSubStyleId, setSelectedSubStyleId] = useState(subStyles[0]?.id ?? 'florentine')
  const [petPose, setPetPose] = useState<PetPose>('standing')

  const clothingOptions = CLOTHING_OPTIONS[categoryId] ?? []
  const [clothingChoices, setClothingChoices] = useState<Record<string, string>>(() =>
    clothingOptions.reduce(
      (acc, opt) => {
        acc[opt.id] = opt.choices[0]?.id ?? ''
        return acc
      },
      {} as Record<string, string>
    )
  )

  useEffect(() => {
    setClothingChoices(
      clothingOptions.reduce(
        (acc, opt) => {
          acc[opt.id] = opt.choices[0]?.id ?? ''
          return acc
        },
        {} as Record<string, string>
      )
    )
  }, [categoryId])

  const handleClothingChange = (optionId: string, choiceId: string) => {
    setClothingChoices((prev) => ({ ...prev, [optionId]: choiceId }))
  }

  return (
    <>
      <SubStyleSelector
        subStyles={subStyles}
        selectedId={selectedSubStyleId}
        onSelect={setSelectedSubStyleId}
      />

      {categoryId === 'pets' && (
        <div className="mb-10">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            Pet Pose
          </h3>
          <div className="flex flex-wrap gap-3">
            <OptionButton selected={petPose === 'standing'} onClick={() => setPetPose('standing')}>
              Standing
            </OptionButton>
            <OptionButton selected={petPose === 'laying'} onClick={() => setPetPose('laying')}>
              Laying on a pillow
            </OptionButton>
          </div>
        </div>
      )}

      {clothingOptions.length > 0 && (
        <div className="mb-10 space-y-8">
          {clothingOptions.map((opt) => (
            <div key={opt.id}>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
                {opt.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {opt.choices.map((choice) => (
                  <OptionButton
                    key={choice.id}
                    selected={clothingChoices[opt.id] === choice.id}
                    onClick={() => handleClothingChange(opt.id, choice.id)}
                  >
                    {choice.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateFlow
        categoryId={categoryId}
        styleId={styleId}
        subStyleId={selectedSubStyleId}
        petPose={categoryId === 'pets' ? petPose : undefined}
        clothingChoices={Object.keys(clothingChoices).length > 0 ? clothingChoices : undefined}
      />
    </>
  )
}
