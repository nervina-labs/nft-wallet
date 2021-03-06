import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { Query } from '../../models'
import { TokenClass } from '../../models/class-list'
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
import { useLike } from '../../hooks/useLikeStatus'
import {
  trackLabels,
  useTrackClick,
  useTrackDidMount,
} from '../../hooks/useTrack'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  position: relative;
`

const Card: React.FC<{ token: TokenClass }> = ({ token }) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: token.class_likes,
    liked: token.class_liked,
    locale: i18n.language,
    uuid: token.uuid,
  })

  const trackGoToNFT = useTrackClick('go-nft-from-explore-recommend', 'click')

  return (
    <Link
      to={`/class/${token.uuid}`}
      onClick={() => {
        trackGoToNFT(trackLabels.explore['recommend-to-nft'])
      }}
    >
      <NFTCard
        src={token.bg_image_url === null ? '' : token.bg_image_url}
        type={token.renderer_type}
        locale={i18n.language}
        title={token.name}
        hasCardback={token.card_back_content_exist}
        titleProps={{ fontWeight: 'normal' }}
        imageProps={{
          customizedSize: {
            fixed: 'large',
          },
        }}
        issuerProps={{
          name: token.issuer_info?.name ?? '',
          src:
            token.issuer_info?.avatar_url === null
              ? ''
              : token.issuer_info?.avatar_url,
          isVerified: token.verified_info?.is_verified,
          containerProps: { h: '25px' },
          onClick(e) {
            push(`/issuer/${token.issuer_info?.uuid ?? ''}`)
            e.stopPropagation()
            e.preventDefault()
          },
          customizedSize: {
            fixed: 'small',
          },
        }}
        limitProps={{
          count: token.total,
          locale: i18n.language,
          limitedText: t('common.limit.limit'),
          unlimitedText: t('common.limit.unlimit'),
        }}
        likeProps={{
          isLiked,
          likeCount,
          isLoading: isLikeLoading,
          onClick: toggleLike,
        }}
        mb="20px"
      />
    </Link>
  )
}

export const Collection: React.FC = () => {
  const { i18n, t } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const goBack = useHistoryBack()
  useTrackDidMount('explore-rank')
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
          emptyElement={t('issuer.no-data')}
          noMoreElement={t('common.actions.pull-to-down')}
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
              <Card key={`${i}-${j}`} token={token} />
            ))
          }}
        />
      </Box>
    </Container>
  )
}
