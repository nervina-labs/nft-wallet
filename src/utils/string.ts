import { ISSUER_ID_REG, TOKEN_CLASS_ID_REGS } from '../constants'

export function verifyEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
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

export function removeTrailingZero(str: string): string {
  return str.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')
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

export function ellipsisIssuerID(value: string): string {
  return `${value.substr(0, 8)}...${value.substr(8, 6)}`
}

export const ellipsisString = (value: string, range: [number, number]) => {
  return `${value.substring(0, range[0])}...${value.substring(
    value.length - range[1]
  )}`
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

export function isUuid(uuid: string): boolean {
  const reg = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return reg.test(uuid)
}

export function isIssuerId(str: string): boolean {
  return ISSUER_ID_REG.test(str)
}

export function isTokenClassId(str: string): boolean {
  return TOKEN_CLASS_ID_REGS.some((r) => r.test(str))
}
