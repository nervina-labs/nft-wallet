import { Dialog } from '@material-ui/core'
import React from 'react'
import { NFTDetail, NftType } from '../../models'
import styled from 'styled-components'
import { Limited } from '../Limited'
import FallbackImg from '../../assets/svg/fallback.svg'
import { getImagePreviewUrl } from '../../utils'
import { LazyLoadImage } from '../Image'
import { Like } from '../Like'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Creator } from '../Creator'
import { CardBack } from '../Cardback'

const CardContainer = styled.div`
  width: 164px;
  padding: 10px;

  background: #ffffff;
  border-radius: 10px;
  position: relative;

  .media {
    width: calc(100%);
    border-radius: 8px 8px 0 0;
    position: relative;
    overflow: hidden;

    .img {
      width: 100%;
      img,
      svg {
        width: 100%;
        height: 164px;
        object-fit: cover;
      }
    }

    .player {
      position: absolute;
      bottom: 6px;
      right: 6px;
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

  .nft-name {
    font-size: 14px;
    line-height: 20px;
    margin: 10px 0;
  }

  .like-and-limit {
    display: flex;
    justify-content: space-between;
  }

  .creator {
    margin: 10px 0;
  }
`

const ShowDetailButton = styled.button`
  border: none;
  background: #fb5d3b;
  border-radius: 44px;
  line-height: 44px;
  height: 44px;
  color: #fff;
  font-size: 14px;
  margin-top: 24px;
`

export const CardDialog: React.FC<{
  nft: NFTDetail
  visible: boolean
  setVisible: (v: boolean) => void
}> = ({ nft, visible, setVisible }) => {
  const { t } = useTranslation('translations')
  const history = useHistory()
  const isBanned = nft.is_issuer_banned || nft.is_class_banned
  const isPlayable =
    nft.renderer_type === NftType.Audio || nft.renderer_type === NftType.Video
  const detailUrl = `/nft/${nft.uuid}`

  return (
    <Dialog
      open={visible}
      onClose={() => setVisible(false)}
      onEscapeKeyDown={() => setVisible(false)}
      keepMounted
      PaperProps={{
        style: {
          background: 'none',
          boxShadow: 'none',
          overflow: 'initial',
        },
      }}
    >
      <CardContainer>
        <div className="media">
          {nft.class_card_back_content_exist && <CardBack />}
          <div className="img">
            <LazyLoadImage
              src={
                isBanned ? FallbackImg : getImagePreviewUrl(nft.bg_image_url)
              }
              width={164}
              height={164}
              skeletonStyle={{ borderRadius: '10px' }}
              cover
              disableContextMenu={true}
              backup={
                <LazyLoadImage
                  skeletonStyle={{ borderRadius: '10px' }}
                  width={164}
                  height={164}
                  src={FallbackImg}
                />
              }
            />
          </div>
          {isPlayable && (
            <span className="player">
              <PlayerSvg />
            </span>
          )}
        </div>
        <div className="nft-name">{nft.name}</div>

        <div className="creator">
          <Creator
            title=""
            baned={nft.is_issuer_banned}
            url={nft.issuer_info?.avatar_url ?? ''}
            name={nft.issuer_info?.name}
            uuid={nft.issuer_info?.uuid}
            vipAlignRight
            color="rgba(63, 63, 63, 0.66)"
            isVip={nft?.verified_info?.is_verified}
            vipTitle={nft?.verified_info?.verified_title}
            vipSource={nft?.verified_info?.verified_source}
          />
        </div>

        <div className="like-and-limit">
          <Limited
            banned={isBanned}
            count={nft.total}
            bold={false}
            sn={nft.n_token_id}
            color="rgba(63, 63, 63, 0.66) !important"
          />
          <Like
            uuid={nft.class_uuid}
            liked={nft.class_liked}
            count={nft.class_likes}
            likeble={false}
          />
        </div>
      </CardContainer>
      <ShowDetailButton onClick={() => history.push(detailUrl)}>
        {t('common.show-detail')}
      </ShowDetailButton>
    </Dialog>
  )
}
