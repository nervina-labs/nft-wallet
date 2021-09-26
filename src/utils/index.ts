import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import dayjs from 'dayjs'
import Web3 from 'web3'
import {
  BOWSER_BROWSER,
  INFURA_ID,
  IS_MAINNET,
  OSS_IMG_HOSTS,
  OSS_IMG_PROCESS_QUERY_KEY,
  OSS_IMG_PROCESS_QUERY_KEY_FORMAT_WEBP,
  OSS_IMG_PROCESS_QUERY_KEY_SCALE,
  SERVER_URL,
} from '../constants'
import * as clipboard from 'clipboard-polyfill/text'
export * from './unipass'
export * from './atom'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export function verifyEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const verifyCkbAddress = (address: string): boolean => {
  try {
    parseAddress(address)
  } catch (err) {
    return false
  }
  return (
    address.startsWith(IS_MAINNET ? 'ckb' : 'ckt') &&
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

export async function copyContent(text: string) {
  try {
    await clipboard.writeText(text)
  } catch (error) {
    copyFallback(text)
  }
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

export function isSupportWebp(): boolean {
  // https://caniuse.com/?search=webp
  // https://x5.tencent.com/guide/caniuse/index.html
  const supportedBrowsers = {
    macos: {
      safari: '>=14',
    },
    edge: '>=18',
    android: {
      wechat: '>=4',
    },
    mobile: {
      safari: '>13.7',
      'android browser': '>=4.2',
    },
    chrome: '>=32',
    firefox: '>=65',
  }

  return !!BOWSER_BROWSER.satisfies(supportedBrowsers)
}

export function addParamsToUrl(
  url: string,
  params: { [key: string]: string },
  options?: {
    ignoreDuplicates?: boolean
  }
): string {
  if (!url) {
    return url
  }
  const urlObj = new URL(url)
  const urlSearchParams = urlObj.searchParams
  Object.keys(params).forEach((key) => {
    if (!urlSearchParams.has(key) || options?.ignoreDuplicates) {
      urlSearchParams.set(key, params[key])
    }
  })
  return decodeURIComponent(urlObj.toString())
}

export function getImagePreviewUrl<U extends string | undefined>(
  url: U,
  size = 300
): U extends string ? string : undefined {
  if (!url) {
    return url as any
  }
  const urlObj = new URL(url)
  const isOssHost = OSS_IMG_HOSTS.some((host) => url?.startsWith(host))
  const isSvgOrWebp = /\.(svg|webp)$/i.test(urlObj.pathname)
  if (!isOssHost || isSvgOrWebp) {
    return url as any
  }
  const webpParam = isSupportWebp() ? OSS_IMG_PROCESS_QUERY_KEY_FORMAT_WEBP : ''
  const params: {
    [key in typeof OSS_IMG_PROCESS_QUERY_KEY]?: string
  } = {}
  params[
    OSS_IMG_PROCESS_QUERY_KEY
  ] = `${OSS_IMG_PROCESS_QUERY_KEY_SCALE}${size}${webpParam}`
  return addParamsToUrl(url, params) as any
}

const MILLION = 1e6

export const formatCount = (count: number, lang: string): number | string => {
  if (lang === 'zh') {
    if (count >= MILLION) {
      return `${roundDown(count / MILLION)} 百万`
    } else if (count >= 10000) {
      return `${roundDown(count / 10000)} 万`
    }
    return count
  }
  if (count >= MILLION) {
    return `${roundDown(count / MILLION)}m`
  }
  return count >= 1000 ? `${roundDown(count / 1000)}k` : count
}

export function randomString(length: number): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export async function downloadImage(imageSrc: string): Promise<void> {
  const headers = new Headers()
  headers.append('Access-Control-Allow-Origin', location.href)
  headers.append('Access-Control-Allow-Credentials', 'true')
  const image = await fetch(imageSrc, {
    headers,
  })
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = 'qrcode.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function ellipsisIssuerID(value: string): string {
  return `${value.substr(0, 8)}...${value.substr(8, 6)}`
}

const TIME_FORMAT_CN = 'YYYY-MM-DD, HH:mm:ss'
const TIME_FORMAT_EN = 'MMM DD, YYYY HH:mm:ss'

export function formatTime(timestamp: string, lang: string) {
  return dayjs(Number(timestamp + '000')).format(
    lang !== 'en' ? TIME_FORMAT_CN : TIME_FORMAT_EN
  )
}

export function getImageForwardingsUrl<T extends string[] | string>(
  urls: T
): T extends string ? string : string[] {
  if (Array.isArray(urls)) {
    return urls.map((url) => getImageForwardingsUrl(url)) as any
  }

  const url = (urls as unknown) as string
  if (!url) {
    return url as any
  }
  const isOssHost = OSS_IMG_HOSTS.find((host) => url?.startsWith(host))
  if (isOssHost) {
    return addParamsToUrl(url, { time: `${new Date().getTime()}` }) as any
  }
  return `${SERVER_URL}/image_forwardings?url=${
    (urls as unknown) as string
  }` as any
}

export async function toDataUrl(
  src: string,
  options?: {
    outputFormat?: string
    disableCache?: boolean
  }
): Promise<string> {
  const outputFormat = options?.outputFormat ?? 'image/png'
  const urlObj = new URL(src)
  urlObj.searchParams.append('time', `${new Date().getTime()}`)
  const url = decodeURI(urlObj.toString())
  return await new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.height = img.height
      canvas.width = img.width
      if (ctx) {
        ctx.drawImage(img, 0, 0)
      }
      const dataURL = canvas.toDataURL(outputFormat)
      resolve(dataURL)
    }
    img.onerror = reject
    img.src = url
    if (img.complete || img.complete === undefined) {
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
      img.src = url
      resolve(url)
    }
  })
}
