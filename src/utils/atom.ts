import { atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

export type PromiseFunc = () => Promise<void> | void
export interface PromiseObj {
  fn: PromiseFunc
}

export const noop: (...args: any) => any = () => {}

export const atomFunc = () => {
  return atom<PromiseObj>({ fn: noop })
}

export type AtomFunc = ReturnType<typeof atomFunc>

export const useAtomFunc = (fnAtom: AtomFunc) => {
  const [{ fn }, setFn] = useAtom(fnAtom)
  return [fn, setFn]
}

export const useUpdateAtomFunc = (fnAtom: AtomFunc) => {
  return useUpdateAtom(fnAtom)
}

export const useAtomFuncValue = (fnAtom: AtomFunc) => {
  return useAtomValue(fnAtom)
}
