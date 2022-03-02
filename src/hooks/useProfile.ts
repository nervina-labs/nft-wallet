import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { useAtom } from 'jotai'
import { atomWithStorage, useAtomCallback } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import i18n from '../i18n'
import { Auth, User } from '../models/user'
import { UnipassConfig } from '../utils'
import {
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

const profileAtom = atomWithStorage<Auths | null>(
  'mibao_account_profile_v2',
  null
)

export function useProfile() {
  const { address } = useAccount()
  const [profile, _setProfile] = useAtom(profileAtom)

  const setProfile = useCallback(
    (p: Partial<Profile>, addr = '') => {
      return _setProfile((prevProfile) => {
        const auth = prevProfile?.[address || addr]
        return {
          ...prevProfile,
          ...{
            [address || addr]: {
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
    return !!profile[address]
  }, [address, profile])

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
  const { profile, setProfile } = useProfile()
  const signMessage = useSignMessage()
  const { address, walletType } = useAccount()
  const { loginMetamask } = useLogin()
  return useAtomCallback(
    useCallback(
      async (get) => {
        const auth = profile?.[address]
        let signature = auth?.auth
        let message = auth?.message
        if (!message) {
          message = JSON.stringify(createMessage())
          setProfile({
            message,
          })
        }
        if (!signature) {
          UnipassConfig.setRedirectUri(location.pathname + location.search)
          signature = await signMessage(message)
          // we don't need set unipass profile auth in here
          if (signature.includes('N/A') || walletType === WalletType.Unipass) {
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

        return {
          address: addr,
          message,
          signature,
        }
      },
      [signMessage, walletType, address, profile, setProfile, loginMetamask]
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
