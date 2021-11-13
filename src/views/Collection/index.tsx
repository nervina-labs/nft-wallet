import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, Redirect, useParams } from 'react-router-dom'
import { Query } from '../../models'
import {
  Appbar as RowAppbar,
  AppbarButton,
  AppbarSticky,
} from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { MainContainer } from '../../styles'
import { useAPI } from '../../hooks/useAccount'
import { Box, NFTCard } from '@mibao-ui/components'
import { InfiniteList } from '../../components/InfiniteList'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import styled from 'styled-components'
import { useFirstOpenScrollToTop } from '../../hooks/useFirstOpenScrollToTop'
import { RoutePath } from '../../routes'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const Collection: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const goBack = useHistoryBack()
  const { data, failureCount, error } = useQuery(
    [Query.CollectionDetail, api, id],
    async () => {
      const { data } = await api.getCollectionDetail(id)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getCollection(id, pageParam)
      return data
    },
    [api, id]
  )
  useFirstOpenScrollToTop()

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <AppbarSticky mb="20px">
        <RowAppbar
          left={
            <AppbarButton onClick={goBack}>
              <BackSvg />
            </AppbarButton>
          }
          title={data?.locales?.[i18n.language] ?? ''}
        />
      </AppbarSticky>
      <Box
        px="20px"
        bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 10%)"
        minH="calc(100vh - 300px)"
      >
        <InfiniteList
          enableQuery
          queryFn={queryFn}
          queryKey={[Query.Collection, api, id]}
          emptyElement={null}
          noMoreElement={null}
          calcDataLength={(data) =>
            data?.pages.reduce(
              (acc, token) => token.class_list.length + acc,
              0
            ) ?? 0
          }
          columnCount={2}
          gap="20px"
          renderItems={(group, i) => {
            return group.class_list.map((token, j: number) => (
              <Link to={`/class/${token.uuid}`} key={`${i}-${j}`}>
                <NFTCard
                  src={token.bg_image_url === null ? '' : token.bg_image_url}
                  type={token.renderer_type}
                  locale={i18n.language}
                  title={token.name}
                  hasCardback={token.card_back_content_exist}
                  titleProps={{ fontWeight: 'normal' }}
                  issuerProps={{
                    name: token.issuer_info?.name ?? '',
                    src:
                      token.issuer_info?.avatar_url === null
                        ? ''
                        : token.issuer_info?.avatar_url,
                  }}
                  limitProps={{
                    count: token.total,
                    locale: i18n.language,
                    limitedText: t('common.limit.limit'),
                    unlimitedText: t('common.limit.unlimit'),
                  }}
                  mb="20px"
                />
                {/* <Flex mb="16px">
                  <Image
                    src={token.bg_image_url === null ? '' : token.bg_image_url}
                    width="50px"
                    height="50px"
                    rounded="10px"
                    resizeScale={300}
                    webp={isSupportWebp()}
                    fallbackSrc={FALLBACK}
                  />
                  <Box
                    h="50px"
                    lineHeight="50px"
                    ml="10px"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {token.name}
                  </Box>
                </Flex> */}
              </Link>
            ))
          }}
        />
      </Box>
    </Container>
  )
}
