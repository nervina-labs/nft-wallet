import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import Web3 from 'web3'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export const verifyCkbLongAddress = (address: string): boolean => {
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

export const verifyEthAddress = (addr: string): boolean => {
  try {
    addr = Web3.utils.toChecksumAddress(addr)
    return true
  } catch (error) {
    return false
  }
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

export function copyFallback(data: string): void {
  const input = document.createElement('input')
  input.readOnly = true
  input.value = data
  input.style.position = 'absolute'
  input.style.width = '100px'
  input.style.left = '-10000px'
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, input.value.length)
  document.execCommand('copy')
  document.body.removeChild(input)
}

export const noop: () => void = () => {}
