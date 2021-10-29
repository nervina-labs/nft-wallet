import { Grid, Avatar, Box } from '@mibao-ui/components'
import { useCallback } from 'react'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'

export const HolderList: React.FC<{
  uuid: string
}> = ({ uuid }) => {
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getHolderByTokenClassUuid(uuid, {
        page: pageParam,
      })
      return data
    },
    [api, uuid]
  )

  return (
    <InfiniteList
      queryKey={[Query.NftHolderList, api, uuid]}
      queryFn={queryFn}
      noMoreElement={null}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, page) => page.token_holder_list.length + acc,
          0
        ) ?? 0
      }
      renderItems={(items, index) => {
        return items.token_holder_list.map((item) => (
          <Grid templateColumns="48px auto auto" h="60px" lineHeight="48px">
            <Avatar
              src={
                item.holder_info.avatar_url === null
                  ? ''
                  : item.holder_info.avatar_url
              }
              border="2px solid #f6f6f6"
            />
            <Box
              ml="18px"
              fontWeight="500"
              fontSize="14px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {item.holder_info.nickname}
            </Box>
            <Box
              textAlign="right"
              fontWeight="600"
              fontSize="14px"
              whiteSpace="nowrap"
            >
              #{item.n_token_id}
            </Box>
          </Grid>
        ))
      }}
    />
  )
}
