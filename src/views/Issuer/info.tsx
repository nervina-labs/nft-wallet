import styled from 'styled-components'
import { NAVIGATION_BAR_HEIGHT } from '../../components/NavigationBar'
import React from 'react'
import { useParams } from 'react-router'
import { useWalletModel } from '../../hooks/useWallet'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { LazyLoadImage } from '../../components/Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as CopySvg } from '../../assets/svg/copy.svg'
import BgSvg from '../../assets/svg/home-bg.svg'
import VerifySvg from '../../assets/svg/weibo.svg'
import { Skeleton } from '@material-ui/lab'
import { useTranslation } from 'react-i18next'

const BgSvgPath = (BgSvg as unknown) as string
const VerifySvgPath = (VerifySvg as unknown) as string

const IssuerInfoContainer = styled.div`
  --follow-field-font-color: #8e8e93;
  --username-font-color: #000;
  --avatar-border-color: #fff;
  position: sticky;
  top: ${NAVIGATION_BAR_HEIGHT}px;
  padding: 24px 15px;
  z-index: 1;

  .avatar-and-follow {
    display: flex;
  }

  .follow {
    display: flex;
    flex-direction: column;
    width: 25%;
    max-width: 80px;
    height: 40px;
    text-align: center;
    margin: auto 0;

    .field {
      color: var(--follow-field-font-color);
      font-size: 12px;
      line-height: 17px;
    }

    .value {
      font-weight: 600;
      font-size: 15px;
      line-height: 22px;
      white-space: nowrap;
    }

    .MuiSkeleton-root {
      margin: auto;
    }
  }

  .follow-button-container {
    margin: auto 0 auto auto;
  }

  .avatar {
    border-radius: 100%;
    width: 60px;
    height: 60px;
    border: 3px solid var(--avatar-border-color);
    overflow: hidden;
    margin-right: 20px;
    pointer-events: none;

    img,
    svg {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .ellipsis-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .username {
    --height: 20px;
    color: var(--username-font-color);
    font-size: 15px;
    line-height: var(--height);
    height: var(--height);
    font-weight: 500;
    margin-top: 15px;
    display: flex;
    .text {
      max-width: calc(100% - 30px);
    }
    .verify {
      height: 10px;
      margin: auto 0 auto 5px;
      transform: scale(1.5);
    }
  }

  .issuer-id {
    --height: 20px;
    font-size: 13px;
    height: var(--height);
    line-height: var(--height);
    margin-top: 5px;
    display: flex;

    .id {
      user-select: none;
    }

    .copy-icon {
      width: 10px;
      height: 10px;
      transform: scale(1.2);
      cursor: pointer;
      margin: auto 0 auto 10px;
    }
  }
  .description {
    font-size: 13px;
    margin-top: 15px;
  }

  .bg {
    position: absolute;
    bottom: -10px;
    left: 0;
    z-index: -1;
    width: 100%;
    pointer-events: none;
    img {
      width: 100%;
      height: 100%;
    }
  }
`

const Follow: React.FC<{
  isLoading?: boolean
  field?: string
  value?: number
}> = ({ isLoading, field, value }) => {
  return (
    <div className="follow">
      <div className="value">
        {isLoading ? (
          <Skeleton variant="rect" width="50px" height="18px" />
        ) : (
          value
        )}
      </div>
      <div className="field">
        {isLoading ? (
          <>
            <div style={{ height: '2px' }} />
            <Skeleton variant="rect" width="30px" height="14px" />
          </>
        ) : (
          field
        )}
      </div>
    </div>
  )
}

const Username: React.FC<{
  isLoading?: boolean
  username?: string
}> = ({ isLoading, username }) => {
  // TODO: 粉丝数折叠成 12.1k 1.2m 的形式
  return (
    <div className="username">
      {isLoading ? (
        <Skeleton variant="rect" width="150px" height="22px" />
      ) : (
        <>
          <div className="text ellipsis-text">{username}</div>
          <img className="verify" src={VerifySvgPath} alt="verify" />
        </>
      )}
    </div>
  )
}

const IssuerId: React.FC<{
  isLoading?: boolean
  id?: string
}> = ({ isLoading, id }) => {
  return (
    <div className="issuer-id">
      {isLoading ? (
        <Skeleton variant="rect" width="200px" height="16px" />
      ) : (
        <>
          <div className="id">ID: </div>
          <div className="text ellipsis-text">
            {isLoading ? (
              <Skeleton variant="rect" width="100%" height="100%" />
            ) : (
              id
            )}
          </div>
          <CopySvg className="copy-icon" />
        </>
      )}
    </div>
  )
}

const Description: React.FC<{
  isLoading?: boolean
  description?: string | null
}> = ({ isLoading, description }) => {
  return (
    <div className="description">
      {isLoading ? (
        <>
          <div style={{ height: '10px' }} />
          <Skeleton variant="rect" width="100%" height="20px" />
          <div style={{ height: '5px' }} />
          <Skeleton variant="rect" width="100%" height="20px" />
        </>
      ) : (
        description
      )}
    </div>
  )
}

export const IssuerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { api } = useWalletModel()
  const [t] = useTranslation('translations')

  const { data, isLoading } = useQuery(
    [Query.Issuers, api],
    async () => {
      const { data } = await api.getIssuerInfo(id)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  return (
    <IssuerInfoContainer>
      <div className="avatar-and-follow">
        <div className="avatar">
          <LazyLoadImage
            src={data?.avatar_url}
            width={60}
            height={60}
            variant="circle"
            backup={<PeopleSvg />}
          />
        </div>
        <Follow
          value={data?.issuer_follows}
          isLoading={isLoading}
          field={t('issuer.follower')}
        />
        <Follow
          value={data?.issuer_likes}
          isLoading={isLoading}
          field={t('issuer.like')}
        />
        <div className="follow-button-container" />
      </div>
      <Username isLoading={isLoading} username={data?.name} />
      <IssuerId isLoading={isLoading} id={data?.issuer_id} />
      <Description isLoading={isLoading} description={data?.description} />

      <div className="bg">
        <img src={BgSvgPath} alt="bg" />
      </div>
    </IssuerInfoContainer>
  )
}
