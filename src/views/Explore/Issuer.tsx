import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { Creator } from '../../components/Creator'
import { Follow } from '../../components/Follow'
import { LazyLoadImage } from '../../components/Image'
import { Issuer } from '../../models/issuer'
import { formatCount } from '../../utils'
import {RoutePath} from "../../routes";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-width: 232px;
  max-width: 232px;
  min-height: 170px;
  max-height: 170px;
  margin-right: 8px;
  border-radius: 8px;
  border: 1px solid #f4f4f4;
  margin-bottom: 24px;
  padding: 8px;
  margin-top: 20px;
  .issuer {
    max-width: 100%;
  }
  .avatar {
    max-height: 38px;
    position: absolute;
    left: 105px;
    top: -20px;
    img {
      border-radius: 50%;
      width: 38px;
      height: 38px;
      min-width: 38px;
    }
    svg {
      width: 38px;
      height: 38px;
    }
  }

  .info {
    font-size: 12px;
    color: #666;
    margin-top: 16px;
    .likes {
      margin-left: 16px;
    }
  }

  .desc {
    margin-top: 13px;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    font-size: 12px;
    color: #333;
  }

  .follow {
    position: absolute;
    bottom: 16px;
    display: flex;
    justify-content: center;
  }
`

export interface IssuerProps {
  issuer: Issuer
  afterToggle?: (params?: any) => Promise<any>
}

export const RecommendIssuser: React.FC<IssuerProps> = ({
  issuer,
  afterToggle,
}) => {
  const { t, i18n } = useTranslation('translations')
  return (
    <Link style={{ textDecoration: 'none' }} to={`${RoutePath.Issuer}/${issuer.uuid}`}>
      <Container>
        <span className="avatar">
          <LazyLoadImage
            src={issuer?.avatar_url}
            width={38}
            height={38}
            variant="circle"
            backup={<PeopleSvg />}
          />
        </span>
        <div className="issuer">
          <Creator
            title=""
            baned={false}
            name={issuer?.name}
            isVip={issuer?.verified_info?.is_verified}
            vipTitle={issuer?.verified_info?.verified_title}
            vipSource={issuer?.verified_info?.verified_source}
            color="#333"
            showAvatar={false}
          />
        </div>
        <div className="info">
          <span className="fans">{`${t('follow.follower')}${formatCount(
            +issuer.issuer_follows,
            i18n.language
          )}`}</span>
          <span className="likes">{`${t('follow.likes')}${formatCount(
            +issuer.issuer_likes,
            i18n.language
          )}`}</span>
        </div>
        <div className="desc">{issuer.description}</div>
        <div className="follow">
          <Follow
            followed={issuer.issuer_followed}
            uuid={issuer.uuid}
            afterToggle={afterToggle}
          />
        </div>
      </Container>
    </Link>
  )
}
