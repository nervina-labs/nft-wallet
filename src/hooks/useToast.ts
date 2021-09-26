/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import type React from 'react'

export interface ToastConfig {
  show: boolean
  title?: React.ReactNode
  onConfirm?: () => void
  onBackdropClick?: () => void
  content: React.ReactNode
  showCloseIcon?: boolean
  okText?: React.ReactNode
}

const toastConfigAtom = atom<ToastConfig>({
  show: false,
  content: '',
})

export function useToastModel() {
  const [toastConfig, setToastConfig] = useAtom(toastConfigAtom)
  return {
    toastConfig,
    setToastConfig,
  }
}

export function useToast() {
  const setToastConfig = useUpdateAtom(toastConfigAtom)

  const toast = (config: ToastConfig) => {
    setToastConfig({
      ...config,
      show: true,
    })
  }

  const closeToast = (): void => {
    setToastConfig({ show: false, content: '' })
  }

  return {
    toast,
    closeToast,
  }
}
