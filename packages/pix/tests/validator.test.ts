import { describe, expect, it } from 'vitest'
import { PixValidationError } from '../src/types'
import { validateStaticPixParams } from '../src/validator'

const BASE_PARAMS = {
    key: '12345678901',
    keyType: 'cpf',
    merchantName: 'Fulano de Tal',
    merchantCity: 'BRASILIA',
} as const

describe('validateStaticPixParams', () => {
    describe('key (delegates to validatePixKey)', () => {
        it('accepts a valid CPF key', () => {
            expect(() => validateStaticPixParams(BASE_PARAMS)).not.toThrow()
        })

        it('rejects an invalid CPF key', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, key: 'bad' })).toThrow(PixValidationError)
        })

        it('accepts a valid email key', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, key: 'joao@exemplo.com.br', keyType: 'email' })).not.toThrow()
        })

        it('accepts a valid phone key', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, key: '+5511999999999', keyType: 'phone' })).not.toThrow()
        })

        it('accepts a valid CNPJ key', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, key: '12345678000199', keyType: 'cnpj' })).not.toThrow()
        })

        it('accepts a valid random (UUID) key', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, key: '123e4567-e89b-12d3-a456-426614174000', keyType: 'random' })).not.toThrow()
        })
    })

    describe('merchantName', () => {
        it('accepts a name at exactly 25 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantName: 'A'.repeat(25) })).not.toThrow()
        })

        it('rejects a name longer than 25 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantName: 'A'.repeat(26) })).toThrow(PixValidationError)
        })

        it('error message mentions the field name', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantName: 'A'.repeat(26) })).toThrow(/merchantName/)
        })
    })

    describe('merchantCity', () => {
        it('accepts a city at exactly 15 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantCity: 'A'.repeat(15) })).not.toThrow()
        })

        it('rejects a city longer than 15 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantCity: 'A'.repeat(16) })).toThrow(PixValidationError)
        })

        it('error message mentions the field name', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, merchantCity: 'A'.repeat(16) })).toThrow(/merchantCity/)
        })
    })

    describe('amount', () => {
        it('accepts a positive amount with 2 decimal places', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, amount: 10.50 })).not.toThrow()
        })

        it('accepts a whole number amount', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, amount: 100 })).not.toThrow()
        })

        it('rejects zero', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, amount: 0 })).toThrow(PixValidationError)
        })

        it('rejects a negative amount', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, amount: -1 })).toThrow(PixValidationError)
        })

        it('is optional — omitting it does not throw', () => {
            expect(() => validateStaticPixParams(BASE_PARAMS)).not.toThrow()
        })
    })

    describe('txId', () => {
        it('accepts alphanumeric txId within 25 chars', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, txId: 'ORDER123' })).not.toThrow()
        })

        it('accepts the literal ***', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, txId: '***' })).not.toThrow()
        })

        it('rejects txId longer than 25 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, txId: 'A'.repeat(26) })).toThrow(PixValidationError)
        })

        it('rejects txId with special characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, txId: 'ORDER-123' })).toThrow(PixValidationError)
        })

        it('is optional — omitting it does not throw', () => {
            expect(() => validateStaticPixParams(BASE_PARAMS)).not.toThrow()
        })
    })

    describe('description', () => {
        it('accepts a description within 72 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, description: 'Pagamento de teste' })).not.toThrow()
        })

        it('accepts a description at exactly 72 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, description: 'A'.repeat(72) })).not.toThrow()
        })

        it('rejects a description longer than 72 characters', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, description: 'A'.repeat(73) })).toThrow(PixValidationError)
        })

        it('error message mentions the field name', () => {
            expect(() => validateStaticPixParams({ ...BASE_PARAMS, description: 'A'.repeat(73) })).toThrow(/description/)
        })

        it('is optional — omitting it does not throw', () => {
            expect(() => validateStaticPixParams(BASE_PARAMS)).not.toThrow()
        })
    })

    it('throws PixValidationError (not a generic Error)', () => {
        try {
            validateStaticPixParams({ ...BASE_PARAMS, key: 'bad' })
        } catch (e) {
            expect(e).toBeInstanceOf(PixValidationError)
            expect((e as PixValidationError).name).toBe('PixValidationError')
        }
    })
})
