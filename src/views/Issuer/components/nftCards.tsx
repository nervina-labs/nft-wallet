import {
  Box,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Image,
  NFTCard,
  AspectRatio,
} from '@mibao-ui/components'
import React, { useCallback, useMemo, useState } from 'react'
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
import { useLike } from '../../../hooks/useLikeStatus'
import { IssuerTokenClass } from '../../../models/issuer'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/svg/fallback.svg'
import { useShareImage } from '../hooks/useShareImage'

interface CardProps {
  token: IssuerTokenClass
  locale: string
  gotoClass: (classId: string) => void
}

const Card: React.FC<CardProps> = ({ token, locale, gotoClass }) => {
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: token.class_likes,
    liked: token.class_liked,
    locale,
    uuid: token.uuid,
  })
  const href = `/class/${token.uuid}`
  return (
    <Box overflow="hidden" mb="24px" px="20px">
      <NFTCard
        hasCardback={token.card_back_content_exist}
        likeProps={{
          isLiked,
          likeCount,
          isLoading: isLikeLoading,
          onClick: toggleLike,
        }}
        href={href}
        locale={locale}
        price={`¥${token.product_price as string}`}
        src={token.bg_image_url === null ? '' : token.bg_image_url}
        title={token.name}
        type={token.renderer_type}
        titleProps={{ noOfLines: 2 }}
        resizeScale={600}
        imageProps={{
          webp: isSupportWebp(),
        }}
        onClick={(e) => {
          e.preventDefault()
          gotoClass(token.uuid)
        }}
      />
    </Box>
  )
}

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
  const clientIsSupportWebp = useMemo(() => isSupportWebp(), [])
  const [, setShareImage] = useShareImage()

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
                onDataChange={(group) => {
                  setShareImage(
                    group?.pages?.[0]?.token_classes?.[0]?.bg_image_url ?? ''
                  )
                }}
                renderItems={(group, i) => {
                  return group.token_classes.map((token, j: number) => (
                    <AspectRatio
                      key={`${i}-${j}`}
                      onClick={() => gotoClass(token.uuid)}
                      ratio={i === 0 && j === 0 ? 1 : 9 / 12}
                      mb="10px"
                    >
                      <Image
                        src={
                          token.bg_image_url === null ? '' : token.bg_image_url
                        }
                        width="100%"
                        height="100%"
                        rounded="20px"
                        resizeScale={300}
                        webp={clientIsSupportWebp}
                        fallbackSrc={FALLBACK}
                      />
                    </AspectRatio>
                  ))
                }}
              />
            ) : null}
          </TabPanel>
          <TabPanel px="5px">
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
                  return group.token_classes.map((token, j: number) => {
                    return (
                      <Card
                        token={token}
                        gotoClass={gotoClass}
                        locale={i18n.language}
                        key={token.uuid || `${i}+${j}`}
                      />
                    )
                  })
                }}
              />
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
