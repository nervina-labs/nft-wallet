import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import { Transaction } from '@lay2/pw-core'
import { UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import UnipassSigner from '../pw/UnipassSigner'
import { History } from 'history'
import { RoutePath } from '../routes'
import { useLocalStorage } from './useLocalStorage'
import { usePrevious } from './usePrevious'

export interface UseWallet {
  api: NFTWalletAPI
  login: () => Promise<UnipassProvider | undefined>
  provider: UnipassProvider | undefined
  address: string
  signTransaction: (tx: Transaction) => Promise<Transaction | undefined>
  isLogined: boolean
  logout: (h: History<unknown>) => void
  prevAddress: string | undefined
}

export const UNIPASS_ACCOUNT_KEY = 'unipass_account'

export interface UnipassAccount {
  address: string
  email?: string
}

function useWallet(): UseWallet {
  const [provider, setProvider] = useState<UnipassProvider>()
  const [
    unipassAccount,
    setUnipassAccount,
  ] = useLocalStorage<UnipassAccount | null>(UNIPASS_ACCOUNT_KEY, null)

  const login = useCallback(async () => {
    const p = await new UnipassProvider(UNIPASS_URL, setUnipassAccount).init()
    setUnipassAccount({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: p.email!,
      address: p.address.toCKBAddress(),
    })
    setProvider(p)
    return p
  }, [setUnipassAccount])

  const logout = useCallback((h: History<unknown>) => {
    localStorage.clear()
    setProvider(undefined)
    h.push(RoutePath.Login)
  }, [])

  const signTransaction = useCallback(
    async (tx: Transaction) => {
      if (provider != null) {
        const signer = new UnipassSigner(provider)
        const signedTx = await signer.sign(tx)
        return signedTx
      }
      const p = await new UnipassProvider(
        UNIPASS_URL,
        setUnipassAccount
      ).connect(unipassAccount)
      const signer = new UnipassSigner(p)
      const signedTx = await signer.sign(tx)
      setProvider(p)
      return signedTx
    },
    [provider, unipassAccount, setUnipassAccount]
  )

  const address = useMemo(() => {
    console.warn('address changed', unipassAccount?.address)
    return unipassAccount?.address ?? ''
  }, [unipassAccount?.address])

  const api = useMemo(() => {
    return new ServerWalletAPI(address)
  }, [address])

  const isLogined = useMemo(() => {
    return address !== ''
  }, [address])

  const prevAddress = usePrevious(address)

  return {
    api,
    login,
    provider,
    address,
    signTransaction,
    isLogined,
    logout,
    prevAddress,
  }
}

export const useWalletModel = createModel(useWallet)
