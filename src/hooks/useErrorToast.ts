import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import React, { useCallback } from 'react'
import { noop } from '../utils'

export type PromiseFunc = () => Promise<void> | void
export interface PromiseObj {
  fn: PromiseFunc
}

const contentAtom = atom<React.ReactNode>('')
const openAtom = atom(false)
const loadingAtom = atom(false)
const onCloseAtom = atom<PromiseObj>({ fn: noop })
const onConfirmAtom = atom<PromiseObj>({ fn: noop })

export const useErrorToastModel = () => {
  const [content, setContent] = useAtom(contentAtom)
  const [isOpen, setIsOpen] = useAtom(openAtom)
  const [isLoading, setIsLoading] = useAtom(loadingAtom)
  const [{ fn: onClose }, setOnClose] = useAtom<PromiseObj>(onCloseAtom)
  const [{ fn: onConfirm }, setOnConfrim] = useAtom<PromiseObj>(onConfirmAtom)

  return {
    content,
    setContent,
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    onClose,
    setOnClose,
    onConfirm,
    setOnConfrim,
  }
}

export interface Warning {
  content: React.ReactNode
  onConfirm?: PromiseFunc
  onClose?: PromiseFunc
}

export const useErrorToast = () => {
  const setContent = useUpdateAtom(contentAtom)
  const setIsOpen = useUpdateAtom(openAtom)
  const setIsLoading = useUpdateAtom(loadingAtom)
  const setOnClose = useUpdateAtom(onCloseAtom)
  const setOnConfrim = useUpdateAtom(onConfirmAtom)
  const toast = useCallback(
    async (
      content: React.ReactNode,
      onConfirm?: PromiseFunc,
      onClose?: PromiseFunc
    ) => {
      setContent(content)
      setIsOpen(true)
      return await new Promise<void>((resolve) => {
        setOnClose({
          fn: async () => {
            setIsOpen(false)
            await onClose?.()
            setIsLoading(false)
            resolve()
          },
        })
        setOnConfrim({
          fn: async () => {
            setIsLoading(true)
            await onConfirm?.()
            setIsLoading(false)
            setIsOpen(false)
            resolve()
          },
        })
      })
    },
    [setContent, setIsOpen, setIsLoading, setOnClose, setOnConfrim]
  )

  return toast
}
