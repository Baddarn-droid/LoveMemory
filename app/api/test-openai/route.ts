import { NextResponse } from 'next/server'

/**
 * One-off diagnostic: test if the OpenAI API key is accepted.
 * Open /api/test-openai in the browser or run: curl http://localhost:3000/api/test-openai
 * Delete this file once you're done debugging.
 */
export async function GET() {
  const apiKey = (process.env.OPENAI_API_KEY ?? '').trim()
  const keyLoaded = apiKey.length > 0
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        keyLoaded: false,
        error: 'OPENAI_API_KEY is not set. Add it to .env.local in the project root (same folder as package.json), then restart the dev server. If you run npm run dev from a different folder, run it from the project root.',
      },
      { status: 200 }
    )
  }

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const message = data?.error?.message ?? data?.error ?? `HTTP ${res.status}`
      const code = data?.error?.code ?? res.status
      return NextResponse.json(
        {
          ok: false,
          keyLoaded: true,
          error: 'OpenAI rejected the key.',
          details: `${code}: ${typeof message === 'string' ? message.replace(/sk-[^\s]+/g, 'sk-***') : JSON.stringify(message)}`,
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ok: true,
      keyLoaded: true,
      message: 'OpenAI API key is valid. If portrait generation still fails, the key may lack access to image models (e.g. gpt-image-1.5).',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, error: 'Request failed.', details: message },
      { status: 200 }
    )
  }
}
