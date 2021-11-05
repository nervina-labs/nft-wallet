import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

const shareImageAtom = atom<string>('')

export function useShareImage() {
  const [s, setS] = useAtom(shareImageAtom)
  const setShareImageAtom = useCallback(
    (img: string) => {
      setS(img)
    },
    [setS]
  )

  return [s, setShareImageAtom] as const
}
