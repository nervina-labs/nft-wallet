import React, { useCallback } from 'react'
import { NFTToken, Query, TransactionStatus } from '../../../models'
import { Empty } from '../empty'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { IssuerList } from '../IssuerList'
import { AppbarSticky, HEADER_HEIGHT } from '../../../components/Appbar'
import { useAPI } from '../../../hooks/useAccount'
import { InfiniteList } from '../../../components/InfiniteList'
import { Card } from '../card'
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@mibao-ui/components'

type ListType = 'owned' | 'liked' | 'follow'

export const NftList: React.FC<{
  address: string
  isHolder: boolean
}> = ({ address, isHolder }) => {
  const api = useAPI()
  const { t } = useTranslation('translations')
  const [listType, setListType] = useRouteQuerySearch<ListType>('list', 'owned')

  const filterIndex = ['owned', 'liked', 'follow'].findIndex(
    (l) => l === listType
  )

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
        })),
      }
    },
    [address, api]
  )

  const getOwnedData = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam, { address })
      return data
    },
    [address, api]
  )

  return (
    <section className="list">
      <AppbarSticky top={!isHolder ? '0' : `${HEADER_HEIGHT}px`} mb="20px">
        <Tabs index={filterIndex} align="space-between" colorScheme="black">
          <TabList px="20px" className="filters">
            <Tab onClick={() => setListType('owned')}>{t('nfts.owned')}</Tab>
            <Tab onClick={() => setListType('liked')}>{t('nfts.liked')}</Tab>
            <Tab onClick={() => setListType('follow')}>
              {t('follow.follow')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt="20px">
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
                        isClass={false}
                        showTokenID
                      />
                    ))
                  }}
                />
              ) : null}
            </TabPanel>
            <TabPanel p={0} pt="20px">
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
                      />
                    ))
                  }}
                />
              ) : null}
            </TabPanel>
            <TabPanel p={0} pt="20px">
              {listType === 'follow' ? (
                <IssuerList
                  isFollow={listType === 'follow'}
                  address={address}
                />
              ) : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AppbarSticky>
    </section>
  )
}
