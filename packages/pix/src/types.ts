export const PixKeyType = {
    CPF: "cpf",
    CNPJ: "cnpj",
    EMAIL: "email",
    PHONE: "phone",
    RANDOM: "random"
} as const;

export type PixKeyType = (typeof PixKeyType)[keyof typeof PixKeyType]

export interface StaticPixParams {
    key: string,
    keyType: PixKeyType,
    merchantName: string,
    merchantCity: string,
    amount?: number,
    txId?: string,
    description?: string,
}

export interface PixPayload {
    raw: string,
    qrcode?: string,
}

export class PixValidationError extends Error {
    constructor(message: string) {
        super(message)

        this.name = "PixValidationError"

        Object.setPrototypeOf(this, PixValidationError.prototype)
    }
}