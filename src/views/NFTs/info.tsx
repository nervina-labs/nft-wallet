import styled from 'styled-components'
import { HEADER_HEIGHT } from '../../components/Appbar'
import React from 'react'
import { GotoProfile, ProfilePath } from './User'
import { Addressbar } from '../../components/AddressBar'
import { UserResponse } from '../../models/user'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Skeleton } from '@material-ui/lab'

const InfoContainer = styled.div`
  --padding: calc(${HEADER_HEIGHT ?? 0}px + 20px) 20px 20px;
  position: relative;
  top: 0;
  width: 100%;
  padding: var(--padding);
  max-width: calc(100%);
  display: flex;
  flex-direction: column;
  transition: 100ms;

  .info {
    position: relative;
    z-index: 1;

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  .bg-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 0;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--padding);
    box-sizing: border-box;
    z-index: 3;

    .username-loading {
      margin: auto 0 auto 15px;
    }
    .address-loading {
      margin-top: 24px;
    }
  }
  .desc {
    margin-top: 12px;
    color: black;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 24px;
    white-space: pre-line;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
  .flex {
    display: flex;
  }
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
  const { t } = useTranslation('translations')
  const description = React.useMemo(() => {
    if (user?.description) {
      return user?.description
    }
    return isHolder ?? !closeMenu ? (
      t('holder.desc')
    ) : (
      <GotoProfile path={ProfilePath.Description} closeMenu={closeMenu}>
        {t('profile.desc.empty')}
      </GotoProfile>
    )
  }, [user?.description, isHolder, t, closeMenu])
  return (
    <InfoContainer>
      <div
        className={classNames('info', {
          hide: isLoading,
        })}
      >
        <div className="desc">{description}</div>
        <Addressbar address={address} isHolder={isHolder} />
      </div>
      {isLoading && (
        <div className="loading">
          <div className="flex">
            <Skeleton variant="circle" width="56px" height="56px" />
            <div className="username-loading">
              <Skeleton variant="rect" width="150px" height="22px" />
              <div style={{ height: '4px' }} />
              <Skeleton variant="rect" width="200px" height="16px" />
            </div>
          </div>
          <div className="desc">
            <Skeleton variant="rect" width="100%" height="16px" />
          </div>
          <div className="address-loading">
            <Skeleton variant="rect" width="100%" height="33px" />
          </div>
        </div>
      )}
    </InfoContainer>
  )
}
