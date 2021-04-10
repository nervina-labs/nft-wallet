import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import PWCore, { ChainID, IndexerCollector } from '@lay2/pw-core'
import { INDEXER_URL, NODE_URL, UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import { unipassCache } from '../cache'
export interface UseWallet {
  api: NFTWalletAPI
  login: () => Promise<void>
  provider: UnipassProvider | undefined
  address: string
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
    } catch (error) {
      //
    }
  }, [])

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

  return {
    api,
    login,
    provider,
    address,
  }
}

export const useWalletModel = createModel(useWallet)
