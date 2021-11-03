import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../hooks/useAccount'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Query, ClassSortType as SortType } from '../../models'
import { TabProps } from '@chakra-ui/react'
import { InfiniteList } from '../InfiniteList'
import { NFTCard, Box, Tab, TabList, Tabs } from '@mibao-ui/components'

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

export const Explore: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const currentTag = useRouteQuery<string>('tag', '')
  const { push, replace, location } = useHistory()
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
          console.log(group.class_list)
          return group.class_list.map((token) => {
            return (
              <Box
                key={token.uuid}
                w="full"
                pb="20px"
                onClick={() => {
                  push(`/class/${token.uuid}`)
                }}
              >
                <NFTCard
                  issuerProps={{
                    name: token.issuer_info?.name ?? '',
                    src:
                      token.issuer_info?.avatar_url === null
                        ? ''
                        : token.issuer_info?.avatar_url,
                    verifiedTitle: token.verified_info?.verified_title,
                  }}
                  likeProps={{
                    likeCount: token.class_likes,
                    isLiked: token.class_liked,
                  }}
                  locale={i18n.language}
                  src={token.bg_image_url === null ? '' : token.bg_image_url}
                  title={token.name}
                  type={token.renderer_type}
                  hasCardback={token.card_back_content_exist}
                  w="full"
                />
              </Box>
            )
          })
        }}
      />
    </>
  )
}
