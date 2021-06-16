import { InputAdornment, InputBase, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { usePrevious } from '../../hooks/usePrevious'
import { useProfileModel } from '../../hooks/useProfile'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
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
    paddingBottom: '26px',
    fontSize: '14px',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
}))

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
    return value.length
  }, [value])
  const { confirm } = useWalletModel()

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
        description: value,
      })
      history.goBack()
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
      setValue(desc ?? '')
    }
  }, [open, desc])

  const onClose = useCallback(() => {
    if (prevValue !== value) {
      confirm(t('profile.save-edit'), onSave, close)
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
        <InputBase
          className={classes.input}
          placeholder={t('profile.desc.placeholder')}
          type="text"
          value={value}
          multiline
          rows={8}
          onChange={(e) => setValue(e.target.value.slice(0, 100))}
          endAdornment={
            <InputAdornment position="end" style={{ alignItems: 'baseline' }}>
              <span className="adornment">{`${len}/100`}</span>
            </InputAdornment>
          }
        />
      </div>
    </DrawerConfig>
  )
}
