import React, { useEffect, useMemo, useState } from 'react'
import { ReactComponent as MySvg } from '../../assets/svg/my.svg'
import { ReactComponent as ExploreSvg } from '../../assets/svg/explore.svg'
import { ReactComponent as AppsSvg } from '../../assets/svg/apps.svg'
import { ReactComponent as HiddenBarKindsSvg } from '../../assets/svg/hidden-bar-kinds.svg'
import { useHistory, useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import { useAccountStatus } from '../../hooks/useAccount'
import { Box, Stack, BoxProps } from '@mibao-ui/components'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, scan, tap, throttleTime } from 'rxjs'
import { trackLabels, useTrackClick } from '../../hooks/useTrack'

const Container = styled(Stack)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  font-size: 16px;
  width: auto;
  height: 55px;
  z-index: 10;
  border-radius: 44px;
  transform: translateX(-50%);
  background-color: white;
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
  const matchExploreAll = useRouteMatch(RoutePath.ExploreAll)
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
        routeMatch: matchExploreAll?.isExact,
        icon: <HiddenBarKindsSvg />,
        path: RoutePath.ExploreAll,
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
    [
      isLogined,
      matchApps?.isExact,
      matchExplore?.isExact,
      matchExploreAll?.isExact,
      matchNFTs?.isExact,
    ]
  )
  const [isHide, setIsHide] = useState(false)
  useObservable(() =>
    fromEvent(window, 'scroll').pipe(
      throttleTime(200),
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
  const { location } = useHistory()
  const trackClick = useTrackClick('narbar', 'click')

  const isAllowShowHiddenBar = useMemo(
    () =>
      [
        RoutePath.Explore,
        RoutePath.ExploreAll,
        RoutePath.NFTs,
        RoutePath.Apps,
      ].some((p) => location.pathname.startsWith(p)),
    [location.pathname]
  )

  const isHidden = isHide || !isAllowShowHiddenBar
  return (
    <Container
      spacing="50px"
      direction="row"
      className={isHidden ? 'hide' : ''}
    >
      {items.map((item, i) => (
        <Link
          to={{
            pathname: item.path,
            search:
              matchExplore?.isExact || matchExploreAll?.isExact
                ? location.search
                : undefined,
          }}
          className={`item ${item.routeMatch ? 'active' : ''}`}
          key={i}
          onClick={() => {
            switch (i) {
              case 0:
                trackClick(trackLabels.navbar.explore)
                break
              case 1:
                trackClick(trackLabels.navbar.categories)
                break
              case 2:
                trackClick(trackLabels.navbar.home)
                break
              case 3:
                trackClick(trackLabels.navbar.apps)
                break
            }
          }}
        >
          {item.icon}
        </Link>
      ))}
    </Container>
  )
}

export const HiddenBarFill: React.FC<BoxProps> = (props) => {
  return <Box h="95px" {...props} />
}
