import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

const isShowAtom = atom(false)
const msgAtom = atom<React.ReactNode>(null)

export const useSnackbarModel = () => {
  const [isShow, setIsShow] = useAtom(isShowAtom)
  const [msg, setMsg] = useAtom(msgAtom)

  return {
    isShow,
    setIsShow,
    msg,
    setMsg,
  }
}

export const useSnackbar = () => {
  const setIsShow = useUpdateAtom(isShowAtom)
  const setMsg = useUpdateAtom(msgAtom)

  const snackbar = useCallback(
    (message: React.ReactNode) => {
      setIsShow(true)
      setMsg(message)
    },
    [setIsShow, setMsg]
  )

  const closeSnackbar = useCallback(() => {
    setIsShow(false)
  }, [setIsShow])

  return {
    snackbar,
    closeSnackbar,
  }
}
