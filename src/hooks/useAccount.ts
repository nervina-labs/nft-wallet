import { atom, useAtom } from 'jotai'
import { loginWithRedirect } from '@nervina-labs/flashsigner'
import {
  Address,
  CellDep,
  DefaultSigner,
  Provider,
  Transaction,
  OutPoint,
  Builder,
  Amount,
  AmountUnit,
} from '@lay2/pw-core'
import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import UP, { UPAuthMessage } from 'up-core-test'
import UPCKB, {
  fetchAssetLockProof,
  completeTxWithProof,
} from 'up-ckb-alpha-test'
import { usePrevious } from './usePrevious'
import type { History } from 'history'
import { UNIPASS_CODE_HASH } from '../constants'
import { Web3Provider } from '../pw/Web3Provider'
import { RoutePath } from '../routes'
import { buildFlashsignerOptions } from '../utils'
import { ServerWalletAPI } from '../apis/ServerWalletAPI'
import { UPCoreSimpleProvier } from '../pw/UProvider'
import { useProfile } from './useProfile'
import { addWitnessArgType } from '../pw/toPwTransaction'

export enum WalletType {
  Unipass = 'Unipass',
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
  Flashsigner = 'flashsigner',
}

export const UNIPASS_ACCOUNT_KEY = 'unipass_account_key_v3'

export interface UnipassAccount {
  address: string
  email?: string
  pubkey?: string
  walletType: WalletType
  expireTime?: string
  username?: string
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

  return {
    address,
    email,
    walletType,
    pubkey,
    account,
  }
}

export function useAccountStatus() {
  const { account, address } = useAccount()
  const expireTime = useMemo(() => {
    return account?.expireTime ?? dayjs('1970').toISOString()
  }, [account?.expireTime])

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
  const { setProfile } = useProfile()
  const { walletType } = useAccount()
  return useCallback(
    (h?: History<unknown>) => {
      setProfile(null)
      setProvider(null)
      setAccount(null)
      if (walletType === WalletType.Unipass) {
        sessionStorage.clear()
        UP.disconnect()
      }
      // localStorage.clear()
      provider?.close()
    },
    [provider, setAccount, setProvider, setProfile, walletType]
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
    UP.initPop()
    const account = await UP.connect({ email: true })
    const address = UPCKB.getCKBAddress(account.username)
    setAccount({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: account.email!,
      address: address.toCKBAddress(),
      walletType: WalletType.Unipass,
      username: account.username,
    })
  }, [setAccount])

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
          await loginUnipass()
          return provider as Provider
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
  const { walletType } = useAccount()
  const [provider, setProvider] = useAtom(providerAtom)
  const { loginMetamask } = useLogin()
  const signUnipass = useCallback(async (tx: Transaction) => {
    const witnessArg = addWitnessArgType(
      {
        ...Builder.WITNESS_ARGS.RawSecp256k1,
      },
      tx.witnesses[0]
    )

    tx = new Transaction(tx.raw, [witnessArg])
    const account = await UP.connect()
    const oldCellDeps = tx.raw.cellDeps.map(
      (cd) =>
        new CellDep(
          cd.depType,
          new OutPoint(cd.outPoint.txHash, cd.outPoint.index)
        )
    )
    const { outputs } = tx.raw
    const changeOutput = outputs[outputs.length - 1]
    changeOutput.capacity = changeOutput.capacity.sub(
      new Amount('3500', AmountUnit.shannon)
    )
    tx.raw.cellDeps = []
    const provider = new UPCoreSimpleProvier(
      account.username,
      UNIPASS_CODE_HASH
    )
    const { usernameHash } = provider
    const signer = new DefaultSigner(provider)
    const signedTx = await signer.sign(tx)
    signedTx.raw.cellDeps = oldCellDeps
    const assetLockProof = await fetchAssetLockProof(usernameHash)
    const completedSignedTx = completeTxWithProof(
      signedTx,
      assetLockProof,
      usernameHash
    )
    return completedSignedTx
  }, [])

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
  const { walletType } = useAccount()
  const [provider, setProvider] = useAtom(providerAtom)
  const { loginMetamask } = useLogin()
  const setAccount = useSetAccount()
  return useCallback(
    async (msg: string) => {
      if (walletType === WalletType.Unipass) {
        try {
          UP.initPop()
          const acc = await UP.connect({ email: true })
          const res = await UP.authorize(
            new UPAuthMessage('PLAIN_MSG', acc.username, msg)
          )
          setAccount({
            address: UPCKB.getCKBAddress(acc.username).toCKBAddress(),
            pubkey: res.pubkey,
            walletType: WalletType.Unipass,
          })
          return res.sig
        } catch (error) {
          return 'N/A'
        }
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
    [walletType, provider, loginMetamask, setProvider, setAccount]
  )
}

export function useAPI() {
  const { address } = useAccount()
  return useMemo(() => {
    return new ServerWalletAPI(address)
  }, [address])
}
