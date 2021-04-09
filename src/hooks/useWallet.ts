import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { MOCK_ADDRESS } from '../mock'
import { NFTWalletAPI } from '../models'
import PWCore, { IndexerCollector } from '@lay2/pw-core'
import { INDEXER_URL, NODE_URL, UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
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
        new IndexerCollector(INDEXER_URL)
      )
    } catch (error) {
      //
    }
    setProvider(PWCore.provider as UnipassProvider)
  }, [])

  const address = useMemo(() => {
    return provider?.address?.toCKBAddress() ?? MOCK_ADDRESS
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
