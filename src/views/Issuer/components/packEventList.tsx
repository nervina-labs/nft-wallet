import { Box, Flex, Heading } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { RoutePath } from '../../../routes'
import { Empty } from './empty'
import { Image } from '@mibao-ui/components'

export const PackEventList: React.FC<{
  id: string
}> = ({ id }) => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const getPackEventData = useCallback(
    async ({ pageParam }) => {
      const { data } = await api.getIssuerPackEventList(id, {
        page: pageParam,
      })
      return data
    },
    [api, id]
  )

  return (
    <InfiniteList
      queryFn={getPackEventData}
      queryKey={[Query.PackEventList, id]}
      enableQuery
      emptyElement={<Empty />}
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) => {
        return (
          data?.pages.reduce(
            (acc, token) => token.pack_events.length + acc,
            0
          ) ?? 0
        )
      }}
      renderItems={(group, i) => {
        return group.pack_events.map((event, j: number) => (
          <Link to={`${RoutePath.PackEvent}/${event.uuid}`} key={`${i}-${j}`}>
            <Flex
              mb="20px"
              rounded="20px"
              overflow="hidden"
              mx="20px"
              shadow="0px 4px 16px rgba(0, 0, 0, 0.08)"
              p="15px"
            >
              <Image
                src={event.cover_image_url}
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
                  {event.name}
                </Heading>
                <Box fontSize="12px">
                  {t('issuer.pack-event-count', {
                    count: event.pack_options_count,
                  })}
                </Box>
              </Flex>
            </Flex>
          </Link>
        ))
      }}
    />
  )
}
