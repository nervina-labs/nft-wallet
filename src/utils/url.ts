import {
  BOWSER_BROWSER,
  OSS_IMG_HOSTS,
  OSS_IMG_PROCESS_QUERY_KEY,
  OSS_IMG_PROCESS_QUERY_KEY_FORMAT_WEBP,
  OSS_IMG_PROCESS_QUERY_KEY_SCALE,
} from '../constants'

function isSupportWebp(): boolean {
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
