import { Box, Button, Grid, Like } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useLike } from '../../../hooks/useLikeStatus'
import { TokenClass } from '../../../models/class-list'
import { NFTDetail } from '../../../models/nft'
import { useHistory } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { RoutePath } from '../../../routes'
import { ReactComponent as BuySvg } from '../../../assets/svg/buy.svg'
import { ReactComponent as TransferSvg } from '../../../assets/svg/transfer.svg'

const TranferOrBuy: React.FC<{
  uuid: string
  detail?: NFTDetail | TokenClass
  isClass?: boolean
}> = ({ uuid, detail, isClass }) => {
  const { t } = useTranslation('translations')
  const { push } = useHistory()
  const tranfer = useCallback(() => {
    push(`/transfer/${uuid}`, {
      nftDetail: detail,
    })
  }, [push, uuid, detail])
  const qrcode = useMemo(() => {
    return detail?.product_qr_code
  }, [detail])

  const ownCurrentToken =
    typeof detail?.class_card_back_content !== 'undefined' ||
    typeof detail?.card_back_content !== 'undefined'

  if (isClass) {
    if (!qrcode) {
      return null
    }

    return (
      <Button
        colorScheme="primary"
        variant="solid"
        my="auto"
        mr="0"
        onClick={() =>
          push(`${RoutePath.Shop}?qrcode=${encodeURIComponent(qrcode)}`)
        }
      >
        <Box as="span" mr="10px">
          {t('shop.buy')}
        </Box>
        <BuySvg />
      </Button>
    )
  }

  if (!ownCurrentToken) {
    return null
  }

  return (
    <Button
      colorScheme="primary"
      variant="solid"
      my="auto"
      mr="0"
      onClick={tranfer}
    >
      <Box as="span" mr="10px">
        {t('nft.transfer')}
      </Box>
      <TransferSvg />
    </Button>
  )
}

export const Footer: React.FC<{
  hidden?: boolean
  uuid: string
  detail?: NFTDetail | TokenClass
  isClass?: boolean
}> = ({ detail, uuid, hidden, isClass }) => {
  const { i18n } = useTranslation('translations')
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: Number(detail?.class_likes) ?? 0,
    liked: detail?.class_liked || false,
    locale: i18n.language,
    uuid: (detail as NFTDetail)?.class_uuid ?? uuid,
  })

  return (
    <Grid
      templateColumns="calc(100% - 120px) 120px"
      position="sticky"
      bottom="0"
      transform={`translateY(${hidden ? '60px' : '0'})`}
      transition="transform 300ms"
      h="60px"
      bg="white"
      px="20px"
      mt="auto"
      borderTop="1px solid #e1e1e1"
      zIndex={5}
    >
      <Like
        likeCount={likeCount}
        isLiked={isLiked}
        isLoading={isLikeLoading}
        onClick={toggleLike}
        my="auto"
      />

      <TranferOrBuy uuid={uuid} detail={detail} isClass={isClass} />
    </Grid>
  )
}
