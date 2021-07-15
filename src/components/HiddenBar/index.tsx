import React, { useCallback } from 'react'
import Slide from '@material-ui/core/Slide'
import styled from 'styled-components'
import { ReactComponent as MySvg } from '../../assets/svg/my.svg'
import { ReactComponent as MetaverseSvg } from '../../assets/svg/metaverse.svg'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import classnames from 'classnames'
import { useWalletModel } from '../../hooks/useWallet'
import { useScrollTriggerWithThreshold } from '../../hooks/useScroll'

export const HideOnScroll: React.FC<{ alwaysShow?: boolean }> = ({
  children,
  alwaysShow,
}) => {
  const trigger = useScrollTriggerWithThreshold()

  return (
    <Slide appear={false} direction="up" in={!trigger || alwaysShow}>
      {children as any}
    </Slide>
  )
}

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  border-radius: 20px;
  background: #2c454c;
  display: flex;
  font-size: 16px;
  width: calc(100% - 40px);
  margin-left: 20px;
  height: 60px;
  z-index: 10;

  @media (min-width: 500px) {
    width: 460px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 4px;
    cursor: pointer;
    flex: 1;
    svg {
      margin-right: 8px;
    }
    &.active {
      background-color: #ff5c00;
      border-radius: 16px;
    }
  }
`

export const HiddenBar: React.FC<{ alwaysShow?: boolean }> = ({
  alwaysShow,
}) => {
  const [t] = useTranslation('translations')
  const matchExplore = useRouteMatch(RoutePath.Explore)
  const matchNFTs = useRouteMatch({
    path: RoutePath.NFTs,
    exact: true,
  })
  const history = useHistory()
  const { isLogined } = useWalletModel()

  const myOnClick = useCallback(() => {
    if (matchNFTs?.isExact) {
      return
    }
    history.push(isLogined ? RoutePath.NFTs : RoutePath.Login)
  }, [isLogined, matchNFTs, history])

  return (
    <HideOnScroll alwaysShow={alwaysShow}>
      <Container>
        <div
          onClick={
            matchExplore?.isExact
              ? undefined
              : () => history.push(RoutePath.Explore)
          }
          className={classnames('item', { active: matchExplore?.isExact })}
        >
          <MetaverseSvg />
          <span>{t('explore.metaverse')}</span>
        </div>
        <div
          onClick={myOnClick}
          className={classnames('item', { active: matchNFTs?.isExact })}
        >
          <MySvg />
          <span>{t('explore.my')}</span>
        </div>
      </Container>
    </HideOnScroll>
  )
}
