import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import { Transaction } from '@lay2/pw-core'
import { UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import { unipassCache } from '../cache'
import UnipassSigner from '../pw/UnipassSigner'
import { History } from 'history'
import { RoutePath } from '../routes'
export interface UseWallet {
  api: NFTWalletAPI
  login: () => Promise<UnipassProvider | undefined>
  provider: UnipassProvider | undefined
  address: string
  signTransaction: (tx: Transaction) => Promise<Transaction | undefined>
  isLogined: boolean
  logout: (h: History<unknown>) => void
}

function useWallet(): UseWallet {
  const [provider, setProvider] = useState<UnipassProvider>()

  const login = useCallback(async () => {
    const p = await new UnipassProvider(UNIPASS_URL).init()
    unipassCache.setUnipassAddress(p.address.toCKBAddress())
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    unipassCache.setUnipassEmail(p.email!)
    setProvider(p)
    return p
  }, [])

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
      const p = await new UnipassProvider(UNIPASS_URL).connect()
      const signer = new UnipassSigner(p)
      const signedTx = await signer.sign(tx)
      setProvider(p)
      return signedTx
    },
    [provider]
  )

  const address = useMemo(() => {
    const cachedAddress = unipassCache.getUnipassAddress()
    if (cachedAddress != null) {
      return cachedAddress
    }
    return provider?.address?.toCKBAddress() ?? ''
  }, [provider])

  const api = useMemo(() => {
    return new ServerWalletAPI(address)
  }, [address])

  const isLogined = useMemo(() => {
    return address !== ''
  }, [address])

  return {
    api,
    login,
    provider,
    address,
    signTransaction,
    isLogined,
    logout,
  }
}

export const useWalletModel = createModel(useWallet)
