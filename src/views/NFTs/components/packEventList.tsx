import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabProps,
  Tabs,
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
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
import { ReactComponent as CollectedSvg } from '../../../assets/svg/pack-event-collected.svg'

export const StyledLink = styled(Link)``

const tabSelectedProps: TabProps = {
  bg: '#F6F8FA',
  rounded: '6px',
}

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
  const tabIndex = useMemo(
    () =>
      [PackEventState.Pending, PackEventState.Completed].indexOf(
        packEventState
      ),
    [packEventState]
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
        <Box fontSize="12px" fontWeight="bold" color="#777E90">
          {total !== -1 ? t('nfts.pack-event-text.total', { total }) : null}
        </Box>
        <Tabs variant="nostyled" colorScheme="gray" size="sm" index={tabIndex}>
          <TabList h="30px">
            <Tab
              onClick={() => setPackEventState(PackEventState.Pending)}
              color="#777E90"
              px="6px"
              py="4px"
              fontSize="12px"
              {...(tabIndex === 0 ? tabSelectedProps : {})}
            >
              {t('nfts.pack-event-text.collecting')}
            </Tab>
            <Tab
              onClick={() => setPackEventState(PackEventState.Completed)}
              color="#777E90"
              px="6px"
              py="4px"
              fontSize="12px"
              {...(tabIndex === 1 ? tabSelectedProps : {})}
            >
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
        renderItems={(group, i) =>
          group.pack_event_records.map((record, j: number) => {
            const isCollected =
              record.record_items_count >=
              record.pack_event_info.pack_options_count
            return (
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
                  p="12px"
                >
                  <Image
                    src={
                      record.pack_event_info.is_banned
                        ? ''
                        : record.pack_event_info.cover_image_url
                    }
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
                    pt="4px"
                  >
                    <Heading
                      fontSize="16px"
                      noOfLines={2}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      color={
                        record.pack_event_info.is_banned ? 'red.600' : undefined
                      }
                      mb="auto"
                    >
                      {record.pack_event_info.is_banned
                        ? t('common.baned.pack-event')
                        : record.pack_event_info.name}
                    </Heading>
                    {!record.pack_event_info.is_banned ? (
                      <Box color="#777E90">
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
                          <Box>
                            {t('nfts.pack-event-text.collection-progress')}
                          </Box>
                          <Box>
                            {isCollected ? (
                              <Flex color="#FFC635" alignItem="center">
                                <Box mr="4px" my="auto">
                                  <CollectedSvg />
                                </Box>
                                {t('nfts.pack-event-text.collected')}{' '}
                              </Flex>
                            ) : (
                              `${record.record_items_count} / ${record.pack_event_info.pack_options_count}`
                            )}
                          </Box>
                        </Flex>
                      </Box>
                    ) : null}
                  </Flex>
                </Flex>
              </StyledLink>
            )
          })
        }
      />
    </>
  )
}
