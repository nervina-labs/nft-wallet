import React from 'react'
import styled from 'styled-components'
import { NFTToken } from '../../models'
import { LazyLoadImage } from '../Image'

export interface CardProps {
  token: NFTToken
}

const Container = styled.div`
  display: flex;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  .media {
    width: 120px;
    height: 120px;
  }
  .content {
    margin: 8px;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
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
    .limit {
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`

export const Card: React.FC<CardProps> = ({ token }) => {
  return (
    <Container>
      <div className="media">
        <LazyLoadImage src={token.token_class_image} width={120} height={120} />
      </div>
      <div className="content">
        <div className="title">{token.token_class_name}</div>
        <div className="desc">{token.token_class_description}</div>
        <div className="limit">
          {token.token_class_total === 0
            ? '不限量'
            : `限量：${token.token_class_total}`}
        </div>
      </div>
    </Container>
  )
}
