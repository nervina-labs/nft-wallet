import { atom, useAtom } from 'jotai'

const listInfo = atom<{
  len: number
  firstImageUrl: string
}>({
  len: 0,
  firstImageUrl: '',
})

export function useShareListInfo() {
  return useAtom(listInfo)
}
