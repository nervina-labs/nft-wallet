import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HolderAvatar } from '../HolderAvatar'
import { AvatarType } from '../../models/user'

const HolderContainer = styled.div`
  display: inline-flex;
  height: var(--size);
  width: 100%;
  user-select: none;
  .username {
    margin: auto auto auto 8px;
    font-size: 14px;
    color: #000;
    line-height: var(--size);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
  }
`

interface HolderProps {
  avatar: string
  username: string
  address: string
  avatarType?: AvatarType
}

export const Holder: React.FC<HolderProps> = ({
  avatar,
  username,
  address,
  avatarType,
}) => {
  const { t } = useTranslation('translations')
  return (
    <Link
      to={`/holder/${address}`}
      style={{ textDecoration: 'none', width: '100%', display: 'block' }}
    >
      <HolderContainer>
        <HolderAvatar avatar={avatar} avatarType={avatarType} />
        <div className="username">
          {username ?? t('holder.user-name-empty')}
        </div>
      </HolderContainer>
    </Link>
  )
}
