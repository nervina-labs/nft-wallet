import { InputAdornment, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useConfirm } from '../../hooks/useConfirm'
import { usePrevious } from '../../hooks/usePrevious'
import { useSetServerProfile } from '../../hooks/useProfile'
import { Query } from '../../models'
import { useRoute } from '../../routes'
import { DrawerConfig } from './DrawerConfig'
import { InputBaseFix } from './InputMod'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    flex: 1,
    width: '100%',
    background: '#FBFBFC',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    padding: '11px 16px',
    fontSize: '14px',
  },
}))

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
  const confirm = useConfirm()
  const classes = useStyles()

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
      confirm(t('profile.save-edit'), onSave, close).catch(Boolean)
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
        <InputBaseFix
          className={classes.input}
          placeholder={t('profile.user-name.placeholder')}
          type="text"
          value={value}
          formatter={(v: string) => v.trim().slice(0, 24)}
          onChange={(e: any) => setValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <span className="adornment">{`${len}/24`}</span>
            </InputAdornment>
          }
        />
        <div className="desc">{t('profile.user-name.desc')}</div>
      </div>
    </DrawerConfig>
  )
}
