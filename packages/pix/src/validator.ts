import { PixValidationError, type PixKeyType } from "./types.js"

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

export function validatePixKey(key: string, type: PixKeyType): void {
    if (!VALIDATION_RULES[type].test(key)) {
        throw new PixValidationError(
            `Invalid ${type} key: "${key}". Expected format: ${getExample(type)}`
        )
    }
}

function getExample(type: PixKeyType): string {
  return VALID_EXAMPLE_TYPES[type]
}