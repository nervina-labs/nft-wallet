import styled from 'styled-components'
import React from 'react'
import { Addressbar } from '../../components/AddressBar'
import Bg from '../../assets/svg/home-bg.svg'
import { UserResponse } from '../../models/user'
import classNames from 'classnames'
import { Skeleton } from '@material-ui/lab'
import { Button } from '../../components/Button'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'

const InfoContainer = styled.div`
  --padding: calc(20px) 20px 20px;
  padding: 20px;
  position: relative;
  top: 0;
  width: 100%;
  padding: var(--padding);
  max-width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  transition: 100ms;

  .btn {
    display: flex;
    align-content: center;
    justify-content: space-between;
    button {
      margin-left: 8px;
      margin-bottom: 8px;
      background: rgb(43, 69, 78) !important;
    }
  }

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

  @media (min-width: 500px) {
    max-width: 460px;
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
  const [t] = useTranslation('translations')
  const history = useHistory()
  return (
    <InfoContainer>
      <div
        className={classNames('info', {
          hide: isLoading,
        })}
      >
        <div className="btn">
          <Addressbar address={address} isHolder={isHolder} />
          <Button
            onClick={() => {
              history.push(RoutePath.Transactions)
            }}
          >
            {t('account.transactions')}
          </Button>
        </div>
      </div>
      <img className="bg-image" src={(Bg as unknown) as string} alt="Bg" />
      {isLoading && (
        <div className="loading">
          <div className="address-loading">
            <Skeleton variant="rect" width="100%" height="33px" />
          </div>
        </div>
      )}
    </InfoContainer>
  )
}
