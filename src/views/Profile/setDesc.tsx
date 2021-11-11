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
  desc?: string
}

export const SetDesc: React.FC<SetUsernameProps> = ({ open, close, desc }) => {
  const [t] = useTranslation('translations')
  const [value, setValue] = useState(desc ?? '')
  const prevValue = usePrevious(value)
  const len = useMemo(() => {
    if (value.length >= 100) return 100
    return value.length
  }, [value])
  const confirm = useConfirmDialog()

  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  const setRemoteProfile = useSetServerProfile()
  const qc = useQueryClient()
  const route = useRoute()
  const onSave = useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    try {
      await setRemoteProfile({
        description: value,
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
      setValue(desc ?? '')
    }
  }, [open, desc])

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
      title={t('profile.desc.edit')}
      isValid={len <= 100}
      isSaving={isSaving}
      onSaving={onSave}
    >
      <div className="username">
        <Input
          placeholder={`${t('profile.input')}${t('profile.description')}`}
          value={value}
          formatter={(v: string) => v.slice(0, 100)}
          onChange={(e) => setValue(e.target.value)}
          isTextarea
          max={100}
        />
      </div>
    </DrawerConfig>
  )
}
