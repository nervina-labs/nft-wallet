import { NFTDetail } from '../../../models'
import { Box, Center, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Image } from '@mibao-ui/components'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'

export const PackEventInfo: React.FC<{
  packEventInfo?: NFTDetail['pack_event_info']
}> = ({ packEventInfo }) => {
  const { t } = useTranslation('translations')
  return (
    <Link to={`${RoutePath.PackEvent}/${packEventInfo?.uuid ?? ''}`}>
      <Box
        bg="#F6F6F6"
        py="10px"
        px="15px"
        rounded="10px"
        position="relative"
        mb="20px"
      >
        <Box color="#777E90" fontSize="12px" mb="5px">
          {t('nft.belonging-pack-event')}
        </Box>
        <Flex>
          <Image
            src={packEventInfo?.cover_image_url}
            w="60px"
            h="60px"
            rounded="10px"
          />
          <Flex
            justify="space-between"
            direction="column"
            w="calc(100% - 60px - 10px - 30px)"
            ml="10px"
            mr="30px"
          >
            <Box fontSize="14px" fontWeight="bold">
              {packEventInfo?.name}
            </Box>
            <Flex fontSize="12px" color="#777E90">
              <Box>
                {t('nft.pack-event-collected', {
                  count: packEventInfo?.pack_options_count,
                })}
              </Box>
              <Box ml="10px">
                {t('nft.pack-event-collected', {
                  count: packEventInfo?.pack_event_record_items_count,
                })}
              </Box>
            </Flex>
          </Flex>
          <Center h="100%" position="absolute" right="5px" top="0" w="20px">
            <ChevronRightIcon color="#777E90" h="30px" w="20px" />
          </Center>
        </Flex>
      </Box>
    </Link>
  )
}
