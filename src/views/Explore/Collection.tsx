import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Creator } from '../../components/Creator'
import { LazyLoadImage } from '../../components/Image'
import { SpecialAssets, SpecialAssetsToken } from '../../models/special-assets'
import FallbackImg from '../../assets/img/card-fallback.png'
import { getImagePreviewUrl } from '../../utils'

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
  header {
    height: 74px;
    position: relative;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .first,
    .second,
    .third {
      position: absolute;
    }

    .first {
      bottom: 11px;
      left: 80px;
      z-index: 3;
    }

    .second {
      left: 20px;
      bottom: 16px;
    }

    .third {
      right: 20px;
      bottom: 16px;
    }
  }
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

  const history = useHistory()
  return (
    <div
      className="item"
      onClick={() => {
        history.push(`/class/${item.uuid}`)
      }}
    >
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
        {isPlayable ? <div className="play"></div> : null}
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

interface GalleryProps {
  imgs: string[]
  bg: string
}

const Gallery: React.FC<GalleryProps> = ({ bg, imgs }) => {
  const [first, second, third] = imgs
  return (
    <header style={{ background: bg }}>
      <div className="first">
        <LazyLoadImage
          src={first}
          width={87}
          height={87}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={87}
              height={87}
              src={FallbackImg}
            />
          }
        />
      </div>
      <div className="second">
        <LazyLoadImage
          src={second}
          width={70}
          height={70}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={70}
              height={70}
              src={FallbackImg}
            />
          }
        />
      </div>
      <div className="third">
        <LazyLoadImage
          src={third}
          width={70}
          height={70}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={70}
              height={70}
              src={FallbackImg}
            />
          }
        />
      </div>
    </header>
  )
}

export const Collection: React.FC<CollectionProps> = ({ collection }) => {
  const { i18n } = useTranslation('translations')
  const name = collection.locales[i18n.language] ?? collection.name
  if (collection.token_classes.length !== 3) {
    return null
  }
  return (
    <Container>
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
