import { Box, Flex, Heading, Tab, TabList, Tabs } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'
import { Empty } from '../empty'
import { Image, Progress } from '@mibao-ui/components'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { PackEventState } from '../../../models/pack-event'
import { RoutePath } from '../../../routes'

export const StyledLink = styled(Link)``

export const PackEventList: React.FC<{}> = () => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const [
    packEventState,
    setPackEventState,
  ] = useRouteQuerySearch<PackEventState>('state', PackEventState.Pending)
  const [total, setTotal] = useState(-1)
  const getPackEventData = useCallback(
    async ({ pageParam }) => {
      const auth = await getAuth()
      const { data } = await api.getPackEventList(auth, {
        page: pageParam,
        state: packEventState,
      })
      return data
    },
    [api, getAuth, packEventState]
  )

  return (
    <>
      <Flex
        justify="space-between"
        px="20px"
        h="30px"
        lineHeight="30px"
        mb="20px"
      >
        <Box fontSize="12px" fontWeight="bold">
          {total !== -1 ? t('nfts.pack-event-text.total', { total }) : null}
        </Box>
        <Tabs
          variant="solid-rounded"
          colorScheme="gray"
          size="sm"
          index={[PackEventState.Pending, PackEventState.Completed].indexOf(
            packEventState
          )}
        >
          <TabList h="30px">
            <Tab onClick={() => setPackEventState(PackEventState.Pending)}>
              {t('nfts.pack-event-text.collecting')}
            </Tab>
            <Tab onClick={() => setPackEventState(PackEventState.Completed)}>
              {t('nfts.pack-event-text.collected')}
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
      <InfiniteList
        queryFn={getPackEventData}
        queryKey={[Query.PackEventList, packEventState]}
        enableQuery
        emptyElement={<Empty />}
        noMoreElement={t('common.actions.pull-to-down')}
        onDataChange={(data) => {
          setTotal(data?.pages[0].meta.total_count ?? 0)
        }}
        calcDataLength={(data) => {
          return (
            data?.pages.reduce(
              (acc, token) => token.pack_event_records.length + acc,
              0
            ) ?? 0
          )
        }}
        renderItems={(group, i) => {
          return group.pack_event_records.map((record, j: number) => (
            <StyledLink
              to={`${RoutePath.PackEvent}/${record.pack_event_info.uuid}`}
              key={`${i}-${j}`}
            >
              <Flex
                mb="20px"
                rounded="20px"
                overflow="hidden"
                mx="20px"
                shadow="0px 4px 16px rgba(0, 0, 0, 0.08)"
                p="15px"
              >
                <Image
                  src={record.pack_event_info.cover_image_url}
                  w="100px"
                  h="100px"
                  rounded="10px"
                />
                <Flex
                  w="calc(100% - 100px - 15px)"
                  ml="15px"
                  flex={1}
                  direction="column"
                  justify="space-between"
                >
                  <Heading
                    fontSize="16px"
                    noOfLines={2}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {record.pack_event_info.name}
                  </Heading>
                  <Box>
                    <Progress
                      value={Math.floor(
                        (record.record_items_count /
                          record.pack_event_info.pack_options_count) *
                          100
                      )}
                      colorScheme="primary"
                      height="8px"
                    />
                    <Flex justify="space-between" fontSize="12px" mt="10px">
                      <Box>{t('nfts.pack-event-text.collection-progress')}</Box>
                      <Box>
                        {record.record_items_count >=
                        record.pack_event_info.pack_options_count
                          ? t('nfts.pack-event-text.collected')
                          : `${record.record_items_count} / ${record.pack_event_info.pack_options_count}`}
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Flex>
            </StyledLink>
          ))
        }}
      />
    </>
  )
}
