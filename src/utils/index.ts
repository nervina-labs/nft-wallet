import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import Web3 from 'web3'
import {
  INFURA_ID,
  OSS_IMG_HOST,
  OSS_IMG_PROCESS_QUERY,
  UNIPASS_URL,
} from '../constants'
import { UnipassAction } from '../models/unipass'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export const verifyCkbAddress = (address: string): boolean => {
  try {
    parseAddress(address)
  } catch (error) {
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
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
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
  if (url.endsWith('.svg')) {
    return url
  }
  return url.startsWith(OSS_IMG_HOST) ? `${url}${OSS_IMG_PROCESS_QUERY}` : url
}

export function generateUnipassUrl(
  action: UnipassAction,
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
): string {
  const url = new URL(
    `${UNIPASS_URL}/${
      action === UnipassAction.Login ? UnipassAction.Login : UnipassAction.Sign
    }`
  )
  const surl = new URL(successURL)
  surl.searchParams.set('action', action)
  if (action === UnipassAction.SignTx) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    surl.searchParams.set(
      'prev_state',
      JSON.stringify({
        ...state,
      })
    )
    const furl = new URL(failURL)
    furl.searchParams.set(
      'prev_state',
      JSON.stringify({
        ...state,
      })
    )
    furl.searchParams.set('action', action)
    failURL = furl.href
  }
  const params: Record<string, string> = {
    success_url: surl.href,
    fail_url: failURL,
  }
  if (pubkey) {
    params.pubkey = pubkey
  }
  if (message) {
    params.message = message
  }
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key])
  }
  return url.href
}

export function generateUnipassLoginUrl(
  successURL: string,
  failURL: string
): string {
  return generateUnipassUrl(UnipassAction.Login, successURL, failURL)
}

export function generateUnipassSignUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string
): string {
  return generateUnipassUrl(
    UnipassAction.Sign,
    successURL,
    failURL,
    pubkey,
    message
  )
}

export function generateUnipassSignTxUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
): string {
  return generateUnipassUrl(
    UnipassAction.SignTx,
    successURL,
    failURL,
    pubkey,
    message,
    state
  )
}
