import React, { useCallback, useMemo } from 'react'
import { NFTToken, Query, TransactionStatus } from '../../../models'
import { Empty } from '../empty'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { IssuerList } from '../IssuerList'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import { useAccount, useAPI } from '../../../hooks/useAccount'
import { InfiniteList } from '../../../components/InfiniteList'
import { Card } from '../card'
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@mibao-ui/components'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'
import { generateOldAddress } from '../../../utils'

const ListTypeSet = ['owned', 'liked', 'follow'] as const
type ListType = typeof ListTypeSet[number]

export const NftList: React.FC<{
  address: string
  isHolder: boolean
}> = ({ address, isHolder }) => {
  const api = useAPI()
  const { t } = useTranslation('translations')
  const [listType, setListType] = useRouteQuerySearch<ListType>('list', 'owned')
  const filterIndex = ListTypeSet.findIndex((l) => l === listType)
  const { walletType } = useAccount()
  const displayAddress = useMemo(() => {
    return generateOldAddress(address, walletType)
  }, [address, walletType])

  const getLikeData = useCallback(
    async ({ pageParam }) => {
      const { data } = await api.getUserLikesClassList(pageParam, { address })
      return {
        meta: data.meta,
        token_list: data.class_list.map<NFTToken>((c) => ({
          class_name: c.name,
          class_bg_image_url: c.bg_image_url,
          class_uuid: c.uuid,
          class_description: c.description,
          class_total: c.total,
          token_uuid: '',
          issuer_avatar_url: c.issuer_info?.avatar_url,
          issuer_name: c.issuer_info?.name,
          issuer_uuid: c.issuer_info?.uuid,
          tx_state: TransactionStatus.Committed,
          is_class_banned: c.is_class_banned,
          is_issuer_banned: c.is_issuer_banned,
          n_token_id: 0,
          verified_info: c.verified_info,
          renderer_type: c.renderer_type,
          card_back_content_exist: c.card_back_content_exist,
          card_back_content: c.card_back_content,
          script_type: c.script_type,
        })),
      }
    },
    [address, api]
  )

  const getOwnedData = useCallback(
    async ({ pageParam = 1 }) => {
      const options: Record<string, any> = {
        address,
      }
      if (isHolder) {
        options.exclude_banned = true
      }
      const { data } = await api.getNFTs(pageParam, options)
      return data
    },
    [address, api, isHolder]
  )

  const trackTab = useTrackClick(isHolder ? 'home' : 'collector', 'switchover')

  return (
    <section className="list">
      <Tabs index={filterIndex} align="space-between" colorScheme="black">
        <TabList
          px="20px"
          className="filters"
          top={!isHolder ? '0' : `${HEADER_HEIGHT}px`}
          position="sticky"
        >
          <Tab
            onClick={() => {
              setListType('owned')
              trackTab(trackLabels.home.switch.hold)
            }}
          >
            {t('nfts.owned')}
          </Tab>
          <Tab
            onClick={() => {
              setListType('liked')
              trackTab(trackLabels.home.switch.like)
            }}
          >
            {t('nfts.liked')}
          </Tab>
          <Tab
            onClick={() => {
              setListType('follow')
              trackTab(trackLabels.home.switch.follow)
            }}
          >
            {t('follow.follow')}
          </Tab>
        </TabList>
        <TabPanels pt="20px">
          <TabPanel p={0}>
            {listType === 'owned' ? (
              <InfiniteList
                queryFn={getOwnedData}
                queryKey={[Query.NFTList, address, listType]}
                enableQuery
                emptyElement={<Empty />}
                noMoreElement={t('common.actions.pull-to-down')}
                calcDataLength={(data) => {
                  return (
                    data?.pages.reduce(
                      (acc, token) => token.token_list.length + acc,
                      0
                    ) ?? 0
                  )
                }}
                renderItems={(group, i) => {
                  return group.token_list.map((token, j: number) => (
                    <Card
                      token={token}
                      key={token.token_uuid || `${i}.${j}`}
                      address={address}
                      displayAddress={displayAddress}
                      isClass={false}
                      showTokenID
                      isHolder={isHolder}
                    />
                  ))
                }}
              />
            ) : null}
          </TabPanel>
          <TabPanel p={0}>
            {listType === 'liked' ? (
              <InfiniteList
                queryFn={getLikeData}
                queryKey={[Query.NFTList, address, listType]}
                enableQuery
                emptyElement={<Empty />}
                noMoreElement={t('common.actions.pull-to-down')}
                calcDataLength={(data) => {
                  return (
                    data?.pages.reduce(
                      (acc, token) => token.token_list.length + acc,
                      0
                    ) ?? 0
                  )
                }}
                renderItems={(group, i) => {
                  return group.token_list.map((token, j: number) => (
                    <Card
                      token={token}
                      key={token.token_uuid || `${i}.${j}`}
                      address={address}
                      isClass
                      showTokenID={false}
                      isHolder={isHolder}
                      displayAddress={displayAddress}
                    />
                  ))
                }}
              />
            ) : null}
          </TabPanel>
          <TabPanel p={0}>
            {listType === 'follow' ? (
              <IssuerList isFollow={listType === 'follow'} address={address} />
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>
  )
}
