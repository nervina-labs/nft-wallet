import { InputAdornment, InputBase, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useProfileModel } from '../../hooks/useProfile'
import { Query } from '../../models'
import { RoutePath } from '../../routes'
import { DrawerConfig } from './DrawerConfig'

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
  const len = useMemo(() => {
    return value.length
  }, [value])

  const classes = useStyles()

  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  const { setRemoteProfile } = useProfileModel()
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
      history.push(RoutePath.Profile)
    } catch (error) {
      //
      console.log(error)
    } finally {
      await qc.refetchQueries(Query.Profile)
      setIsSaving(false)
    }
  }, [value, setRemoteProfile, history, isSaving, qc])

  useEffect(() => {
    if (!open) {
      setValue(username ?? '')
    }
  }, [open, username])
  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={close}
      title={t('profile.user-name.edit')}
      isValid={len <= 24 && len >= 2}
      isSaving={isSaving}
      onSaving={onSave}
    >
      <div className="username">
        <InputBase
          className={classes.input}
          placeholder={t('profile.user-name.placeholder')}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
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
