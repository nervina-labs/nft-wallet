/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createModel } from 'hox'
import { useCallback, useState } from 'react'
import { Auth, User } from '../models/user'
import { useLocalStorage } from './useLocalStorage'
import { useWalletModel, WalletType } from './useWallet'

export type Gender = 'male' | 'female'

export interface Profile {
  username?: string
  gender?: Gender
  birthday?: string
  region?: string
  description?: string
  avatar?: string
  auth?: string
}

export interface UseProfile {
  profile: Profile | null
  setProfile: (profile: Partial<Profile>) => void
  setAvatar: (c: string) => void
  setUsername: (c: string) => void
  setGender: (c: Gender) => void
  setRegion: (c: string) => void
  setDescription: (c: string) => void
  setPreviewImageData: React.Dispatch<React.SetStateAction<string>>
  showEditSuccess: boolean
  setShowEditSuccess: React.Dispatch<React.SetStateAction<boolean>>
  previewImageData: string
  getAuth: () => Promise<Auth>
  setRemoteProfile: (user: Partial<User>, ext?: string) => Promise<void>
}

function useProfile(): UseProfile {
  const { address, walletType, signMessage, api, provider } = useWalletModel()
  const [profile, _setProfile] = useLocalStorage<Profile | null>(
    `profile:${address}`,
    null
  )

  const [previewImageData, setPreviewImageData] = useState('')

  const setProfile = useCallback(
    (p: Partial<Profile>) => {
      return _setProfile({
        ...profile,
        ...p,
      })
    },
    [profile, _setProfile]
  )

  const getAuth: () => Promise<Auth> = useCallback(async () => {
    let signature = profile?.auth

    if (!signature) {
      signature = await signMessage(address)
      if (signature.includes('N/A')) {
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

  const [showEditSuccess, setShowEditSuccess] = useState(false)

  const setRemoteProfile = useCallback(
    async (user: Partial<User>, ext?: string) => {
      const auth = await getAuth()
      await api.setProfile(user, auth, ext)
      setShowEditSuccess(true)
    },
    [getAuth, api]
  )

  const setAvatar = useCallback(
    async (avatar: string) => {
      setProfile({ avatar })
    },
    [setProfile]
  )
  const setUsername = useCallback(
    async (username: string) => {
      setProfile({ username })
    },
    [setProfile]
  )
  const setGender = useCallback(
    async (gender: Gender) => {
      setProfile({ gender })
    },
    [setProfile]
  )
  const setRegion = useCallback(
    async (region: string) => {
      setProfile({ region })
    },
    [setProfile]
  )
  const setDescription = useCallback(
    async (description: string) => {
      setProfile({ description })
    },
    [setProfile]
  )

  return {
    profile,
    setProfile,
    setDescription,
    setRegion,
    setGender,
    setUsername,
    setAvatar,
    previewImageData,
    setPreviewImageData,
    getAuth,
    setRemoteProfile,
    showEditSuccess,
    setShowEditSuccess,
  }
}

export const useProfileModel = createModel(useProfile)
