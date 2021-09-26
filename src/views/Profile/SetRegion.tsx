/* eslint-disable @typescript-eslint/indent */
import styled from 'styled-components'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DrawerConfig } from './DrawerConfig'
import { ReactComponent as RightSvg } from '../../assets/svg/right-arrow.svg'
import pc from 'china-division/dist/pc-code.json'
import { allRegions, ChinaRegions } from '../../data/regions'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { ProfilePath, RoutePath } from '../../routes'
import { useSetServerProfile } from '../../hooks/useProfile'
import { useQueryClient } from 'react-query'
import { Query } from '../../models'
import { usePrevious } from '../../hooks/usePrevious'
import { useConfirm } from '../../hooks/useConfirm'

export interface SetUsernameProps {
  open: boolean
  close: () => void
  region?: string
}

const Region = styled.div`
  overflow-y: auto;
  height: calc(100% - 78px);
  .label {
    font-size: 12px;
    line-height: 14px;
    color: #333333;
    margin: 8px 0;
    margin-left: 20px;
  }
`

const ItemContainer = styled.div`
  display: flex;
  cursor: pointer;
  padding: 12px 0;
  background-color: white;
  &.invalid {
    cursor: not-allowed;
  }
  .content {
    flex: 1;
    margin-left: 20px;
    display: flex;
    align-items: center;
    &.location {
      font-weight: bold;
    }
    svg {
      margin-right: 6px;
    }
  }
  .action {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 12px;
    color: #999;
    svg {
      margin-left: 6px;
    }
  }
`

const sortRegions = (
  regions: typeof allRegions,
  isChinese: boolean
): typeof allRegions => {
  if (isChinese) {
    return ChinaRegions.concat(
      regions
        .sort((a, b) => {
          return a.zh.localeCompare(b.zh, 'zh')
        })
        .filter((a) => !ChinaRegions.some((r) => r.code === a.code))
    )
  }
  return regions
}

interface ItemProps {
  content: React.ReactNode
  hasNext: boolean
  selected: boolean
  code: string
  onClick: (code: string) => void
}

const Item: React.FC<ItemProps> = ({
  content,
  selected,
  hasNext,
  code,
  onClick,
}) => {
  const [t] = useTranslation('translations')
  return (
    <ItemContainer onClick={() => onClick(code)}>
      <div className="content">{content}</div>
      <div className="action">
        {selected ? t('profile.regions.selected') : null}
        {hasNext ? <RightSvg /> : null}
      </div>
    </ItemContainer>
  )
}

export const getRegionFromCode = (
  region?: string,
  locale?: string
): string | null => {
  if (!region) {
    return null
  }

  const [countryCode, cityCode] = region.split(';;')
  const country = allRegions.find((r) => r.code === countryCode)?.[
    locale as 'zh'
  ]
  const isChinese = locale === 'zh'
  if (!isChinese || !cityCode) {
    return country ?? null
  }
  let city = ''
  let province = ''

  for (let i = 0; i < pc.length; i++) {
    const p = pc[i]
    if (cityCode.startsWith(p.code)) {
      province = p.name
      for (let j = 0; j < p.children.length; j++) {
        const c = p.children[j]
        if (c.code === cityCode) {
          city = c.name
        }
      }
    }
  }

  return `${province}，${city}`
}

export const SetRegion: React.FC<SetUsernameProps> = ({
  open,
  close,
  region,
}) => {
  const [t, i18n] = useTranslation('translations')
  const [value, setValue] = useState(region ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  const matchProvince = useRouteMatch(ProfilePath.Provinces)
  const matchCity = useRouteMatch(ProfilePath.Cities)
  const [currentProvince, setCurrentProvince] = useState('')
  const [selectedCountry, selectedCity] = useMemo(() => {
    return value.split(';;')
  }, [value])
  const setRemoteProfile = useSetServerProfile()
  const prevValue = usePrevious(value)
  const confirm = useConfirm()

  useEffect(() => {
    if (!open) {
      setValue(region ?? '')
    }
  }, [open, region])

  const currentCities = useMemo(() => {
    return pc.find((c) => c.code === currentProvince)?.children
  }, [currentProvince])

  const conutries = useMemo(() => {
    const isChinese = i18n.language !== 'en'
    return sortRegions(allRegions, isChinese).map((r) => {
      const name = r[i18n.language as 'zh']
      const hasNext = isChinese && r.code === 'CN'
      return (
        <Item
          key={r.code}
          content={name}
          selected={selectedCountry === r.code}
          hasNext={hasNext}
          code={r.code}
          onClick={(code) => {
            if (hasNext) {
              // setValue('')
              history.push(ProfilePath.Provinces)
            } else {
              setValue(code)
            }
          }}
        />
      )
    })
  }, [i18n.language, selectedCountry, history])

  const list = useMemo(() => {
    const isChinese = i18n.language !== 'en'
    if (!isChinese) {
      return conutries
    }

    if (matchCity?.isExact) {
      return currentCities?.map((city) => {
        return (
          <Item
            key={city.name}
            content={city.name}
            selected={selectedCity === city.code}
            hasNext={false}
            code={city.code}
            onClick={(code) => setValue(`CN;;${code}`)}
          />
        )
      })
    }

    if (matchProvince?.isExact) {
      return pc.map((r) => (
        <Item
          key={r.name}
          content={r.name}
          selected={selectedCity?.startsWith(r.code)}
          hasNext={true}
          code={r.code}
          onClick={(code) => {
            setCurrentProvince(code)
            // setValue('')
            history.push(ProfilePath.Cities)
          }}
        />
      ))
    }

    return conutries
  }, [
    i18n.language,
    matchProvince,
    selectedCity,
    matchCity,
    conutries,
    currentCities,
    history,
  ])

  const qc = useQueryClient()
  const onSave = useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    try {
      await setRemoteProfile({
        region: value,
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
      confirm(t('profile.save-edit'), onSave, close).catch(Boolean)
    } else {
      close()
    }
  }, [onSave, close, t, prevValue, value, confirm])
  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={onClose}
      title={t('profile.regions.edit')}
      isValid={!!value}
      bg="#F5F5F5"
      onSaving={onSave}
      isSaving={isSaving}
    >
      <Region>
        <div className="label">{t('profile.regions.all')}</div>
        {list}
      </Region>
    </DrawerConfig>
  )
}
