import React from 'react'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { LazyLoadImage } from '../Image'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const HolderContainer = styled.div`
  --size: 44px;
  display: inline-flex;
  height: var(--size);
  width: 100%;
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
  img,
  svg {
    width: var(--size);
    height: var(--size);
    border-radius: 100%;
    object-fit: cover;
  }
`

interface HolderProps {
  avatar: string
  username: string
  address: string
}

export const Holder: React.FC<HolderProps> = ({
  avatar,
  username,
  address,
}) => {
  const { t } = useTranslation('translations')
  return (
    <Link
      to={`/holder/${address}`}
      style={{ textDecoration: 'none', width: '100%', display: 'block' }}
    >
      <HolderContainer>
        <LazyLoadImage
          src={avatar}
          width={44}
          height={44}
          variant="circle"
          backup={<PeopleSvg />}
        />
        <div className="username">
          {username ?? t('holder.user-name-empty')}
        </div>
      </HolderContainer>
    </Link>
  )
}
