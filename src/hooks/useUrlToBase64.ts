import FallbackImgPath from '../assets/img/nft-fallback.png'
import { getImagePreviewUrl, toDataUrl } from '../utils'
import { useQuery } from 'react-query'
import { useAPI } from './useAccount'
import { useCallback } from 'react'

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
      const previewUrl = options?.usePreviewUrl
        ? getImagePreviewUrl(url, options.usePreviewUrl)
        : url
      if (!previewUrl) {
        return fallbackImg
      }
      // eslint-disable-next-line @typescript-eslint/return-await
      return await toDataUrl(previewUrl)
        .catch(async () => {
          const base64Content = (await api.getUrlBase64(previewUrl)).data.result
          return base64Content
            ? `data:image/jpeg;base64,${base64Content}`
            : fallbackImg
        })
        .then((base64) => {
          if (options?.toBlob) {
            return fetch(base64).then(async (res) =>
              URL.createObjectURL(await res.blob())
            )
          }
          return base64
        })
        .catch(() => fallbackImg)
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
