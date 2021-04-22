import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export const isValidCkbLongAddress = (address: string): boolean => {
  try {
    parseAddress(address)
  } catch {
    return false
  }
  return (
    address.length === 95 &&
    (address.startsWith('ckb') || address.startsWith('ckt')) &&
    /^[A-Za-z0-9]+$/.test(address)
  )
}

export function truncateMiddle(
  str: string,
  takeLength = 6,
  tailLength = takeLength,
  pad = '...'
): string {
  if (takeLength + tailLength >= str.length) return str
  return `${str.slice(0, takeLength)}${pad}${str.slice(-tailLength)}`
}
