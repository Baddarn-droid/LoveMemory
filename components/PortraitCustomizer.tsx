'use client'

import type { CategoryId } from '@/lib/styles'
import { CLOTHING_OPTIONS, COLOUR_OPTIONS } from '@/lib/styles'

export type PetPose = 'standing' | 'laying'

export type PortraitOptions = {
  petPose: PetPose
  clothingChoices: Record<string, string>
  colourOptionId: string
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
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </button>
  )
}

interface PortraitCustomizerProps {
  categoryId: CategoryId
  styleTitle: string
  options: PortraitOptions
  onChange: (options: PortraitOptions) => void
}

/** Customization panel — shown on every style page for pets and family */
export function PortraitCustomizer({ categoryId, styleTitle, options, onChange }: PortraitCustomizerProps) {
  const clothingOptions = CLOTHING_OPTIONS[categoryId] ?? []
  const isPets = categoryId === 'pets'

  const setPetPose = (petPose: PetPose) => onChange({ ...options, petPose })
  const setColour = (colourOptionId: string) => onChange({ ...options, colourOptionId })
  const setClothing = (optionId: string, choiceId: string) =>
    onChange({
      ...options,
      clothingChoices: { ...options.clothingChoices, [optionId]: choiceId },
    })

  return (
    <section
      id="portrait-options"
      aria-label="Portrait customization"
      className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
    >
      <div className="mb-8 text-center">
        <h2 className="text-sm font-medium uppercase tracking-widest text-white/50">Customize your portrait</h2>
        <p className="mt-2 text-xs text-white/40">{styleTitle} · adjust options before you upload</p>
        <p className="mt-1 text-xs text-white/35">
          Fast light edit for {isPets ? 'pets' : 'people'} — faces stay close to your photo
        </p>
      </div>

      {isPets && (
        <div className="mb-8">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/45">Pet pose</h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={options.petPose === 'standing'} onClick={() => setPetPose('standing')}>
              Standing
            </OptionButton>
            <OptionButton selected={options.petPose === 'laying'} onClick={() => setPetPose('laying')}>
              Laying on a pillow
            </OptionButton>
          </div>
        </div>
      )}

      {clothingOptions.map((opt) => (
        <div key={opt.id} className="mb-8 last:mb-0">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/45">{opt.label}</h3>
          <div className="flex flex-wrap gap-2">
            {opt.choices.map((choice) => (
              <OptionButton
                key={choice.id}
                selected={options.clothingChoices[opt.id] === choice.id}
                onClick={() => setClothing(opt.id, choice.id)}
              >
                {choice.label}
              </OptionButton>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 border-t border-white/[0.06] pt-8">
        <h3 className="mb-1 text-xs font-medium uppercase tracking-widest text-white/45">Colour palette</h3>
        <p className="mb-4 text-xs text-white/35">
          &ldquo;Style default&rdquo; keeps colours from {styleTitle}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOUR_OPTIONS.map((opt) => {
            const isSelected = options.colourOptionId === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setColour(opt.id)}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex shrink-0 gap-1">
                  {(opt.colors ?? []).slice(0, 4).map((color, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
