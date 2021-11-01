/* eslint-disable @typescript-eslint/indent */
import type { ModalProps, ModalBodyProps } from '@mibao-ui/components'
import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import React, { useCallback } from 'react'
import { noop } from '../utils'
import type { ModalContentProps, AlertStatus } from '@chakra-ui/react'

export type PromiseFunc = () => Promise<void> | void

export interface PromiseObj {
  fn: PromiseFunc
}

export interface ConfirmDialogOptions {
  type?: AlertStatus
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  modalProps?: ModalProps
  modalContentProps?: ModalContentProps
  modalBodyProps?: ModalBodyProps
  showCloseButton?: boolean
}

export interface ConfirmDialogProps extends ConfirmDialogOptions {
  onConfirm?: PromiseFunc
  onCancel?: PromiseFunc
  onClose?: PromiseFunc
}

const optionsAtom = atom<ConfirmDialogOptions>({})
const openAtom = atom(false)
const loadingAtom = atom(false)
const onCloseAtom = atom<PromiseObj>({ fn: noop })
const onConfirmAtom = atom<PromiseObj>({ fn: noop })
const onCancelAtom = atom<PromiseObj>({ fn: noop })

export const useConfirmDialogModel = () => {
  const [isOpen, setIsOpen] = useAtom(openAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [isLoading, setIsLoading] = useAtom(loadingAtom)
  const [{ fn: onClose }, setOnClose] = useAtom<PromiseObj>(onCloseAtom)
  const [{ fn: onConfirm }, setOnConfrim] = useAtom<PromiseObj>(onConfirmAtom)
  const [{ fn: onCancel }, setOnCancel] = useAtom<PromiseObj>(onCancelAtom)

  return {
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    onClose,
    setOnClose,
    onConfirm,
    setOnConfrim,
    onCancel,
    setOnCancel,
    options,
    setOptions,
  }
}

export interface Warning {
  content: React.ReactNode
  onConfirm?: PromiseFunc
  onClose?: PromiseFunc
}

export const useConfirmDialog = () => {
  const setOptions = useUpdateAtom(optionsAtom)
  const setIsOpen = useUpdateAtom(openAtom)
  const setIsLoading = useUpdateAtom(loadingAtom)
  const setOnClose = useUpdateAtom(onCloseAtom)
  const setOnConfrim = useUpdateAtom(onConfirmAtom)
  const setOnCancel = useUpdateAtom(onCancelAtom)
  const confirm = useCallback(
    async ({
      onCancel,
      onClose,
      onConfirm,
      ...options
    }: ConfirmDialogProps) => {
      setOptions(options)
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
        setOnCancel({
          fn: onCancel
            ? async () => {
                setIsLoading(true)
                await onCancel?.()
                setIsLoading(false)
                setIsOpen(false)
                resolve()
              }
            : noop,
        })
      })
    },
    [setOptions, setIsOpen, setIsLoading, setOnClose, setOnConfrim, setOnCancel]
  )

  return confirm
}
