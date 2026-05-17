import { describe, expect, it } from 'vitest'
import { buildTLV } from '../../src/lib/tlv'

describe('buildTLV', () => {
    it('encodes a single-digit-length value', () => {
        expect(buildTLV('00', '01')).toBe('000201')
    })

    it('encodes a two-digit-length value', () => {
        expect(buildTLV('59', 'Fulano de Tal')).toBe('5913Fulano de Tal')
    })

    it('pads length to two digits', () => {
        expect(buildTLV('58', 'BR')).toBe('5802BR')
    })

    it('encodes nested TLV (value is itself a TLV string)', () => {
        const inner = buildTLV('00', 'BR.GOV.BCB.PIX')
        expect(inner).toBe('0014BR.GOV.BCB.PIX')
        const outer = buildTLV('26', inner)
        expect(outer).toBe('2618' + '0014BR.GOV.BCB.PIX')
    })
})
