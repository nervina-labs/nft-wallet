import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
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
  Grid,
  Avatar,
} from '@mibao-ui/components'
import { TokenClass } from '../../models/class-list'
import { useLike } from '../../hooks/useLikeStatus'
import { isSupportWebp } from '../../utils'

const tabProps: TabProps = {
  py: '4px',
  px: '8px',
  rounded: '6px',
  mr: '22px',
  whiteSpace: 'nowrap',
  fontWeight: 'normal',
  _selected: {
    bg: '#f6f6f6',
    fontWeight: 'bold',
  },
}

const Card: React.FC<{ token: TokenClass }> = ({ token }) => {
  const { i18n } = useTranslation('translations')
  const { push } = useHistory()
  const gotoClass = useCallback(() => {
    push(`/class/${token.uuid}`)
  }, [push, token.uuid])
  const gotoIssuer = useCallback(() => {
    if (token.issuer_info?.uuid) {
      push(`/issuer/${token.issuer_info?.uuid}`)
    }
  }, [push, token.issuer_info?.uuid])
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: token.class_likes,
    liked: token.class_liked,
    locale: i18n.language,
    uuid: token.uuid,
  })

  return (
    <Box key={token.uuid} w="full" pb="20px">
      <NftImage
        src={token.bg_image_url === null ? '' : token.bg_image_url}
        type={token.renderer_type}
        hasCardBack={token.card_back_content_exist}
        onClick={gotoClass}
        resizeScale={300}
        webp={isSupportWebp()}
      />
      <Box
        fontSize="16px"
        onClick={gotoClass}
        mt="15px"
        mb="10px"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {token.name}
      </Box>
      <Grid
        templateColumns="25px calc(100% - 30px - 50px) 40px"
        onClick={gotoIssuer}
      >
        <Avatar
          src={
            token.issuer_info?.avatar_url === null
              ? ''
              : token.issuer_info?.avatar_url
          }
          resizeScale={50}
          webp={isSupportWebp()}
          isVerified={token.verified_info?.is_verified}
        />
        <Box
          fontSize="12px"
          fontWeight="300"
          lineHeight="25px"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          px="10px"
        >
          {token.issuer_info?.name}
        </Box>
        <Like
          likeCount={likeCount}
          isLiked={isLiked}
          isLoading={isLikeLoading}
          onClick={toggleLike}
          whiteSpace="nowrap"
        />
      </Grid>
      {token.product_price && (
        <Box fontWeight="500" fontSize="12px" mt="7px">
          ¥{token.product_price}
        </Box>
      )}
    </Box>
  )
}

export const Explore: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const { t, i18n } = useTranslation('translations')
  const api = useAPI()
  const [currentTag, setCurrentTag] = useRouteQuerySearch<string>(
    'tag',
    'recommend'
  )
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
    const index = tags.findIndex((t) => t.name === currentTag)
    return index === -1 ? 0 : index + 1
  }, [currentTag, tags])
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      if (tags) {
        const currentTagId = tagIndex === 0 ? 'all' : tags[tagIndex - 1].uuid
        if (currentTagId) {
          const { data } = await api.getClassListByTagId(
            currentTagId,
            pageParam,
            sort
          )
          return data
        }
      }
      return {
        meta: {
          current_page: 0,
          total_count: 0,
        },
        class_list: [],
      }
    },
    [api, sort, tagIndex, tags]
  )
  const onChangeTabIndex = useCallback(
    (i: number) => {
      setCurrentTag(i === 0 ? 'recommend' : tags?.[i - 1]?.name ?? 'recommend')
    },
    [setCurrentTag, tags]
  )

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
        <TabList borderBottom="none" overflow="auto">
          <Tab {...tabProps}>{t('explore.recommended')}</Tab>
          {tags?.map((tag) => (
            <Tab {...tabProps} key={tag.name}>
              {tag.locales[i18n.language]}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <InfiniteList
        enableQuery
        queryFn={queryFn}
        queryKey={[Query.Explore, tagIndex, sort, api]}
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
      />
    </>
  )
}
