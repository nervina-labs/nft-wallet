import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import { Image } from '@mibao-ui/components'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as RedEnvelopeHiddenModelIcon } from '../../../assets/svg/red-envelope-hidden-model.svg'
import { RedEnvelopeResponse } from '../../../models'
import { ellipsisString } from '../../../utils'

interface RecordsProps {
  data?: RedEnvelopeResponse
  address?: string
}

export const Records: React.FC<RecordsProps> = ({ data, address }) => {
  const { t } = useTranslation('translations')
  const statusText = useMemo(() => {
    return '恭喜您领取成功!'
  }, [])

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="calc(100% - 60px)"
      textAlign="center"
    >
      <Box color="white" fontSize="12px" mb="10px" mt="50px">
        {t('red-envelope.from-red-envelope', {
          email: data?.issuer_info.name ?? data?.issuer_info.email,
        })}
      </Box>
      <Box color="#F9E0B7" fontSize="18px" fontWeight="bold">
        {statusText}
      </Box>

      <Box color="#F9E0B7" fontSize="16px" mb="10px" mt="50px">
        {data?.promotion_copy}
      </Box>
      {data?.promotion_link ? (
        <Button
          as="a"
          variant="solid"
          bg="#F9E0B7"
          w="150px"
          _hover={{
            bg: '#F9E0B7',
          }}
          _active={{
            bg: '#dac4a0',
            transition: '0s',
          }}
          href={data?.promotion_link}
        >
          {t('red-envelope.promotion-link')}
        </Button>
      ) : null}

      <Divider
        borderBottomColor="rgba(239, 239, 239, 0.2)"
        mt="50px"
        w="calc(100% - 40px)"
      />

      {data ? (
        <Box
          color="rgba(255, 255, 255, 0.5)"
          h="32px"
          lineHeight="32px"
          fontSize="12px"
          textAlign="left"
          w="calc(100% - 40px)"
        >
          {t('red-envelope.record-count-text', {
            total: data.progress.total,
            claimed: data.progress.claimed,
            remain: data.progress.total - data.progress.claimed,
          })}
        </Box>
      ) : null}

      <Box w="full" mt="15px" mb="60px">
        {data?.reward_records.map((record, i) => (
          <Flex
            key={i}
            justify="space-between"
            alignItems="center"
            color="white"
            fontSize="14px"
            w="full"
            px="20px"
            textAlign="left"
            h="48px"
            bg={address === record.address ? '#E47767' : undefined}
          >
            <Flex justify="center" direction="column">
              <Box w="full">{ellipsisString(record.address, [5, 5])}</Box>
              <Box fontSize="12px" w="full">
                {dayjs(record.rewarded_at).format('HH : mm')}
              </Box>
            </Flex>
            {record.is_special_model ? (
              <Flex lineHeight="48px" alignItems="center" fontSize="12px">
                <RedEnvelopeHiddenModelIcon />
                <Box as="span" ml="6px">
                  {t('red-envelope.hidden-model')}
                </Box>
              </Flex>
            ) : null}
            <Image src="" w="38px" h="38px" rounded="8px" />
          </Flex>
        ))}
      </Box>
    </Flex>
  )
}
