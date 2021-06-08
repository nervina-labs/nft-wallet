import { createModel } from 'hox'
import { useCallback, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useWalletModel } from './useWallet'

export type Gender = 'male' | 'female'

export interface Profile {
  username?: string
  gender?: Gender
  birthday?: string
  region?: string
  description?: string
  avatar?: string
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
  previewImageData: string
}

function useProfile(): UseProfile {
  const { address } = useWalletModel()
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
  }
}

export const useProfileModel = createModel(useProfile)
