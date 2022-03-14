import { Box, Divider, Flex, Spinner } from '@chakra-ui/react'
import { Image } from '@mibao-ui/components'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as RedEnvelopeHiddenModelIcon } from '../../../assets/svg/red-envelope-hidden-model.svg'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAccount, useAPI } from '../../../hooks/useAccount'
import {
  Query,
  RecordItem,
  RedEnvelopeRecord,
  RedEnvelopeResponse,
  RedEnvelopeState,
  RedpackType,
} from '../../../models'
import {
  ellipsisString,
  formatTime,
  generateOldAddress,
  isSupportWebp,
} from '../../../utils'
import { Extension } from './extension'
import { Promotion } from './promotion'

interface RecordsProps {
  uuid: string
  data?: RedEnvelopeResponse
  address?: string
  isAlreadyOpened?: boolean
}

const StatusText: React.FC<{
  data?: RedEnvelopeResponse
  isAlreadyOpened?: boolean
}> = ({ data, isAlreadyOpened }) => {
  const { t } = useTranslation('translations')
  const baseProps = {
    color: '#F9E0B7',
    fontSize: '18px',
    fontWeight: 'bold',
    px: '20px',
  }
  if (data?.is_claimed_special_model) {
    return <Box {...baseProps}>{t('red-envelope.message-hidden-model')}</Box>
  }
  if (isAlreadyOpened) {
    return (
      <Box {...baseProps} color="white">
        {t('red-envelope.message-already-opened')}
      </Box>
    )
  }
  if (data?.state === RedEnvelopeState.Done && !data?.is_current_user_claimed) {
    return (
      <Box {...baseProps} color="white">
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
      <Box {...baseProps} color="white">
        {textMap[data.state]}
      </Box>
    )
  }
  return <Box {...baseProps}>{t('red-envelope.message-succeed')}</Box>
}

const RewardRecord: React.FC<{
  address?: string
  data: RedEnvelopeRecord
}> = ({ address, data }) => {
  const { walletType } = useAccount()
  const { t, i18n } = useTranslation('translations')
  const [imageUrl, hasSpecialModel, specialCount] = useMemo(() => {
    const { specialRecord, specialCount } = data.record_items.reduce<{
      specialRecord?: RecordItem
      specialCount: number
    }>(
      (acc, record) => ({
        specialRecord:
          acc.specialRecord || (record.is_special_model ? record : undefined),
        specialCount: record.is_special_model
          ? acc.specialCount + 1
          : acc.specialCount,
      }),
      {
        specialCount: 0,
      }
    )
    return [
      specialRecord
        ? specialRecord.bg_image_url
        : data.record_items[0].bg_image_url,
      Boolean(specialRecord),
      specialCount,
    ]
  }, [data])

  return (
    <Flex
      justify="space-between"
      alignItems="center"
      color="white"
      fontSize="14px"
      w="full"
      px="20px"
      textAlign="left"
      h="48px"
      position="relative"
      bg={address === data.address ? '#E47767' : undefined}
      userSelect="none"
    >
      <Flex justify="center" direction="column">
        <Box w="full">
          {ellipsisString(generateOldAddress(data.address, walletType), [8, 5])}
        </Box>
        <Box fontSize="12px" w="full">
          {formatTime(data.created_at, i18n.language, true)}
        </Box>
      </Flex>
      {hasSpecialModel ? (
        <Flex
          lineHeight="48px"
          alignItems="center"
          fontSize="12px"
          whiteSpace="nowrap"
        >
          <RedEnvelopeHiddenModelIcon />
          <Box as="span" ml="6px">
            {t('red-envelope.hidden-model')} × {specialCount}
          </Box>
        </Flex>
      ) : null}
      <Image
        src={imageUrl === null || !imageUrl ? '' : imageUrl}
        w="38px"
        h="38px"
        minW="38px"
        rounded="10px"
        resizeScale={100}
        webp={isSupportWebp()}
        border={hasSpecialModel ? '2px solid #FFDCA2' : undefined}
        customizedSize={{
          fixed: 'small',
        }}
      />
      <Box
        position="absolute"
        right="18px"
        top="2px"
        rounded="full"
        bg="#FF5C00"
        border="1px solid #FFDCA2"
        zIndex={1}
        minW="15px"
        h="15px"
        lineHeight="13px"
        textAlign="center"
        fontSize="12px"
        whiteSpace="nowrap"
        px="3px"
      >
        {data.record_items.length > 99 ? '99+' : data.record_items.length}
      </Box>
    </Flex>
  )
}

export const Records: React.FC<RecordsProps> = ({
  uuid,
  data,
  address,
  isAlreadyOpened,
}) => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getRedEnvelopeRecords(uuid, {
        page: pageParam,
      })
      return data
    },
    [api, uuid]
  )
  const fromUsername = useMemo(() => {
    const name =
      data?.issuer_info?.name ||
      data?.issuer_info?.email ||
      data?.user_info?.nickname
    if (!name) {
      return ellipsisString(data?.user_info?.address ?? '', [5, 5])
    }
    return name.length > 10 ? `${name.substring(0, 10)}…` : name
  }, [
    data?.issuer_info?.email,
    data?.issuer_info?.name,
    data?.user_info?.address,
    data?.user_info?.nickname,
  ])

  const isShowPromotion =
    (data?.is_current_user_claimed || data?.promotion_copy) &&
    data.redpack_type === RedpackType.Saas

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="calc(100% - 60px)"
      textAlign="center"
    >
      <Box color="white" fontSize="12px" mb="10px" mt="50px" px="20px">
        {t('red-envelope.from-red-envelope', {
          username: fromUsername,
        })}
      </Box>
      <StatusText data={data} isAlreadyOpened={isAlreadyOpened} />
      {isShowPromotion ? (
        <Promotion copy={data.promotion_copy} link={data.promotion_link} />
      ) : null}
      {data?.redpack_type === RedpackType.Wallet ? (
        <Extension greeting={data.greetings} />
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
        <InfiniteList
          pullDownToRefresh={false}
          queryKey={[Query.RedEnvelopeRecords, api, uuid]}
          queryFn={queryFn}
          loader={<Spinner color="#F9E0B7" />}
          noMoreElement={null}
          emptyElement={''}
          calcDataLength={(data) =>
            data?.pages.reduce((acc, page) => page.records.length + acc, 0) ?? 0
          }
          renderItems={(items, i) => {
            return items.records.map((item, j) => (
              <RewardRecord key={`${i}-${j}`} data={item} address={address} />
            ))
          }}
        />
      </Box>
    </Flex>
  )
}
