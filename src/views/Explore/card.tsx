import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { getImagePreviewUrl } from '../../utils'
import FallbackImg from '../../assets/img/card-fallback.png'
import { Creator } from '../../components/Creator'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'
import { TokenClass } from '../../models/class-list'
import classNames from 'classnames'
import { NftType } from '../../models'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { CardBack } from '../../components/Cardback'

const CardContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  &.horizontal {
    min-width: 186px;
    margin-right: 8px;
    margin-bottom: 24px;
  }

  .media {
    img {
      border-radius: 8px;
    }
    position: relative;

    .player {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .title {
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    margin: 10px 8px;
    margin-bottom: 16px;
    display: -webkit-box;
    display: -moz-box;
    flex: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    &.oneline {
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }
  }

  .issuer {
    margin: 10px;
    margin-top: 0;
    .name {
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      white-space: inherit;
      word-break: break-all;
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px;
    margin-bottom: 16px;
  }
`
interface CardProps {
  token: TokenClass
  isHorizontal?: boolean
  oneLineName?: boolean
}

export const Card: React.FC<CardProps> = ({
  token,
  isHorizontal = false,
  oneLineName = false,
}) => {
  const width = isHorizontal
    ? 186
    : ((window.innerWidth > 500 ? 500 : window.innerWidth) - 48) / 2
  const history = useHistory()
  const isPlayable =
    token.renderer_type === NftType.Audio ||
    token.renderer_type === NftType.Video
  const hasCardBack = token.card_back_content_exist
  return (
    <CardContainer
      onClick={() => {
        history.push(`/class/${token.uuid}`)
      }}
      className={classNames({ horizontal: isHorizontal })}
    >
      <div className="media">
        <LazyLoadImage
          src={getImagePreviewUrl(token.bg_image_url)}
          width={width}
          height={width}
          skeletonStyle={{ borderRadius: '8px' }}
          cover={true}
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              skeletonStyle={{ borderRadius: '8px' }}
              width={width}
              cover
              height={width}
              src={FallbackImg}
            />
          }
        />
        {isPlayable ? (
          <span className="player">
            <PlayerSvg />
          </span>
        ) : null}
        {hasCardBack ? <CardBack /> : null}
      </div>
      <div className={classNames('title', { oneline: oneLineName })}>
        {token.name}
      </div>
      <div className="issuer">
        <Creator
          title=""
          baned={token.is_issuer_banned}
          url={token.issuer_info?.avatar_url ?? ''}
          name={token.issuer_info?.name}
          uuid={token.issuer_info?.uuid}
          vipAlignRight
          color="rgb(51, 51, 51)"
          isVip={token?.verified_info?.is_verified}
          vipTitle={token?.verified_info?.verified_title}
          vipSource={token?.verified_info?.verified_source}
        />
      </div>
      <div className="info">
        <Limited count={token.total} bold={false} banned={false} color="#666" />
        <Like
          count={token.class_likes}
          liked={token.class_liked}
          uuid={token.uuid}
        />
      </div>
    </CardContainer>
  )
}
