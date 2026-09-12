/** Read at request time (bracket access so Next does not bake in an empty value at build). */
export function getXaiApiKey(): string {
  const raw = process.env['XAI_API_KEY']
  return typeof raw === 'string' ? raw.trim() : ''
}
