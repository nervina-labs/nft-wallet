import dayjs from 'dayjs'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

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

export function throttle(fn: () => void, wait: number): () => void {
  let time = Date.now()
  return function () {
    if (time + wait - Date.now() < 0) {
      fn()
      time = Date.now()
    }
  }
}

const TIME_FORMAT_CN = 'YYYY-MM-DD, HH:mm:ss'
const TIME_FORMAT_EN = 'MMM DD, YYYY HH:mm:ss'

export function formatTime(timestamp: string, lang: string) {
  return dayjs(Number(timestamp + '000')).format(
    lang !== 'en' ? TIME_FORMAT_CN : TIME_FORMAT_EN
  )
}
