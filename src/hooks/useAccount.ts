import { atom, useAtom } from 'jotai'
import { loginWithRedirect } from '@nervina-labs/flashsigner'
import { Address, DefaultSigner, Provider, Transaction } from '@lay2/pw-core'
import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { usePrevious } from './usePrevious'
import type { History } from 'history'
import UnipassProvider from '../pw/UnipassProvider'
import { UNIPASS_URL } from '../constants'
import { Web3Provider } from '../pw/Web3Provider'
import { RoutePath } from '../routes'
import {
  generateUnipassLoginUrl,
  generateUnipassSignUrl,
  buildFlashsignerOptions,
  generateOldAddress,
} from '../utils'
import UnipassSigner from '../pw/UnipassSigner'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'

export enum WalletType {
  Unipass = 'Unipass',
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
  Flashsigner = 'flashsigner',
}

export const UNIPASS_ACCOUNT_KEY = 'unipass_account_key_v2'

export interface UnipassAccount {
  address: string
  email?: string
  pubkey?: string
  walletType: WalletType
  expireTime?: string
}

export const providerAtom = atom<Provider | null>(null)

export const accountAtom = atomWithStorage<UnipassAccount | null>(
  UNIPASS_ACCOUNT_KEY,
  null
)

export function useProvider() {
  return useAtomValue(providerAtom)
}

export function useAccount() {
  const account = useAtomValue(accountAtom)

  const address = useMemo(() => {
    return account?.address ?? ''
  }, [account?.address])

  const pubkey = useMemo(() => {
    return account?.pubkey
  }, [account?.pubkey])

  const email = useMemo(() => {
    return account?.email
  }, [account?.email])

  const walletType = useMemo(() => {
    return account?.walletType
  }, [account?.walletType])

  const displayAddress = useMemo(() => {
    if (address) {
      return generateOldAddress(address, walletType)
    }
    return ''
  }, [walletType, address])

  return {
    address,
    email,
    walletType,
    pubkey,
    account,
    displayAddress,
  }
}

export function useAccountStatus() {
  const { account, walletType, pubkey, address } = useAccount()
  const expireTime = useMemo(() => {
    return account?.expireTime ?? dayjs('1970').toISOString()
  }, [account?.expireTime])

  const isLogined = useMemo(() => {
    const now = dayjs()
    const isExpired = now.isAfter(dayjs(expireTime))
    if (isExpired) {
      return false
    }
    if (walletType === WalletType.Unipass && !pubkey) {
      return false
    }
    return address !== ''
  }, [address, expireTime, pubkey, walletType])

  const prevAddress = usePrevious(address)

  return {
    expireTime,
    isLogined,
    prevAddress,
  }
}

export function useSetAccount() {
  const setAccount = useUpdateAtom(accountAtom)
  return useCallback(
    (account: UnipassAccount | null) => {
      setAccount((prevAccount) => {
        return account === null
          ? null
          : {
              ...prevAccount,
              ...account,
              expireTime: dayjs().add(7, 'day').toISOString(),
            }
      })
    },
    [setAccount]
  )
}

export function useLogout() {
  const setAccount = useSetAccount()
  const [provider, setProvider] = useAtom(providerAtom)

  return useCallback(
    (h?: History<unknown>) => {
      setProvider(null)
      setAccount(null)
      // localStorage.clear()
      provider?.close()
    },
    [provider, setAccount, setProvider]
  )
}

