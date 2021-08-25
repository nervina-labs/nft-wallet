import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import Web3 from 'web3'
import { INFURA_ID, OSS_IMG_HOST, OSS_IMG_PROCESS_QUERY } from '../constants'
export * from './unipass'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export const verifyCkbAddress = (address: string): boolean => {
  try {
    parseAddress(address)
  } catch (err) {
    return false
  }
  return (
    (address.startsWith('ckb') || address.startsWith('ckt')) &&
    /^[A-Za-z0-9]+$/.test(address)
  )
}

export const verifyEthAddress = (addr: string): boolean => {
  return Web3.utils.isAddress(addr)
}

export const verifyEthContractAddress = async (
  addr: string
): Promise<boolean> => {
  try {
    const provider = new Web3.providers.HttpProvider(
      `https://mainnet.infura.io/v3/${INFURA_ID}`
    )
    const web3 = new Web3(provider)
    const code = await web3.eth.getCode(addr)
    provider.disconnect()
    return code !== '0x'
  } catch (error) {
    console.log(error)
    return false
  }
}

const DASReg: RegExp = /^((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|[0-9a-zA-Z])+\.bit$/
export const verifyDasAddress = (addr: string): boolean => {
  return DASReg.test(addr)
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

export function getRandomNumber(min: number, max: number): number {
  return parseInt((Math.random() * (max - min) + min).toString(), 10)
}

export function getRandomBool(): boolean {
  return Math.random() > 0.5
}

export function throttle(fn: () => void, wait: number): () => void {
  let time = Date.now()
  return function () {
    if (time + wait - Date.now() < 0) {
      fn()
      time = Date.now()
    }
  }
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => NodeJS.Timeout {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
    return timer
  }
}

export function removeTrailingZero(str: string): string {
  return str.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')
}

export function roundDown(n: number, decimals = 1): number {
  return Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function isVerticalScrollable(): boolean {
  return document.body.scrollHeight > document.body.clientHeight
}

export function getImagePreviewUrl(url?: string): string | undefined {
  if (url == null) {
    return url
  }
  if (/\.svg$/i.test(url)) {
    return url
  }
  return url.startsWith(OSS_IMG_HOST) ? `${url}${OSS_IMG_PROCESS_QUERY}` : url
}

export const formatCount = (count: number, lang: string): number | string => {
  if (lang === 'zh') {
    return count >= 10000 ? `${roundDown(count / 10000)} 万` : count
  }
  return count >= 1000 ? `${roundDown(count / 1000)}k` : count
}
