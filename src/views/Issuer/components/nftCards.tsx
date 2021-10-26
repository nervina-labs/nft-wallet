import {
  Box,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Image,
  AspectRatio,
  NftImage,
  Flex,
} from '@mibao-ui/components'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../../hooks/useRouteQuery'
import { PRODUCT_STATUE_SET, ProductState, Query } from '../../../models'
import { useHistory } from 'react-router-dom'
import { Empty } from '../../NFTs/empty'
import { InfiniteListNext } from '../../../components/InfiniteListNext'
import { useAPI } from '../../../hooks/useAccount'
import { useParams } from 'react-router'
import { Like } from '../../../components/Like'
import styled from 'styled-components'

const LineClamp = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

export const NftCards: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const { replace, location } = useHistory()
  const api = useAPI()
  const [t] = useTranslation('translations')
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
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getIssuerTokenClass(id, productState, {
        page: pageParam,
      })
      return data
    },
    [api, id, productState]
  )

  return (
    <Box w="full">
      <Tabs
        colorScheme="black"
        align="space-around"
        defaultIndex={index}
        onChange={onChange}
      >
        <TabList position={'sticky'} top={50} zIndex={99} bg={'white'}>
          <Tab>{t('issuer.created')}</Tab>
          <Tab>{t('issuer.selling')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {index === 0 ? (
              <InfiniteListNext
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
                      ratio={i === 0 && j === 0 ? 1 : 9 / 12}
                      key={`${i}-${j}`}
                    >
                      <Image
                        src={token.bg_image_url}
                        width="100%"
                        height="calc(100% - 5px)"
                        rounded="20px"
                        resizeScale={300}
                      />
                    </AspectRatio>
                  ))
                }}
              />
            ) : null}
          </TabPanel>
          <TabPanel>
            {index === 1 ? (
              <InfiniteListNext
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
                    <Box pb={'25px'}>
                      <NftImage
                        type={token.renderer_type}
                        hasCardBack={token.card_back_content_exist}
                        src={token.bg_image_url}
                      />
                      <Box fontWeight="600" fontSize="16px" mt="14px">
                        <LineClamp>{token.name}</LineClamp>
                      </Box>
                      <Flex justifyContent={'space-between'} mt={'10px'}>
                        <Box fontWeight="500" fontSize="16px">
                          ¥{499}
                        </Box>

                        <Box>
                          <Like
                            count={String(token.class_likes)}
                            liked={token.class_liked}
                            uuid={token.uuid}
                          />
                        </Box>
                      </Flex>
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
