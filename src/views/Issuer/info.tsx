import styled from 'styled-components'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useWalletModel } from '../../hooks/useWallet'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { LazyLoadImage } from '../../components/Image'
import { Follow as FollowButton } from '../../components/Follow'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as CopySvg } from '../../assets/svg/copy.svg'
import { ReactComponent as SuccessSvg } from '../../assets/svg/success.svg'
import BgSvg from '../../assets/svg/home-bg.svg'
import VerifySvg from '../../assets/svg/weibo.svg'
import { Skeleton } from '@material-ui/lab'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { HEADER_HEIGHT } from '../../components/Appbar'

const BgSvgPath = (BgSvg as unknown) as string
const VerifySvgPath = (VerifySvg as unknown) as string

const IssuerInfoContainer = styled.div`
  --follow-field-font-color: #8e8e93;
  --username-font-color: #000;
  --avatar-border-color: #fff;
  --desc-font-color: #999999;
  --desc-more-font-color: #666666;
  --verify-title-font-color: #000;
  position: sticky;
  top: ${HEADER_HEIGHT}px;
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
      height: 17px;
      line-height: 17px;
      user-select: none;
    }

    .value {
      font-weight: 600;
      font-size: 15px;
      height: 22px;
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
    user-select: none;

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
      user-select: none;
    }
  }

  .issuer-id {
    --height: 20px;
    font-size: 13px;
    height: var(--height);
    line-height: var(--height);
    margin-top: 5px;
    display: flex;
    cursor: pointer;

    .id {
      user-select: none;
    }

    .copy-icon {
      width: 10px;
      height: 10px;
      transform: scale(1.2);
      margin: auto 0 auto 10px;
      transition: 0.2s;
    }
    .copy-icon.copied {
      transform: scale(1.6);
    }
  }
  .description {
    display: flex;
    font-size: 13px;
    margin-top: 15px;
    color: var(--desc-font-color);

    .content.fold {
      white-space: nowrap;
      width: calc(100% - 50px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .more {
      color: var(--desc-more-font-color);
      cursor: pointer;
      user-select: none;
    }
  }
  .verified-title {
    font-size: 13px;
    margin-top: 15px;
    color: var(--verify-title-font-color);
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
}> = ({ isLoading, field, value = 0 }) => {
  const showValue = useMemo(() => {
    if (value >= 1000) {
      const k = Math.round(value / 100) / 10
      const h = Math.round((value - k * 1000) / 100)
      return `${k}.${h}k`
    }
    return value
  }, [value])

  return (
    <div className="follow">
      <div className="value">
        {isLoading ? (
          <Skeleton variant="rect" width="50px" height="18px" />
        ) : (
          showValue
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
  const [copied, setCopied] = useState(false)
  const copy = (): void => {
    if (isLoading ?? copied) {
      return
    }
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="issuer-id" onClick={copy}>
      {isLoading ? (
        <Skeleton variant="rect" width="350px" height="16px" />
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
          {copied ? (
            <SuccessSvg className="copy-icon copied" />
          ) : (
            <CopySvg className="copy-icon" />
          )}
        </>
      )}
    </div>
  )
}

const Description: React.FC<{
  isLoading?: boolean
  description?: string | null
}> = ({ isLoading, description }) => {
  const [fold, setFold] = useState(true)
  const [t] = useTranslation('translations')

  useEffect(() => {
    if ((description?.length ?? 0) <= 30) {
      setFold(false)
    }
  }, [description])

  if (isLoading) {
    return (
      <div className="description">
        <div style={{ height: '10px' }} />
        <Skeleton variant="rect" width="100%" height="18px" />
        <div style={{ height: '5px' }} />
        <Skeleton variant="rect" width="100%" height="18px" />
      </div>
    )
  }

  return (
    <div className="description" onClick={() => setFold(false)}>
      <div className={classNames('content', { fold })}>{description}</div>
      {fold && <div className="more">{t('issuer.more')}</div>}
    </div>
  )
}

const VerifiedTitle: React.FC<{
  isLoading?: boolean
  content?: string | null
}> = ({ isLoading, content }) => {
  return (
    <div className="verified-title">
      {isLoading ? (
        <>
          <Skeleton variant="rect" width="100px" height="18px" />
        </>
      ) : (
        content
      )}
    </div>
  )
}

export const IssuerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { api } = useWalletModel()
  const [t] = useTranslation('translations')

  const { data, isLoading, refetch } = useQuery(
    [Query.Issuers, api, id],
    async () => {
      const { data } = await api.getIssuerInfo(id)
      return data
    }
  )

  useEffect(() => {
    window.scroll({ top: 0 })
  })

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
        <div className="follow-button-container">
          {data && (
            <FollowButton
              followed={data.issuer_followed}
              uuid={id}
              afterToggle={refetch}
            />
          )}
        </div>
      </div>
      <Username isLoading={isLoading} username={data?.name} />
      <IssuerId isLoading={isLoading} id={data?.issuer_id} />
      <VerifiedTitle
        isLoading={isLoading}
        content={data?.verified_info?.verified_title}
      />
      <Description isLoading={isLoading} description={data?.description} />

      <div className="bg">
        <img src={BgSvgPath} alt="bg" />
      </div>
    </IssuerInfoContainer>
  )
}
