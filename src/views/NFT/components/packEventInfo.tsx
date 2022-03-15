import { NFTDetail } from '../../../models'
import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Image } from '@mibao-ui/components'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import { TokenClass } from '../../../models/class-list'

export const PackEventInfo: React.FC<{
  packEventInfo?: NFTDetail['pack_event_info'] | TokenClass['pack_event_info']
}> = ({ packEventInfo }) => {
  const { t } = useTranslation('translations')
  const isTokenClass =
    typeof (packEventInfo as NFTDetail['pack_event_info'])
      ?.pack_event_record_items_count !== 'undefined'

  return (
    <>
      <Box color="#777E90" fontSize="12px" mb="5px">
        {t('nft.belonging-pack-event')}
      </Box>
      <Link to={`${RoutePath.PackEvent}/${packEventInfo?.uuid ?? ''}`}>
        <Box
          bg="#fff"
          p="12px"
          rounded="16px"
          position="relative"
          mb="20px"
          shadow="0 0 8px rgba(0, 0, 0, 0.1)"
        >
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
              <Box fontSize="14px">{packEventInfo?.name}</Box>
              <Flex fontSize="12px" color="#777E90">
                <Box>
                  {t('nft.pack-event-collected', {
                    count: packEventInfo?.pack_options_count,
                  })}
                </Box>
                {!isTokenClass ? (
                  <Box ml="10px">
                    {t('nft.pack-event-collected', {
                      count: (packEventInfo as NFTDetail['pack_event_info'])
                        ?.pack_event_record_items_count,
                    })}
                  </Box>
                ) : null}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Link>
    </>
  )
}
