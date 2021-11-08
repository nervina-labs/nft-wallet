import {
  Avatar,
  AvatarType,
  Box,
  Button,
  Grid,
  Stack,
} from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query, TransactionLog } from '../../../models'
import { ellipsisString, formatTime } from '../../../utils'
import TransactionsArrowSvg from '../../../assets/svg/transactions-arrow.svg'
import { Center, Image, useClipboard } from '@chakra-ui/react'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { useHistory } from 'react-router-dom'
import { useToast } from '../../../hooks/useToast'

const UserWithAddress: React.FC<{
  avatar_url?: string | null
  avatar_tid?: number | null
  avatar_type: AvatarType
  nickname: string
  address: string
}> = ({
  avatar_url: avatarUrl,
  avatar_type: avatarType,
  avatar_tid: avatarTid,
  nickname,
  address,
}) => {
  const { i18n } = useTranslation('translations')
  const { push } = useHistory()
  const goToHolder = useCallback(() => push(`/holder/${address}`), [
    address,
    push,
  ])

  return (
    <Grid
      templateColumns="25px calc(100% - 25px - 8px)"
      h="25px"
      cursor="pointer"
      onClick={goToHolder}
    >
      <Avatar
        src={avatarUrl === null ? '' : avatarUrl}
        type={avatarType}
        size="25px"
        border="1px solid #f6f6f6"
        fallbackSrc={FallbackAvatarSrc}
        srcQueryParams={
          avatarTid
            ? {
                tid: avatarTid,
                locale: i18n.language,
              }
            : undefined
        }
        resizeScale={50}
      />
      <Stack ml="8px" spacing="0" h="30px">
        {nickname ? (
          <>
            <Box fontSize="14px" fontWeight="500" lineHeight="14px">
              {nickname}
            </Box>
            <Box fontSize="12px" color="#777E90" lineHeight="12px">
              {ellipsisString(address, [5, 5])}
            </Box>
          </>
        ) : (
          <Box fontSize="14px" fontWeight="500" lineHeight="25px">
            {ellipsisString(address, [5, 5])}
          </Box>
        )}
      </Stack>
    </Grid>
  )
}

const NftTxLog: React.FC<{ log: TransactionLog }> = ({ log }) => {
  const { t, i18n } = useTranslation('translations')
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(log.tx_hash)
  const onCopyTxHash = useCallback(() => {
    if (hasCopied) return
    toast(t('info.copied'))
    onCopy()
  }, [hasCopied, onCopy])

  return (
    <Box bg="#f6f6f6" p="20px" rounded="22px" mb="10px">
      <Box color="#777E90" fontSize="12px" mb="15px">
        {formatTime(log.on_chain_timestamp, i18n.language)}
      </Box>
      <UserWithAddress {...log.sender_info} />
      <Center w="25px" h="30px" mb="5px">
        <Image src={TransactionsArrowSvg} alt="TransactionsArrowSvg" />
      </Center>
      <UserWithAddress {...log.holder_info} />
      <Box color="#777E90" fontSize="12px" mt="15px">
        {t('nft.tx_hash')}:{' '}
        <Button
          variant="link"
          fontSize="12px"
          colorScheme="primary"
          fontWeight="300"
          onClick={onCopyTxHash}
        >
          {ellipsisString(log.tx_hash, [10, 10])}
        </Button>
      </Box>
    </Box>
  )
}

export const NftTxLogsList: React.FC<{
  uuid: string
  isClass?: boolean
}> = ({ uuid, isClass }) => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = isClass
        ? await api.getTokenClassTransactions(uuid, { page: pageParam })
        : await api.getTokenTransactions(uuid, { page: pageParam })
      return data
    },
    [api, isClass, uuid]
  )

  return (
    <InfiniteList
      queryKey={[Query.NFTTransactions, api, isClass, uuid]}
      queryFn={queryFn}
      noMoreElement={t('nft.no-more-transaction-history')}
      calcDataLength={(data) =>
        data?.pages.reduce((acc, page) => page.transactions.length + acc, 0) ??
        0
      }
      renderItems={(items, i) => {
        return items.transactions.map((item, j) => (
          <NftTxLog key={`${i}-${j}`} log={item} />
        ))
      }}
    />
  )
}
