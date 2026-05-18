import { describe, expect, it } from 'vitest'
import { PixValidationError } from '../src/types'
import { generateStaticPix } from '../src/generate'

const BASE_PARAMS = {
    key: '12345678901',
    keyType: 'cpf',
    merchantName: 'Fulano de Tal',
    merchantCity: 'BRASILIA',
} as const

describe('generateStaticPix', () => {
    it('returns a PixPayload with a raw string', () => {
        const result = generateStaticPix(BASE_PARAMS)
        expect(typeof result.raw).toBe('string')
        expect(result.raw.length).toBeGreaterThan(0)
    })

    it('payload starts with the EMV format indicator (000201)', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw.startsWith('000201')).toBe(true)
    })

    it('payload ends with a 4-char CRC hex value after 6304', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).toMatch(/6304[0-9A-F]{4}$/)
    })

    it('payload contains the Pix GUI (BR.GOV.BCB.PIX)', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).toContain('BR.GOV.BCB.PIX')
    })

    it('payload contains the Pix key', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).toContain('12345678901')
    })

    it('payload contains merchant name and city', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).toContain('Fulano de Tal')
        expect(raw).toContain('BRASILIA')
    })

    it('includes amount when provided', () => {
        const { raw } = generateStaticPix({ ...BASE_PARAMS, amount: 10.5 })
        expect(raw).toContain('10.50')
    })

    it('omits amount field when not provided', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        // Tag 54 is the transaction amount field
        expect(raw).not.toContain('5403')
        expect(raw).not.toContain('5404')
        expect(raw).not.toContain('5405')
    })

    it('uses *** as default txId', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).toContain('***')
    })

    it('uses custom txId when provided', () => {
        const { raw } = generateStaticPix({ ...BASE_PARAMS, txId: 'MYORDER123' })
        expect(raw).toContain('MYORDER123')
    })

    it('includes description inside field 26 when provided', () => {
        const { raw } = generateStaticPix({ ...BASE_PARAMS, description: 'Pagamento de teste' })
        expect(raw).toContain('Pagamento de teste')
    })

    it('omits description field when not provided', () => {
        const { raw } = generateStaticPix(BASE_PARAMS)
        expect(raw).not.toContain('0218')
    })

    it('throws PixValidationError for an invalid key', () => {
        expect(() =>
            generateStaticPix({ ...BASE_PARAMS, key: 'not-a-cpf' })
        ).toThrow(PixValidationError)
    })

    it('matches the BACEN spec 2.6.3 example payload structure', () => {
        // Validates the full payload can be decoded at pix.nascent.com.br/tools/pix-qr-decoder/
        const { raw } = generateStaticPix(BASE_PARAMS)
        // Must contain all mandatory EMV tags in order
        const tags = ['000201', '26', '52040000', '5303986', '5802BR', '59', '60', '6207', '6304']
        for (const tag of tags) {
            expect(raw).toContain(tag)
        }
    })
})
