'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, useEffect, useRef } from 'react'
import type { CategoryId } from '@/lib/styles'
import { buildPortraitPrompt } from '@/lib/buildPortraitPrompt'
import { getApiBase } from '@/lib/apiBase'
import type { PortraitOptions } from '@/components/PortraitCustomizer'
import { FormatPreview } from '@/components/FormatPreview'
import { GalleryWall } from '@/components/ProdigiClassicFrame'
import {
  DEFAULT_FRAME_COLOUR,
  DEFAULT_FRAME_SIZE,
  FRAME_COLOURS,
  FRAME_FINISH,
  FRAME_SIZES,
  getFrameSize,
  type FrameColourId,
  type FrameSizeId,
} from '@/lib/frameCatalog'

const ACCEPT = 'image/*'

/** Shown while OpenAI paints the portrait — updates by elapsed seconds */
const GENERATE_STATUS_STEPS: { afterSec: number; label: string }[] = [
  { afterSec: 0, label: 'Sending your photo…' },
  { afterSec: 2, label: 'Choosing the wardrobe…' },
  { afterSec: 4, label: 'Dressing the scene…' },
  { afterSec: 8, label: 'Keeping it looking like them…' },
  { afterSec: 14, label: 'Almost there…' },
  { afterSec: 22, label: 'Still working — hang tight…' },
]

