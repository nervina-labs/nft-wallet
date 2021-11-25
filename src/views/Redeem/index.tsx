import React, { useCallback, useMemo } from 'react'
import {
  Appbar,
  AppbarButton,
  AppbarSticky,
  HEADER_HEIGHT,
} from '../../components/Appbar'
import { ReactComponent as MyExchangeSvg } from '../../assets/svg/my-exchange.svg'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { RoutePath } from '../../routes'
import { Query } from '../../models'
import { RedeemCard } from './RedeemCard'
import { Link } from 'react-router-dom'
import { SubmitInfo } from '../RedeemDetail/SubmitInfo'
import { RedeemListType } from '../../models/redeem'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Tab, TabList, Tabs } from '@mibao-ui/components'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { InfiniteList } from '../../components/InfiniteList'
import { useTrackDidMount } from '../../hooks/useTrack'

export const RedeemContainer = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  background: #f6f6f6;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }

  .list {
    padding: 20px 0;
    flex: 1;
  }
`

const TabTypeSet = [RedeemListType.All, RedeemListType.CanRedeem]

export const Redeem: React.FC = () => {
  const { t } = useTranslation('translations')
  const [tabType, setTabType] = useRouteQuerySearch<RedeemListType>(
    'type',
    RedeemListType.All
  )
  const tabIndex = useMemo(() => {
    const i = TabTypeSet.indexOf(tabType)
    return i === -1 ? 0 : i
  }, [tabType])

  useTrackDidMount('redeem')

  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address } = useAccount()

  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getAllRedeemEvents(
        pageParam,
        TabTypeSet.includes(tabType) ? tabType : TabTypeSet[0]
      )
      return data
    },
    [api, tabType]
  )
  useScrollRestoration()

  return (
    <RedeemContainer>
      <AppbarSticky>
        <Appbar
          title={t('exchange.title')}
          right={
            isLogined ? (
              <AppbarButton>
                <Link to={RoutePath.MyRedeem}>
                  <MyExchangeSvg />
                </Link>
              </AppbarButton>
            ) : (
              <div />
            )
          }
        />
      </AppbarSticky>
      <AppbarSticky top={`${HEADER_HEIGHT}px`} bg="white" mb="20px">
        <Tabs index={tabIndex} colorScheme="black" align="space-around">
          <TabList px="20px">
            <Tab onClick={() => setTabType(RedeemListType.All)}>
              {t('exchange.tabs.all')}
            </Tab>
            <Tab onClick={() => setTabType(RedeemListType.CanRedeem)}>
              {t('exchange.tabs.redeemable')}
            </Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
      <InfiniteList
        enableQuery
        queryFn={queryFn}
        queryKey={[Query.RedeemList, tabType, address]}
        noMoreElement={t('common.actions.pull-to-down')}
        calcDataLength={(data) =>
          data?.pages.reduce(
            (acc, token) => token.event_list.length + acc,
            0
          ) ?? 0
        }
        renderItems={(group, i) => {
          return group.event_list.map((token, j: number) => (
            <React.Fragment key={`${i}-${j}`}>
              <RedeemCard item={token} />
            </React.Fragment>
          ))
        }}
      />
      <SubmitInfo />
    </RedeemContainer>
  )
}
