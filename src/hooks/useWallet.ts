import { createModel } from 'hox'
import { useMemo } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { MOCK_ADDRESS } from '../mock'
import { NFTWalletAPI } from '../models'

export interface UseWallet {
  api: NFTWalletAPI
}

function useWallet(): UseWallet {
  const address = MOCK_ADDRESS
  const api = useMemo(() => {
    return new ServerWalletAPI(address)
  }, [address])

  return {
    api,
  }
}

export const useWalletModel = createModel(useWallet)
