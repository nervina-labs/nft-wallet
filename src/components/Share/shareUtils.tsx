import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'
import styled from 'styled-components'
import { useWalletModel } from '../../hooks/useWallet'
import { useQuery } from 'react-query'

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

export function useUrlToBase64(url: string) {
  const { api } = useWalletModel()
  return useQuery([url, api, 'urlToBase64'], async () => {
    return (await api.getUrlBase64(url)).data.result
  })
}

export function useHtml2CanvasImageUrl(urls: string[]) {
  const { api } = useWalletModel()
  return useQuery([...urls, api, 'useHtml2CanvasImageUrl'], async () => {
    return await Promise.all(
      urls.map(async (url) => (await api.getUrlBase64(url)).data.result)
    )
  })
}

export const BackgroundImageContainer = styled.div`
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
  top: 0;
  left: 0;
  position: fixed;
  width: 323px;
  height: 484px;
  //content-visibility: hidden;
  z-index: 10;
`

export const IssuerContainer = styled.div`
  --height: ${(props: { height?: number }) =>
    props.height ? `${props.height}px` : '35px'};
  --width: 180px;
  width: 100%;
  display: flex;
  height: var(--height);
  line-height: var(--height);
  margin-bottom: 6px;
  font-size: 14px;

  .avatar {
    width: var(--height);
    min-width: var(--height);
    height: var(--height);
    background: #fff;
    overflow: hidden;
    border-radius: 100%;
    margin-right: 10px;

    img,
    svg {
      width: var(--height);
      height: var(--height);
    }
  }

  .issuer-name {
    line-height: var(--height);
    height: var(--height);
    text-overflow: ellipsis;
    width: var(--width);
    white-space: nowrap;
    overflow: hidden;
    font-weight: 500;
  }
`
