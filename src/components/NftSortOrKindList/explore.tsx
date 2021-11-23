import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory, Link } from 'react-router-dom'
import { useAPI } from '../../hooks/useAccount'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { Query, ClassSortType as SortType } from '../../models'
import { TabProps } from '@chakra-ui/react'
import { InfiniteList } from '../InfiniteList'
import {
  Box,
  Tab,
  TabList,
  Tabs,
  NftImage,
  Like,
  HStack,
  Issuer,
} from '@mibao-ui/components'
import { TokenClass } from '../../models/class-list'
import { useLike } from '../../hooks/useLikeStatus'
import { isSupportWebp } from '../../utils'
import styled from '@emotion/styled'
import { useTrackClick, useTrackEvent } from '../../hooks/useTrack'

const tabProps: TabProps = {
  py: '4px',
  px: '8px',
  rounded: '6px',
  mr: '22px',
  whiteSpace: 'nowrap',
  fontWeight: '400',
  _selected: {
    bg: '#f6f6f6',
    fontWeight: 'normal',
    color: 'var(--chakra-colors-black)',
  },
}

const TabListStyled = styled(TabList)`
  &::-webkit-scrollbar {
    display: none;
  }
`

const Card: React.FC<{ token: TokenClass }> = ({ token }) => {
  const { i18n } = useTranslation('translations')
  const { push } = useHistory()
  const gotoIssuer = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      if (token.issuer_info?.uuid) {
        push(`/issuer/${token.issuer_info?.uuid}`)
      }
    },
    [push, token.issuer_info?.uuid]
  )
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: token.class_likes,
    liked: token.class_liked,
    locale: i18n.language,
    uuid: token.uuid,
  })

  const trackClick = useTrackClick('go-nft-from-explore-explore', 'click')
  const trackLike = useTrackEvent(
    'explore-explore',
    'like',
    undefined,
    toggleLike
  )
  return (
    <Link to={`/class/${token.uuid}`} onClick={async () => await trackClick()}>
      <Box w="full" pb="20px">
        <NftImage
          src={token.bg_image_url === null ? '' : token.bg_image_url}
          type={token.renderer_type}
          hasCardBack={token.card_back_content_exist}
          resizeScale={300}
          webp={isSupportWebp()}
          rounded="22px"
        />
        <Box
          fontSize="16px"
          mt="15px"
          mb="10px"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {token.name}
        </Box>
        <HStack justifyContent="space-between">
          <Issuer
            src={
              token.issuer_info?.avatar_url === null
                ? ''
                : token.issuer_info?.avatar_url
            }
            name={token.issuer_info?.name as string}
            size="25px"
            isVerified={token.verified_info?.is_verified}
            onClick={gotoIssuer}
            webp={isSupportWebp()}
          />
          <Like
            likeCount={likeCount}
            isLiked={isLiked}
            isLoading={isLikeLoading}
            onClick={trackLike}
            whiteSpace="nowrap"
          />
        </HStack>
        {token.product_price && (
          <Box fontWeight="500" fontSize="14px" mt="7px" whiteSpace="nowrap">
            ¥{token.product_price}
          </Box>
        )}
      </Box>
    </Link>
  )
}

export const Explore: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const { t, i18n } = useTranslation('translations')
  const api = useAPI()
  const [currentTag, setCurrentTag] = useRouteQuerySearch<string>('tag', 'all')
  const { data: tags, isLoading } = useQuery(
    Query.Tags,
    async () => {
      const { data } = await api.getTags()
      return data.tags
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const tagIndex = useMemo(() => {
    if (!tags) {
      return 0
    }
    const index = tags.findIndex((t) => t.uuid === currentTag)
    return index === -1 ? 0 : index + 1
  }, [currentTag, tags])
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getClassListByTagId(
        currentTag,
        pageParam,
        sort
      )
      return data
    },
    [api, currentTag, sort]
  )
  const onChangeTabIndex = useCallback(
    (i: number) => {
      setCurrentTag(i === 0 ? 'all' : tags?.[i - 1]?.uuid ?? 'all')
    },
    [setCurrentTag, tags]
  )
  const stopPropagation = useCallback((e) => {
    e?.stopPropagation()
  }, [])

  if (isLoading || !tags) {
    return null
  }

  return (
    <>
      <Tabs
        variant="solid-rounded"
        index={tagIndex}
        onChange={onChangeTabIndex}
        mb="15px"
        zIndex={2}
        position="relative"
      >
        <TabListStyled
          borderBottom="none"
          overflow="auto"
          onScroll={stopPropagation}
          onTouchMove={stopPropagation}
        >
          <Tab {...tabProps}>{t('explore.recommended')}</Tab>
          {tags?.map((tag) => (
            <Tab {...tabProps} key={tag.name}>
              {tag.locales[i18n.language]}
            </Tab>
          ))}
        </TabListStyled>
      </Tabs>
      <InfiniteList
        enableQuery
        queryFn={queryFn}
        queryKey={[Query.Explore, currentTag, sort]}
        emptyElement={null}
        noMoreElement={t('common.actions.pull-to-down')}
        calcDataLength={(data) =>
          data?.pages.reduce(
            (acc, token) => token?.class_list?.length + acc,
            0
          ) ?? 0
        }
        columnCount={2}
        gap="20px"
        renderItems={(group, i) => {
          return group.class_list.map((token, j) => {
            return <Card token={token} key={`${i}-${j}`} />
          })
        }}
        style={{
          overflowX: 'hidden',
        }}
      />
    </>
  )
}
