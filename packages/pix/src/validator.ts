import { PixValidationError, type PixKeyType, type StaticPixParams } from './types'

const VALIDATION_RULES = {
    cpf: /^\d{11}$/,
    cnpj: /^\d{14}$/,
    phone: /^\+55\d{10,11}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    random: /^[0-9a-f-]{36}$/
}

const VALID_EXAMPLE_TYPES: Record<PixKeyType, string> = {
    cpf:    '12345678901          (11 digits, no punctuation)',
    cnpj:   '12345678000199       (14 digits, no punctuation)',
    phone:  '+5511999999999       (with +55 country code)',
    email:  'joao@exemplo.com.br',
    random: '123e4567-e89b-12d3-a456-426614174000  (UUID v4)'
}

function assertMaxLength(value: string, field: string, max: number): void {
    if (value.length > max) {
        throw new PixValidationError(
            `"${field}" exceeds the maximum length of ${max} characters (got ${value.length})`
        )
    }
}

function validatePixKey(key: string, type: PixKeyType): void {
    if (!VALIDATION_RULES[type].test(key)) {
        throw new PixValidationError(
            `Invalid ${type} key: "${key}". Expected format: ${VALID_EXAMPLE_TYPES[type]}`
        )
    }
}

function validateMerchant(name: string, city: string): void {
    assertMaxLength(name, 'merchantName', 25)
    assertMaxLength(city, 'merchantCity', 15)
}

function validateAmount(amount: number): void {
    if (amount <= 0) {
        throw new PixValidationError(
            `"amount" must be a positive number (got ${amount})`
        )
    }
    if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) {
        throw new PixValidationError(
            `"amount" must have at most 2 decimal places (got ${amount})`
        )
    }
}

function validateTxId(txId: string): void {
    if (txId === '***') return
    if (!/^[A-Za-z0-9]{1,25}$/.test(txId)) {
        throw new PixValidationError(
            `"txId" must be alphanumeric and at most 25 characters, or the literal "***" (got "${txId}")`
        )
    }
}

function validateDescription(description: string): void {
    assertMaxLength(description, 'description', 72)
}

export function validateStaticPixParams(params: StaticPixParams): void {
    validatePixKey(params.key, params.keyType)
    validateMerchant(params.merchantName, params.merchantCity)
    if (params.amount !== undefined) validateAmount(params.amount)
    if (params.txId !== undefined) validateTxId(params.txId)
    if (params.description !== undefined) validateDescription(params.description)
}
