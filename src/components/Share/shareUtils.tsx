import React, { useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'
import styled from 'styled-components'
import { useWalletModel } from '../../hooks/useWallet'
import { useQuery } from 'react-query'
import { toDataUrl } from '../../utils'
import FallbackImg from '../../assets/svg/fallback.svg'

export function useHtml2Canvas(
  element: HTMLDivElement | null,
  options?: {
    deps?: any[]
    enable?: boolean
  }
): string {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    if (element && options?.enable !== false) {
      html2canvas(element, { useCORS: true, allowTaint: true })
        .then((canvas) => {
          setImgSrc(canvas.toDataURL('image/png'))
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error)
        })
    }
  }, [element, options?.enable].concat(options?.deps ?? []))
  return imgSrc
}

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
  const fallbackImg = options?.fallbackImg ?? FallbackImg
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
      (Array.isArray(urls)
        ? await Promise.all(urls.map(toDataUrlFromApi))
        : await toDataUrlFromApi(urls)) as any,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
}

export function usePosterLoader<E extends HTMLDivElement>(
  posterElement: E | null,
  onLoad: (el: E) => void,
  loading = true
) {
  useEffect(() => {
    if (posterElement && !loading) {
      onLoad(posterElement)
    }
  }, [onLoad, posterElement, loading])
}

export const BackgroundImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <BackgroundImageContainer>
      <img src={src} alt="bg" />
    </BackgroundImageContainer>
  )
}

const BackgroundImageContainer = styled.div`
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

export const PosterContainer = styled.div`
  top: -100%;
  left: -100%;
  position: fixed;
  width: 323px;
  height: 484px;
  content-visibility: hidden;
  z-index: 10;
  overflow: hidden;
`

export const UserContainer = styled.div`
  --avatar-size: ${(props: { avatarSize?: number }) =>
    props.avatarSize ? `${props.avatarSize}px` : '35px'};
  --width: calc(180px - var(--avatar-size) - 30px);
  width: 100%;
  display: flex;
  height: var(--height);
  line-height: var(--height);
  margin-bottom: 6px;
  font-size: 14px;

  .avatar {
    width: var(--avatar-size);
    min-width: var(--avatar-size);
    height: var(--avatar-size);
    background: #fff;
    overflow: hidden;
    border-radius: 100%;

    img,
    svg {
      width: var(--avatar-size);
      height: var(--avatar-size);
    }
  }

  .issuer-name {
    margin-left: 10px;
    line-height: var(--avatar-size);
    height: var(--avatar-size);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 500;
    width: var(--width);
  }
`
