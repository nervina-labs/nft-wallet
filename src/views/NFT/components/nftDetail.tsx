import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  Limited,
  Skeleton,
  SkeletonText,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@mibao-ui/components'
import { NFTDetail } from '../../../models'
import { TokenClass } from '../../../models/class-list'
import { ReactComponent as OwnedSealSvg } from '../../../assets/svg/owned-seal.svg'
import { ReactComponent as OwnedSealENSvg } from '../../../assets/svg/owned-seal-en.svg'
import { ReactComponent as AvatarVerifiedSvg } from '../../../assets/svg/avatar-verified.svg'
import { Follow } from '../../../components/Follow'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../../hooks/useRouteQuery'
import { useCallback, useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { NftTxLogsList } from './nftTxLogList'
import { HolderList } from './holdersList'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { isSupportWebp } from '../../../utils'
import { Tag, TagLabel } from '@chakra-ui/react'
import { RoutePath } from '../../../routes'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'
import styled from 'styled-components'

const LinkFlex = styled(Link)`
  display: flex;
`

const TAB_PARAM_SET = ['desc', 'tx_logs', 'holders'] as const
type TabParam = typeof TAB_PARAM_SET[number]

const NftDetailTab: React.FC<{
  detail?: NFTDetail | TokenClass
  isClass?: boolean
  uuid: string
  isLoading: boolean
}> = ({ detail, isClass, uuid, isLoading }) => {
  const { t } = useTranslation('translations')
  const { replace, location } = useHistory()
  const tabParam = useRouteQuery<TabParam>('tab', 'desc')
  const [tabIndex, setTabIndex] = useState(
    TAB_PARAM_SET.findIndex((item) => item === tabParam) || 0
  )
  const onChangeTab = useCallback(
    (index) => {
      replace(`${location.pathname}?tab=${TAB_PARAM_SET[index]}`)
      setTabIndex(index)
    },
    [location.pathname, replace]
  )

  const trackTab = useTrackClick('nft-detail', 'switchover')

  return (
    <Tabs
      align="space-between"
      colorScheme="black"
      defaultIndex={tabIndex}
      onChange={onChangeTab}
      mt="20px"
      position="relative"
    >
      <Skeleton
        isLoaded={!isLoading}
        h="40px"
        position="sticky"
        top={`${HEADER_HEIGHT}px`}
        bg="white"
        zIndex={3}
      >
        <TabList px="20px">
          <Tab
            onClick={async () =>
              await trackTab(trackLabels.nftDetail.switch.desc)
            }
          >
            {t('nft.desc')}
          </Tab>
          <Tab
            onClick={async () =>
              await trackTab(trackLabels.nftDetail.switch.tx)
            }
          >
            {t('nft.transaction-history')}
          </Tab>
          <Tab
            onClick={async () =>
              await trackTab(trackLabels.nftDetail.switch.collector)
            }
          >
            {t('nft.holder')}
          </Tab>
        </TabList>
      </Skeleton>
      <TabPanels minH="200px">
        <TabPanel p="20px">
          <SkeletonText isLoaded={!isLoading} spacing={4} noOfLines={3}>
            <Box
              fontSize="14px"
              color="#777E90"
              userSelect="text"
              whiteSpace="pre-wrap"
            >
              {detail?.description ? detail?.description : t('nft.no-desc')}
            </Box>
          </SkeletonText>
        </TabPanel>
        <TabPanel p="20px" opacity={isLoading ? 0 : 1}>
          {tabIndex === 1 && <NftTxLogsList uuid={uuid} isClass={isClass} />}
        </TabPanel>
        <TabPanel p="0" pt="8px" opacity={isLoading ? 0 : 1}>
          {tabIndex === 2 && (
            <HolderList uuid={(detail as NFTDetail)?.class_uuid ?? uuid} />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export const NftDetail: React.FC<{
  detail?: NFTDetail | TokenClass
  isClass?: boolean
  uuid: string
  isLoading: boolean
  refetch: (params?: any) => Promise<any>
}> = ({ detail, isLoading, refetch, isClass, uuid }) => {
  const { t, i18n } = useTranslation('translations')
  const isOwned =
    typeof detail?.card_back_content !== 'undefined' ||
    typeof detail?.class_card_back_content !== 'undefined'
  const avatarUrl =
    detail?.issuer_info?.avatar_url === null
      ? ''
      : detail?.issuer_info?.avatar_url
  const matchNFT = useRouteMatch(RoutePath.NFT)
  const showAvatarVerified =
    !detail?.is_class_banned &&
    !detail?.is_issuer_banned &&
    detail?.verified_info?.is_verified

  const trackFollow = useTrackClick('nft-detail-follow', 'click')

  return (
    <Box py="20px">
      <SkeletonText isLoaded={!isLoading} noOfLines={2} spacing={2} px="20px">
        <Flex justify="space-between">
          <Box pr="10px">
            <Box
              textOverflow="ellipsis"
              overflow="hidden"
              noOfLines={2}
              fontSize="18px"
              mr="10px"
              mb="5px"
            >
              {detail?.name}
            </Box>
            <Flex lineHeight="20px">
              <Limited
                count={detail?.total ?? 0}
                serialNumber={(detail as NFTDetail)?.n_token_id}
                limitedText={t('common.limit.limit')}
                unlimitedText={t('common.limit.unlimit')}
                locale={i18n.language}
              />
              {detail?.is_redeemed ? (
                <Tag variant="outline" size="sm" colorScheme="green" ml="15px">
                  <TagLabel>{t('exchange.redeemed')}</TagLabel>
                </Tag>
              ) : null}
            </Flex>
          </Box>
          {isOwned && matchNFT?.isExact ? (
            <Center w="50px">
              {i18n.language === 'en' ? <OwnedSealENSvg /> : <OwnedSealSvg />}
            </Center>
          ) : null}
        </Flex>
      </SkeletonText>

      <Grid
        templateColumns="calc(100% - 100px) auto"
        mt="25px"
        px="20px"
        cursor="pointer"
      >
        <LinkFlex
          to={detail ? `/issuer/${detail?.issuer_info?.uuid ?? ''}` : ''}
        >
          <Box position="relative">
            <Avatar
              src={avatarUrl}
              size="48px"
              minW="48px"
              fallbackSrc={FallbackAvatarSrc}
              webp={isSupportWebp()}
              resizeScale={100}
            />
            {showAvatarVerified ? (
              <Center position="absolute" right="0" bottom="0" zIndex={2}>
                <AvatarVerifiedSvg />
              </Center>
            ) : null}
          </Box>

          {isLoading ? (
            <SkeletonText
              noOfLines={2}
              spacing={3}
              ml="18px"
              pt="4px"
              h="full"
            />
          ) : (
            <Flex
              justify="center"
              direction="column"
              h="100%"
              ml="18px"
              w="calc(100% - 48px - 18px)"
            >
              <Box
                fontSize="14px"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontWeight="500"
              >
                {detail?.issuer_info?.name}
              </Box>
              {detail?.verified_info?.verified_title && (
                <Box
                  fontSize="12px"
                  color="#777E90"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {detail?.verified_info?.verified_title}
                </Box>
              )}
            </Flex>
          )}
        </LinkFlex>
        <Flex justifyContent="flex-end">
          <Skeleton isLoaded={!isLoading} borderRadius="12px" my="auto">
            <Follow
              followed={detail?.issuer_info?.issuer_followed === true}
              uuid={detail?.issuer_info?.uuid ?? ''}
              afterToggle={async () => {
                trackFollow(uuid)
                await refetch()
              }}
              isPrimary
            />
          </Skeleton>
        </Flex>
      </Grid>

      <NftDetailTab
        detail={detail}
        uuid={uuid}
        isClass={isClass}
        isLoading={isLoading}
      />
    </Box>
  )
}
