import {
  BOWSER_BROWSER,
  IS_WEBKIT,
  OSS_IMG_HOSTS,
  OSS_IMG_PROCESS_QUERY_KEY,
  OSS_IMG_PROCESS_QUERY_KEY_FORMAT_WEBP,
  OSS_IMG_PROCESS_QUERY_KEY_SCALE,
} from '../constants'
import i18n from '../i18n'

export function isSupportWebp(): boolean {
  if (IS_WEBKIT) {
    return false
  }
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

export function addParamsToUrl<U extends string | undefined>(
  url: U,
  params: { [key: string]: string | number },
  options?: {
    ignoreDuplicates?: boolean
  }
): U {
  if (!url) {
    return url
  }
  try {
    const urlObj = new URL(url)
    const urlSearchParams = urlObj.searchParams
    Object.keys(params).forEach((key) => {
      if (!urlSearchParams.has(key) || options?.ignoreDuplicates) {
        urlSearchParams.set(key, `${params[key]}`)
      }
    })
    return decodeURIComponent(urlObj.toString()) as U
  } catch {
    return url
  }
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

export const getNFTQueryParams = (
  tid?: number | null,
  locale = i18n.language
) => {
  if (typeof tid === 'number' || typeof tid === 'string') {
    return {
      tid,
      locale,
    }
  }
  return undefined
}

export async function toDataUrl(
  src: string,
  options?: {
    outputFormat?: string
    disableCache?: boolean
    toBlob?: boolean
    useRam?: boolean
  }
): Promise<string> {
  const outputFormat = options?.outputFormat ?? 'image/png'
  const url = options?.useRam
    ? (() => {
        const urlObj = new URL(src)
        urlObj.searchParams.append('time', `${new Date().getTime()}`)
        return decodeURI(urlObj.toString())
      })()
    : src
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
      if (options?.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('not blob'))
            return
          }
          const url = URL.createObjectURL(blob)
          resolve(url)
        }, outputFormat)
      } else {
        const dataURL = canvas.toDataURL(outputFormat)
        resolve(dataURL)
      }
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

export function isUsdz(url?: string) {
  if (!url) return url
  return /.usdz$/.test(url)
}

export function removeCurrentUrlOrigin(url: string) {
  try {
    const urlObj = new URL(url)
    if (urlObj.origin !== location.origin) {
      return url
    }
    return urlObj.pathname + urlObj.search
  } catch {
    return url
  }
}
