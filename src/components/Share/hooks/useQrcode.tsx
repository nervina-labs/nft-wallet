import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

export function useQrcode(content?: string) {
  const [qrcodeSrc, setQrcodeSrc] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (!content) {
      setQrcodeSrc(undefined)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    QRCode.toDataURL(content, (error, url) => {
      setIsLoading(false)
      if (error) {
        setQrcodeSrc(undefined)
        throw error
      }
      setQrcodeSrc(url)
    })
  }, [content])
  return {
    qrcodeSrc,
    isLoading,
  }
}
