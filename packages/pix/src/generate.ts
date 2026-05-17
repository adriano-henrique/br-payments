import { buildPixPayload } from './lib/payload'
import type { PixPayload, StaticPixParams } from './types'

export function generateStaticPix(params: StaticPixParams): PixPayload {
    const raw = buildPixPayload(params)
    return { raw }
}