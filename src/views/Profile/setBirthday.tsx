import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DrawerConfig } from './DrawerConfig'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Datepicker = require('react-mobile-datepicker')

export interface SetUsernameProps {
  open: boolean
  close: () => void
  birthday?: string
}

const defaultDate = new Date('2000-01-01')

export const SetBirthday: React.FC<SetUsernameProps> = ({
  open,
  close,
  birthday,
}) => {
  const [t, i18n] = useTranslation('translations')
  const [value, setValue] = useState(
    birthday ? new Date(birthday) : defaultDate
  )

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

  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={close}
      title={t('profile.edit-birthday')}
      isValid
    >
      <div className="birthday">
        <Datepicker
          isPopup={false}
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
