import {
  Box,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Image,
  NFTCard,
} from '@mibao-ui/components'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../../hooks/useRouteQuery'
import { PRODUCT_STATUE_SET, ProductState, Query } from '../../../models'
import { useHistory } from 'react-router-dom'
import { Empty } from '../../NFTs/empty'
import { useAPI } from '../../../hooks/useAccount'
import { useParams } from 'react-router'
import { useAtom } from 'jotai'
import { TabCountInfo } from './issuerInfo'
import { InfiniteList } from '../../../components/InfiniteList'

export const NftCards: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const { replace, location, push } = useHistory()
  const api = useAPI()
  const { t, i18n } = useTranslation('translations')
  const [index, setIndex] = useState(
    PRODUCT_STATUE_SET.findIndex((item) => item === productState) || 0
  )
  const onChange = useCallback(
    (index) => {
      replace(`${location.pathname}?productState=${PRODUCT_STATUE_SET[index]}`)
      setIndex(index)
    },
    [location.pathname, replace]
  )
  const gotoClass = useCallback(
    (classId: string) => {
      push(`/class/${classId}`)
    },
    [push]
  )
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getIssuerTokenClass(id, productState, {
        page: pageParam,
      })
      return data
    },
    [api, id, productState]
  )
  const [tabCountInfo] = useAtom(TabCountInfo)

  return (
    <Box w="full">
      <Tabs
        colorScheme="black"
        align="space-around"
        defaultIndex={index}
        onChange={onChange}
      >
        <TabList position={'sticky'} top={50} zIndex={99} bg={'white'}>
          <Tab>
            {t('issuer.created')} {tabCountInfo.issuedClassCount}
          </Tab>
          <Tab>
            {t('issuer.selling')} {tabCountInfo.onSaleProductCount}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {index === 0 ? (
              <InfiniteList
                enableQuery
                queryFn={queryFn}
                queryKey={[Query.Issuers, api, id, productState]}
                emptyElement={<Empty />}
                noMoreElement={t('common.actions.pull-to-down')}
                calcDataLength={(data) =>
                  data?.pages.reduce(
                    (acc, token) => token.token_classes.length + acc,
                    0
                  ) ?? 0
                }
                columnCount={2}
                renderItems={(group, i) => {
                  return group.token_classes.map((token, j: number) => (
                    <Box
                      pb="10px"
                      key={`${i}-${j}`}
                      onClick={() => gotoClass(token.uuid)}
                    >
                      <Image
                        src={
                          token.bg_image_url === null ? '' : token.bg_image_url
                        }
                        width="100%"
                        height="100%"
                        rounded="20px"
                        resizeScale={300}
                        containerProps={{
                          ratio: i === 0 && j === 0 ? 1 : 9 / 12,
                        }}
                        webp
                      />
                    </Box>
                  ))
                }}
              />
            ) : null}
          </TabPanel>
          <TabPanel>
            {index === 1 ? (
              <InfiniteList
                enableQuery
                queryFn={queryFn}
                queryKey={[Query.Issuers, api, id, productState]}
                emptyElement={<Empty />}
                noMoreElement={t('common.actions.pull-to-down')}
                calcDataLength={(data) =>
                  data?.pages.reduce(
                    (acc, token) => token.token_classes.length + acc,
                    0
                  ) ?? 0
                }
                columnCount={1}
                renderItems={(group, i) => {
                  return group.token_classes.map((token, j: number) => (
                    <Box
                      rounded="10%"
                      shadow="0 0 1px rgba(0, 0, 0, 0.1)"
                      overflow="hidden"
                      p="10px"
                      pb="20px"
                      mb="25px"
                    >
                      <NFTCard
                        hasCardback={token.card_back_content_exist}
                        likeProps={{
                          isLiked: token.class_liked,
                          likeCount: token.class_likes,
                        }}
                        locale={i18n.language}
                        price={`¥${token.product_price as string}`}
                        src={token.bg_image_url}
                        title={token.name}
                        type={token.renderer_type}
                        resizeScale={500}
                        imageProps={{
                          webp: true,
                        }}
                        onClick={() => gotoClass(token.uuid)}
                      />
                    </Box>
                  ))
                }}
              />
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
