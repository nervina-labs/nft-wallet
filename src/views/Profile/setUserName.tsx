import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { usePrevious } from '../../hooks/usePrevious'
import { useSetServerProfile } from '../../hooks/useProfile'
import { Query } from '../../models'
import { DrawerConfig } from './DrawerConfig'
import { useRoute } from '../../hooks/useRoute'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { Input } from './Input'

export interface SetUsernameProps {
  open: boolean
  close: () => void
  username?: string
}

export const SetUsername: React.FC<SetUsernameProps> = ({
  open,
  close,
  username,
}) => {
  const [t] = useTranslation('translations')
  const [value, setValue] = useState(username ?? '')
  const route = useRoute()
  const len = useMemo(() => {
    if (value.length >= 24) return 24
    return value.length
  }, [value])

  const prevValue = usePrevious(value)
  const confirm = useConfirmDialog()

  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  const setRemoteProfile = useSetServerProfile()
  const qc = useQueryClient()
  const onSave = useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    try {
      await setRemoteProfile({
        nickname: value,
      })
      history.replace(route.from)
    } catch (error) {
      //
      console.log(error)
    } finally {
      await qc.refetchQueries(Query.Profile)
      setIsSaving(false)
    }
  }, [value, setRemoteProfile, history, isSaving, qc, route])

  useEffect(() => {
    if (!open) {
      setValue(username ?? '')
    }
  }, [open, username])

  const onClose = useCallback(() => {
    if (prevValue !== value) {
      confirm({
        type: 'text',
        title: t('profile.save-edit'),
        onConfirm: onSave,
        onCancel: close,
      })
    } else {
      close()
    }
  }, [onSave, close, t, prevValue, value, confirm])
  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={onClose}
      title={t('profile.user-name.edit')}
      isValid={len <= 24 && len >= 2}
      isSaving={isSaving}
      onSaving={onSave}
    >
      <div className="username">
        <Input
          placeholder={`${t('profile.input')}${t('profile.username')}`}
          value={value}
          formatter={(v: string) => v.slice(0, 24)}
          onChange={(e) => setValue(e.target.value)}
          max={24}
          errorMsg={t('profile.user-name.desc')}
        />
      </div>
    </DrawerConfig>
  )
}
