import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import { Address, DefaultSigner, Provider, Transaction } from '@lay2/pw-core'
import { UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import UnipassSigner from '../pw/UnipassSigner'
import { History } from 'history'
import { RoutePath } from '../routes'
import { useLocalStorage } from './useLocalStorage'
import { usePrevious } from './usePrevious'

import { Web3Provider } from '../pw/Web3Provider'
export interface UseWallet {
  api: NFTWalletAPI
  login: (walletType?: WalletType) => Promise<Provider>
  provider: Provider | undefined
  address: string
  signTransaction: (tx: Transaction) => Promise<Transaction | undefined>
  isLogined: boolean
  logout: (h: History<unknown>) => void
  prevAddress: string | undefined
  walletType?: WalletType
}

export const UNIPASS_ACCOUNT_KEY = 'unipass_account'

export interface UnipassAccount {
  address: string
  email?: string
  walletType: WalletType
}

export enum WalletType {
  Unipass = 'Unipass',
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
}

function useWallet(): UseWallet {
  const [provider, setProvider] = useState<Provider>()

  const [
    unipassAccount,
    setUnipassAccount,
  ] = useLocalStorage<UnipassAccount | null>(UNIPASS_ACCOUNT_KEY, null)

  const address = useMemo(() => {
    return unipassAccount?.address ?? ''
  }, [unipassAccount?.address])

  const walletType = useMemo(() => {
    return unipassAccount?.walletType
  }, [unipassAccount?.walletType])

  const walletAddressOnChange = useCallback(
    (addr?: Address) => {
      if (unipassAccount?.walletType === WalletType.Unipass) {
        return
      }
      if (!unipassAccount?.walletType) {
        return
      }
      if (!addr) {
        setUnipassAccount(null)
        localStorage.clear()
        return
      }
      const ckbAddress = addr.toCKBAddress()
      setUnipassAccount({
        address: ckbAddress,
        walletType: unipassAccount?.walletType,
      })
    },
    [setUnipassAccount, unipassAccount?.walletType]
  )

  const loginUnipass = useCallback(async () => {
    const p = await new UnipassProvider(UNIPASS_URL, setUnipassAccount).init()
    setUnipassAccount({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: p.email!,
      address: p.address.toCKBAddress(),
      walletType: WalletType.Unipass,
    })
    setProvider(p)
    return p
  }, [setUnipassAccount])

  const loginMetamask = useCallback(async () => {
    const Web3Modal = (await import('web3modal')).default
    const web3Modal = new Web3Modal({
      cacheProvider: true,
    })
    const provider = await web3Modal.connect()
    const Web3 = (await import('web3')).default
    const web3 = new Web3(provider)
    const p = await new Web3Provider(web3, walletAddressOnChange).init()
    setUnipassAccount({
      address: p.address.toCKBAddress(),
      walletType: WalletType.Metamask,
    })
    setProvider(p)
    return p
  }, [setUnipassAccount, walletAddressOnChange])

  const login = useCallback(
    async (walletType: WalletType = WalletType.Unipass) => {
      switch (walletType) {
        case WalletType.Unipass:
          return await loginUnipass()
        case WalletType.Metamask:
          return await loginMetamask()
        default:
          return await loginUnipass()
      }
    },
    [loginMetamask, loginUnipass]
  )

  const logout = useCallback(
    (h: History<unknown>) => {
      localStorage.clear()
      h.push(RoutePath.Login)
      provider?.close()
      setProvider(undefined)
    },
    [provider]
  )

  const signUnipass = useCallback(
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

  const signMetamask = useCallback(
    async (tx: Transaction) => {
      if (provider != null) {
        const signer = new DefaultSigner(provider)
        const signedTx = await signer.sign(tx)
        return signedTx
      }
      const p = await loginMetamask()
      const signer = new DefaultSigner(p)
      const signedTx = await signer.sign(tx)
      setProvider(p)
      return signedTx
    },
    [provider, loginMetamask]
  )

  const signTransaction = useCallback(
    async (tx: Transaction) => {
      switch (unipassAccount?.walletType) {
        case WalletType.Unipass:
          return await signUnipass(tx)
        case WalletType.Metamask:
          return await signMetamask(tx)
        case WalletType.WalletConnect:
          return await signMetamask(tx)
        default:
          return await signUnipass(tx)
      }
    },
    [unipassAccount?.walletType, signUnipass, signMetamask]
  )

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
    walletType,
  }
}

export const useWalletModel = createModel(useWallet)