function getGenerateStatusMessage(elapsedSec: number): string {
  let message = GENERATE_STATUS_STEPS[0].label
  for (const step of GENERATE_STATUS_STEPS) {
    if (elapsedSec >= step.afterSec) message = step.label
  }
  return message
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

interface CreateFlowProps {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  portraitOptions: PortraitOptions
}

export function CreateFlow({ categoryId, styleId, subStyleId, portraitOptions }: CreateFlowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const effectivePetPose = categoryId === 'pets' ? portraitOptions.petPose : undefined
  const { clothingChoices, colourOptionId } = portraitOptions
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null)
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateElapsedSec, setGenerateElapsedSec] = useState(0)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [frameColour, setFrameColour] = useState<FrameColourId>(DEFAULT_FRAME_COLOUR)
  const [frameSize, setFrameSize] = useState<FrameSizeId>(DEFAULT_FRAME_SIZE)
  const [framePrices, setFramePrices] = useState<Record<string, string>>({})
  const lastPromptRef = useRef<string>('')

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.split(',')[1] ?? '')
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)
      if (generatedPreviewUrl && !generatedPreviewUrl.startsWith('data:')) {
        URL.revokeObjectURL(generatedPreviewUrl)
      }
    }
  }, [uploadPreviewUrl, generatedPreviewUrl])

  useEffect(() => {
    if (!isGenerating) {
      setGenerateElapsedSec(0)
      return
    }
    setGenerateElapsedSec(0)
    const id = setInterval(() => setGenerateElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [isGenerating])

  useEffect(() => {
    if (!generatedPreviewUrl) return
    let cancelled = false
    fetch(`${getApiBase() || ''}/api/frame-price`)
      .then((res) => res.json())
      .then((data: { sizes?: Array<{ id: string; display: string }> }) => {
        if (cancelled || !data.sizes) return
        const next: Record<string, string> = {}
        for (const size of data.sizes) next[size.id] = size.display
        setFramePrices(next)
      })
      .catch(() => {
        if (!cancelled) setFramePrices({})
      })
    return () => {
      cancelled = true
    }
  }, [generatedPreviewUrl])

  const handleFile = useCallback((file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploadedFile(file)
    setUploadPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setGeneratedPreviewUrl(null)
    setGenerateError(null)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  const generatePortrait = async () => {
    if (!uploadedFile) return
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const prompt = buildPortraitPrompt({
        categoryId,
        styleId,
        subStyleId,
        colourOptionId: colourOptionId === 'style-default' ? undefined : colourOptionId,
        petPose: effectivePetPose,
        clothingChoices,
      })
      lastPromptRef.current = prompt
      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('prompt', prompt)
      formData.append('category', categoryId)
      formData.append('style', styleId)
      formData.append('tier', 'preview')
      const apiBase = getApiBase()
      const res = await fetch(`${apiBase || ''}/api/generate-portrait`, { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
      if (data.url) setGeneratedPreviewUrl(data.url)
      else if (data.b64) setGeneratedPreviewUrl(`data:image/png;base64,${data.b64}`)
      else throw new Error('No image in response')
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const getImageBase64 = async (): Promise<string> => {
    if (!generatedPreviewUrl) return ''
    if (generatedPreviewUrl.startsWith('data:')) {
      return generatedPreviewUrl.split(',')[1] ?? ''
    }
    const res = await fetch(generatedPreviewUrl)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.split(',')[1] ?? '')
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleCheckout = async (option: 'download' | 'print' | 'framed') => {
    if (!generatedPreviewUrl || !uploadedFile) return
    setCheckoutLoading(option)
    setCheckoutError(null)
    try {
      const imageB64 = await getImageBase64()
      const sourceImageB64 = await fileToBase64(uploadedFile)
      const prompt =
        lastPromptRef.current ||
        buildPortraitPrompt({
          categoryId,
          styleId,
          subStyleId,
          colourOptionId: colourOptionId === 'style-default' ? undefined : colourOptionId,
          petPose: effectivePetPose,
          clothingChoices,
        })
      const apiBase = getApiBase()
      const prep = await fetch(`${apiBase}/api/prepare-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageB64,
          sourceImageB64,
          prompt,
          category: categoryId,
          style: styleId,
          subStyleId,
          petPose: effectivePetPose,
          option,
          frameColor: option === 'framed' ? frameColour : undefined,
          frameSize: option === 'download' ? undefined : frameSize,
        }),
      })
      const prepData = await prep.json()
      if (!prep.ok) throw new Error(prepData.error || 'Failed to prepare checkout')
      const { orderId } = prepData

      const checkout = await fetch(`${apiBase}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          option,
          frameColor: option === 'framed' ? frameColour : undefined,
          frameSize: option === 'download' ? undefined : frameSize,
          returnUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const checkoutData = await checkout.json()
      if (!checkout.ok) throw new Error(checkoutData.error || 'Checkout failed')
      if (checkoutData.url) window.location.href = checkoutData.url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong')
      setCheckoutLoading(null)
    }
  }

  const reset = () => {
    setUploadedFile(null)
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)
    setUploadPreviewUrl(null)
    setGeneratedPreviewUrl(null)
    setGenerateError(null)
  }

  const step = generatedPreviewUrl ? 'result' : uploadPreviewUrl ? 'generate' : 'upload'

  return (
    <div id="create" className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-10">
      <p className="mb-6 text-center text-xs text-white/40">
        <a href="#portrait-options" className="text-amber-300/80 underline-offset-2 hover:text-amber-200 hover:underline">
          ↑ Change pose, headwear, or colours
        </a>
      </p>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'upload' ? 'bg-amber-400' : 'bg-white/20'}`} />
          <div className={`h-px w-8 transition-colors ${step !== 'upload' ? 'bg-amber-400/50' : 'bg-white/10'}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'generate' ? 'bg-amber-400' : step === 'result' ? 'bg-white/20' : 'bg-white/20'}`} />
          <div className={`h-px w-8 transition-colors ${step === 'result' ? 'bg-amber-400/50' : 'bg-white/10'}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'result' ? 'bg-amber-400' : 'bg-white/20'}`} />
        </div>
        <p className="mt-2 text-center text-xs text-white/40">
          {step === 'upload' && 'Step 1: Upload your photo'}
          {step === 'generate' && 'Step 2: Generate your portrait'}
          {step === 'result' && 'Step 3: Get your portrait'}
        </p>
      </div>

      {/* Upload step */}
      {step === 'upload' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <h3 className="mb-2 text-xl font-semibold text-white">Drop in a photo</h3>
          <p className="mb-3 text-sm text-white/50">See the gift first — you only pay if you want to keep it</p>
          <p className="mb-6 max-w-md text-xs leading-relaxed text-amber-200/75">
            <strong className="font-semibold text-amber-200">Photo quality matters.</strong> A clear, well-lit picture
            with {categoryId === 'pets' ? 'your pet' : 'your face'} in focus gives the best results.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 transition-colors ${
              isDragging ? 'border-amber-400 bg-amber-400/10' : 'border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10">
              <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-lg font-medium text-white">Drop your photo here</p>
            <p className="mt-1 text-sm text-white/50">or click to browse</p>
            <p className="mt-4 text-xs text-white/30">JPG, PNG up to 10MB</p>
            <ul className="mt-4 max-w-sm space-y-1 text-left text-xs text-white/45">
              <li>• Face clearly visible, good lighting, in focus</li>
              <li>• Head and shoulders works best — one person or pet</li>
              <li>• Avoid heavy filters, blur, or sunglasses</li>
            </ul>
            <p className="mt-4 max-w-xs text-xs text-white/40">
              Generation usually takes{' '}
              <span className="text-amber-200/80">15–35 seconds</span> — period theme on clothes and background.
            </p>
        </div>
        </motion.div>
      )}

      {/* Generate step */}
      {step === 'generate' && (
            <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <h3 className="mb-6 text-xl font-semibold text-white">Preview & Generate</h3>
          <div className="relative mb-6">
            <img
              src={uploadPreviewUrl!}
              alt="Your photo"
              className="h-52 w-52 rounded-xl bg-charcoal object-contain shadow-lg"
            />
            <button
              onClick={reset}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
              title="Remove"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isGenerating ? (
            <div
              className="flex w-full max-w-md flex-col items-center rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-6 py-8"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
              <p className="text-base font-medium text-white">
                {getGenerateStatusMessage(generateElapsedSec)}
              </p>
              <p className="mt-2 text-sm text-white/50">
                {generateElapsedSec > 0 ? (
                  <>
                    <span className="tabular-nums text-amber-200/90">{formatElapsed(generateElapsedSec)}</span>
                    {' elapsed · '}
                  </>
                ) : null}
                Usually 15–35 seconds
              </p>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-amber-500/40 via-amber-400 to-amber-500/40" />
              </div>
              <ul className="mt-5 space-y-1.5 text-left text-xs text-white/45">
                <li>Please keep this tab open while we work.</li>
                <li>Do not refresh or go back — that can cancel the request.</li>
                <li>First generation after a while may take a little longer.</li>
              </ul>
            </div>
          ) : (
            <>
              {generateError && (
                <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {generateError}
                </div>
              )}
              <p className="mb-2 text-white/60">Generate your portrait before you buy — free to try</p>
              <p className="mb-5 max-w-sm text-xs leading-relaxed text-amber-200/75">
                Fast light edit (typically{' '}
                <strong className="font-semibold text-amber-200">15–35 seconds</strong>) — period theme on clothes
                and background. What you see is what you get after purchase.
              </p>
              <button
                onClick={generatePortrait}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
                Generate Portrait
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* Result step */}
      {step === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: 'var(--font-satoshi)' }}>
            Looks like them. Ready to gift.
          </h2>
          <p className="mb-8 text-center text-sm text-white/45">
            Preview is watermarked. Choose a size, then checkout.
          </p>

          <div className={`relative mx-auto mb-8 w-full ${getFrameSize(frameSize).id === 'small' ? 'max-w-sm' : 'max-w-lg'}`}>
            <GalleryWall className="rounded-2xl px-8 py-10 sm:px-12">
              <FormatPreview
                src={generatedPreviewUrl!}
                variant="framed"
                frameColour={frameColour}
                size="hero"
                aspect={getFrameSize(frameSize).aspect}
              />
            </GalleryWall>
            <div className="pointer-events-none absolute inset-[18%] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-10 opacity-[0.14]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="rotate-[-25deg] text-lg font-bold tracking-wider text-white">
                    LOVEMEMORY
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={reset}
              className="absolute right-4 top-4 rounded-full bg-black/55 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/80"
              title="Retry or Edit"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="mx-auto mb-5 grid max-w-lg gap-3 sm:grid-cols-2">
            {FRAME_SIZES.map((size) => {
              const selected = frameSize === size.id
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setFrameSize(size.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selected ? 'border-amber-400/70 bg-amber-400/10' : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{size.label}</p>
                  <p className="mt-1 text-xs text-white/50">{size.hint}</p>
                  <p className="mt-3 text-2xl font-bold text-white">{framePrices[size.id] ?? '…'}</p>
                  <p className="text-[11px] text-white/40">UK shipping included</p>
                </button>
              )
            })}
          </div>

          <div className="mx-auto mb-8 max-w-md">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-white/45">Frame colour</p>
              <div className="flex flex-wrap justify-center gap-2">
                {FRAME_COLOURS.map((colour) => {
                  const selected = frameColour === colour.id
                  return (
                    <button
                      key={colour.id}
                      type="button"
                      onClick={() => setFrameColour(colour.id)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? 'border-amber-400/60 bg-amber-400/15 text-white'
                          : 'border-white/10 text-white/65 hover:border-white/25'
                      }`}
                    >
                      <span
                        className="h-4 w-4 border border-black/30"
                        style={{ background: FRAME_FINISH[colour.id].wood }}
                        aria-hidden
                      />
                      {colour.label}
                    </button>
                  )
                })}
              </div>
            </div>

          {checkoutError && (
            <div className="mx-auto mb-6 max-w-md rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              {checkoutError}
            </div>
          )}

          <div className="mx-auto max-w-md text-center">
            <button
              onClick={() => handleCheckout(getFrameSize(frameSize).option)}
              disabled={checkoutLoading !== null}
              className="mt-2 w-full rounded-full bg-amber-400 py-4 text-lg font-semibold text-black transition-colors hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70"
            >
              {checkoutLoading && checkoutLoading !== 'download'
                ? 'Taking you to checkout…'
                : `Checkout · ${framePrices[frameSize] ?? getFrameSize(frameSize).label}`}
            </button>
            <button
              onClick={() => handleCheckout('download')}
              disabled={checkoutLoading !== null}
              className="mt-3 w-full rounded-full border border-white/15 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 disabled:opacity-70"
            >
              {checkoutLoading === 'download' ? 'Processing…' : 'Digital download only'}
            </button>
          </div>
        </motion.div>
      )}
        </div>
  )
}
