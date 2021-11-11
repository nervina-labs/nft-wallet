export function getRandomNumber(min: number, max: number): number {
  return parseInt((Math.random() * (max - min) + min).toString(), 10)
}

export function getRandomBool(): boolean {
  return Math.random() > 0.5
}

export function roundDown(n: number, decimals = 1): number {
  return Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

const MILLION = 1e6

export function isUnlimited(n: number | string) {
  return n === '0' || n === 0
}

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

export const formatCurrency = (n?: string | number, currency = '¥') => {
  if (currency === 'cny') {
    currency = '¥'
  } else if (currency === 'usd') {
    currency = '$'
  }
  return n ? `${currency} ${Number(n).toFixed(2)}` : ''
}
