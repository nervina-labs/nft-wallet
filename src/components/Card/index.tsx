import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { NFTToken } from '../../models'
import { LazyLoadImage } from '../Image'
import { Limited } from '../Limited'
import { Creator } from '../Creator'

export interface CardProps {
  token: NFTToken
}

const Container = styled.div`
  display: flex;
  cursor: pointer;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  .media {
    width: 120px;
    height: 120px;
    min-width: 120px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  .content {
    margin: 8px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .desc {
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin: 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
    .creator {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: rgba(0, 0, 0, 0.6);
      .avatar {
        margin-left: 12px;
        margin-right: 2px;
        img {
          border-radius: 50%;
          width: 24px;
          height: 24px;
        }
        svg {
          position: relative;
          top: 2px;
        }
      }
      .name {
        color: rgba(0, 0, 0, 0.8);
        font-weight: normal;
        text-overflow: ellipsis;
      }
    }
  }
`

export const Card: React.FC<CardProps> = ({ token }) => {
  const history = useHistory()
  return (
    <Container onClick={() => history.push(`/nft/${token.token_uuid}`)}>
      <div className="media">
        <LazyLoadImage
          src={token.class_bg_image_url}
          width={120}
          height={120}
        />
      </div>
      <div className="content">
        <div className="title">{token.class_name}</div>
        <Limited count={token.class_total} />
        <Creator url={token.issuer_avatar_url} name={token.issuer_name} />
      </div>
    </Container>
  )
}
