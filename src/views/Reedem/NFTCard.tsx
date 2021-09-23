import React from 'react'
import styled from 'styled-components'
import { Media } from './Media'
import { Limited } from '../../components/Limited'
import { NormalRewardInfo } from '../../models/redeem'
import { NftType } from '../../models'
import { Link } from 'react-router-dom'

const Container = styled(Link)`
  display: flex;
  flex: 1;
  text-decoration: none;
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 8px 0;
    margin-left: 8px;
    justify-content: space-between;
    .name {
      font-size: 12px;
      color: #000000;
      display: -webkit-box;
      text-overflow: ellipsis;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      margin-bottom: 4px;
    }
  }
`

export interface NFTCardProps {
  info: NormalRewardInfo
}

export const NFTCard: React.FC<NFTCardProps> = ({ info }) => {
  return (
    <Container
      to={`${info.n_token_id != null ? '/nft' : '/class'}/${
        info.token_uuid || info.class_uuid
      }`}
    >
      <Media
        isPlayable={info.renderer_type !== NftType.Picture}
        hasCardBack={info.class_card_back_content_exist}
        src={info.class_bg_image_url}
        width={70}
      />
      <div className="content">
        <div className="name">{info.class_name}</div>
        <Limited
          count={info.class_total}
          fontSize={12}
          bold={false}
          color="#999999"
          sn={info.n_token_id}
        />
      </div>
    </Container>
  )
}
