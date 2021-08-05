import dayjs from 'dayjs'
import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { usePrevious } from '../../hooks/usePrevious'
import { useProfileModel } from '../../hooks/useProfile'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { RoutePath } from '../../routes'
import { DrawerConfig } from './DrawerConfig'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Datepicker = require('react-mobile-datepicker')

export interface SetUsernameProps {
  open: boolean
  close: () => void
  birthday?: string
}

const defaultDate = new Date('1990-01-01')
const minDate = new Date('1926-08-17')
const maxDate = new Date()

export const SetBirthday: React.FC<SetUsernameProps> = ({
  open,
  close,
  birthday,
}) => {
  const [t, i18n] = useTranslation('translations')
  const [value, setValue] = useState(
    birthday ? new Date(birthday) : defaultDate
  )

  const prevValue = usePrevious(value)
  const { confirm } = useWalletModel()

  const isChinese = i18n.language !== 'en'

  useEffect(() => {
    if (!open) {
      setValue(birthday ? new Date(birthday) : defaultDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, birthday])

  const monthMap: Record<number, string> = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  }

  const dateConfig = {
    year: {
      format: 'YYYY',
      caption: isChinese ? '年' : 'Year',
      step: 1,
    },
    month: {
      format: (value: any) => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const mouth: number = value.getMonth() + 1
        return isChinese ? mouth : monthMap[mouth]
      },
      caption: isChinese ? '月' : 'Mon',
      step: 1,
    },
    date: {
      format: 'DD',
      caption: isChinese ? '日' : 'Day',
      step: 1,
    },
  }

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
        birthday: dayjs(value).format('YYYY-MM-DD'),
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
      title={t('profile.edit-birthday')}
      isValid
      onSaving={onSave}
      isSaving={isSaving}
    >
      <div className="birthday">
        <Datepicker
          isPopup={false}
          min={minDate}
          max={maxDate}
          showCaption
          dateConfig={dateConfig}
          confirmText=""
          cancelText=""
          showHeader={false}
          value={value}
          theme="ios"
          onChange={setValue}
        />
      </div>
    </DrawerConfig>
  )
}
