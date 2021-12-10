import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Image } from '@mibao-ui/components'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReactComponent as RedEnvelopeHiddenModelIcon } from '../../../assets/svg/red-envelope-hidden-model.svg'
import { RedEnvelopeResponse, RedEnvelopeState } from '../../../models'
import { RoutePath } from '../../../routes'
import { ellipsisString, isSupportWebp } from '../../../utils'

interface RecordsProps {
  data?: RedEnvelopeResponse
  address?: string
  isAlreadyOpened?: boolean
}

const LinkStyled = styled(Link)`
  display: block;
  background-color: #f9e0b7;
  min-width: 150px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 8px;
  :active {
    background-color: #dac4a0;
    transition: 0s;
  }
`

export const Records: React.FC<RecordsProps> = ({
  data,
  address,
  isAlreadyOpened,
}) => {
  const { t } = useTranslation('translations')
  const isSpecialModel = useMemo(
    () =>
      Boolean(
        data?.reward_records.find((record) => record.address === address)
          ?.is_special_model
      ),
    [address, data?.reward_records]
  )
  const statusText = useMemo(() => {
    if (isSpecialModel) {
      return t('red-envelope.message-hidden-model')
    }
    if (isAlreadyOpened) {
      return (
        <Box as="span" color="white">
          {t('red-envelope.message-already-opened')}
        </Box>
      )
    }
    if (!data?.user_claimed && data?.state === RedEnvelopeState.Done) {
      return (
        <Box as="span" color="white">
          {t('red-envelope.message-empty')}
        </Box>
      )
    }
    const textMap: { [key in RedEnvelopeState]?: string } = {
      [RedEnvelopeState.Closed]: t('red-envelope.message-closed'),
      [RedEnvelopeState.Expired]: t('red-envelope.message-expired'),
    }
    if (data?.state && textMap[data.state]) {
      return (
        <Box as="span" color="white">
          {textMap[data.state]}
        </Box>
      )
    }
    return t('red-envelope.message-succeed')
  }, [data, isAlreadyOpened, isSpecialModel, t])

  const fromUsername = data?.issuer_info.name || data?.issuer_info.email || ''
  const promotionCopy =
    data?.promotion_copy || t('red-envelope.default-promotion-copy')

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="calc(100% - 60px)"
      textAlign="center"
    >
      <Box color="white" fontSize="12px" mb="10px" mt="50px" px="20px">
        {t('red-envelope.from-red-envelope', {
          username:
            fromUsername.length > 10
              ? `${fromUsername.substring(0, 10)}…`
              : fromUsername,
        })}
      </Box>
      <Box color="#F9E0B7" fontSize="18px" fontWeight="bold" px="20px">
        {statusText}
      </Box>

      <Box color="#F9E0B7" fontSize="16px" mb="10px" mt="50px" px="20px">
        {promotionCopy}
      </Box>
      {data?.promotion_link ? (
        <Button
          as="a"
          variant="solid"
          bg="#F9E0B7"
          minW="150px"
          _hover={{
            bg: '#F9E0B7',
          }}
          _active={{
            bg: '#dac4a0',
            transition: '0s',
          }}
          href={data.promotion_link}
          target="_blank"
        >
          {t('red-envelope.promotion-link')}
        </Button>
      ) : (
        <LinkStyled to={RoutePath.NFTs}>
          {t('red-envelope.promotion-link')}
        </LinkStyled>
      )}

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
              <Box w="full">{ellipsisString(record.address, [8, 5])}</Box>
              <Box fontSize="12px" w="full">
                {dayjs(record.rewarded_at).format('HH:mm')}
              </Box>
            </Flex>
            {record.is_special_model ? (
              <Flex
                lineHeight="48px"
                alignItems="center"
                fontSize="12px"
                whiteSpace="nowrap"
              >
                <RedEnvelopeHiddenModelIcon />
                <Box as="span" ml="6px">
                  {t('red-envelope.hidden-model')}
                </Box>
              </Flex>
            ) : null}
            <Image
              src={
                record.bg_image_url === null || !record.bg_image_url
                  ? ''
                  : record.bg_image_url
              }
              w="38px"
              h="38px"
              minW="38px"
              rounded="8px"
              resizeScale={100}
              webp={isSupportWebp()}
            />
          </Flex>
        ))}
      </Box>
    </Flex>
  )
}
