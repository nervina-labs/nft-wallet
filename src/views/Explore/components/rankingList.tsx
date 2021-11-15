import { Avatar, Image, Box, Flex, Grid, Skeleton } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { RankingItem } from '../../../models/rank'
import { ReactComponent as MoreSvg } from '../../../assets/svg/recommend-more.svg'
import { RankIcon } from '../../../components/RankIcon'
import { Link } from 'react-router-dom'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/img/nft-fallback.png'

const RANKING_EMOJI_MAP: { [key in string]: string } = {
  hot_sale_issuer: '🏆',
  hot_sale_token_class: '🏆',
  popular_issuer: '🔥',
  popular_token_class: '🔥',
}

const Item: React.FC<RankingItem> = ({
  name,
  locales,
  token_classes: tokenClasses,
  issuers,
  uuid,
}) => {
  const { t, i18n } = useTranslation('translations')

  return (
    <Link to={`/explore/ranking/${uuid}`}>
      <Flex justify="space-between" fontSize="16px" mb="20px" cursor="pointer">
        <Box>
          {RANKING_EMOJI_MAP[name] ?? ''} {locales?.[i18n.language]}
        </Box>
        <Flex fontSize="12px" color="#777E90">
          <Box my="auto" mr="5px">
            {t('explore.more')}
          </Box>
          <Box my="auto">
            <MoreSvg />
          </Box>
        </Flex>
      </Flex>

      <Box>
        {tokenClasses?.slice(0, 3).map((token, i) => (
          <Grid
            key={i}
            mb="15px"
            templateColumns={'60px calc(100% - 120px) 60px'}
          >
            <Image
              src={token.bg_image_url === null ? '' : token.bg_image_url}
              w="50px"
              h="50px"
              rounded="10px"
              resizeScale={100}
              webp={isSupportWebp()}
              fallbackSrc={FALLBACK}
            />
            <Box
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              ml="10px"
            >
              {token.name}
            </Box>
            <Box m="auto" mr="0">
              <RankIcon rank={i} variant="trophy" />
            </Box>
          </Grid>
        ))}

        {issuers?.slice(0, 3).map((issuer, i) => (
          <Grid mb="15px" templateColumns={'60px calc(100% - 120px) 60px'}>
            <Avatar
              src={issuer.avatar_url === null ? '' : issuer.avatar_url}
              size="50px"
              isVerified={issuer.verified_info?.is_verified}
              webp={isSupportWebp()}
              resizeScale={150}
            />
            <Flex direction="column" mx="10px">
              <Box
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                fontWeight="500"
                fontSize="14px"
              >
                {issuer.name}
              </Box>
              <Box
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                fontWeight="500"
                fontSize="12px"
                color="#777E90"
                mt="auto"
              >
                {issuer.verified_info?.verified_title}
              </Box>
            </Flex>
            <Box m="auto" mr="0">
              <RankIcon rank={i} variant="text" />
            </Box>
          </Grid>
        ))}
      </Box>
    </Link>
  )
}

export const RankingList: React.FC = () => {
  const api = useAPI()
  const { data, isLoading } = useQuery(
    Query.RankingList,
    async () => {
      const { data } = await api.getRankingList()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  return (
    <Box overflowY="hidden" overflowX="auto">
      <Flex w="auto" p="20px">
        {isLoading ? (
          <>
            {[0, 1].map((k) => (
              <Skeleton
                w="90%"
                maxWidth="305px"
                h="240px"
                mr="15px"
                flexShrink={0}
                rounded="15px"
                key={k}
              />
            ))}
          </>
        ) : (
          <>
            {data?.ranking_list?.map((ranking, i) => (
              <Flex
                w="90%"
                h="240px"
                direction="column"
                shrink={0}
                pr="15px"
                mr="15px"
                maxW="305px"
                key={i}
              >
                <Item {...ranking} />
              </Flex>
            ))}
          </>
        )}
      </Flex>
    </Box>
  )
}
