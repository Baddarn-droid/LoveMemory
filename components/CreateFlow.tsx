'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, useEffect, useRef } from 'react'
import type { CategoryId } from '@/lib/styles'
import { buildPortraitPrompt } from '@/lib/buildPortraitPrompt'
import { getApiBase } from '@/lib/apiBase'

const ACCEPT = 'image/*'

type PetPose = 'standing' | 'laying'

interface CreateFlowProps {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  petPose?: PetPose
  clothingChoices?: Record<string, string>
}

function PoseButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
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

export function CreateFlow({ categoryId, styleId, subStyleId, petPose, clothingChoices }: CreateFlowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [internalPetPose, setInternalPetPose] = useState<PetPose>('standing')
  const effectivePetPose = categoryId === 'pets' ? (petPose ?? internalPetPose) : petPose
  const showPetPoseSelector = categoryId === 'pets' && petPose === undefined
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null)
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)
      if (generatedPreviewUrl && !generatedPreviewUrl.startsWith('data:')) {
        URL.revokeObjectURL(generatedPreviewUrl)
      }
    }
  }, [uploadPreviewUrl, generatedPreviewUrl])

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
        petPose: effectivePetPose,
        clothingChoices: clothingChoices ?? undefined,
      })
      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('prompt', prompt)
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
    if (!generatedPreviewUrl) return
    setCheckoutLoading(option)
    setCheckoutError(null)
    try {
      const imageB64 = await getImageBase64()
      const apiBase = getApiBase()
      const prep = await fetch(`${apiBase}/api/prepare-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageB64, option }),
      })
      const prepData = await prep.json()
      if (!prep.ok) throw new Error(prepData.error || 'Failed to prepare checkout')
      const { orderId } = prepData

      const checkout = await fetch(`${apiBase}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, option, returnUrl: typeof window !== 'undefined' ? window.location.href : undefined }),
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
      {/* Pet pose selector - shown for all pet styles when not inside RenaissanceFlow */}
      {showPetPoseSelector && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            Pet Pose
          </h3>
          <div className="flex flex-wrap gap-3">
            <PoseButton selected={internalPetPose === 'standing'} onClick={() => setInternalPetPose('standing')}>
              Standing
            </PoseButton>
            <PoseButton selected={internalPetPose === 'laying'} onClick={() => setInternalPetPose('laying')}>
              Laying on a pillow
            </PoseButton>
          </div>
        </div>
      )}

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
          <h3 className="mb-2 text-xl font-semibold text-white">Upload Your Photo</h3>
          <p className="mb-6 text-sm text-white/50">Preview your portrait for free — only pay when you love it</p>
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
              className="h-48 w-48 rounded-xl object-cover shadow-lg"
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
            <div className="flex flex-col items-center">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
              <p className="text-white/70">Creating your Renaissance portrait...</p>
              <p className="mt-1 text-sm text-white/40">This may take a moment</p>
            </div>
          ) : (
            <>
              {generateError && (
                <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {generateError}
                </div>
              )}
              <p className="mb-4 text-white/60">Preview your portrait before you buy — free to generate</p>
              <button
                onClick={generatePortrait}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
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
          <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: 'var(--font-satoshi)' }}>
            Your Masterpiece is Ready!
          </h2>

          {/* Preview with watermark and edit buttons */}
          <div className="relative mx-auto mb-12 w-full max-w-md">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] shadow-2xl">
              <img
                src={generatedPreviewUrl!}
                alt="Your portrait"
                className="w-full object-contain"
              />
              {/* Watermark overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8 opacity-30">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="rotate-[-25deg] text-2xl font-bold tracking-wider text-white/40">
                      LOVEMEMORY
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Retry/Edit buttons */}
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                onClick={reset}
                className="rounded-full bg-black/60 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/80"
                title="Retry or Edit"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Choose Your Format */}
          <h3 className="mb-6 text-center text-xl font-semibold text-white">Choose Your Format</h3>

          {checkoutError && (
            <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              {checkoutError}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {/* Digital Download */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Most Popular
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">Instant Masterpiece</h4>
              <p className="mb-4 text-sm text-white/50">Instant high-resolution download — perfect for sharing or saving.</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">£29.90</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  High-resolution download
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No watermark
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Commercial use rights
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('download')}
                disabled={checkoutLoading !== null}
                className="w-full rounded-full bg-white py-3 font-semibold text-black transition-colors hover:bg-white/90 disabled:cursor-wait disabled:opacity-70"
              >
                {checkoutLoading === 'download' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Download Now'
                )}
              </button>
            </div>
            {/* Fine Art Print */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="mb-4 h-7" />
              <h4 className="mb-2 text-lg font-bold text-white">Fine Art Print</h4>
              <p className="mb-4 text-sm text-white/50">Printed on museum-quality archival paper with fade-resistant inks.</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">£29.90</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Museum-quality archival paper
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fade-resistant inks
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping · 7-9 days
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  + Includes digital download
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('print')}
                disabled={checkoutLoading !== null}
                className="w-full rounded-full bg-white py-3 font-semibold text-black transition-colors hover:bg-white/90 disabled:cursor-wait disabled:opacity-70"
              >
                {checkoutLoading === 'print' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Order Print'
                )}
              </button>
            </div>
            {/* Framed Canvas */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  The Perfect Gift!
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">Large Canvas</h4>
              <p className="mb-4 text-sm text-white/50">Gallery-quality canvas on wood — arrives ready to hang.</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">£29.90</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Ready to hang
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Cotton-blend canvas, 1.25&quot; thick
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping · 7-9 days
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  + Includes digital download
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('framed')}
                disabled={checkoutLoading !== null}
                className="w-full rounded-full bg-white py-3 font-semibold text-black transition-colors hover:bg-white/90 disabled:cursor-wait disabled:opacity-70"
              >
                {checkoutLoading === 'framed' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Order Canvas'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
        </div>
  )
}
