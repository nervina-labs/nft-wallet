import styled from 'styled-components'
import React from 'react'
import { Addressbar } from '../../components/AddressBar'
import { UserResponse } from '../../models/user'
import { useTranslation } from 'react-i18next'
import {
  Center,
  Avatar,
  Heading,
  Text,
  Skeleton,
  SkeletonCircle,
} from '@mibao-ui/components'
import { getNFTQueryParams } from '../../utils'
import { RoutePath } from '../../routes'
import { Link } from 'react-router-dom'

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
      <Link to={RoutePath.Profile}>{t('profile.desc.empty')}</Link>
    )
  }, [user?.description, isHolder, t])

  const userName = React.useMemo(() => {
    if (user?.nickname) {
      return user?.nickname
    }
    return isHolder ? (
      t('holder.user-name-empty')
    ) : (
      <Link to={RoutePath.Profile}>{t('profile.user-name.empty')}</Link>
    )
  }, [t, user, isHolder])

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
        </>
      )}
    </InfoContainer>
  )
}
