import { Button, Grid, Like } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useLike } from '../../../hooks/useLikeStatus'
import { TokenClass } from '../../../models/class-list'
import { NFTDetail } from '../../../models/nft'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'

export const Footer: React.FC<{
  hidden?: boolean
  uuid: string
  detail?: NFTDetail | TokenClass
}> = ({ detail, uuid, hidden }) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: Number(detail?.class_likes) ?? 0,
    liked: detail?.class_liked || false,
    locale: i18n.language,
    uuid: (detail as NFTDetail)?.class_uuid ?? uuid,
  })
  const tranfer = useCallback(() => {
    push(`/transfer/${uuid}`, {
      nftDetail: detail,
    })
  }, [push, uuid, detail])

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

      <Button
        colorScheme="primary"
        variant="solid"
        my="auto"
        mr="0"
        onClick={tranfer}
      >
        {t('nft.transfer')}
        <ArrowForwardIcon ml="5px" />
      </Button>
    </Grid>
  )
}
