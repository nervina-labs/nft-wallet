import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Media } from './Media'
import { Limited } from '../../components/Limited'
import { NormalRewardInfo } from '../../models/redeem'
import { NftType } from '../../models'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

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

      &.banned {
        color: #d03a3a;
      }
    }
  }
`

export interface NFTCardProps {
  info: NormalRewardInfo
}

export const NFTCard: React.FC<NFTCardProps> = ({ info }) => {
  const [t] = useTranslation('translations')
  const id = useMemo(() => {
    if (info.n_token_id == null && info.token_uuid) {
      return info.token_class_uuid
    }
    return info.token_uuid ?? info.class_uuid
  }, [info])
  const isBaned = !!(
    info.is_banned ||
    info.is_issuer_banned ||
    info.is_class_banned
  )
  return (
    <Container
      to={
        isBaned ? '#' : `${info.n_token_id != null ? '/nft' : '/class'}/${id}`
      }
    >
      <Media
        isPlayable={isBaned ? false : info.renderer_type !== NftType.Picture}
        hasCardBack={isBaned ? false : info.card_back_content_exist}
        src={isBaned ? '' : info.class_bg_image_url}
        width={70}
      />
      <div className="content">
        <div className={classNames('name', { banned: isBaned })}>
          {isBaned ? t('common.baned.nft') : info.class_name}
        </div>
        <Limited
          count={info.class_total}
          fontSize={12}
          banned={isBaned}
          bold={false}
          color="#999999"
          sn={info.n_token_id}
        />
      </div>
    </Container>
  )
}
