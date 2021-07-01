/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createModel } from 'hox'
import React, { useCallback, useState } from 'react'
import i18n from '../i18n'
import { Auth, User } from '../models/user'
import { useLocalStorage } from './useLocalStorage'
import { useWalletModel, WalletType } from './useWallet'

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

export interface UseProfile {
  profile: Profile | null
  setProfile: (profile: Partial<Profile>) => void
  setPreviewImageData: React.Dispatch<React.SetStateAction<string>>
  showEditSuccess: boolean
  setShowEditSuccess: React.Dispatch<React.SetStateAction<boolean>>
  previewImageData: string
  getAuth: () => Promise<Auth>
  setRemoteProfile: (user: Partial<User>, ext?: string) => Promise<void>
  snackbarMsg: React.ReactNode
  snackbar: (msg: React.ReactNode) => void
  closeSnackbar: () => void
  toggleLike: (uuid: string, like: boolean) => Promise<boolean>
}

export interface Auths {
  [key: string]: Profile
}

function useProfile(): UseProfile {
  const { address, walletType, signMessage, api, provider } = useWalletModel()
  const [profile, _setProfile] = useLocalStorage<Auths | null>(
    'mibao_account_profile',
    null
  )

  const [previewImageData, setPreviewImageData] = useState('')

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

  const getAuth: () => Promise<Auth> = useCallback(async () => {
    let signature = profile?.[address]?.auth

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
  const [snackbarMsg, setSnackbarMsg] = useState<React.ReactNode>()

  const snackbar = useCallback((message: React.ReactNode) => {
    setShowEditSuccess(true)
    setSnackbarMsg(message)
  }, [])

  const closeSnackbar = useCallback(() => {
    setShowEditSuccess(false)
  }, [])

  const setRemoteProfile = useCallback(
    async (user: Partial<User>, ext?: string) => {
      const auth = await getAuth()
      await api.setProfile(user, auth, ext)
      snackbar(i18n.t('profile.success', { ns: 'translations' }))
    },
    [getAuth, api, snackbar]
  )

  const toggleLike = useCallback(
    async (uuid: string, like: boolean) => {
      const auth = await getAuth()
      const { data } = await api.toggleLike(uuid, like, auth)
      return data.liked
    },
    [getAuth, api]
  )

  return {
    profile,
    setProfile,
    previewImageData,
    setPreviewImageData,
    getAuth,
    setRemoteProfile,
    showEditSuccess,
    setShowEditSuccess,
    snackbarMsg,
    snackbar,
    closeSnackbar,
    toggleLike,
  }
}

export const useProfileModel = createModel(useProfile)
