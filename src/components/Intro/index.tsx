import React, { useMemo, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import Guide, { IStep } from 'byte-guide'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { getHelpCenterUrl } from '../../data/help'
import { useWalletModel } from '../../hooks/useWallet'

export interface IntroProps {
  show: boolean
}

const GUIDE_STORAGE_KEY = 'GUIDE_STORAGE_KEY+'

export const Intro: React.FC<IntroProps> = ({ show }) => {
  const { t, i18n } = useTranslation('translations')
  const [showArrow, setShowArrow] = useState(true)
  const { address } = useWalletModel()
  const history = useHistory()
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
        selector: '.account',
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
  }, [t, i18n.language, history, address])
  return (
    <Guide
      steps={steps}
      localKey={GUIDE_STORAGE_KEY + address}
      closable={false}
      arrow={showArrow}
      lang={i18n.language === 'en' ? 'en' : 'zh'}
      nextText={t('guide.next')}
      okText={t('guide.done')}
      afterStepChange={(stepIndex) => {
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
        }
      }}
    />
  )
}
