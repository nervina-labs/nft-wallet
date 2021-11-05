import React, { useEffect, useMemo, useState } from 'react'
import { ReactComponent as MySvg } from '../../assets/svg/my.svg'
import { ReactComponent as ExploreSvg } from '../../assets/svg/explore.svg'
import { ReactComponent as AppsSvg } from '../../assets/svg/apps.svg'
import { ReactComponent as HiddenBarKindsSvg } from '../../assets/svg/hidden-bar-kinds.svg'
import { useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import { useAccountStatus } from '../../hooks/useAccount'
import { Stack } from '@mibao-ui/components'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, scan, tap, throttleTime } from 'rxjs'

const Container = styled(Stack)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  font-size: 16px;
  width: auto;
  height: 55px;
  z-index: 10;
  border-radius: 44px;
  backdrop-filter: blur(32px);
  transform: translateX(-50%);
  background: linear-gradient(
    87.48deg,
    rgba(255, 255, 255, 0.5) 6.39% #ffffff 99.5%
  );
  box-shadow: 0 4px 20px rgba(168, 193, 221, 0.2);
  border: 1px solid rgba(246, 246, 246, 0.1);
  width: 80%;
  justify-content: space-between;
  max-width: 315px;
  transition: 300ms;

  &.hide {
    transform: translateX(-50%) translateY(100px);
  }

  .item {
    margin: 0 auto;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  svg {
    height: 24px;
    width: 24px;
    fill: #777e90;
    margin: auto;

    path: {
      fill: #777e90;
    }
  }

  .active svg {
    fill: #5065e5 !important;
    path: {
      fill: #5065e5 !important;
    }
  }
`

export const HiddenBar: React.FC<{ alwaysShow?: boolean }> = ({
  alwaysShow,
}) => {
  const { isLogined } = useAccountStatus()
  const matchExplore = useRouteMatch(RoutePath.Explore)
  const matchNFTs = useRouteMatch({
    path: RoutePath.NFTs,
    exact: true,
  })
  const matchApps = useRouteMatch(RoutePath.Apps)
  const items = useMemo(
    () => [
      {
        routeMatch: matchExplore?.isExact,
        icon: <ExploreSvg />,
        path: RoutePath.Explore,
      },
      {
        routeMatch: matchExplore?.isExact,
        icon: <HiddenBarKindsSvg />,
        path: RoutePath.Explore,
      },
      {
        routeMatch: matchNFTs?.isExact,
        icon: <MySvg />,
        path: isLogined ? RoutePath.NFTs : RoutePath.Login,
      },
      {
        routeMatch: matchApps?.isExact,
        icon: <AppsSvg />,
        path: RoutePath.Apps,
      },
    ],
    [isLogined, matchApps?.isExact, matchExplore?.isExact, matchNFTs?.isExact]
  )
  const [isHide, setIsHide] = useState(false)
  useObservable(() =>
    fromEvent(window, 'scroll').pipe(
      throttleTime(500),
      scan((acc) => [acc[1], window.scrollY], [window.scrollY, window.scrollY]),
      tap(([prev, curr]) => {
        if (!alwaysShow) {
          setIsHide(prev < curr && curr > 200)
        }
      })
    )
  )
  useEffect(() => {
    if (alwaysShow) {
      setIsHide(false)
    }
  }, [alwaysShow])

  return (
    <Container spacing="50px" direction="row" className={isHide ? 'hide' : ''}>
      {items.map((item, i) => (
        <Link
          to={item.path}
          className={`item ${item.routeMatch ? 'active' : ''}`}
          key={i}
        >
          {item.icon}
        </Link>
      ))}
    </Container>
  )
}
