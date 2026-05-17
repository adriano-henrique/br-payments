import type { StaticPixParams } from '../types'
import { validatePixKey } from '../validator'
import { calculateCRC16 } from './crc16'
import { buildTLV } from './tlv'

const MERCHANT_VALUE_PIX = 'BR.GOV.BCB.PIX'

export function buildPixPayload(
    params: StaticPixParams
): string {
    validatePixKey(params.key, params.keyType)
    const pixKeyTLV = buildTLV('01', params.key)
    const merchantTLV = buildTLV('26', buildTLV('00', MERCHANT_VALUE_PIX) + pixKeyTLV)
    const merchantNameTLV = buildTLV('59', params.merchantName)
    const merchantCityTLV = buildTLV('60', params.merchantCity)
    const amountTLV = params.amount ? buildTLV('54', params.amount.toFixed(2)) : ''

    const payload = [
        buildTLV('00', '01'),
        merchantTLV,
        buildTLV('52', '0000'), // MCC
        buildTLV('53', '986'),
        amountTLV,
        buildTLV('58', 'BR'),
        merchantNameTLV,
        merchantCityTLV,
        buildTLV('62', buildTLV('05', params.txId ?? '***')),
    ].join('')

    const withCRCField = payload + '6304'
    const crc = calculateCRC16(withCRCField)
    return withCRCField + crc
}