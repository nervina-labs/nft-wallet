import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Creator } from '../../components/Creator'
import { LazyLoadImage } from '../../components/Image'
import { SpecialAssets, SpecialAssetsToken } from '../../models/special-assets'
import FallbackImg from '../../assets/img/card-fallback.png'
import { getImagePreviewUrl } from '../../utils'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { Gallery } from '../../components/Gallery'

interface CollectionProps {
  collection: SpecialAssets
}

const Container = styled.div`
  width: 248px;
  min-width: 248px;
  max-width: 248px;
  border-radius: 8px;
  border: 1px solid #f4f4f4;
  margin-right: 8px;
  margin-bottom: 24px;
  margin-top: 24px;
  .title {
    font-size: 14px;
    margin: 8px 0;
    margin-left: 10px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px;
    margin-bottom: 8px;
    cursor: pointer;

    .media {
      border-radius: 4px;
      width: 50px;
      height: 50px;
      min-width: 50px;
      max-width: 50px;
      position: relative;
      .player {
        border-radius: 4px;
        position: absolute;
        top: 15px;
        left: 15px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .body {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      overflow: hidden;
      margin: 0 8px;
      width: 100%;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
      }
    }
  }
`

interface ItemProps {
  item: SpecialAssetsToken
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const isPlayable =
    item.renderer_type === 'video' || item.renderer_type === 'audio'

  return (
    <div className="item">
      <div className="media">
        <LazyLoadImage
          src={getImagePreviewUrl(item.bg_image_url)}
          width={50}
          height={50}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={50}
              height={50}
              src={FallbackImg}
            />
          }
        />
        {isPlayable ? (
          <div className="player">
            <PlayerSvg />
          </div>
        ) : null}
      </div>
      <div className="body">
        <div className="name">{item.name}</div>
        <Creator
          title=""
          baned={false}
          name={item.issuer_name}
          isVip={item?.verified_info?.is_verified}
          vipTitle={item?.verified_info?.verified_title}
          vipSource={item?.verified_info?.verified_source}
          color="#999999"
          showAvatar={false}
        />
      </div>
    </div>
  )
}

export const Collection: React.FC<CollectionProps> = ({ collection }) => {
  const { i18n } = useTranslation('translations')
  const name = collection.locales[i18n.language] ?? collection.name
  const history = useHistory()
  if (collection.token_classes.length !== 3) {
    return null
  }
  return (
    <Container
      onClick={() =>
        history.push(`${RoutePath.Collection}/${collection.uuid}`, {
          title: name,
          bgColor: collection.bg_color,
        })
      }
    >
      <Gallery
        bg={collection.bg_color}
        imgs={collection.token_classes.map(
          (c) => getImagePreviewUrl(c.bg_image_url) as string
        )}
      />
      <div className="title">{name}</div>
      {collection.token_classes.map((token) => {
        return <Item item={token} key={token.uuid} />
      })}
    </Container>
  )
}
