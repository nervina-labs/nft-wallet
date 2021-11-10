/* eslint-disable @typescript-eslint/indent */
import type { ModalProps, ModalBodyProps } from '@mibao-ui/components'
import { atom } from 'jotai'
import { selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils'
import React, { useCallback } from 'react'
import { noop } from '../utils'
import type { ModalContentProps, AlertStatus } from '@chakra-ui/react'

export type PromiseFunc = () => Promise<void> | void

export interface PromiseObj {
  fn: PromiseFunc
}

export interface ConfirmDialogOptions {
  type?: AlertStatus | 'text'
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
const onCloseObjAtom = atom<PromiseObj>({ fn: noop })
const onConfirmObjAtom = atom<PromiseObj>({ fn: noop })
const onCancelObjlAtom = atom<PromiseObj>({ fn: noop })
const fnSelector = (a: PromiseObj) => a.fn
const onCloseAtom = selectAtom(onCloseObjAtom, fnSelector)
const onConfirmAtom = selectAtom(onConfirmObjAtom, fnSelector)
const onCancelAtom = selectAtom(onCancelObjlAtom, fnSelector)
const cancelLoadingAtom = atom(false)

export const useConfirmDialogModel = () => {
  const isOpen = useAtomValue(openAtom)
  const options = useAtomValue(optionsAtom)
  const isLoading = useAtomValue(loadingAtom)
  const onClose = useAtomValue(onCloseAtom)
  const onConfirm = useAtomValue(onConfirmAtom)
  const onCancel = useAtomValue(onCancelAtom)
  const isCancelLoading = useAtomValue(cancelLoadingAtom)

  return {
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    onCancel,
    options,
    isCancelLoading,
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
  const setOnClose = useUpdateAtom(onCloseObjAtom)
  const setOnConfirm = useUpdateAtom(onConfirmObjAtom)
  const setOnCancel = useUpdateAtom(onCancelObjlAtom)
  const setCancelLoading = useUpdateAtom(cancelLoadingAtom)
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
        setOnConfirm({
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
                setCancelLoading(true)
                await onCancel?.()
                setCancelLoading(false)
                setIsOpen(false)
                resolve()
              }
            : noop,
        })
      })
    },
    [
      setOptions,
      setIsOpen,
      setIsLoading,
      setOnClose,
      setOnConfirm,
      setOnCancel,
      setCancelLoading,
    ]
  )

  return confirm
}

export const useCloseConfirmDialog = () => {
  const setIsOpen = useUpdateAtom(openAtom)
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen])
  return onClose
}
