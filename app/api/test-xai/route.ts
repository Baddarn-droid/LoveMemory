import { NextResponse } from 'next/server'
import { getXaiApiKey } from '@/lib/xaiEnv'

/**
 * Diagnostic: check whether XAI_API_KEY is accepted.
 * Open /api/test-xai in the browser.
 */
export async function GET() {
  const apiKey = getXaiApiKey()
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        keyLoaded: false,
        error: 'XAI_API_KEY is not set. Add it to .env.local, then restart the dev server.',
      },
      { status: 200 }
    )
  }

  try {
    const res = await fetch('https://api.x.ai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const message = data?.error?.message ?? data?.error ?? `HTTP ${res.status}`
      return NextResponse.json(
        {
          ok: false,
          keyLoaded: true,
          error: 'xAI rejected the key.',
          details: String(message).replace(/xai-[A-Za-z0-9]+/g, 'xai-***'),
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ok: true,
      keyLoaded: true,
      message: 'xAI API key is valid. Portrait generation uses grok-imagine-image-2.0.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: 'Request failed.', details: message }, { status: 200 })
  }
}
