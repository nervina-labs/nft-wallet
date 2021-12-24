import {
  Avatar,
  AvatarType,
  Box,
  Button,
  Grid,
  Stack,
} from '@mibao-ui/components'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query, TransactionLog } from '../../../models'
import {
  ellipsisString,
  formatTime,
  getNFTQueryParams,
  isSupportWebp,
} from '../../../utils'
import TransactionsArrowSvg from '../../../assets/svg/transactions-arrow.svg'
import { Center, Image, useClipboard } from '@chakra-ui/react'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { useHistory } from 'react-router-dom'
import { useToast } from '../../../hooks/useToast'

const UserWithAddress: React.FC<{
  avatarUrl?: string | null
  avatarTid?: number | null
  avatarType?: AvatarType
  nickname: string
  address: string
  showAddress?: string
  isIssuer?: boolean
  isVerified?: boolean
}> = ({
  avatarUrl,
  avatarTid,
  avatarType = 'image',
  nickname,
  address,
  showAddress,
  isIssuer,
  isVerified,
}) => {
  const { i18n } = useTranslation('translations')
  const { push } = useHistory()
  const goToHolderOrIssuer = useCallback(() => {
    if (isIssuer) {
      push(`/issuer/${address}`)
      return
    }
    push(`/holder/${address}`)
  }, [address, isIssuer, push])
  const showingAddress = useMemo(() => showAddress || address, [
    address,
    showAddress,
  ])
  const addressEllipsisRange: [number, number] = useMemo(
    () => [isIssuer ? 12 : 5, 5],
    [isIssuer]
  )

  return (
    <Grid
      templateColumns="25px calc(100% - 25px - 8px)"
      cursor="pointer"
      onClick={goToHolderOrIssuer}
    >
      <Avatar
        src={avatarUrl === null ? '' : avatarUrl}
        type={avatarType}
        size="25px"
        border={avatarType === 'token' ? undefined : '1px solid #f6f6f6'}
        fallbackSrc={FallbackAvatarSrc}
        isVerified={isVerified}
        srcQueryParams={getNFTQueryParams(avatarTid, i18n.language)}
        webp={isSupportWebp()}
        resizeScale={100}
        customizedSize={{
          fixed: 'small',
        }}
      />
      <Stack ml="8px" spacing="4px" h="30px">
        {nickname ? (
          <>
            <Box
              fontSize="13px"
              fontWeight="500"
              lineHeight="13px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {nickname}
            </Box>
            <Box fontSize="12px" color="#777E90" lineHeight="12px">
              {ellipsisString(showingAddress, addressEllipsisRange)}
            </Box>
          </>
        ) : (
          <Box fontSize="14px" fontWeight="500" lineHeight="25px">
            {ellipsisString(showingAddress, addressEllipsisRange)}
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
  }, [hasCopied, onCopy, t, toast])
  const senderInfo =
    log.tx_type === 'issue'
      ? {
          avatarUrl: log.issuer_avatar_url,
          nickname: log.issuer_name,
          address: log.issuer_uuid,
          showAddress: log.n_issuer_id,
          isIssuer: true,
          isVerified: log.verified_info?.is_verified,
        }
      : {
          avatarUrl: log.sender_info.avatar_url,
          avatarType: log.sender_info.avatar_type,
          avatarTid: log.sender_info.avatar_tid,
          nickname: log.sender_info.nickname,
          address: log.sender_info.address,
        }

  return (
    <Box bg="#f6f6f6" p="20px" rounded="22px" mb="10px">
      <Box color="#777E90" fontSize="12px" mb="15px">
        {formatTime(log.on_chain_timestamp, i18n.language)}
      </Box>
      <UserWithAddress {...senderInfo} />
      <Center w="25px" h="30px" mb="5px">
        <Image src={TransactionsArrowSvg} alt="TransactionsArrowSvg" />
      </Center>
      <UserWithAddress
        avatarType={log.holder_info.avatar_type}
        avatarUrl={log.holder_info.avatar_url}
        avatarTid={log.holder_info.avatar_tid}
        nickname={log.holder_info.nickname}
        address={log.holder_info.address}
      />
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
  isLoading?: boolean
}> = ({ uuid, isClass, isLoading }) => {
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
      enableQuery={!isLoading}
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
