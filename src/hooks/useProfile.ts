import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import i18n from '../i18n'
import { Auth, User } from '../models/user'
import { UnipassConfig } from '../utils'
import {
  useAccount,
  useAPI,
  useProvider,
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
}

export interface Auths {
  [key: string]: Profile
}

const profileAtom = atomWithStorage<Auths | null>('mibao_account_profile', null)

export function useProfile() {
  const { address } = useAccount()
  const [profile, _setProfile] = useAtom(profileAtom)

  const setProfile = useCallback(
    (p: Partial<Profile>) => {
      return _setProfile((pp) => {
        return {
          ...pp,
          ...{
            [address]: p,
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

export function useGetAndSetAuth(): () => Promise<Auth> {
  const { profile, setProfile } = useProfile()
  const signMessage = useSignMessage()
  const { address, walletType } = useAccount()
  const provider = useProvider()

  return useCallback(async () => {
    let signature = profile?.[address]?.auth
    if (!signature) {
      UnipassConfig.setRedirectUri(location.pathname + location.search)
      signature = await signMessage(address)
      // we don't need set unipass profile auth in here
      if (signature.includes('N/A') || walletType === WalletType.Unipass) {
        throw new Error('signing: user denied')
      } else {
        setProfile({
          auth: signature,
        })
      }
    }

    const addr =
      walletType === WalletType.Unipass
        ? address
        : (provider?.address?.addressString as string)
    return {
      address: addr,
      message: address,
      signature,
    }
  }, [signMessage, walletType, address, profile, setProfile, provider])
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
