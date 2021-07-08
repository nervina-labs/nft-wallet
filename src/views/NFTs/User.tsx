import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { UserResponse } from '../../models/user'
import { getRegionFromCode } from '../Profile/SetRegion'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as MaleSvg } from '../../assets/svg/male.svg'
import { ReactComponent as FemaleSvg } from '../../assets/svg/female.svg'

const UserContainer = styled.div`
  margin-left: 25px;
  margin-top: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  .avatar {
    height: 56px;
    width: 56px;
    min-width: 56px;
    svg {
      width: 56px;
      height: 56px;
    }
  }
  .content {
    margin-left: 16px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    color: white;
    flex-direction: column;
    height: calc(100% - 8px);
    &.empty {
      justify-content: center;
    }
    .nickname {
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      color: black;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .info {
      color: white;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #999;
      span {
        margin-right: 6px;
        &.region {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .gender {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 21px;
        height: 21px;
        min-width: 21px;
        background: rgba(240, 240, 240, 0.5);
      }
    }
  }
  .action {
    display: flex;
    /* justify-content: flex-end; */
    height: 100%;
    flex-direction: column-reverse;
    margin-right: 25px;

    .icon {
      cursor: pointer;
      background: rgba(255, 246, 235, 0.553224);
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      top: -5px;
      svg {
        path {
          fill: #333;
        }
      }
    }
  }
`

export interface UserConfig {
  user?: UserResponse
  setShowAvatarAction: (show: boolean) => void
  closeMenu: () => void
}

export const Gender: React.FC<{ gender: string }> = ({ gender }) => {
  return (
    <span className="gender">
      {gender === 'male' ? <MaleSvg /> : <FemaleSvg />}
    </span>
  )
}

export enum ProfilePath {
  Username = '/nfts/username',
  Description = '/nfts/description',
}

export interface GotoProfileProps {
  path: ProfilePath
  children: React.ReactNode
  closeMenu: () => void
}

export const GotoProfile: React.FC<GotoProfileProps> = ({
  children,
  path,
  closeMenu,
}) => {
  const history = useHistory()
  return (
    <span
      style={{ cursor: 'pointer' }}
      onClick={() => {
        closeMenu()
        history.push(path)
      }}
    >
      {children}
    </span>
  )
}

export const User: React.FC<UserConfig> = ({
  user,
  setShowAvatarAction,
  closeMenu,
}) => {
  const isInfoEmpty = useMemo(() => {
    return !user?.gender && !user?.region
  }, [user])

  const { i18n, t } = useTranslation('translations')

  const userInfo = useMemo(() => {
    const region = getRegionFromCode(user?.region, i18n.language as 'zh')
    return (
      <>
        {user?.gender ? <Gender gender={user?.gender} /> : null}
        {region ? <span className="region">{region}</span> : null}
      </>
    )
  }, [user, i18n.language])

  return (
    <UserContainer>
      <div
        className="avatar"
        onClick={() => {
          if (!user?.avatar_url) {
            setShowAvatarAction(true)
          }
        }}
      >
        {user?.avatar_url ? (
          <LazyLoadImage
            src={user?.avatar_url}
            width={56}
            height={56}
            imageStyle={{ borderRadius: '50%' }}
            variant="circle"
            backup={<PeopleSvg />}
          />
        ) : (
          <PeopleSvg />
        )}
      </div>
      <div className={classNames('content', { empty: isInfoEmpty })}>
        <div className="nickname">
          {user?.nickname ? (
            user?.nickname
          ) : (
            <GotoProfile path={ProfilePath.Username} closeMenu={closeMenu}>
              {t('profile.user-name.empty')}
            </GotoProfile>
          )}
        </div>
        {!isInfoEmpty ? <div className="info">{userInfo}</div> : null}
      </div>
    </UserContainer>
  )
}
