import React from 'react'
import styled from 'styled-components'
import { Media } from './Media'
import { Limited } from '../../components/Limited'
import { NormalRewardInfo } from '../../models/redeem'
import { NftType } from '../../models'

const Container = styled.div`
  display: flex;
  flex: 1;
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
    <Container>
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