export function useLogin() {
  const logout = useLogout()
  const { walletType } = useAccount()
  const setAccount = useSetAccount()
  const [provider, setProvider] = useAtom(providerAtom)
  const web3WalletAddressOnChange = useCallback(
    (addr?: Address) => {
      if (walletType !== WalletType.Metamask) {
        return
      }
      if (!addr) {
        logout()
        return
      }
      const ckbAddress = addr.toCKBAddress()
      setAccount({
        address: ckbAddress,
        walletType: walletType ?? WalletType.Metamask,
      })
    },
    [setAccount, walletType, logout]
  )

  const loginUnipass = useCallback(async () => {
    const p = await new UnipassProvider(UNIPASS_URL, setAccount).init()
    setAccount({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: p.email!,
      address: p.address.toCKBAddress(),
      walletType: WalletType.Unipass,
    })
    setProvider(p)
    return p
  }, [setAccount, setProvider])

  const loginMetamask = useCallback(async () => {
    const Web3Modal = (await import('web3modal')).default
    const web3Modal = new Web3Modal({
      cacheProvider: true,
    })
    const provider = await web3Modal.connect()
    const Web3 = (await import('web3')).default
    const web3 = new Web3(provider)
    const p = await new Web3Provider(web3, web3WalletAddressOnChange).init()
    setAccount({
      address: p.address.toCKBAddress(),
      walletType: WalletType.Metamask,
    })
    setProvider(p)
    return p
  }, [setAccount, web3WalletAddressOnChange, setProvider])

  const login = useCallback(
    async (walletType: WalletType = WalletType.Unipass) => {
      provider?.close()
      switch (walletType) {
        case WalletType.Unipass:
          return await new Promise<Provider>((resolve) => {
            const url = `${location.origin}${RoutePath.Unipass}`
            location.href = generateUnipassLoginUrl(url, url)
            resolve(provider as Provider)
          })
        case WalletType.Flashsigner:
          return await new Promise<Provider>((resolve) => {
            const url = `${location.origin}${RoutePath.Flashsigner}`
            loginWithRedirect(url, buildFlashsignerOptions())
            resolve(provider as Provider)
          })
        case WalletType.Metamask:
          return await loginMetamask()
        case WalletType.WalletConnect:
          return await loginMetamask()
        default:
          return await loginUnipass()
      }
    },
    [loginMetamask, loginUnipass, provider]
  )

  return {
    login,
    loginMetamask,
  }
}

export function useSignTransaction() {
  const setAccount = useSetAccount()
  const { account, walletType } = useAccount()
  const [provider, setProvider] = useAtom(providerAtom)
  const { loginMetamask } = useLogin()
  const signUnipass = useCallback(
    async (tx: Transaction) => {
      const p = await new UnipassProvider(UNIPASS_URL, setAccount).connect(
        account
      )
      const signer = new UnipassSigner(p)
      const [signedTx] = signer.toMessages(tx)
      setProvider(p)
      return signedTx.message as any
    },
    [account, setAccount, setProvider]
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
    [provider, loginMetamask, setProvider]
  )

  return useCallback(
    async (tx: Transaction) => {
      switch (walletType) {
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
    [walletType, signUnipass, signMetamask]
  )
}

export function toHex(str: string): string {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return result
}

export function useSignMessage() {
  const { walletType, pubkey } = useAccount()
  const [provider, setProvider] = useAtom(providerAtom)
  const { loginMetamask } = useLogin()
  return useCallback(
    async (msg: string) => {
      if (walletType === WalletType.Unipass) {
        const url = `${location.origin}${RoutePath.Unipass}`
        const message = toHex(msg)
        location.href = generateUnipassSignUrl(
          url,
          `${location.origin}${RoutePath.NFTs}`,
          pubkey,
          message
        )
        return message
      }
      if (provider != null) {
        try {
          const sig = await (provider as Web3Provider).signMsg(msg)
          return sig
        } catch (error) {
          return 'N/A'
        }
      }
      const p = await loginMetamask()
      setProvider(p)
      try {
        return await (p as Web3Provider).signMsg(msg)
      } catch (error) {
        return 'N/A'
      }
    },
    [walletType, provider, loginMetamask, setProvider, pubkey]
  )
}

export function useAPI() {
  const { address } = useAccount()
  return useMemo(() => {
    return new ServerWalletAPI(address)
  }, [address])
}
