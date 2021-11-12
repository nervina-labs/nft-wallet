import FallbackImgPath from '../assets/img/nft-fallback.png'
import { getImagePreviewUrl, toDataUrl } from '../utils'
import { useQuery } from 'react-query'
import { useAPI } from './useAccount'
import { useCallback } from 'react'

const URL_CACHE_MAP = new Map<string, string>()

export function useUrlToBase64<
  S extends string | undefined,
  U extends S | S[],
  RETURN = U extends S[] ? S[] : S
>(
  urls: U,
  options?: {
    fallbackImg?: string
    toBlob?: boolean
    usePreviewUrl?: number
  }
) {
  const api = useAPI()
  const fallbackImg = options?.fallbackImg ?? FallbackImgPath
  const toDataUrlFromApi = useCallback(
    async (url?: string) => {
      if (url && URL_CACHE_MAP.has(url)) {
        return URL_CACHE_MAP.get(url)
      }
      const previewUrl = options?.usePreviewUrl
        ? getImagePreviewUrl(url, options.usePreviewUrl)
        : url
      if (!previewUrl) {
        return fallbackImg
      }
      const result = await toDataUrl(previewUrl, { toBlob: options?.toBlob })
        .catch(async () => {
          const base64Content = (await api.getUrlBase64(previewUrl)).data.result
          return base64Content
            ? `data:image/jpeg;base64,${base64Content}`
            : fallbackImg
        })
        .catch(() => fallbackImg)
      if (url) {
        URL_CACHE_MAP.set(url, result)
      }
      return result
    },
    [api, fallbackImg, options?.toBlob, options?.usePreviewUrl]
  )

  return useQuery(
    [...(Array.isArray(urls) ? urls : [urls]), fallbackImg, api],
    async (): Promise<RETURN> =>
      Array.isArray(urls)
        ? await Promise.all(urls.map(toDataUrlFromApi))
        : await toDataUrlFromApi(urls),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
}
