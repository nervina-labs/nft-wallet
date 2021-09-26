/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { atom, useAtom } from 'jotai'
import React, { useCallback } from 'react'

export interface ToastConfig {
  show: boolean
  title?: React.ReactNode
  onConfirm?: () => void
  onBackdropClick?: () => void
  content: React.ReactNode
  showCloseIcon?: boolean
  okText?: React.ReactNode
}

export interface UseToast {
  toast: (config: ToastConfig) => void
  toastConfig: ToastConfig
  closeToast: () => void
}

const toastConfigAtom = atom<ToastConfig>({
  show: false,
  content: '',
})

export function useToast(): UseToast {
  const [toastConfig, setToastConfig] = useAtom(toastConfigAtom)

  const toast = useCallback((config: ToastConfig) => {
    setToastConfig({
      ...config,
      show: true,
    })
  }, [])

  const closeToast = (): void => {
    setToastConfig({ show: false, content: '' })
  }

  return {
    toastConfig,
    toast,
    closeToast,
  }
}
