import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import classNames from 'classnames'
import { useRouteMatch } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { Loading } from '@mibao-ui/components'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    max-width: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    iframe {
      width: 100%;
      height: calc(100vh - 44px);
      min-height: 100%;
      border: none;
    }
  }
  .hidden {
    display: none;
  }
`

export const Help: React.FC = () => {
  const { t } = useTranslation('translations')
  const url = useRouteQuery('url', '')
  const [isLoaded, setIsLoaded] = useState(false)
  const matchHelpCenter = useRouteMatch(RoutePath.Help)

  const src = useMemo(() => decodeURIComponent(url), [url])
  const frame = useRef<HTMLIFrameElement | null>(null)
  useEffect(() => {
    if (frame.current) {
      frame.current.onload = () => {
        setIsLoaded(true)
      }
    }
  }, [])

  return (
    <Container>
      <AppbarSticky>
        <Appbar
          title={
            matchHelpCenter?.isExact ? t('help.title') : t('license.title')
          }
        />
      </AppbarSticky>
      <div className="main">
        {isLoaded ? null : <Loading size="lg" />}
        <iframe
          className={classNames({ hidden: !isLoaded })}
          src={src}
          ref={frame}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </Container>
  )
}
