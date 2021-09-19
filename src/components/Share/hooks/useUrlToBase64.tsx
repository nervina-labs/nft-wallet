import { useWalletModel } from '../../../hooks/useWallet'
import FallbackImgPath from '../../../assets/img/fallback.png'
import { toDataUrl } from '../../../utils'
import { useQuery } from 'react-query'

export function useUrlToBase64<
  S extends string | undefined,
  U extends S | S[],
  RETURN = U extends S[] ? S[] : S
>(
  urls: U,
  options?: {
    fallbackImg?: string
    toBlob?: boolean
  }
) {
  const { api } = useWalletModel()
  const fallbackImg = options?.fallbackImg ?? FallbackImgPath
  const toDataUrlFromApi = async (url?: string) => {
    if (!url) {
      return fallbackImg
    }
    return await toDataUrl(url)
      .catch(async () => {
        const base64Content = (await api.getUrlBase64(url)).data.result
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
  }
  return useQuery(
    [...(Array.isArray(urls) ? urls : [urls]), api],
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
