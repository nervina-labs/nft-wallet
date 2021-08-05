import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import { useRouteMatch } from 'react-router-dom'
import { RoutePath } from '../../routes'

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
  const history = useHistory()
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
      <Appbar
        title={matchHelpCenter?.isExact ? t('help.title') : t('license.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
      />
      <div className="main">
        {isLoaded ? null : <CircularProgress size="30px" />}
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
