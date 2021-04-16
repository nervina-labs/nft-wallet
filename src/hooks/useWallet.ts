import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import PWCore, { ChainID, IndexerCollector, Transaction } from '@lay2/pw-core'
import { INDEXER_URL, NODE_URL, UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import { unipassCache } from '../cache'
import UnipassSigner from '../pw/UnipassSigner'
export interface UseWallet {
  api: NFTWalletAPI
  login: () => Promise<UnipassProvider | undefined>
  provider: UnipassProvider | undefined
  address: string
  signTransaction: (tx: Transaction) => Promise<Transaction | undefined>
  isLogined: boolean
}

function useWallet(): UseWallet {
  const [provider, setProvider] = useState<UnipassProvider>()

  const login = useCallback(async () => {
    try {
      await new PWCore(NODE_URL).init(
        new UnipassProvider(UNIPASS_URL),
        new IndexerCollector(INDEXER_URL),
        ChainID.ckb_testnet
      )
      const p = PWCore.provider as UnipassProvider
      unipassCache.setUnipassAddress(p.address.toCKBAddress())
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      unipassCache.setUnipassEmail(p.email!)
      setProvider(p)
      return p
    } catch (error) {
      console.log(error)
      // TODO
    }
  }, [])

  const signTransaction = useCallback(
    async (tx: Transaction) => {
      if (provider != null) {
        const signer = new UnipassSigner(provider)
        const signedTx = await signer.sign(tx)
        return signedTx
      }
      const p = await login()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signer = new UnipassSigner(p!)
      const signedTx = await signer.sign(tx)
      return signedTx
    },
    [provider, login]
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
  }
}

export const useWalletModel = createModel(useWallet)
