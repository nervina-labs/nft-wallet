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
import { Query } from '../../../models'
import { ellipsisString, formatTime } from '../../../utils'
import TransactionsArrowSvg from '../../../assets/svg/transactions-arrow.svg'
import { Center, Image } from '@chakra-ui/react'

const UserWithAddress: React.FC<{
  avatar_url?: string | null
  avatar_type: AvatarType
  nickname: string
  address: string
}> = ({
  avatar_url: avatarUrl,
  avatar_type: avatarType,
  nickname,
  address,
}) => {
  return (
    <Grid templateColumns="25px calc(100% - 25px - 8px)" h="25px">
      <Avatar
        src={avatarUrl === null ? '' : avatarUrl}
        type={avatarType}
        size="25px"
        border="1px solid #f6f6f6"
      />
      <Stack ml="8px" spacing="0" h="30px">
        {nickname ? (
          <>
            <Box fontSize="14px" fontWeight="500" lineHeight="14px">
              {nickname}
            </Box>
            <Box fontSize="12px" color="#777E90" lineHeight="12px">
              {ellipsisString(address, [7, 4])}
            </Box>
          </>
        ) : (
          <Box fontSize="14px" fontWeight="500" lineHeight="25px">
            {ellipsisString(address, [7, 4])}
          </Box>
        )}
      </Stack>
    </Grid>
  )
}

export const NftTxLogsList: React.FC<{
  uuid: string
  isClass?: boolean
}> = ({ uuid, isClass }) => {
  const { t, i18n } = useTranslation('translations')
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
      noMoreElement={null}
      calcDataLength={(data) =>
        data?.pages.reduce((acc, page) => page.transactions.length + acc, 0) ??
        0
      }
      renderItems={(items, index) => {
        return items.transactions.map((item) => (
          <Box pb="10px">
            <Box bg="#f6f6f6" p="20px" rounded="22px">
              <Box color="#777E90" fontSize="12px" mb="15px">
                {formatTime(item.on_chain_timestamp, i18n.language)}
              </Box>
              <UserWithAddress {...item.sender_info} />
              <Center w="25px" h="30px" mb="5px">
                <Image src={TransactionsArrowSvg} alt="TransactionsArrowSvg" />
              </Center>
              <UserWithAddress {...item.holder_info} />
              <Box color="#777E90" fontSize="12px" mt="15px">
                {t('nft.tx_hash')}:{' '}
                <Button
                  variant="link"
                  fontSize="12px"
                  colorScheme="primary"
                  fontWeight="300"
                >
                  {ellipsisString(item.tx_hash, [12, 8])}
                </Button>
              </Box>
            </Box>
          </Box>
        ))
      }}
    />
  )
}
