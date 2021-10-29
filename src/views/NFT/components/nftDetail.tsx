import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
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
import styled from 'styled-components'
import { Follow } from '../../../components/Follow'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../../hooks/useRouteQuery'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { NftTxLogsList } from './nftTxLogList'
import { HolderList } from './holdersList'

const NftDetailName = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-size: 18px;
  -webkit-line-clamp: 2;
  margin-right: 10px;
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

  return (
    <Tabs
      align="space-between"
      colorScheme="black"
      defaultIndex={tabIndex}
      onChange={onChangeTab}
      mt="20px"
    >
      <Skeleton isLoaded={!isLoading} h="40px">
        <TabList px="20px">
          <Tab>{t('nft.desc')}</Tab>
          <Tab>{t('nft.transaction-history')}</Tab>
          <Tab>{t('nft.holder')}</Tab>
        </TabList>
      </Skeleton>
      <TabPanels>
        <TabPanel p="20px">
          <SkeletonText isLoaded={!isLoading} spacing={4} noOfLines={3}>
            <Box fontSize="14px" color="#777E90">
              {detail?.description ? detail?.description : t('nft.no-desc')}
            </Box>
          </SkeletonText>
        </TabPanel>
        <TabPanel p="20px" opacity={isLoading ? 0 : 1}>
          {tabIndex === 1 && <NftTxLogsList uuid={uuid} isClass={isClass} />}
        </TabPanel>
        <TabPanel p="20px" opacity={isLoading ? 0 : 1}>
          {tabIndex === 2 && <HolderList uuid={uuid} />}
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
  const isOwned =
    typeof detail?.card_back_content === 'string' ||
    typeof detail?.class_card_back_content === 'string'
  const avatarUrl =
    detail?.issuer_info?.avatar_url === null
      ? ''
      : detail?.issuer_info?.avatar_url

  return (
    <Box py="20px">
      <SkeletonText isLoaded={!isLoading} noOfLines={2} spacing={6} px="20px">
        <Flex justifyContent={'space-between'}>
          <NftDetailName>{detail?.name}</NftDetailName>
          {isOwned ? (
            <Center w="50px">
              <OwnedSealSvg />
            </Center>
          ) : null}
        </Flex>
      </SkeletonText>

      <Grid
        templateColumns="48px calc(100% - 48px - 100px) auto"
        mt="25px"
        px="20px"
      >
        <Avatar src={avatarUrl} size="48px" border="3px solid #f6f6f6" />
        <SkeletonText
          isLoaded={!isLoading}
          noOfLines={2}
          spacing={3}
          ml="18px"
          pt="4px"
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
          <Box fontSize="12px" color="#777E90">
            {detail?.verified_info?.verified_title}
          </Box>
        </SkeletonText>

        <Flex justifyContent="flex-end">
          <Skeleton isLoaded={!isLoading} borderRadius="12px" my="auto">
            <Follow
              followed={detail?.issuer_info?.issuer_followed === true}
              uuid={detail?.issuer_info?.uuid ?? ''}
              afterToggle={refetch}
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