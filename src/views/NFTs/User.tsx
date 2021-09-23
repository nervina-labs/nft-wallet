import classNames from 'classnames'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { AvatarType, UserResponse } from '../../models/user'
import { getRegionFromCode } from '../Profile/SetRegion'
import { ReactComponent as MaleSvg } from '../../assets/svg/male.svg'
import { ReactComponent as FemaleSvg } from '../../assets/svg/female.svg'
import { HolderAvatar } from '../../components/HolderAvatar'
import { PhotoProvider } from 'react-photo-view'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { CardDialog } from '../../components/Card/CardDialog'

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  setShowAvatarAction?: (show: boolean) => void
  closeMenu?: () => void
  isHolder?: boolean
  enablePreview?: boolean
}

export const Gender: React.FC<{ gender: string }> = ({ gender }) => {
  return (
    <span className="gender">
      {gender === 'male' ? <MaleSvg /> : <FemaleSvg />}
    </span>
  )
}

export enum ProfilePath {
  Username = '/home/username',
  Description = '/home/description',
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
  isHolder,
  enablePreview,
}) => {
  const isInfoEmpty = useMemo(() => {
    return !user?.gender && !user?.region
  }, [user])

  const { i18n, t } = useTranslation('translations')
  const [showNftAvatarModal, setShowNftAvatarModal] = useState(false)
  const { api, isLogined } = useWalletModel()
  const userInfo = useMemo(() => {
    const region = getRegionFromCode(user?.region, i18n.language as 'zh')
    return (
      <>
        {user?.gender ? <Gender gender={user?.gender} /> : null}
        {region ? <span className="region">{region}</span> : null}
      </>
    )
  }, [user, i18n.language])

  const { data: nft } = useQuery(
    [Query.NFTDetail, user?.avatar_token_uuid, api, isLogined],
    async () => {
      const id = user?.avatar_token_uuid as string
      const { data } = await api.getNFTDetail(id)
      return data
    },
    {
      enabled:
        enablePreview &&
        user?.avatar_type === AvatarType.Token &&
        Boolean(user?.avatar_token_uuid),
    }
  )

  return (
    <UserContainer>
      <div
        className="avatar"
        onClick={() => {
          if (!isHolder && !user?.avatar_url && setShowAvatarAction) {
            setShowAvatarAction(true)
          } else if (enablePreview && user?.avatar_type === AvatarType.Token) {
            setShowNftAvatarModal(true)
          }
        }}
      >
        <PhotoProvider maskClassName="preview-mask">
          <HolderAvatar
            tid={user?.avatar_tid ? `${user?.avatar_tid}` : undefined}
            avatar={user?.avatar_url ?? ''}
            avatarType={user?.avatar_type}
            size={56}
            enablePreview={
              enablePreview && user?.avatar_type === AvatarType.Image
            }
          />
        </PhotoProvider>
      </div>
      {nft && (
        <CardDialog
          visible={showNftAvatarModal}
          setVisible={setShowNftAvatarModal}
          nft={nft}
        />
      )}
      <div className={classNames('content', { empty: isInfoEmpty })}>
        <div className="nickname">
          {user?.nickname ? (
            user?.nickname
          ) : isHolder ?? !closeMenu ? (
            t('holder.user-name-empty')
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
