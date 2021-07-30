import React, { useCallback } from 'react'
import Slide from '@material-ui/core/Slide'
import styled from 'styled-components'
import { ReactComponent as MySvg } from '../../assets/svg/my.svg'
import { ReactComponent as ExploreSvg } from '../../assets/svg/explore.svg'
import { ReactComponent as AppsSvg } from '../../assets/svg/apps.svg'
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
  background: #2a2a2a;
  display: flex;
  font-size: 16px;
  width: 255px;
  height: 55px;
  margin-left: calc((100% - 255px) / 2);
  z-index: 10;
  border-radius: 44px;

  @media (min-width: 500px) {
    margin-left: 122.5px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    svg {
      height: 24px;
      width: 24px;
      cursor: pointer;
    }
    &.active {
      svg {
        path {
          fill: #ff5c00;
        }
      }
    }
  }
`

export const HiddenBar: React.FC<{ alwaysShow?: boolean }> = ({
  alwaysShow,
}) => {
  const matchExplore = useRouteMatch(RoutePath.Explore)
  const matchNFTs = useRouteMatch({
    path: RoutePath.NFTs,
    exact: true,
  })
  const matchApps = useRouteMatch(RoutePath.Apps)
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
          <ExploreSvg />
        </div>
        <div
          onClick={myOnClick}
          className={classnames('item', { active: matchNFTs?.isExact })}
        >
          <MySvg />
        </div>
        <div
          onClick={
            matchApps?.isExact ? undefined : () => history.push(RoutePath.Apps)
          }
          className={classnames('item', { active: matchApps?.isExact })}
        >
          <AppsSvg />
        </div>
      </Container>
    </HideOnScroll>
  )
}
