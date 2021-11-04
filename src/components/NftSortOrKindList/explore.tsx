import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../hooks/useAccount'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Query, ClassSortType as SortType } from '../../models'
import { Flex, TabProps } from '@chakra-ui/react'
import { InfiniteList } from '../InfiniteList'
import {
  Box,
  Tab,
  TabList,
  Tabs,
  NftImage,
  Issuer,
  Like,
} from '@mibao-ui/components'
import { TokenClass } from '../../models/class-list'
import { useLike } from '../../hooks/useLikeStatus'

const tabProps: TabProps = {
  py: '4px',
  px: '8px',
  rounded: '6px',
  mr: '22px',
  whiteSpace: 'nowrap',
  _selected: {
    bg: '#f6f6f6',
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
      />
      <Box
        fontSize="16px"
        fontWeight="600"
        onClick={gotoClass}
        mt="15px"
        mb="10px"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {token.name}
      </Box>
      <Flex justify="space-between">
        <Issuer
          name={token.issuer_info?.name ?? ''}
          src={
            token.issuer_info?.avatar_url === null
              ? ''
              : token.issuer_info?.avatar_url
          }
          isVerified={token.verified_info?.is_verified}
          size="25px"
          onClick={gotoIssuer}
          mr="5px"
        />
        <Like
          likeCount={likeCount}
          isLiked={isLiked}
          isLoading={isLikeLoading}
          onClick={toggleLike}
        />
      </Flex>
    </Box>
  )
}

export const Explore: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const currentTag = useRouteQuery<string>('tag', '')
  const { replace, location } = useHistory()
  const { t, i18n } = useTranslation('translations')
  const api = useAPI()
  const [tagIndex, setTagIndex] = useState(0)
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
  useEffect(() => {
    const findIndex = tags?.findIndex((tag) => tag.name === currentTag) ?? -1
    setTagIndex(findIndex === -1 ? 0 : findIndex + 1)
  }, [tags, currentTag])

  const onChangeTabIndex = useCallback(
    (i: number) => {
      setTagIndex(i)
      if (tags) {
        replace(
          i === 0
            ? `${location.pathname}?tag=recommend`
            : `${location.pathname}?tag=${tags[i - 1]?.name}`
        )
      }
    },
    [location.pathname, replace, tags]
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
      >
        <TabList borderBottom="none" overflow="auto">
          <Tab {...tabProps}>推荐</Tab>
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
        renderItems={(group) => {
          return group.class_list.map((token) => {
            return <Card token={token} />
          })
        }}
      />
    </>
  )
}
