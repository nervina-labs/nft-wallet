import {
  Box,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Image,
  AspectRatio,
} from '@mibao-ui/components'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { PRODUCT_STATUE_SET, Query } from '../../../models'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../../hooks/useAccount'
import { useParams } from 'react-router'
import { InfiniteList } from '../../../components/InfiniteList'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/img/nft-fallback.png'
import { Empty } from './empty'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'
import { PackEventList } from './packEventList'

const TabTypes = [...PRODUCT_STATUE_SET, 'pack_event'] as const

export const NftCards: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [productState, setProductState] = useRouteQuerySearch<
    typeof TabTypes[number]
  >('type', 'product_state')
  const { push } = useHistory()
  const api = useAPI()
  const { t } = useTranslation('translations')
  const index = useMemo(() => {
    const i = TabTypes.findIndex((item) => item === productState)
    return i !== -1 ? i : 0
  }, [productState])
  const trackTab = useTrackClick('issuer', 'switchover')

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
      const { data } = await api.getIssuerTokenClass(id, {
        page: pageParam,
      })
      return data
    },
    [api, id]
  )
  const clientIsSupportWebp = useMemo(() => isSupportWebp(), [])

  const trackCreatorClick = useTrackClick('go-nft-from-issuer', 'click')

  return (
    <Box w="full">
      <Tabs
        colorScheme="black"
        align="space-around"
        index={index}
        onChange={(i) => setProductState(TabTypes[i])}
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
              await trackTab(trackLabels.issuer.switch.packEvent)
            }
          >
            {t('issuer.pack-event')}
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
            {index === 1 ? <PackEventList id={id} /> : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
