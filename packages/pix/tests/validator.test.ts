import { describe, expect, it } from 'vitest'
import { PixValidationError } from '../src/types'
import { validatePixKey } from '../src/validator'

describe('validatePixKey', () => {
    describe('CPF', () => {
        it('accepts a valid 11-digit CPF', () => {
            expect(() => validatePixKey('12345678901', 'cpf')).not.toThrow()
        })

        it('rejects CPF with punctuation', () => {
            expect(() => validatePixKey('123.456.789-01', 'cpf')).toThrow(PixValidationError)
        })

        it('rejects CPF with wrong digit count', () => {
            expect(() => validatePixKey('1234567890', 'cpf')).toThrow(PixValidationError)
        })
    })

    describe('CNPJ', () => {
        it('accepts a valid 14-digit CNPJ', () => {
            expect(() => validatePixKey('12345678000199', 'cnpj')).not.toThrow()
        })

        it('rejects CNPJ with punctuation', () => {
            expect(() => validatePixKey('12.345.678/0001-99', 'cnpj')).toThrow(PixValidationError)
        })
    })

    describe('phone', () => {
        it('accepts a valid phone with +55 and 11 digits', () => {
            expect(() => validatePixKey('+5511999999999', 'phone')).not.toThrow()
        })

        it('accepts a valid phone with +55 and 10 digits', () => {
            expect(() => validatePixKey('+551199999999', 'phone')).not.toThrow()
        })

        it('rejects phone without country code', () => {
            expect(() => validatePixKey('11999999999', 'phone')).toThrow(PixValidationError)
        })
    })

    describe('email', () => {
        it('accepts a valid email', () => {
            expect(() => validatePixKey('joao@exemplo.com.br', 'email')).not.toThrow()
        })

        it('rejects email without @', () => {
            expect(() => validatePixKey('joaoexemplo.com.br', 'email')).toThrow(PixValidationError)
        })
    })

    describe('random (UUID)', () => {
        it('accepts a valid UUID v4', () => {
            expect(() => validatePixKey('123e4567-e89b-12d3-a456-426614174000', 'random')).not.toThrow()
        })

        it('rejects a UUID without hyphens', () => {
            expect(() => validatePixKey('123e4567e89b12d3a456426614174000', 'random')).toThrow(PixValidationError)
        })
    })

    it('throws PixValidationError (not a generic Error)', () => {
        const error = (() => {
            try {
                validatePixKey('bad', 'cpf')
            } catch (e) {
                return e
            }
        })()
        expect(error).toBeInstanceOf(PixValidationError)
        expect((error as PixValidationError).name).toBe('PixValidationError')
    })

    it('includes the invalid key in the error message', () => {
        expect(() => validatePixKey('bad-cpf', 'cpf')).toThrow(/bad-cpf/)
    })
})
