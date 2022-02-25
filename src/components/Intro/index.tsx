import React, { useMemo, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import Guide, { IStep } from 'byte-guide'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { getHelpCenterUrl } from '../../data/help'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'

export interface IntroProps {
  show: boolean
}

const GUIDE_STORAGE_KEY = 'GUIDE_STORAGE_KEY+'

export const Intro: React.FC<IntroProps> = ({ show }) => {
  const { t, i18n } = useTranslation('translations')
  const [showArrow, setShowArrow] = useState(true)
  const api = useAPI()
  const { address } = useAccount()
  const history = useHistory()
  const getAuth = useGetAndSetAuth()
  const steps: IStep[] = useMemo(() => {
    return [
      {
        title: t('guide.one.title'),
        content: t('guide.one.desc'),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        selector: '.address-bar',
      },
      {
        title: t('guide.two.title'),
        content: t('guide.two.desc'),
        selector: '.filters',
        offset: {
          x: 0,
          y: 155,
        },
      },
      {
        title: t('guide.three.title'),
        content: t('guide.three.desc'),
        selector: '.setting',
        placement: 'bottom-left',
        beforeStepChange: () => {
          setShowArrow(false)
        },
      },
      {
        title: t('guide.four.title'),
        content: (
          <Trans
            ns="translations"
            i18nKey="guide.four.desc"
            t={t}
            components={{
              b: (
                <b
                  style={{
                    cursor: 'pointer',
                    color: '#FF8201',
                  }}
                  onClick={() => {
                    localStorage.setItem(GUIDE_STORAGE_KEY + address, 'true')
                    document.documentElement.style.overflow = ''
                    api.setProfile({ guide_finished: 'true' }).catch(Boolean)
                    history.push(
                      `${RoutePath.Help}?url=${encodeURIComponent(
                        getHelpCenterUrl(i18n.language)
                      )}`
                    )
                  }}
                />
              ),
            }}
          />
        ),
        selector: '.filters',
      },
    ]
  }, [t, i18n.language, history, address, api])

  if (!show) {
    return null
  }
  return (
    <Guide
      steps={steps}
      localKey={GUIDE_STORAGE_KEY + address}
      closable={false}
      arrow={showArrow}
      lang={i18n.language === 'en' ? 'en' : 'zh'}
      nextText={t('guide.next')}
      okText={t('guide.done')}
      afterStepChange={async (stepIndex) => {
        if (stepIndex === 1) {
          requestAnimationFrame(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const modal: HTMLDivElement = document.querySelector('.guide-mask')!
            const width = modal?.style?.borderBottomWidth?.replace('px', '')
            if (width && modal) {
              modal.style.borderBottomWidth = `${Number(width) - 155}px`
            }
          })
        }
        if (stepIndex === 3) {
          requestAnimationFrame(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const modal: HTMLDivElement = document.querySelector('.guide-mask')!
            if (modal) {
              modal.style.background = 'rgba(0, 0, 0, 0.6)'
              modal.style.borderStyle = 'none'
            }
          })
          const auth = await getAuth()
          api.setProfile({ guide_finished: 'true' }, { auth }).catch(Boolean)
        }
      }}
    />
  )
}
