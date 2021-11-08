import { Dialog } from '@material-ui/core'
import React from 'react'
import { NFTDetail, NftType } from '../../models'
import styled from 'styled-components'
import { Limited } from '../Limited'
import { Like } from '../Like'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Creator } from '../Creator'
import { CardImage } from './CardImage'

const CardContainer = styled.div`
  width: 164px;
  padding: 10px;

  background: #ffffff;
  border-radius: 10px;
  position: relative;

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
    .name {
      width: 100px;
      white-space: nowrap;
      margin-right: auto;
      display: block;
    }
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
        <CardImage
          src={nft.bg_image_url}
          width={164}
          height={164}
          isPlayable={
            nft.renderer_type === NftType.Audio ||
            nft.renderer_type === NftType.Video
          }
          hasCardBack={nft.class_card_back_content_exist}
          tid={`${nft.n_token_id}`}
          has3dIcon={nft.renderer_type === NftType.ThreeD}
        />

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
