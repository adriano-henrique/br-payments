import { describe, expect, it } from 'vitest'
import { calculateCRC16 } from '../../src/lib/crc16'

describe('calculateCRC16', () => {
    it('matches the known CRC-16/CCITT-FALSE test vector', () => {
        // Standard check value for CRC-16 with init=0xFFFF, poly=0x1021
        expect(calculateCRC16('123456789')).toBe('29B1')
    })

    it('returns a 4-character uppercase hex string', () => {
        const result = calculateCRC16('some data')
        expect(result).toMatch(/^[0-9A-F]{4}$/)
    })

    it('produces different checksums for different inputs', () => {
        expect(calculateCRC16('abc')).not.toBe(calculateCRC16('abd'))
    })

    it('handles the CRC field prefix correctly (ends with 6304)', () => {
        // The payload always appends '6304' before computing the CRC
        const withCRCField = '00020126330014BR.GOV.BCB.PIX01111234567890152040000530398605802BR5913Fulano de Tal6008BRASILIA62070503***6304'
        const crc = calculateCRC16(withCRCField)
        expect(crc).toMatch(/^[0-9A-F]{4}$/)
        expect(crc.length).toBe(4)
    })
})
