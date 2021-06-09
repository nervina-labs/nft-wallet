import { createModel } from 'hox'
import { useCallback, useMemo, useState } from 'react'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { NFTWalletAPI } from '../models'
import { Address, DefaultSigner, Provider, Transaction } from '@lay2/pw-core'
import { INFURA_ID, UNIPASS_URL } from '../constants'
import UnipassProvider from '../pw/UnipassProvider'
import UnipassSigner from '../pw/UnipassSigner'
import { History } from 'history'
import { useLocalStorage } from './useLocalStorage'
import { usePrevious } from './usePrevious'

import { Web3Provider } from '../pw/Web3Provider'
import dayjs from 'dayjs'
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
  signMessage: (msg: string) => Promise<string>
}

export const UNIPASS_ACCOUNT_KEY = 'unipass_account_key'

export interface UnipassAccount {
  address: string
  email?: string
  walletType: WalletType
  expireTime?: string
}

export enum WalletType {
  Unipass = 'Unipass',
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
}

function toHex(str: string): string {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return result
}

function useWallet(): UseWallet {
  const [provider, setProvider] = useState<Provider>()

  const [unipassAccount, setAccount] = useLocalStorage<UnipassAccount | null>(
    UNIPASS_ACCOUNT_KEY,
    null
  )

  const setUnipassAccount = useCallback(
    (account: UnipassAccount | null) => {
      setAccount(
        account === null
          ? null
          : {
              ...account,
              expireTime: dayjs().add(1, 'day').toISOString(),
            }
      )
    },
    [setAccount]
  )

  const address = useMemo(() => {
    return unipassAccount?.address ?? ''
  }, [unipassAccount?.address])

  const walletType = useMemo(() => {
    return unipassAccount?.walletType
  }, [unipassAccount?.walletType])

  const logout = useCallback(
    (h?: History<unknown>) => {
      setProvider(undefined)
      setUnipassAccount(null)
      localStorage.clear()
      provider?.close()
    },
    [provider, setUnipassAccount]
  )

  const web3WalletAddressOnChange = useCallback(
    (addr?: Address) => {
      if (unipassAccount?.walletType === WalletType.Unipass) {
        return
      }
      if (!addr) {
        logout()
        return
      }
      const ckbAddress = addr.toCKBAddress()
      setUnipassAccount({
        address: ckbAddress,
        walletType: unipassAccount?.walletType ?? WalletType.Metamask,
      })
    },
    [setUnipassAccount, unipassAccount, logout]
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
    const p = await new Web3Provider(web3, web3WalletAddressOnChange).init()
    setUnipassAccount({
      address: p.address.toCKBAddress(),
      walletType: WalletType.Metamask,
    })
    setProvider(p)
    return p
  }, [setUnipassAccount, web3WalletAddressOnChange])

  const loginWalletConnect = useCallback(async () => {
    const Web3Modal = (await import('web3modal')).default
    // const walletconnectProvider = (await import('@walletconnect/web3-provider'))
    // .default
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: Object.create(null),
          options: { infuraId: INFURA_ID },
        },
      },
    })
    const provider = await web3Modal.connectTo('walletconnect')
    const Web3 = (await import('web3')).default
    const web3 = new Web3(provider)
    const p = await new Web3Provider(web3, web3WalletAddressOnChange).init()
    setUnipassAccount({
      address: p.address.toCKBAddress(),
      walletType: WalletType.WalletConnect,
    })
    setProvider(p)
    return p
  }, [setUnipassAccount, web3WalletAddressOnChange])

  const login = useCallback(
    async (walletType: WalletType = WalletType.Unipass) => {
      switch (walletType) {
        case WalletType.Unipass:
          return await loginUnipass()
        case WalletType.Metamask:
          return await loginMetamask()
        case WalletType.WalletConnect:
          return await loginWalletConnect()
        default:
          return await loginUnipass()
      }
    },
    [loginMetamask, loginUnipass, loginWalletConnect]
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

  const signMessage = useCallback(
    async (msg: string) => {
      if (unipassAccount?.walletType === WalletType.Unipass) {
        if (provider != null) {
          const sig = await provider.sign(toHex(msg))
          return sig.slice(4)
        }
        const p = await new UnipassProvider(
          UNIPASS_URL,
          setUnipassAccount
        ).connect(unipassAccount)
        setProvider(p)
        const sig = await p.sign(toHex(msg))
        return sig.slice(4)
      }
      if (provider != null) {
        const sig = await (provider as Web3Provider).signMsg(msg)
        return sig
      }
      const p = await loginMetamask()
      setProvider(p)
      return await (p as Web3Provider).signMsg(msg)
    },
    [unipassAccount, provider, setUnipassAccount, loginMetamask]
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

  const expireTime = useMemo(() => {
    return unipassAccount?.expireTime ?? dayjs('1970').toISOString()
  }, [unipassAccount?.expireTime])

  const isLogined = useMemo(() => {
    const now = dayjs()
    const isExpired = now.isAfter(dayjs(expireTime))
    if (isExpired) {
      return false
    }
    return address !== ''
  }, [address, expireTime])

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
    signMessage,
  }
}

export const useWalletModel = createModel(useWallet)
