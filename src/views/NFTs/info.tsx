import styled from 'styled-components'
import React from 'react'
import { Addressbar } from '../../components/AddressBar'
import { AvatarType, UserResponse } from '../../models/user'
import { useTranslation } from 'react-i18next'
import {
  Center,
  Avatar,
  Heading,
  Text,
  Skeleton,
  SkeletonCircle,
  Preview,
  useDisclosure,
  NFTCard,
  Box,
  Button,
} from '@mibao-ui/components'
import { addParamsToUrl, getNFTQueryParams, isSupportWebp } from '../../utils'
import { ProfilePath } from '../../routes'
import { Link } from 'react-router-dom'
import { Query } from '../../models'
import { useAPI } from '../../hooks/useAccount'
import { useQuery } from 'react-query'

const InfoContainer = styled(Center)`
  padding: 24px;
  padding-top: 0;
  flex-direction: row;
  text-align: center;
  margin-top: 8px;
`

export const Info: React.FC<{
  user?: UserResponse
  isLoading?: boolean
  isHolder: boolean
  address: string
  setShowAvatarAction?: (show: boolean) => void
  closeMenu?: () => void
}> = ({
  isLoading,
  user,
  setShowAvatarAction,
  closeMenu,
  isHolder,
  address,
}) => {
  const { t, i18n } = useTranslation('translations')
  const description = React.useMemo(() => {
    if (user?.description) {
      return user?.description
    }
    return isHolder ? (
      t('holder.desc')
    ) : (
      <Link to={ProfilePath.Description}>{t('profile.desc.empty')}</Link>
    )
  }, [user?.description, isHolder, t])

  const userName = React.useMemo(() => {
    if (user?.nickname) {
      return user?.nickname
    }
    return isHolder ? (
      t('holder.user-name-empty')
    ) : (
      <Link to={ProfilePath.Username}>{t('profile.user-name.empty')}</Link>
    )
  }, [t, user, isHolder])

  const {
    isOpen: isPreviewOpen,
    onClose: onPreviewClose,
    onOpen: onPreviewOpen,
  } = useDisclosure()

  const api = useAPI()
  const { data: nft } = useQuery(
    [Query.NFTDetail, user?.avatar_token_uuid, api],
    async () => {
      const id = user?.avatar_token_uuid as string
      const { data } = await api.getNFTDetail(id)
      return data
    },
    {
      enabled:
        user?.avatar_type === AvatarType.Token &&
        Boolean(user?.avatar_token_uuid),
    }
  )

  return (
    <InfoContainer flexDirection="column">
      {isLoading ? (
        <>
          <SkeletonCircle size="100px" />
          <Skeleton height="24px" mt="8px" mb="12px" width="150px" />
          <Skeleton height="18px" mb="24px" width="150px" />
          <Skeleton height="32px" mb="24px" width="180px" borderRadius="21px" />
        </>
      ) : (
        <>
          <Avatar
            src={user?.avatar_url || ''}
            resizeScale={200}
            size="100px"
            type={user?.avatar_type}
            srcQueryParams={getNFTQueryParams(user?.avatar_tid, i18n.language)}
            onClick={() => {
              if (user?.avatar_type === AvatarType.Token || user?.avatar_url) {
                onPreviewOpen()
              }
            }}
          />
          <Heading
            mt="8px"
            mb="12px"
            fontSize="16px"
            fontWeight="bold"
            isTruncated
            w="100%"
          >
            {userName}
          </Heading>
          <Text
            mb="24px"
            noOfLines={3}
            color="#777E90"
            fontSize="12px"
            whiteSpace="pre-wrap"
            w="100%"
          >
            {description}
          </Text>
          <Addressbar address={address} isHolder={isHolder} />
          <Preview
            isOpen={isPreviewOpen}
            onClose={onPreviewClose}
            renderer="1"
            bgImgUrl={addParamsToUrl(
              user?.avatar_url as string,
              Object.create(
                getNFTQueryParams(user?.avatar_tid, i18n.language) || {}
              )
            )}
            type={user?.avatar_type === AvatarType.Token ? 'three_d' : 'image'}
            render3D={() => {
              return (
                <Center w="100%" height="100%">
                  <Box w="300px">
                    <NFTCard
                      w="100%"
                      borderRadius="22px"
                      bg="white"
                      p="16px"
                      isIssuerBanned={nft?.is_issuer_banned}
                      isNFTBanned={nft?.is_class_banned}
                      hasCardback={nft?.card_back_content_exist}
                      resizeScale={600}
                      title={nft?.name}
                      bannedText={t('common.baned.nft')}
                      type={nft?.renderer_type}
                      src={nft?.bg_image_url || ''}
                      locale={i18n.language}
                      imageProps={{
                        webp: isSupportWebp(),
                      }}
                      issuerProps={{
                        name: nft?.issuer_info?.name as string,
                        src: nft?.issuer_info?.avatar_url,
                        bannedText: t('common.baned.issuer'),
                        size: '25px',
                        isVerified: nft?.verified_info?.is_verified,
                        containerProps: { h: '25px' },
                      }}
                      limitProps={{
                        count: nft?.total as string,
                        limitedText: t('common.limit.limit'),
                        unlimitedText: t('common.limit.unlimit'),
                        serialNumber: nft?.n_token_id,
                        ml: '4px',
                      }}
                      likeProps={{
                        likeCount: nft?.class_likes as number,
                        isLiked: nft?.class_liked as boolean,
                      }}
                    />
                    <Link to={`/nft/${user?.avatar_token_uuid as string}`}>
                      <Button
                        isFullWidth
                        variant="solid"
                        colorScheme="primary"
                        mt="20px"
                      >
                        {t('common.show-detail')}
                      </Button>
                    </Link>
                  </Box>
                </Center>
              )
            }}
          />
        </>
      )}
    </InfoContainer>
  )
}
