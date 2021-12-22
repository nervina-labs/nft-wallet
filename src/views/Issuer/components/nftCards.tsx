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
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { PRODUCT_STATUE_SET, ProductState, Query } from '../../../models'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../../hooks/useAccount'
import { useParams } from 'react-router'
import { InfiniteList } from '../../../components/InfiniteList'
import { useLike } from '../../../hooks/useLikeStatus'
import { IssuerTokenClass } from '../../../models/issuer'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/img/nft-fallback.png'
import { Empty } from './empty'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import {
  trackLabels,
  useTrackClick,
  useTrackEvent,
} from '../../../hooks/useTrack'

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
  const trackLike = useTrackEvent(
    'issuer-on-sell',
    'click',
    trackLabels.issuer.like,
    toggleLike
  )
  return (
    <Box overflow="hidden" mb="24px" px="20px">
      <NFTCard
        hasCardback={token.card_back_content_exist}
        likeProps={{
          isLiked,
          likeCount,
          isLoading: isLikeLoading,
          onClick: trackLike,
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
          customizedSize: {
            fixed: 'small',
          },
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
  const [productState, setProductState] = useRouteQuerySearch<ProductState>(
    'productState',
    'product_state'
  )
  const { push } = useHistory()
  const api = useAPI()
  const { t, i18n } = useTranslation('translations')
  const [index, setIndex] = useState(
    PRODUCT_STATUE_SET.findIndex((item) => item === productState) || 0
  )
  const trackTab = useTrackClick('issuer', 'switchover')

  const onChange = useCallback(
    (index) => {
      setProductState(PRODUCT_STATUE_SET[index])
      setIndex(index)
    },
    [setProductState]
  )

  const trackGoToClass = useTrackClick('go-nft-from-issuer-on-sell', 'click')
  const gotoClass = useCallback(
    (classId: string, track = true) => {
      push(`/class/${classId}`)
      if (track) {
        trackGoToClass(trackLabels.issuer['to-nft'])
      }
    },
    [push, trackGoToClass]
  )
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getIssuerTokenClass(id, productState, {
        page: pageParam,
      })
      return data
    },
    [api, id, productState]
  )
  const clientIsSupportWebp = useMemo(() => isSupportWebp(), [])

  const trackCreatorClick = useTrackClick('go-nft-from-issuer', 'click')

  return (
    <Box w="full">
      <Tabs
        colorScheme="black"
        align="space-around"
        defaultIndex={index}
        onChange={onChange}
      >
        <TabList
          position="sticky"
          top={`${HEADER_HEIGHT}px`}
          zIndex={99}
          bg={'white'}
        >
          <Tab
            onClick={async () =>
              await trackTab(trackLabels.issuer.switch.creartor)
            }
          >
            {t('issuer.created')}
          </Tab>
          <Tab
            onClick={async () =>
              await trackTab(trackLabels.issuer.switch.onsell)
            }
          >
            {t('issuer.selling')}
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
                    <AspectRatio
                      key={`${i}-${j}`}
                      onClick={() => {
                        gotoClass(token.uuid, false)
                        trackCreatorClick(trackLabels.issuer['to-nft'])
                      }}
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
                        customizedSize={{
                          fixed: 'large',
                        }}
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
                emptyElement={<Empty type="on_sale" />}
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
