import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { useAtom } from 'jotai'
import { atomWithStorage, useAtomCallback } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import i18n from '../i18n'
import { Auth, User } from '../models/user'
import { UnipassConfig } from '../utils'
import {
  accountAtom,
  useAccount,
  useAPI,
  useLogin,
  useSignMessage,
  WalletType,
} from './useAccount'
import { useToast } from './useToast'

export type Gender = 'male' | 'female'

export interface Profile {
  username?: string
  gender?: string
  birthday?: string
  region?: string
  description?: string
  avatar?: string
  auth?: string
  message?: string
}

export interface Auths {
  [key: string]: Profile
}

export const profileAtom = atomWithStorage<Auths | null>(
  'mibao_account_profile_v3',
  null
)

export function useProfile() {
  const { address, walletType, pubkey } = useAccount()
  const [profile, _setProfile] = useAtom(profileAtom)

  const setProfile = useCallback(
    (p: Partial<Profile> | null, addr = '') => {
      return _setProfile((prevProfile) => {
        const auth = prevProfile?.[address || addr]
        return {
          ...prevProfile,
          ...{
            [address || addr]:
              p === null
                ? null
                : {
                    ...auth,
                    ...p,
                  },
          },
        }
      })
    },
    [_setProfile, address]
  )

  const isAuthenticated = useMemo(() => {
    if (profile == null) {
      return false
    }
    if (walletType === WalletType.Unipass && !pubkey) {
      return false
    }
    return !!profile[address]?.auth
  }, [address, profile, walletType, pubkey])

  return {
    profile,
    setProfile,
    isAuthenticated,
  }
}

export function createMessage() {
  return {
    origin: location.origin,
    timestamp: `${Date.now()}`,
  }
}

export function useGetAndSetAuth(): () => Promise<Auth> {
  const { setProfile } = useProfile()
  const signMessage = useSignMessage()
  const { walletType } = useAccount()
  const { loginMetamask } = useLogin()
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const address = get(accountAtom)?.address || ''
        const profile = get(profileAtom)
        const auth = profile?.[address]
        let signature = auth?.auth
        let message = auth?.message
        if (!message) {
          message = JSON.stringify(createMessage())
          setProfile({
            message,
          })
        }
        const account = get(accountAtom)
        if (
          walletType === WalletType.JoyID &&
          account &&
          signature &&
          message
        ) {
          return {
            address: account.address,
            message,
            signature,
            pub_key: account.pubkey,
          }
        }
        if (
          !signature ||
          (walletType === WalletType.Unipass && !account?.pubkey)
        ) {
          UnipassConfig.setRedirectUri(location.pathname + location.search)
          signature = await signMessage(message)
          if (signature.includes('N/A')) {
            throw new Error('signing: user denied')
          } else {
            setProfile({
              auth: signature,
              message,
            })
          }
        }

        let addr = address

        if (walletType === WalletType.Metamask) {
          try {
            addr = addressToScript(address).args
          } catch (error) {
            const p = await loginMetamask()
            addr = p.address?.addressString
          }
        }

        if (walletType === WalletType.Unipass) {
          return {
            address: addr,
            message,
            signature,
            pub_key: account?.pubkey,
            key_type: 'RsaPubkey',
            username: account?.username,
          }
        }

        return {
          address: addr,
          message,
          signature,
        }
      },
      [signMessage, walletType, setProfile, loginMetamask]
    )
  )
}

export function useToggleLike() {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  return useCallback(
    async (uuid: string, like: boolean) => {
      const auth = await getAuth()
      const { data } = await api.toggleLike(uuid, like, auth)
      return data.liked
    },
    [getAuth, api]
  )
}

export function useSetServerProfile() {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const toast = useToast()

  return useCallback(
    async (user: Partial<User>, options?: { ext?: string }) => {
      const auth = await getAuth()
      await api.setProfile(user, { auth, ext: options?.ext })
      toast(i18n.t('profile.success', { ns: 'translations' }))
    },
    [getAuth, api, toast]
  )
}

export const useProfileModel = () => {}
