/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createModel } from 'hox'
import React, { useCallback, useState } from 'react'

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

function useToastModel(): UseToast {
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    show: false,
    content: '',
  })

  const toast = useCallback((config: ToastConfig) => {
    setToastConfig({
      ...config,
      show: true,
    })
  }, [])

  const closeToast = (): void => setToastConfig({ show: false, content: '' })

  return {
    toastConfig,
    toast,
    closeToast,
  }
}

export const useToast = createModel(useToastModel)
